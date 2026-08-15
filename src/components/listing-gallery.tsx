"use client";

import Image from "next/image";
import { useState } from "react";

function Placeholder() {
  return <div className="flex h-full min-h-48 items-center justify-center bg-surface-high text-center text-sm text-ink-muted" role="img" aria-label="Imagen de la vivienda no disponible"><span><b className="block text-4xl" aria-hidden="true">⌂</b>Imagen no disponible</span></div>;
}

export function ListingGallery({ images, alt }: { images: { url: string; sortOrder: number }[]; alt: string }) {
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  if (!images.length) return <div className="overflow-hidden rounded-card"><Placeholder /></div>;

  return <div className={`grid overflow-hidden rounded-card bg-surface-high shadow-soft ${images.length > 1 ? "gap-1 sm:grid-cols-2" : ""}`}>
    {images.map((image, index) => <div className={`relative min-h-56 sm:min-h-72 ${index === 0 && images.length >= 3 ? "sm:row-span-2 sm:min-h-[36rem]" : ""}`} key={image.sortOrder}>
      {failed.has(index) ? <Placeholder /> : <Image src={image.url} alt={`${alt}. Fotografía ${index + 1} de ${images.length}`} fill unoptimized sizes={index === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 40vw, 100vw"} className="object-cover" onError={() => setFailed((current) => new Set(current).add(index))} />}
    </div>)}
  </div>;
}
