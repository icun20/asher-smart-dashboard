import { NextResponse } from "next/server";

type ValidCategory = "organic" | "plastic" | "paper" | "metal" | "glass" | "hazardous";

interface RawGeminiDetection {
  category?: string;
  subLabel?: string;
  confidence?: number;
  box_2d?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] scaled 0..1000
  estimatedWeightKg?: number;
}

const VALID_CATEGORIES = new Set<ValidCategory>([
  "organic",
  "plastic",
  "paper",
  "metal",
  "glass",
  "hazardous",
]);

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.GEMINI_API_KEY),
    provider: "gemini-2.5-flash",
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        configured: false,
        error:
          "GEMINI_API_KEY is not configured. Add it to .env.local or Vercel Environment Variables to enable Deep AI Audit.",
      },
      { status: 501 }
    );
  }

  try {
    const body = (await request.json()) as { imageBase64?: string; mimeType?: string };
    if (!body.imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64 payload." }, { status: 400 });
    }

    const base64Data = body.imageBase64.includes(",")
      ? body.imageBase64.split(",")[1]
      : body.imageBase64;
    const mimeType = body.mimeType || "image/jpeg";

    const prompt = `You are an industrial waste computer-vision classifier for The ASHER thermal waste processor.
Detect every visible waste object or distinct waste cluster in this image (ignore humans, faces, walls, floors, and furniture).
Classify each detected waste item strictly into one of these 6 categories:
- "organic" (food scraps, fruit, vegetables, leaves, wood, yard waste)
- "plastic" (PET bottles, plastic bags, wrappers, containers, cups, foam, polymers)
- "paper" (cardboard boxes, paper sheets, cartons, tissues, books, newspapers)
- "metal" (aluminum cans, tin cans, foil, scrap metal, utensils, wires)
- "glass" (glass bottles, jars, ceramic, broken glass)
- "hazardous" (batteries, power banks, aerosols, spray cans, electronics/e-waste, phones, chemical bottles, medical sharps)

Return ONLY valid JSON matching this schema:
{
  "detections": [
    {
      "category": "plastic",
      "subLabel": "PET Water Bottle",
      "confidence": 0.92,
      "box_2d": [ymin, xmin, ymax, xmax],
      "estimatedWeightKg": 0.4
    }
  ]
}
Where box_2d coordinates are integers from 0 to 1000 relative to image height and width. Return at most 12 highest-confidence items.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json(
        { error: `Vision API request failed (${geminiRes.status})`, details: errText.slice(0, 200) },
        { status: 502 }
      );
    }

    const data = (await geminiRes.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(rawText) as { detections?: RawGeminiDetection[] };
    const rawItems = Array.isArray(parsed.detections) ? parsed.detections : [];

    const detections = rawItems
      .filter((item) => {
        const cat = item.category?.toLowerCase() as ValidCategory | undefined;
        return cat && VALID_CATEGORIES.has(cat) && Array.isArray(item.box_2d) && item.box_2d.length === 4;
      })
      .map((item, idx) => {
        const [ymin, xmin, ymax, xmax] = item.box_2d!;
        const x = Math.max(0, Math.min(1, xmin / 1000));
        const y = Math.max(0, Math.min(1, ymin / 1000));
        const w = Math.max(0.03, Math.min(1 - x, (xmax - xmin) / 1000));
        const h = Math.max(0.03, Math.min(1 - y, (ymax - ymin) / 1000));

        return {
          id: `gemini-${idx}-${Date.now()}`,
          category: item.category!.toLowerCase() as ValidCategory,
          subLabel: item.subLabel || "Detected Waste",
          confidence: Math.max(0.5, Math.min(0.99, Number(item.confidence ?? 0.85))),
          x: Number(x.toFixed(3)),
          y: Number(y.toFixed(3)),
          w: Number(w.toFixed(3)),
          h: Number(h.toFixed(3)),
          estimatedWeightKg: Math.max(0.1, Number((item.estimatedWeightKg ?? 0.5).toFixed(2))),
        };
      });

    return NextResponse.json({
      configured: true,
      engine: "gemini-2.5-flash",
      detections,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to analyze waste image", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
