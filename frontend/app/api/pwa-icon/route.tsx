import { ImageResponse } from "next/og";

const ALLOWED_SIZES = new Set([32, 180, 192, 512]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSize = Number(searchParams.get("size") ?? 192);
  const size = ALLOWED_SIZES.has(rawSize) ? rawSize : 192;
  const isMaskable = searchParams.get("maskable") === "1";

  const iconSize = Math.round(size * (isMaskable ? 0.5 : 0.58));
  const radius = isMaskable ? 0 : Math.round(size * 0.22);
  const borderWidth = isMaskable ? 0 : Math.max(2, Math.round(size * 0.025));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          borderRadius: radius,
          border: borderWidth > 0 ? `${borderWidth}px solid #166534` : "none",
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>
    ),
    {
      width: size,
      height: size,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
