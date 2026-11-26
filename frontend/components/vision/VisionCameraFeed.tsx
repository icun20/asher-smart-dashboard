"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
} from "lucide-react";
import {
  WASTE_CATEGORIES,
  SIMULATION_SCENARIOS,
  analyzeCanvasFrame,
  type WasteDetectionBox,
} from "@/lib/wasteVision";

export type VisionInputMode = "simulation" | "upload" | "webcam";

interface VisionCameraFeedProps {
  deviceSn: string;
  deviceName: string;
  detections: WasteDetectionBox[];
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
  onDetectionsUpdate: (boxes: WasteDetectionBox[], source: "Trolley Cam" | "Photo Upload" | "Live Webcam") => void;
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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [inferenceMs, setInferenceMs] = useState<number>(28);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const uploadedImgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const visibleDetections = detections.filter((d) => d.confidence >= confidenceThreshold);
  const hasHazardous = visibleDetections.some((d) => d.category === "hazardous");

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Draw bounding boxes & HUD on canvas
  const drawOverlayBoxes = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, boxes: WasteDetectionBox[]) => {
      if (!showBoxes) return;

      for (const box of boxes) {
        if (box.confidence < confidenceThreshold) continue;
        const meta = WASTE_CATEGORIES[box.category];
        const bx = box.x * width;
        const by = box.y * height;
        const bw = box.w * width;
        const bh = box.h * height;

        // Semi-transparent fill
        ctx.fillStyle = `${meta.colorHex}22`;
        ctx.fillRect(bx, by, bw, bh);

        // Box stroke
        ctx.strokeStyle = meta.colorHex;
        ctx.lineWidth = box.category === "hazardous" ? 3 : 2;
        ctx.strokeRect(bx, by, bw, bh);

        // Corner brackets for YOLOv8 look
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
        const labelY = Math.max(0, by - labelH);

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

      // Industrial stainless-steel loading trolley tray background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      // Subtle tray grid
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

      // Draw trolley inner rim (56x76cm loading tray visual cue)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(18, 18, w - 36, h - 36);

      // Draw stylized waste objects corresponding to each detection
      for (const det of scenario.detections) {
        const meta = WASTE_CATEGORIES[det.category];
        const cx = (det.x + det.w / 2) * w;
        const cy = (det.y + det.h / 2) * h;
        const rx = (det.w * w) * 0.42;
        const ry = (det.h * h) * 0.4;

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

      // Draw bounding boxes
      drawOverlayBoxes(ctx, w, h, scenario.detections);

      // Animated scanner laser line
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
      }

      if (!isPaused) {
        animId = requestAnimationFrame(renderSimulation);
      }
    };

    renderSimulation();
    setInferenceMs(24);

    return () => cancelAnimationFrame(animId);
  }, [mode, scenarioId, isPaused, drawOverlayBoxes, stopWebcam, onDetectionsUpdate]);

  // Re-render uploaded image when toggle/threshold changes
  const renderUploadedPhoto = useCallback(
    (img: HTMLImageElement, rerunCv: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      // Cover-fit image cleanly
      const scale = Math.min(w / img.width, h / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const offsetX = (w - drawW) / 2;
      const offsetY = (h - drawH) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      if (rerunCv) {
        const t0 = performance.now();
        const cvBoxes = analyzeCanvasFrame(ctx, w, h);
        setInferenceMs(Math.max(8, Math.round(performance.now() - t0)));
        onDetectionsUpdate(cvBoxes, "Photo Upload");
        drawOverlayBoxes(ctx, w, h, cvBoxes);
      } else {
        drawOverlayBoxes(ctx, w, h, detections);
      }
    },
    [detections, drawOverlayBoxes, onDetectionsUpdate]
  );

  useEffect(() => {
    if (mode === "upload" && uploadedImgRef.current) {
      renderUploadedPhoto(uploadedImgRef.current, false);
    }
  }, [mode, showBoxes, confidenceThreshold, renderUploadedPhoto]);

  // Handle Photo Upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    stopWebcam();
    setMode("upload");
    setUploadedImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        uploadedImgRef.current = img;
        renderUploadedPhoto(img, true);
      };
      if (typeof reader.result === "string") {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Webcam Mode
  const startWebcam = async () => {
    setMode("webcam");
    setCameraError(null);
    stopWebcam();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Browser camera access is not supported in this environment.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 360 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError(
        "Camera permission denied or no camera detected. Switch to Upload Photo or Live Bay Simulation."
      );
    }
  };

  useEffect(() => {
    if (mode !== "webcam" || isPaused) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const t0 = performance.now();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const boxes = analyzeCanvasFrame(ctx, canvas.width, canvas.height);
      setInferenceMs(Math.max(12, Math.round(performance.now() - t0)));
      onDetectionsUpdate(boxes, "Live Webcam");
      drawOverlayBoxes(ctx, canvas.width, canvas.height, boxes);
    }, 450);

    return () => clearInterval(interval);
  }, [mode, isPaused, drawOverlayBoxes, onDetectionsUpdate]);

  useEffect(() => {
    return () => stopWebcam();
  }, [stopWebcam]);

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

        {mode === "upload" && uploadedImageName && (
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-md border border-border">
            <span className="truncate">Analyzed photo: {uploadedImageName}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline ml-2 shrink-0"
            >
              Change Photo
            </button>
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
                Prohibited items detected on the loading trolley. Remove batteries, pressurized
                cans, or chemical containers before opening the 56×76 cm feed door.
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
          <div className="absolute top-2.5 left-2.5 flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused ? "bg-amber-400" : "bg-green-400 animate-pulse"
              }`}
            />
            <span>
              {mode === "simulation"
                ? `TROLLEY_CAM • ${deviceName} (${deviceSn})`
                : mode === "upload"
                ? "CV_IMAGE_ANALYSIS"
                : "LIVE_WEBCAM_STREAM"}
            </span>
          </div>

          {/* Top-right Inference Metric */}
          <div className="absolute top-2.5 right-2.5 hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm text-slate-200 text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/10">
            <span>YOLOv8-Waste</span>
            <span className="text-primary">{inferenceMs}ms</span>
            <span>• {visibleDetections.length} obj</span>
          </div>

          {/* Webcam Error State */}
          {mode === "webcam" && cameraError && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-slate-300">
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
              min={50}
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
              {showBoxes ? <Eye className="w-3.5 h-3.5 mr-1.5" /> : <EyeOff className="w-3.5 h-3.5 mr-1.5" />}
              {showBoxes ? "Boxes On" : "Boxes Off"}
            </button>

            {mode !== "upload" && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 mr-1.5" /> : <Pause className="w-3.5 h-3.5 mr-1.5" />}
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
