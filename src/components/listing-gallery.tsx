"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function Placeholder() {
  return <div className="flex h-full min-h-48 items-center justify-center bg-surface-high text-center text-sm text-ink-muted" role="img" aria-label="Imagen de la vivienda no disponible"><span><b className="block text-4xl" aria-hidden="true">⌂</b>Imagen no disponible</span></div>;
}

export function ListingGallery({ images, alt }: { images: { url: string; sortOrder: number }[]; alt: string }) {
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function open(index: number) {
    setActiveIndex(index);
    dialogRef.current?.showModal();
    setIsOpen(true);
    closeButtonRef.current?.focus();
  }

  function move(offset: number) {
    setActiveIndex((current) => (current + offset + images.length) % images.length);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlockScroll = () => { setIsOpen(false); };
    dialog.addEventListener("close", unlockScroll);
    dialog.addEventListener("cancel", unlockScroll);
    return () => { dialog.removeEventListener("close", unlockScroll); dialog.removeEventListener("cancel", unlockScroll); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!images.length) return <div className="overflow-hidden rounded-card"><Placeholder /></div>;

  return <>
    <div className={`grid overflow-hidden rounded-card bg-surface-high shadow-soft ${images.length > 1 ? "gap-1 sm:grid-cols-2" : ""}`}>
      {images.map((image, index) => <div className={`relative min-h-56 sm:min-h-72 ${index === 0 && images.length >= 3 ? "sm:row-span-2 sm:min-h-[36rem]" : ""}`} key={image.sortOrder}>
        {failed.has(index) ? <Placeholder /> : <button className="group absolute inset-0 cursor-zoom-in" type="button" onClick={() => open(index)} aria-label={`Ampliar fotografía ${index + 1} de ${images.length}`}><Image src={image.url} alt={`${alt}. Fotografía ${index + 1} de ${images.length}`} fill unoptimized sizes={index === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 40vw, 100vw"} className="object-cover transition-opacity group-hover:opacity-90" onError={() => setFailed((current) => new Set(current).add(index))} /></button>}
      </div>)}
    </div>
    <dialog ref={dialogRef} className="lightbox" aria-modal="true" aria-label={`Fotografía ampliada de ${alt}`} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }} onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}>
      <button ref={closeButtonRef} className="lightbox-control right-3 top-3 sm:right-5 sm:top-5" type="button" aria-label="Cerrar fotografía ampliada" onClick={() => dialogRef.current?.close()}>×</button>
      <div className="relative h-[calc(100dvh-8rem)] w-[calc(100vw-2rem)] max-w-[90rem] sm:h-[calc(100dvh-6rem)] sm:w-[calc(100vw-8rem)]"><Image src={images[activeIndex].url} alt={`${alt}. Fotografía ${activeIndex + 1} de ${images.length}, ampliada`} fill unoptimized priority className="object-contain" sizes="100vw" /></div>
      {images.length > 1 && <><button className="lightbox-control left-3 top-1/2 -translate-y-1/2 sm:left-5" type="button" aria-label="Fotografía anterior" onClick={() => move(-1)}>←</button><button className="lightbox-control right-3 top-1/2 -translate-y-1/2 sm:right-5" type="button" aria-label="Fotografía siguiente" onClick={() => move(1)}>→</button><p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white" aria-live="polite">{activeIndex + 1} de {images.length}</p></>}
    </dialog>
  </>;
}
