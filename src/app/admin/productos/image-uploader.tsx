"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getUploadSignatureAction } from "./actions";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const signature = await getUploadSignatureAction();
      const url = await uploadToCloudinary(file, signature);
      onChange([...images, url]);
    } catch {
      toast.error("No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative size-24 overflow-hidden rounded-md border">
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((i) => i !== url))}
              className="bg-background/80 absolute top-1 right-1 rounded-full p-0.5"
              aria-label="Quitar imagen"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Subiendo…" : "Agregar imagen"}
      </Button>
    </div>
  );
}
