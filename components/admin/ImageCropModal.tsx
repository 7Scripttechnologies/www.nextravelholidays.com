"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Cropper, { type Area } from "react-easy-crop";
import { cropImageToFile, type ImageCropSpec } from "@/lib/image-crop";

interface ImageCropModalProps {
  imageSrc: string;
  fileName: string;
  crop: ImageCropSpec;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

export default function ImageCropModal({
  imageSrc,
  fileName,
  crop,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const round = crop.shape === "round";

  useEffect(() => {
    setMounted(true);
  }, []);

  const onCropComplete = useCallback((_area: Area, croppedPixels: Area) => {
    setPixels(croppedPixels);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [busy, onCancel]);

  async function handleConfirm() {
    if (!pixels || busy) return;
    setBusy(true);
    setError("");
    try {
      const file = await cropImageToFile(imageSrc, pixels, fileName);
      onConfirm(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not crop this image.");
      setBusy(false);
    }
  }

  const dialog = (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 p-3 sm:items-center sm:p-6"
      onClick={() => {
        if (!busy) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-crop-title"
        className="flex max-h-[calc(100svh-1.5rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <h2 id="image-crop-title" className="text-base font-bold text-[#EDEDED] sm:text-lg">
            Crop image
          </h2>
          <p className="mt-1 text-sm text-[#9A9A9A]">{crop.label}</p>
        </div>

        <div className="relative h-[min(58vh,420px)] w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={position}
            zoom={zoom}
            aspect={crop.aspect}
            cropShape={round ? "round" : "rect"}
            showGrid={!round}
            minZoom={1}
            maxZoom={4}
            objectFit="contain"
            onCropChange={setPosition}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { background: "#000" },
              cropAreaStyle: {
                border: round ? "3px solid #E20E17" : "2px solid rgba(226,14,23,0.9)",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
              },
            }}
          />
        </div>

        <div className="space-y-4 px-5 py-4 sm:px-6">
          <label className="block">
            <span className="text-xs font-semibold tracking-wide text-[#9A9A9A] uppercase">
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-2 w-full accent-[#E20E17]"
            />
          </label>
          <p className="text-xs leading-5 text-[#7A7A7A]">
            Drag the photo to frame it. The box matches this spot on the website.
          </p>
          {error ? <p className="text-sm text-[#E20E17]">{error}</p> : null}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onCancel}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-[#EDEDED] transition hover:border-white/30 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy || !pixels}
              onClick={() => void handleConfirm()}
              className="rounded-full bg-[#E20E17] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(226,14,23,0.28)] transition hover:brightness-110 disabled:opacity-60"
            >
              {busy ? "Saving crop…" : "Use this crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(dialog, document.body);
}
