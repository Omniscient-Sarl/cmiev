"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface GalleryGridProps {
  images: { src: string; alt: string }[];
  gridClassName?: string;
  featuredFirst?: boolean;
}

export function GalleryGrid({ images, gridClassName, featuredFirst }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setSelectedIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i));
      if (e.key === "ArrowLeft") setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i));
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selectedIndex, images.length, close]);

  return (
    <>
      <div className={gridClassName ?? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={`group relative overflow-hidden rounded-2xl bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${featuredFirst && i === 0 ? "col-span-2 row-span-2" : "aspect-[4/3]"}`}
            aria-label={img.alt}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={images[selectedIndex].alt}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          {selectedIndex > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex - 1); }}
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {selectedIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex + 1); }}
              className="absolute right-14 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label="Next image"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
