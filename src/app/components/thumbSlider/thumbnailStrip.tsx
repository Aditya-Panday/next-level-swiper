"use client";

import LazyThumb from "./Lazythumb";
import { useCarousel } from "./slideCarousel";

interface GalleryImage {
  id: string | number;
  mainUrl: string;
  thumbnailUrl: string;
  alt?: string;
}

interface ThumbnailStripProps {
  images: GalleryImage[];
  thumbsVisible: number;
}

export function ThumbnailStrip({ images, thumbsVisible }: ThumbnailStripProps) {
  // widthStyle computed once here, passed to every LazyThumb
  // so each thumb doesn't redundantly recompute it
  const widthStyle = `calc(100% / ${thumbsVisible})`;

  return (
    <div
      role="tablist"
      aria-label="Image thumbnails"
      /**
       * no-scrollbar hides the native scrollbar on all browsers.
       * Add this to your global CSS / Tailwind plugin:
       *   .no-scrollbar::-webkit-scrollbar { display: none; }
       *   .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
       *
       * overflow-x: auto + flex → horizontal scroll for many thumbs
       */
      className="no-scrollbar flex gap-2 overflow-x-auto px-1"
    >
      {images.map((img, i) => (
        <LazyThumb
          key={img.id}
          index={i}
          src={img.thumbnailUrl}
          alt={img.alt ?? `Image ${i + 1}`}
          widthStyle={widthStyle}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AriaLiveRegion
// Announces slide changes to screen readers without showing visible text.
// Must be a client component because it reads context (activeIndex).
// ─────────────────────────────────────────────────────────────────────────────

interface AriaLiveRegionProps {
  images: GalleryImage[];
}

export function AriaLiveRegion({ images }: AriaLiveRegionProps) {
  const { activeIndex } = useCarousel();
  const active = images[activeIndex];

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      /**
       * sr-only from Tailwind:
       *   position: absolute; width: 1px; height: 1px;
       *   padding: 0; margin: -1px; overflow: hidden;
       *   clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
       */
      className="sr-only"
    >
      {active?.alt ?? `Image ${activeIndex + 1} of ${images.length}`}
    </div>
  );
}
