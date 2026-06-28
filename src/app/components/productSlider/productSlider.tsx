"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardData {
  id: string | number;
  title: string;
  content: string;
  imageUrl?: string;
  tag?: string;
}

export interface CardsToShow {
  mobile?: number; // < 640px
  tablet?: number; // 640–1023px
  desktop?: number; // ≥ 1024px
}

export interface AdaptiveCardCarouselProps {
  cards: CardData[];
  cardsToShow?: CardsToShow;
  gap?: number; // px
  className?: string;
}

// ─── Hook: responsive cards-to-show ──────────────────────────────────────────

function useCardsToShow(config: Required<CardsToShow>): number {
  const getCount = useCallback(() => {
    if (typeof window === "undefined") return config.desktop;
    const w = window.innerWidth;
    if (w < 640) return config.mobile;
    if (w < 1024) return config.tablet;
    return config.desktop;
  }, [config]);

  const [count, setCount] = useState<number>(getCount);

  useEffect(() => {
    const observer = new ResizeObserver(() => setCount(getCount()));
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [getCount]);

  return count;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AdaptiveCardCarousels: React.FC<AdaptiveCardCarouselProps> = ({
  cards,
  cardsToShow = {},
  gap = 16,
  className = "",
}) => {
  const config: Required<CardsToShow> = useMemo(
    () => ({
      mobile: cardsToShow.mobile ?? 1.2,
      tablet: cardsToShow.tablet ?? 2.5,
      desktop: cardsToShow.desktop ?? 3.5,
    }),
    [cardsToShow],
  );

  const visibleCount = useCardsToShow(config);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, cards.length - Math.floor(visibleCount));

  const scrollTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, maxIndex));
      setCurrentIndex(clamped);

      const track = trackRef.current;
      if (!track) return;

      const card = track.children[clamped] as HTMLElement | undefined;
      if (!card) return;

      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: "smooth",
      });
    },
    [maxIndex],
  );

  const prev = useCallback(
    () => scrollTo(currentIndex - 1),
    [currentIndex, scrollTo],
  );
  const next = useCallback(
    () => scrollTo(currentIndex + 1),
    [currentIndex, scrollTo],
  );

  // Sync index on native scroll (touch drag)
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth =
      (track.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
    const idx = Math.round(track.scrollLeft / (cardWidth + gap));
    setCurrentIndex(Math.max(0, Math.min(idx, maxIndex)));
  }, [gap, maxIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next],
  );

  const cardWidthPercent = 100 / visibleCount;

  return (
    <section
      className={`acc-root ${className}`}
      aria-label="Card carousel"
      role="region"
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="acc-track"
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-live="polite"
        style={
          {
            "--gap": `${gap}px`,
            "--card-width": `${cardWidthPercent}%`,
          } as React.CSSProperties
        }
      >
        {cards.map((card, i) => (
          <article
            key={card.id}
            className="acc-card"
            aria-label={`Card ${i + 1} of ${cards.length}: ${card.title}`}
          >
            {card.imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={card.imageUrl}
                alt={card.title}
                className="acc-card__img"
                loading={i < 4 ? "eager" : "lazy"}
                decoding="async"
              />
            )}
            <div className="acc-card__body">
              {card.tag && <span className="acc-card__tag">{card.tag}</span>}
              <h3 className="acc-card__title">{card.title}</h3>
              <p className="acc-card__content">{card.content}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Controls */}
      <div className="acc-controls" aria-label="Carousel controls">
        <button
          className="acc-btn"
          onClick={prev}
          disabled={currentIndex === 0}
          aria-label="Previous cards"
        >
          ‹
        </button>

        {/* Dot indicators */}
        <div className="acc-dots" role="tablist" aria-label="Go to slide">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to slide ${i + 1}`}
              className={`acc-dot ${i === currentIndex ? "acc-dot--active" : ""}`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>

        <button
          className="acc-btn"
          onClick={next}
          disabled={currentIndex >= maxIndex}
          aria-label="Next cards"
        >
          ›
        </button>
      </div>

      <style>{`
        .acc-root {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .acc-track {
          display: flex;
          gap: var(--gap, 16px);
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          outline: none;
          padding-bottom: 4px; /* prevent shadow clipping */
        }

        .acc-track::-webkit-scrollbar { display: none; }

        .acc-card {
          flex: 0 0 calc(var(--card-width, 33.333%) - var(--gap, 16px) * 0.75);
          scroll-snap-align: start;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          will-change: transform;
        }

        .acc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,.13);
        }

        .acc-card__img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
        }

        .acc-card__body {
          padding: 16px;
        }

        .acc-card__tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #6366f1;
          background: #eef2ff;
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .acc-card__title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 8px;
          color: #111827;
          line-height: 1.35;
        }

        .acc-card__content {
          font-size: .875rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .acc-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 20px;
        }

        .acc-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, border-color 0.15s, opacity 0.15s;
        }

        .acc-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .acc-btn:disabled {
          opacity: 0.35;
          cursor: default;
        }

        .acc-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .acc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          padding: 0;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .acc-dot--active {
          background: #6366f1;
          transform: scale(1.25);
        }

        @media (prefers-reduced-motion: reduce) {
          .acc-card { transition: none; }
          .acc-track { scroll-behavior: auto; }
        }
      `}</style>
    </section>
  );
};

export default AdaptiveCardCarousels;
