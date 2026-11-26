export type WasteCategoryId =
  | "organic"
  | "plastic"
  | "paper"
  | "metal"
  | "glass"
  | "hazardous";

export interface WasteCategoryMeta {
  id: WasteCategoryId;
  label: string;
  shortLabel: string;
  carbonTag: string;
  colorHex: string;
  badgeClass: string;
  dotClass: string;
  avgItemWeightKg: number;
  isBiogenic: boolean;
  isFossil: boolean;
  isHazardous: boolean;
}

export interface WasteDetectionBox {
  id: string;
  category: WasteCategoryId;
  subLabel: string;
  confidence: number; // 0 to 1
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  w: number; // normalized 0..1
  h: number; // normalized 0..1
  estimatedWeightKg: number;
}

export interface VisionBatchLogEntry {
  id: string;
  timestamp: string;
  deviceSn: string;
  source: "Trolley Cam" | "Photo Upload" | "Live Webcam";
  totalItems: number;
  totalWeightKg: number;
  biogenicPct: number;
  fossilPct: number;
  inertPct: number;
  dominantCategory: WasteCategoryId;
  hasHazardous: boolean;
  categoryCounts: Record<WasteCategoryId, number>;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  detections: WasteDetectionBox[];
}

export const WASTE_CATEGORIES: Record<WasteCategoryId, WasteCategoryMeta> = {
  organic: {
    id: "organic",
    label: "Organic / Biogenic",
    shortLabel: "Organic",
    carbonTag: "Biogenic CO₂ (Neutral)",
    colorHex: "#22c55e",
    badgeClass: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
    dotClass: "bg-green-500",
    avgItemWeightKg: 1.4,
    isBiogenic: true,
    isFossil: false,
    isHazardous: false,
  },
  plastic: {
    id: "plastic",
    label: "Plastic / Polymer",
    shortLabel: "Plastic",
    carbonTag: "Fossil CO₂ (Scope 1)",
    colorHex: "#3b82f6",
    badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    dotClass: "bg-blue-500",
    avgItemWeightKg: 0.65,
    isBiogenic: false,
    isFossil: true,
    isHazardous: false,
  },
  paper: {
    id: "paper",
    label: "Paper & Cardboard",
    shortLabel: "Paper",
    carbonTag: "Biogenic CO₂ (Neutral)",
    colorHex: "#f59e0b",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    dotClass: "bg-amber-500",
    avgItemWeightKg: 0.85,
    isBiogenic: true,
    isFossil: false,
    isHazardous: false,
  },
  metal: {
    id: "metal",
    label: "Metal (Non-Combustible)",
    shortLabel: "Metal",
    carbonTag: "Inert Slag / Ash",
    colorHex: "#64748b",
    badgeClass: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
    dotClass: "bg-slate-500",
    avgItemWeightKg: 1.1,
    isBiogenic: false,
    isFossil: false,
    isHazardous: false,
  },
  glass: {
    id: "glass",
    label: "Glass & Inert",
    shortLabel: "Glass",
    carbonTag: "Inert Residue",
    colorHex: "#a855f7",
    badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    dotClass: "bg-purple-500",
    avgItemWeightKg: 0.9,
    isBiogenic: false,
    isFossil: false,
    isHazardous: false,
  },
  hazardous: {
    id: "hazardous",
    label: "Hazardous / B3 (Reject)",
    shortLabel: "Hazardous (B3)",
    carbonTag: "Prohibited — Hold Load",
    colorHex: "#ef4444",
    badgeClass: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    dotClass: "bg-red-500",
    avgItemWeightKg: 0.5,
    isBiogenic: false,
    isFossil: false,
    isHazardous: true,
  },
};

export const WASTE_CATEGORY_LIST: WasteCategoryMeta[] = [
  WASTE_CATEGORIES.organic,
  WASTE_CATEGORIES.plastic,
  WASTE_CATEGORIES.paper,
  WASTE_CATEGORIES.metal,
  WASTE_CATEGORIES.glass,
  WASTE_CATEGORIES.hazardous,
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "mixed-municipal",
    name: "Mixed Municipal",
    description: "Standard hotel & commercial unsorted trolley batch",
    detections: [
      { id: "m1", category: "organic", subLabel: "Food Scraps", confidence: 0.94, x: 0.08, y: 0.16, w: 0.28, h: 0.34, estimatedWeightKg: 4.2 },
      { id: "m2", category: "plastic", subLabel: "PET Bottles", confidence: 0.91, x: 0.41, y: 0.14, w: 0.22, h: 0.28, estimatedWeightKg: 1.8 },
      { id: "m3", category: "paper", subLabel: "Cardboard Box", confidence: 0.89, x: 0.66, y: 0.18, w: 0.25, h: 0.35, estimatedWeightKg: 2.5 },
      { id: "m4", category: "organic", subLabel: "Yard Trimmings", confidence: 0.87, x: 0.14, y: 0.56, w: 0.26, h: 0.30, estimatedWeightKg: 3.1 },
      { id: "m5", category: "metal", subLabel: "Aluminum Cans", confidence: 0.84, x: 0.45, y: 0.52, w: 0.18, h: 0.26, estimatedWeightKg: 1.2 },
      { id: "m6", category: "glass", subLabel: "Clear Glass Jar", confidence: 0.79, x: 0.68, y: 0.58, w: 0.19, h: 0.25, estimatedWeightKg: 1.4 },
    ],
  },
  {
    id: "high-plastic",
    name: "Commercial Plastic",
    description: "Packaging-heavy batch elevating Scope 1 fossil CO₂ ratio",
    detections: [
      { id: "p1", category: "plastic", subLabel: "HDPE Film Wrap", confidence: 0.95, x: 0.07, y: 0.14, w: 0.32, h: 0.38, estimatedWeightKg: 3.6 },
      { id: "p2", category: "plastic", subLabel: "PET Containers", confidence: 0.92, x: 0.43, y: 0.16, w: 0.26, h: 0.30, estimatedWeightKg: 2.4 },
      { id: "p3", category: "plastic", subLabel: "LDPE Packaging", confidence: 0.88, x: 0.36, y: 0.52, w: 0.28, h: 0.33, estimatedWeightKg: 2.9 },
      { id: "p4", category: "paper", subLabel: "Kraft Cartons", confidence: 0.86, x: 0.72, y: 0.20, w: 0.22, h: 0.36, estimatedWeightKg: 2.1 },
      { id: "p5", category: "metal", subLabel: "Tin Strapping", confidence: 0.78, x: 0.10, y: 0.58, w: 0.20, h: 0.26, estimatedWeightKg: 1.1 },
    ],
  },
  {
    id: "organic-kitchen",
    name: "Organic Kitchen",
    description: "High-moisture biogenic waste maximizing avoided landfill CH₄",
    detections: [
      { id: "o1", category: "organic", subLabel: "Vegetable Peelings", confidence: 0.96, x: 0.09, y: 0.15, w: 0.36, h: 0.40, estimatedWeightKg: 6.4 },
      { id: "o2", category: "organic", subLabel: "Cooked Food Residue", confidence: 0.93, x: 0.49, y: 0.18, w: 0.38, h: 0.35, estimatedWeightKg: 5.8 },
      { id: "o3", category: "paper", subLabel: "Soiled Napkins", confidence: 0.85, x: 0.12, y: 0.60, w: 0.28, h: 0.26, estimatedWeightKg: 1.5 },
      { id: "o4", category: "organic", subLabel: "Fruit Pulp", confidence: 0.90, x: 0.45, y: 0.58, w: 0.26, h: 0.28, estimatedWeightKg: 4.1 },
      { id: "o5", category: "plastic", subLabel: "Sauce Sachet", confidence: 0.74, x: 0.75, y: 0.62, w: 0.16, h: 0.20, estimatedWeightKg: 0.4 },
    ],
  },
  {
    id: "hazardous-alert",
    name: "Hazardous (B3) Alert",
    description: "Contaminated batch containing prohibited lithium battery & aerosol",
    detections: [
      { id: "h1", category: "hazardous", subLabel: "Pressurized Aerosol", confidence: 0.97, x: 0.34, y: 0.22, w: 0.24, h: 0.34, estimatedWeightKg: 0.6 },
      { id: "h2", category: "hazardous", subLabel: "Li-Ion Battery Pack", confidence: 0.93, x: 0.64, y: 0.48, w: 0.20, h: 0.24, estimatedWeightKg: 0.4 },
      { id: "h3", category: "plastic", subLabel: "Chemical Jug", confidence: 0.86, x: 0.08, y: 0.18, w: 0.22, h: 0.36, estimatedWeightKg: 1.7 },
      { id: "h4", category: "organic", subLabel: "Mixed Organics", confidence: 0.82, x: 0.10, y: 0.58, w: 0.24, h: 0.28, estimatedWeightKg: 2.8 },
      { id: "h5", category: "metal", subLabel: "Scrap Wire", confidence: 0.80, x: 0.65, y: 0.14, w: 0.24, h: 0.26, estimatedWeightKg: 1.3 },
    ],
  },
];

export function summarizeDetections(detections: WasteDetectionBox[]) {
  const counts: Record<WasteCategoryId, number> = {
    organic: 0,
    plastic: 0,
    paper: 0,
    metal: 0,
    glass: 0,
    hazardous: 0,
  };
  const weights: Record<WasteCategoryId, number> = {
    organic: 0,
    plastic: 0,
    paper: 0,
    metal: 0,
    glass: 0,
    hazardous: 0,
  };

  let totalWeightKg = 0;
  for (const det of detections) {
    counts[det.category] += 1;
    weights[det.category] += det.estimatedWeightKg;
    totalWeightKg += det.estimatedWeightKg;
  }

  const pctByCategory: Record<WasteCategoryId, number> = {
    organic: 0,
    plastic: 0,
    paper: 0,
    metal: 0,
    glass: 0,
    hazardous: 0,
  };

  if (totalWeightKg > 0) {
    for (const cat of WASTE_CATEGORY_LIST) {
      pctByCategory[cat.id] = Math.round((weights[cat.id] / totalWeightKg) * 100);
    }
  }

  const biogenicWeight = weights.organic + weights.paper;
  const fossilWeight = weights.plastic;
  const inertWeight = weights.metal + weights.glass;

  const biogenicPct = totalWeightKg > 0 ? Math.round((biogenicWeight / totalWeightKg) * 100) : 0;
  const fossilPct = totalWeightKg > 0 ? Math.round((fossilWeight / totalWeightKg) * 100) : 0;
  const inertPct = totalWeightKg > 0 ? Math.round((inertWeight / totalWeightKg) * 100) : 0;

  let dominantCategory: WasteCategoryId = "organic";
  let maxWeight = -1;
  for (const cat of WASTE_CATEGORY_LIST) {
    if (weights[cat.id] > maxWeight) {
      maxWeight = weights[cat.id];
      dominantCategory = cat.id;
    }
  }

  // ASHER thermal reduction: ~4% ash for combustibles + 95% residue for metal/glass
  const estimatedAshKg =
    (biogenicWeight + fossilWeight) * 0.04 + inertWeight * 0.92;

  return {
    totalItems: detections.length,
    totalWeightKg: Number(totalWeightKg.toFixed(1)),
    estimatedAshKg: Number(estimatedAshKg.toFixed(2)),
    counts,
    weights,
    pctByCategory,
    biogenicPct,
    fossilPct,
    inertPct,
    dominantCategory,
    hasHazardous: counts.hazardous > 0,
  };
}

/**
 * Lightweight client-side Computer Vision region analyzer for uploaded photos & live webcam frames.
 * Uses HSV chromaticity, saturation, luminance, and local edge contrast across spatial tiles
 * to classify waste material regions without requiring external ML downloads.
 */
export function analyzeCanvasFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): WasteDetectionBox[] {
  if (width <= 0 || height <= 0) return [];

  const cols = 4;
  const rows = 3;
  const cellW = Math.floor(width / cols);
  const cellH = Math.floor(height / rows);
  const imageData = ctx.getImageData(0, 0, width, height).data;

  interface CellResult {
    col: number;
    row: number;
    category: WasteCategoryId;
    subLabel: string;
    confidence: number;
    energy: number;
  }

  const cells: CellResult[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const startX = c * cellW;
      const startY = r * cellH;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let sumSat = 0;
      let sumVal = 0;
      let edgeEnergy = 0;
      let redHotPixels = 0;
      let greenOrganicPixels = 0;
      let bluePlasticPixels = 0;
      let warmPaperPixels = 0;
      let brightGlassPixels = 0;
      let samples = 0;

      const step = Math.max(2, Math.floor(Math.min(cellW, cellH) / 18));

      for (let y = startY; y < startY + cellH - step; y += step) {
        for (let x = startX; x < startX + cellW - step; x += step) {
          const idx = (y * width + x) * 4;
          const pr = imageData[idx];
          const pg = imageData[idx + 1];
          const pb = imageData[idx + 2];

          const idxRight = (y * width + (x + step)) * 4;
          const lum = 0.299 * pr + 0.587 * pg + 0.114 * pb;
          const lumRight =
            0.299 * imageData[idxRight] +
            0.587 * imageData[idxRight + 1] +
            0.114 * imageData[idxRight + 2];
          edgeEnergy += Math.abs(lum - lumRight);

          const maxC = Math.max(pr, pg, pb);
          const minC = Math.min(pr, pg, pb);
          const delta = maxC - minC;
          const sat = maxC === 0 ? 0 : delta / maxC;
          const val = maxC / 255;

          let hue = 0;
          if (delta > 0) {
            if (maxC === pr) hue = 60 * (((pg - pb) / delta) % 6);
            else if (maxC === pg) hue = 60 * ((pb - pr) / delta + 2);
            else hue = 60 * ((pr - pg) / delta + 4);
            if (hue < 0) hue += 360;
          }

          sumR += pr;
          sumG += pg;
          sumB += pb;
          sumSat += sat;
          sumVal += val;

          // Feature votes
          if ((hue < 14 || hue > 345) && sat > 0.55 && val > 0.4) redHotPixels++;
          if (hue >= 55 && hue <= 165 && sat > 0.22 && val > 0.18) greenOrganicPixels++;
          if (hue >= 175 && hue <= 265 && sat > 0.25) bluePlasticPixels++;
          if (hue >= 20 && hue <= 52 && sat >= 0.18 && sat <= 0.65 && val > 0.35) warmPaperPixels++;
          if (sat < 0.16 && val > 0.72) brightGlassPixels++;

          samples++;
        }
      }

      if (samples === 0) continue;

      const avgSat = sumSat / samples;
      const avgVal = sumVal / samples;
      const avgEdge = edgeEnergy / samples;
      const avgR = sumR / samples;
      const avgG = sumG / samples;
      const avgB = sumB / samples;

      // Skip near-empty uniform background tiles
      if (avgEdge < 4.5 && avgVal < 0.15) continue;

      const redRatio = redHotPixels / samples;
      const greenRatio = greenOrganicPixels / samples;
      const blueRatio = bluePlasticPixels / samples;
      const paperRatio = warmPaperPixels / samples;
      const glassRatio = brightGlassPixels / samples;

      let category: WasteCategoryId = "organic";
      let subLabel = "Organic Matter";
      let confidence = 0.72;

      if (redRatio > 0.28) {
        category = "hazardous";
        subLabel = "Hazard / Chemical Pack";
        confidence = Math.min(0.95, 0.76 + redRatio * 0.4);
      } else if (blueRatio > 0.18 || (avgSat > 0.38 && avgB > avgR && avgVal > 0.35)) {
        category = "plastic";
        subLabel = "Polymer / PET Item";
        confidence = Math.min(0.94, 0.74 + Math.max(blueRatio, avgSat * 0.4) * 0.45);
      } else if (greenRatio > 0.18 || (avgG > avgB + 12 && avgSat > 0.24)) {
        category = "organic";
        subLabel = "Biogenic / Food Waste";
        confidence = Math.min(0.95, 0.75 + greenRatio * 0.45);
      } else if (paperRatio > 0.22) {
        category = "paper";
        subLabel = "Cardboard / Paper";
        confidence = Math.min(0.92, 0.73 + paperRatio * 0.45);
      } else if (glassRatio > 0.32 && avgEdge > 10) {
        category = "glass";
        subLabel = "Glass / Translucent";
        confidence = Math.min(0.89, 0.68 + glassRatio * 0.35);
      } else if (avgSat < 0.18 && avgEdge > 12) {
        category = "metal";
        subLabel = "Metallic / Can";
        confidence = Math.min(0.9, 0.7 + Math.min(avgEdge / 80, 0.2));
      } else {
        category = avgVal > 0.55 ? "plastic" : "organic";
        subLabel = category === "plastic" ? "Mixed Packaging" : "Mixed Organic";
        confidence = Math.min(0.84, 0.65 + Math.min(avgEdge / 100, 0.18));
      }

      cells.push({
        col: c,
        row: r,
        category,
        subLabel,
        confidence: Number(confidence.toFixed(2)),
        energy: avgEdge,
      });
    }
  }

  // Keep top 6 highest-energy distinct cells to produce clean readable bounding boxes
  const ranked = [...cells]
    .sort((a, b) => b.energy * b.confidence - a.energy * a.confidence)
    .slice(0, 6);

  return ranked.map((cell, idx) => {
    const padX = 0.025;
    const padY = 0.03;
    const w = 1 / cols - padX * 1.4;
    const h = 1 / rows - padY * 1.4;
    const meta = WASTE_CATEGORIES[cell.category];
    const weightFactor = 0.8 + ((cell.col + cell.row + 1) % 3) * 0.35;
    return {
      id: `cv-${cell.row}-${cell.col}-${idx}`,
      category: cell.category,
      subLabel: cell.subLabel,
      confidence: cell.confidence,
      x: Number(Math.max(0.02, cell.col / cols + padX * 0.6).toFixed(3)),
      y: Number(Math.max(0.03, cell.row / rows + padY * 0.6).toFixed(3)),
      w: Number(w.toFixed(3)),
      h: Number(h.toFixed(3)),
      estimatedWeightKg: Number((meta.avgItemWeightKg * weightFactor).toFixed(1)),
    };
  });
}

export function createInitialBatchLogs(deviceSn: string): VisionBatchLogEntry[] {
  return [
    {
      id: `BCH-${deviceSn}-104`,
      timestamp: "Today, 14:42",
      deviceSn,
      source: "Trolley Cam",
      totalItems: 6,
      totalWeightKg: 14.2,
      biogenicPct: 69,
      fossilPct: 13,
      inertPct: 18,
      dominantCategory: "organic",
      hasHazardous: false,
      categoryCounts: { organic: 2, plastic: 1, paper: 1, metal: 1, glass: 1, hazardous: 0 },
    },
    {
      id: `BCH-${deviceSn}-103`,
      timestamp: "Today, 13:18",
      deviceSn,
      source: "Trolley Cam",
      totalItems: 5,
      totalWeightKg: 12.1,
      biogenicPct: 17,
      fossilPct: 74,
      inertPct: 9,
      dominantCategory: "plastic",
      hasHazardous: false,
      categoryCounts: { organic: 0, plastic: 3, paper: 1, metal: 1, glass: 0, hazardous: 0 },
    },
    {
      id: `BCH-${deviceSn}-102`,
      timestamp: "Today, 11:05",
      deviceSn,
      source: "Trolley Cam",
      totalItems: 5,
      totalWeightKg: 6.8,
      biogenicPct: 41,
      fossilPct: 25,
      inertPct: 19,
      dominantCategory: "organic",
      hasHazardous: true,
      categoryCounts: { organic: 1, plastic: 1, paper: 0, metal: 1, glass: 0, hazardous: 2 },
    },
  ];
}
