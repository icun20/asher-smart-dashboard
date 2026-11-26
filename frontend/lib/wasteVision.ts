import type { ObjectDetection, DetectedObject } from "@tensorflow-models/coco-ssd";

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
  source: "Trolley Cam" | "Photo Upload" | "Live Webcam" | "Deep AI Audit";
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

/**
 * COCO-SSD neural network classes mapped to ASHER incoming waste streams.
 * Background objects (person, chair, couch, tv, table, etc.) are intentionally excluded
 * so live webcam demos do not misclassify operators or room furniture as waste.
 */
const COCO_TO_WASTE_MAP: Record<
  string,
  { category: WasteCategoryId; label: string; weightKg: number }
> = {
  // Organic / Biogenic
  banana: { category: "organic", label: "Banana / Fruit Waste", weightKg: 0.3 },
  apple: { category: "organic", label: "Apple / Organic", weightKg: 0.25 },
  orange: { category: "organic", label: "Citrus / Organic", weightKg: 0.25 },
  broccoli: { category: "organic", label: "Vegetable Waste", weightKg: 0.4 },
  carrot: { category: "organic", label: "Vegetable Waste", weightKg: 0.25 },
  sandwich: { category: "organic", label: "Food Scraps", weightKg: 0.35 },
  "hot dog": { category: "organic", label: "Food Scraps", weightKg: 0.3 },
  pizza: { category: "organic", label: "Food Waste", weightKg: 0.45 },
  donut: { category: "organic", label: "Bakery Waste", weightKg: 0.2 },
  cake: { category: "organic", label: "Food Waste", weightKg: 0.5 },

  // Plastic / Polymer
  bottle: { category: "plastic", label: "PET Bottle", weightKg: 0.35 },
  cup: { category: "plastic", label: "Cup / Polymer", weightKg: 0.15 },
  toothbrush: { category: "plastic", label: "Plastic Item", weightKg: 0.1 },
  backpack: { category: "plastic", label: "Synthetic Bag", weightKg: 0.9 },
  handbag: { category: "plastic", label: "Synthetic Packaging", weightKg: 0.7 },
  suitcase: { category: "plastic", label: "Hard Polymer Case", weightKg: 2.2 },
  umbrella: { category: "plastic", label: "Nylon / Polymer", weightKg: 0.5 },
  frisbee: { category: "plastic", label: "Hard Plastic", weightKg: 0.2 },
  "sports ball": { category: "plastic", label: "Rubber / Polymer", weightKg: 0.45 },
  "teddy bear": { category: "plastic", label: "Synthetic Textile", weightKg: 0.4 },

  // Paper & Cardboard
  book: { category: "paper", label: "Paper / Cardboard", weightKg: 0.6 },
  kite: { category: "paper", label: "Paper / Fiber", weightKg: 0.2 },

  // Metal (Non-Combustible)
  fork: { category: "metal", label: "Metal Utensil", weightKg: 0.15 },
  knife: { category: "metal", label: "Metal Blade", weightKg: 0.2 },
  spoon: { category: "metal", label: "Metal Utensil", weightKg: 0.15 },
  scissors: { category: "metal", label: "Scrap Metal", weightKg: 0.25 },
  toaster: { category: "metal", label: "Metal Appliance", weightKg: 1.8 },

  // Glass & Inert
  "wine glass": { category: "glass", label: "Glassware", weightKg: 0.4 },
  bowl: { category: "glass", label: "Ceramic / Glass Bowl", weightKg: 0.55 },
  vase: { category: "glass", label: "Glass / Ceramic Vase", weightKg: 0.8 },
  clock: { category: "glass", label: "Glass / Inert", weightKg: 0.6 },

  // Hazardous / B3 (E-Waste, Lithium Batteries, Electronics)
  "cell phone": { category: "hazardous", label: "E-Waste (Li-Ion Battery)", weightKg: 0.25 },
  laptop: { category: "hazardous", label: "E-Waste (Battery / PCB)", weightKg: 1.6 },
  remote: { category: "hazardous", label: "E-Waste (Dry Cell Battery)", weightKg: 0.2 },
  keyboard: { category: "hazardous", label: "E-Waste (Electronics)", weightKg: 0.75 },
  mouse: { category: "hazardous", label: "E-Waste (Electronics)", weightKg: 0.15 },
  microwave: { category: "hazardous", label: "Hazardous Appliance", weightKg: 4.5 },
  "hair drier": { category: "hazardous", label: "E-Waste Appliance", weightKg: 0.6 },
};

const IGNORED_BACKGROUND_CLASSES = new Set<string>([
  "person",
  "chair",
  "couch",
  "bed",
  "dining table",
  "bench",
  "tv",
  "potted plant",
  "sink",
  "refrigerator",
  "oven",
  "toilet",
  "car",
  "truck",
  "bus",
  "motorcycle",
  "cat",
  "dog",
]);

let cachedModelPromise: Promise<ObjectDetection> | null = null;

/**
 * Loads TensorFlow.js + COCO-SSD (mobilenet_v2 for higher detection accuracy)
 * strictly on the client side and caches the singleton model across re-renders.
 */
export async function loadWasteVisionModel(): Promise<ObjectDetection> {
  if (!cachedModelPromise) {
    cachedModelPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      try {
        await tf.setBackend("webgl");
      } catch {
        await tf.setBackend("cpu");
      }
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      return cocoSsd.load({ base: "mobilenet_v2" });
    })().catch((err) => {
      cachedModelPromise = null;
      throw err;
    });
  }
  return cachedModelPromise;
}

export function mapCocoPredictionsToWaste(
  predictions: DetectedObject[],
  sourceWidth: number,
  sourceHeight: number,
  wasteFilterOnly = true
): WasteDetectionBox[] {
  if (sourceWidth <= 0 || sourceHeight <= 0) return [];

  const boxes: WasteDetectionBox[] = [];

  predictions.forEach((pred, idx) => {
    const rawClass = pred.class.toLowerCase();
    if (wasteFilterOnly && IGNORED_BACKGROUND_CLASSES.has(rawClass)) {
      return;
    }

    const mapped = COCO_TO_WASTE_MAP[rawClass];
    if (wasteFilterOnly && !mapped) {
      return;
    }

    const [px, py, pw, ph] = pred.bbox;
    const x = Math.max(0, Math.min(1, px / sourceWidth));
    const y = Math.max(0, Math.min(1, py / sourceHeight));
    const w = Math.max(0.02, Math.min(1 - x, pw / sourceWidth));
    const h = Math.max(0.02, Math.min(1 - y, ph / sourceHeight));

    const category: WasteCategoryId = mapped ? mapped.category : "plastic";
    const subLabel = mapped
      ? mapped.label
      : `${pred.class.charAt(0).toUpperCase()}${pred.class.slice(1)}`;
    const estimatedWeightKg = mapped ? mapped.weightKg : 0.5;

    boxes.push({
      id: `tf-${rawClass}-${idx}`,
      category,
      subLabel,
      confidence: Number(pred.score.toFixed(2)),
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
      w: Number(w.toFixed(3)),
      h: Number(h.toFixed(3)),
      estimatedWeightKg,
    });
  });

  return boxes;
}

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

  // ASHER thermal reduction: ~4% ash for combustibles + 92% residue for non-combustible metal/glass
  const estimatedAshKg = (biogenicWeight + fossilWeight) * 0.04 + inertWeight * 0.92;

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
