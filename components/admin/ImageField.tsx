"use client";

import { useRef, useState, useTransition } from "react";
import AppImage from "@/components/AppImage";
import ImageCropModal from "@/components/admin/ImageCropModal";
import { uploadAdminImage } from "@/app/admin/actions";
import type { ImageCropSpec } from "@/lib/image-crop";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  crop: ImageCropSpec;
  required?: boolean;
}

export default function ImageField({ label, value, onChange, crop, required }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [session, setSession] = useState<{ src: string; name: string } | null>(null);
  const round = crop.shape === "round";

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    const src = URL.createObjectURL(file);
    setSession({ src, name: file.name });
  }

  function closeCrop() {
    if (session) URL.revokeObjectURL(session.src);
    setSession(null);
  }

  function uploadCropped(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadAdminImage(formData);
      closeCrop();
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        setError("");
        onChange(result.url);
      }
    });
  }

  return (
    <div>
      <p className="text-sm font-medium text-[#EDEDED]">{label}</p>
      <p className="mt-0.5 text-xs text-[#7A7A7A]">{crop.label}</p>
      <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
        {value ? (
          <div
            className={cn(
              "relative w-36 shrink-0 overflow-hidden border border-line bg-black",
              round ? "rounded-full" : "rounded-xl",
            )}
            style={{ aspectRatio: String(crop.aspect) }}
          >
            <AppImage src={value} alt="" fill className="object-cover" />
          </div>
        ) : (
          <div
            className={cn(
              "flex w-36 shrink-0 items-center justify-center border border-dashed border-line text-xs text-muted",
              round ? "rounded-full" : "rounded-xl",
            )}
            style={{ aspectRatio: String(crop.aspect) }}
          >
            No image
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="text"
            value={value}
            required={required}
            placeholder="/images/beach.jpg or https://..."
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={pending}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/60",
                pending && "opacity-60",
              )}
            >
              <Upload className="size-3.5" />
              {pending ? "Uploading..." : "Upload & crop"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs font-semibold text-muted hover:text-[#EDEDED]"
              >
                Clear
              </button>
            ) : null}
          </div>
          {error ? <p className="text-xs text-[#E20E17]">{error}</p> : null}
        </div>
      </div>

      {session ? (
        <ImageCropModal
          imageSrc={session.src}
          fileName={session.name}
          crop={crop}
          onCancel={closeCrop}
          onConfirm={uploadCropped}
        />
      ) : null}
    </div>
  );
}
