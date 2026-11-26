"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { ObjectDetection } from "@tensorflow-models/coco-ssd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Camera,
  Upload,
  Video,
  Play,
  Pause,
  ScanEye,
  Eye,
  EyeOff,
  AlertTriangle,
  Plus,
  RefreshCw,
  Sparkles,
  LoaderCircle,
  Filter,
} from "lucide-react";
import {
  WASTE_CATEGORIES,
  SIMULATION_SCENARIOS,
  loadWasteVisionModel,
  mapCocoPredictionsToWaste,
  type WasteDetectionBox,
} from "@/lib/wasteVision";

export type VisionInputMode = "simulation" | "upload" | "webcam";
export type DetectionSource = "Trolley Cam" | "Photo Upload" | "Live Webcam" | "Deep AI Audit";

interface VisionCameraFeedProps {
  deviceSn: string;
  deviceName: string;
  detections: WasteDetectionBox[];
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
  onDetectionsUpdate: (boxes: WasteDetectionBox[], source: DetectionSource) => void;
  onCaptureBatch: () => void;
}

export function VisionCameraFeed({
  deviceSn,
  deviceName,
  detections,
  confidenceThreshold,
  onConfidenceChange,
  onDetectionsUpdate,
  onCaptureBatch,
}: VisionCameraFeedProps) {
  const [mode, setMode] = useState<VisionInputMode>("simulation");
  const [scenarioId, setScenarioId] = useState<string>(SIMULATION_SCENARIOS[0].id);
  const [isPaused, setIsPaused] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const [wasteFilterOnly, setWasteFilterOnly] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [inferenceMs, setInferenceMs] = useState<number>(24);

  // Neural Network & Deep AI Audit state
  const [modelStatus, setModelStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [activeEngineLabel, setActiveEngineLabel] = useState<string>("Bay Simulator");
  const [deepAuditConfigured, setDeepAuditConfigured] = useState<boolean>(false);
  const [isDeepAuditing, setIsDeepAuditing] = useState<boolean>(false);
  const [deepAuditNotice, setDeepAuditNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const uploadedImgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modelRef = useRef<ObjectDetection | null>(null);
  const isInferringRef = useRef<boolean>(false);

  const visibleDetections = detections.filter((d) => d.confidence >= confidenceThreshold);
  const hasHazardous = visibleDetections.some((d) => d.category === "hazardous");

  // Check if Gemini Deep AI Audit API key is configured on server
  useEffect(() => {
    let active = true;
    fetch("/api/vision/analyze")
      .then((res) => res.json())
      .then((data: { configured?: boolean }) => {
        if (active) setDeepAuditConfigured(Boolean(data.configured));
      })
      .catch(() => {
        if (active) setDeepAuditConfigured(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const ensureModelLoaded = useCallback(async (): Promise<ObjectDetection | null> => {
    if (modelRef.current) return modelRef.current;
    setModelStatus("loading");
    try {
      const loaded = await loadWasteVisionModel();
      modelRef.current = loaded;
      setModelStatus("ready");
      return loaded;
    } catch {
      setModelStatus("error");
      return null;
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Draw bounding boxes onto the target canvas
  const drawOverlayBoxes = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      offsetX: number,
      offsetY: number,
      drawW: number,
      drawH: number,
      boxes: WasteDetectionBox[]
    ) => {
      if (!showBoxes) return;

      for (const box of boxes) {
        if (box.confidence < confidenceThreshold) continue;
        const meta = WASTE_CATEGORIES[box.category];
        const bx = offsetX + box.x * drawW;
        const by = offsetY + box.y * drawH;
        const bw = box.w * drawW;
        const bh = box.h * drawH;

        ctx.fillStyle = `${meta.colorHex}20`;
        ctx.fillRect(bx, by, bw, bh);

        ctx.strokeStyle = meta.colorHex;
        ctx.lineWidth = box.category === "hazardous" ? 3 : 2;
        ctx.strokeRect(bx, by, bw, bh);

        // Corner brackets
        const corner = Math.min(14, bw * 0.25, bh * 0.25);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx, by + corner);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + corner, by);
        ctx.moveTo(bx + bw - corner, by);
        ctx.lineTo(bx + bw, by);
        ctx.lineTo(bx + bw, by + corner);
        ctx.moveTo(bx, by + bh - corner);
        ctx.lineTo(bx, by + bh);
        ctx.lineTo(bx + corner, by + bh);
        ctx.moveTo(bx + bw - corner, by + bh);
        ctx.lineTo(bx + bw, by + bh);
        ctx.lineTo(bx + bw, by + bh - corner);
        ctx.stroke();

        // Label badge
        const label = `${meta.shortLabel} ${Math.round(box.confidence * 100)}% • ${box.subLabel}`;
        ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
        const textWidth = ctx.measureText(label).width;
        const labelH = 20;
        const labelY = by > labelH + 2 ? by - labelH : by + 2;

        ctx.fillStyle = meta.colorHex;
        ctx.fillRect(bx, labelY, textWidth + 12, labelH);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, bx + 6, labelY + 14);
      }
    },
    [showBoxes, confidenceThreshold]
  );

  // Simulation Mode renderer
  useEffect(() => {
    if (mode !== "simulation") return;
    stopWebcam();
    setActiveEngineLabel("Bay Simulator");
    setDeepAuditNotice(null);

    const scenario =
      SIMULATION_SCENARIOS.find((s) => s.id === scenarioId) ?? SIMULATION_SCENARIOS[0];
    onDetectionsUpdate(scenario.detections, "Trolley Cam");

    let animId = 0;
    let scanY = 0;

    const renderSimulation = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(148, 163, 184, 0.10)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 56x76 cm loading tray visual frame
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(18, 18, w - 36, h - 36);

      for (const det of scenario.detections) {
        const meta = WASTE_CATEGORIES[det.category];
        const cx = (det.x + det.w / 2) * w;
        const cy = (det.y + det.h / 2) * h;
        const rx = det.w * w * 0.42;
        const ry = det.h * h * 0.4;

        ctx.save();
        ctx.fillStyle = `${meta.colorHex}55`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `${meta.colorHex}88`;
        ctx.beginPath();
        ctx.ellipse(cx - rx * 0.15, cy - ry * 0.15, rx * 0.55, ry * 0.45, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      drawOverlayBoxes(ctx, 0, 0, w, h, scenario.detections);

      if (!isPaused) {
        scanY = (scanY + 2.2) % h;
        const grad = ctx.createLinearGradient(0, Math.max(0, scanY - 36), 0, scanY);
        grad.addColorStop(0, "rgba(74, 222, 128, 0)");
        grad.addColorStop(1, "rgba(74, 222, 128, 0.25)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, Math.max(0, scanY - 36), w, 36);

        ctx.strokeStyle = "rgba(74, 222, 128, 0.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(w, scanY);
        ctx.stroke();
        animId = requestAnimationFrame(renderSimulation);
      }
    };

    renderSimulation();
    setInferenceMs(24);

    return () => cancelAnimationFrame(animId);
  }, [mode, scenarioId, isPaused, drawOverlayBoxes, stopWebcam, onDetectionsUpdate]);

  // Helper to compute letterboxed image draw metrics on canvas
  const getImageDrawRect = (imgW: number, imgH: number, canvasW: number, canvasH: number) => {
    const scale = Math.min(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (canvasW - drawW) / 2;
    const offsetY = (canvasH - drawH) / 2;
    return { offsetX, offsetY, drawW, drawH };
  };

  // Render uploaded photo + boxes
  const paintUploadedPhoto = useCallback(
    (img: HTMLImageElement, boxes: WasteDetectionBox[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { offsetX, offsetY, drawW, drawH } = getImageDrawRect(
        img.naturalWidth || img.width,
        img.naturalHeight || img.height,
        canvas.width,
        canvas.height
      );
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      drawOverlayBoxes(ctx, offsetX, offsetY, drawW, drawH, boxes);
    },
    [drawOverlayBoxes]
  );

  // Run real TF.js Neural Network on uploaded photo
  const runTfjsOnUploadedImage = useCallback(
    async (img: HTMLImageElement) => {
      paintUploadedPhoto(img, []);
      const model = await ensureModelLoaded();
      if (!model) return;

      const t0 = performance.now();
      const predictions = await model.detect(img, 15, 0.35);
      const elapsed = Math.max(12, Math.round(performance.now() - t0));
      const mapped = mapCocoPredictionsToWaste(
        predictions,
        img.naturalWidth || img.width,
        img.naturalHeight || img.height,
        wasteFilterOnly
      );

      setInferenceMs(elapsed);
      setActiveEngineLabel("TF.js Neural Net (MobileNetV2)");
      onDetectionsUpdate(mapped, "Photo Upload");
      paintUploadedPhoto(img, mapped);
    },
    [ensureModelLoaded, paintUploadedPhoto, onDetectionsUpdate, wasteFilterOnly]
  );

  // Re-paint uploaded photo when display toggles change
  useEffect(() => {
    if (mode === "upload" && uploadedImgRef.current) {
      paintUploadedPhoto(uploadedImgRef.current, detections);
    }
  }, [mode, showBoxes, confidenceThreshold, detections, paintUploadedPhoto]);

  // Re-run TF.js if waste filter toggles while in upload mode
  useEffect(() => {
    if (mode === "upload" && uploadedImgRef.current && activeEngineLabel.startsWith("TF.js")) {
      void runTfjsOnUploadedImage(uploadedImgRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasteFilterOnly]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    stopWebcam();
    setMode("upload");
    setCameraError(null);
    setDeepAuditNotice(null);
    setUploadedImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        uploadedImgRef.current = img;
        void runTfjsOnUploadedImage(img);
      };
      if (typeof reader.result === "string") {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Start Live Webcam + TF.js Real-Time Neural Net
  const startWebcam = async () => {
    setMode("webcam");
    setCameraError(null);
    setDeepAuditNotice(null);
    setIsPaused(false);
    stopWebcam();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Browser camera access is not supported in this environment.");
      return;
    }

    try {
      const [stream] = await Promise.all([
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 360 } },
          audio: false,
        }),
        ensureModelLoaded(),
      ]);

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActiveEngineLabel("TF.js Neural Net (Live)");
    } catch {
      setCameraError(
        "Camera permission denied or no camera detected. Switch to Upload Photo or Bay Sim."
      );
    }
  };

  // Live Webcam Neural Net Loop
  useEffect(() => {
    if (mode !== "webcam" || isPaused) return;

    let cancelled = false;
    let latestBoxes: WasteDetectionBox[] = [];

    const interval = setInterval(async () => {
      if (cancelled || isInferringRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { offsetX, offsetY, drawW, drawH } = getImageDrawRect(
        video.videoWidth,
        video.videoHeight,
        canvas.width,
        canvas.height
      );

      // Draw live video frame smoothly
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, offsetX, offsetY, drawW, drawH);

      const model = modelRef.current;
      if (!model) {
        drawOverlayBoxes(ctx, offsetX, offsetY, drawW, drawH, latestBoxes);
        return;
      }

      isInferringRef.current = true;
      try {
        const t0 = performance.now();
        const predictions = await model.detect(video, 12, 0.35);
        if (cancelled) return;
        const elapsed = Math.max(10, Math.round(performance.now() - t0));
        const mapped = mapCocoPredictionsToWaste(
          predictions,
          video.videoWidth,
          video.videoHeight,
          wasteFilterOnly
        );
        latestBoxes = mapped;
        setInferenceMs(elapsed);
        setActiveEngineLabel("TF.js Neural Net (Live)");
        onDetectionsUpdate(mapped, "Live Webcam");

        // Re-paint frame + crisp bounding boxes
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, offsetX, offsetY, drawW, drawH);
        drawOverlayBoxes(ctx, offsetX, offsetY, drawW, drawH, mapped);
      } finally {
        isInferringRef.current = false;
      }
    }, 220);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [mode, isPaused, wasteFilterOnly, drawOverlayBoxes, onDetectionsUpdate]);

  useEffect(() => {
    return () => stopWebcam();
  }, [stopWebcam]);

  // Deep AI Audit (Server-side Gemini Vision API for real complex trash piles)
  const handleDeepAiAudit = async () => {
    setDeepAuditNotice(null);

    // Grab current clean source image (without drawn boxes!)
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 720;
    tempCanvas.height = 405;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    if (mode === "upload" && uploadedImgRef.current) {
      const img = uploadedImgRef.current;
      tempCanvas.width = img.naturalWidth || img.width;
      tempCanvas.height = img.naturalHeight || img.height;
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
    } else if (mode === "webcam" && videoRef.current && videoRef.current.readyState >= 2) {
      const video = videoRef.current;
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
      setIsPaused(true);
    } else {
      setDeepAuditNotice("Upload a real waste photo or open Live Webcam first to run Deep AI Audit.");
      return;
    }

    const imageBase64 = tempCanvas.toDataURL("image/jpeg", 0.85);
    setIsDeepAuditing(true);
    const t0 = performance.now();

    try {
      const res = await fetch("/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType: "image/jpeg" }),
      });

      const payload = (await res.json()) as {
        configured?: boolean;
        detections?: WasteDetectionBox[];
        error?: string;
      };

      if (!res.ok) {
        setDeepAuditNotice(
          payload.error ||
            "Deep AI Audit unavailable. Add GEMINI_API_KEY in Vercel/local .env to unlock mixed-pile VLM analysis."
        );
        return;
      }

      const boxes = payload.detections ?? [];
      setInferenceMs(Math.round(performance.now() - t0));
      setActiveEngineLabel("Gemini 2.5 Vision (Deep Audit)");
      onDetectionsUpdate(boxes, "Deep AI Audit");

      if (mode === "upload" && uploadedImgRef.current) {
        paintUploadedPhoto(uploadedImgRef.current, boxes);
      } else if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          const { offsetX, offsetY, drawW, drawH } = getImageDrawRect(
            videoRef.current.videoWidth,
            videoRef.current.videoHeight,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(videoRef.current, offsetX, offsetY, drawW, drawH);
          drawOverlayBoxes(ctx, offsetX, offsetY, drawW, drawH, boxes);
        }
      }
    } catch {
      setDeepAuditNotice("Network error while calling /api/vision/analyze.");
    } finally {
      setIsDeepAuditing(false);
    }
  };

  return (
    <Card className="border-border shadow-none flex flex-col h-full">
      <CardHeader className="pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ScanEye className="h-5 w-5 text-primary shrink-0" />
            <CardTitle className="text-lg">Incoming Waste Vision Scanner</CardTitle>
          </div>

          {/* Input Source Switcher */}
          <div className="inline-flex rounded-lg border border-border bg-slate-50 dark:bg-slate-900 p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                stopWebcam();
                setMode("simulation");
                setCameraError(null);
              }}
              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                mode === "simulation"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-slate-500 hover:text-foreground"
              }`}
            >
              <Camera className="w-3.5 h-3.5 mr-1.5" />
              Bay Sim
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                mode === "upload"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-slate-500 hover:text-foreground"
              }`}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload Photo
            </button>
            <button
              type="button"
              onClick={startWebcam}
              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                mode === "webcam"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-slate-500 hover:text-foreground"
              }`}
            >
              <Video className="w-3.5 h-3.5 mr-1.5" />
              Webcam
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Scenario Pills when in Simulation Mode */}
        {mode === "simulation" && (
          <div className="flex flex-wrap gap-2">
            {SIMULATION_SCENARIOS.map((sc) => (
              <button
                type="button"
                key={sc.id}
                onClick={() => setScenarioId(sc.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  scenarioId === sc.id
                    ? sc.id === "hazardous-alert"
                      ? "bg-danger/15 border-danger text-danger"
                      : "bg-primary/15 border-primary text-foreground"
                    : "border-border bg-card text-slate-500 hover:text-foreground"
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>
        )}

        {/* Active Model & Deep Audit Controls for Upload / Webcam */}
        {mode !== "simulation" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-border">
            <div className="flex items-center gap-2 min-w-0">
              {modelStatus === "loading" ? (
                <LoaderCircle className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-safe shrink-0" />
              )}
              <span className="text-slate-600 dark:text-slate-300 truncate">
                {modelStatus === "loading"
                  ? "Downloading TF.js MobileNetV2 Neural Network (~6MB, one-time)..."
                  : mode === "upload" && uploadedImageName
                  ? `${activeEngineLabel} • ${uploadedImageName}`
                  : `${activeEngineLabel} • Hold bottle, fruit, paper, cup, or phone`}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setWasteFilterOnly((prev) => !prev)}
                className={`inline-flex items-center px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                  wasteFilterOnly
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "border-border bg-card text-slate-500"
                }`}
                title="Ignore humans and room furniture when detecting waste"
              >
                <Filter className="w-3 h-3 mr-1" />
                {wasteFilterOnly ? "Waste Only" : "All Objects"}
              </button>

              <button
                type="button"
                onClick={handleDeepAiAudit}
                disabled={isDeepAuditing}
                className="inline-flex items-center px-2.5 py-1 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                title={
                  deepAuditConfigured
                    ? "Run Gemini Vision Deep Audit on mixed waste piles"
                    : "Configure GEMINI_API_KEY in .env to enable Gemini Deep Audit"
                }
              >
                {isDeepAuditing ? (
                  <LoaderCircle className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-1" />
                )}
                {isDeepAuditing ? "Auditing..." : "Deep AI Audit"}
              </button>
            </div>
          </div>
        )}

        {deepAuditNotice && (
          <div className="text-xs px-3 py-2 rounded-lg border border-warning/40 bg-warning/10 text-amber-700 dark:text-amber-400">
            {deepAuditNotice}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Hazardous Pre-Load Warning Banner */}
        {hasHazardous && (
          <div className="flex items-start gap-3 p-3 rounded-lg border border-danger/40 bg-danger/10 text-danger">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs sm:text-sm">
              <div className="font-bold uppercase tracking-wide">
                Hazardous (B3) Material Detected — Hold Loading
              </div>
              <p className="text-danger/90 mt-0.5">
                Prohibited items (batteries, e-waste, pressurized cans) detected before feed door.
                Remove flagged objects before loading into the 56×76 cm chamber.
              </p>
            </div>
          </div>
        )}

        {/* Main Viewport Canvas */}
        <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-border">
          <video ref={videoRef} playsInline muted className="hidden" />
          <canvas
            ref={canvasRef}
            width={720}
            height={405}
            className="w-full h-full object-contain block"
          />

          {/* Top-left Telemetry Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/10 max-w-[70%] truncate">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isPaused ? "bg-amber-400" : "bg-green-400 animate-pulse"
              }`}
            />
            <span className="truncate">
              {mode === "simulation"
                ? `TROLLEY_CAM • ${deviceName} (${deviceSn})`
                : mode === "upload"
                ? "NEURAL_PHOTO_SCAN"
                : "LIVE_NEURAL_WEBCAM"}
            </span>
          </div>

          {/* Top-right Inference Metric */}
          <div className="absolute top-2.5 right-2.5 hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm text-slate-200 text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/10">
            <span>{activeEngineLabel.split(" ")[0]}</span>
            <span className="text-primary">{inferenceMs}ms</span>
            <span>• {visibleDetections.length} obj</span>
          </div>

          {/* Model Loading Overlay */}
          {mode !== "simulation" && modelStatus === "loading" && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center text-slate-200 z-20">
              <LoaderCircle className="w-8 h-8 text-primary animate-spin mb-3" />
              <div className="text-sm font-semibold">Loading TensorFlow.js Neural Network</div>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Initializing MobileNetV2 COCO-SSD in browser WebGL for accurate real-time object
                classification...
              </p>
            </div>
          )}

          {/* Webcam Error State */}
          {mode === "webcam" && cameraError && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-slate-300 z-20">
              <Video className="w-10 h-10 text-slate-500 mb-3" />
              <p className="text-sm max-w-sm">{cameraError}</p>
              <button
                type="button"
                onClick={startWebcam}
                className="mt-4 inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Retry Camera
              </button>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 flex-1">
            <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Confidence ≥ {Math.round(confidenceThreshold * 100)}%
            </label>
            <input
              type="range"
              min={40}
              max={95}
              step={5}
              value={Math.round(confidenceThreshold * 100)}
              onChange={(e) => onConfidenceChange(Number(e.target.value) / 100)}
              className="w-full max-w-[160px] accent-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBoxes((prev) => !prev)}
              className="inline-flex items-center px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {showBoxes ? (
                <Eye className="w-3.5 h-3.5 mr-1.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 mr-1.5" />
              )}
              {showBoxes ? "Boxes On" : "Boxes Off"}
            </button>

            {mode !== "upload" && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {isPaused ? (
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                ) : (
                  <Pause className="w-3.5 h-3.5 mr-1.5" />
                )}
                {isPaused ? "Resume" : "Pause"}
              </button>
            )}

            <button
              type="button"
              onClick={onCaptureBatch}
              disabled={visibleDetections.length === 0}
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Log Batch
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
