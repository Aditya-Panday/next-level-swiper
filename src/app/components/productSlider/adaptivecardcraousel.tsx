"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Card } from "../cards/card";
import { useCarouselResponsive } from "@/src/hooks/useCardResponsive";

interface CardItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface AdaptiveCardCarouselProps {
  cards: CardItem[];
  cardsPerViewConfig?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
  onCardClick?: (card: CardItem) => void;
}

export function AdaptiveCardCarousel({
  cards,
  cardsPerViewConfig,
  className = "",
  onCardClick,
}: AdaptiveCardCarouselProps) {
  const { cardsPerView, mounted } = useCarouselResponsive(cardsPerViewConfig);
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = useMemo(() => {
    return Math.max(0, cards.length - cardsPerView);
  }, [cards.length, cardsPerView]);

  const visibleCards = useMemo(() => {
    return cards.slice(currentIndex, currentIndex + cardsPerView);
  }, [cards, currentIndex, cardsPerView]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    },
    [handlePrevious, handleNext],
  );

  if (!mounted) {
    return (
      <div
        className={`flex h-64 items-center justify-center bg-muted ${className}`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`w-full ${className}`}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Card carousel"
    >
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-shrink-0 rounded-md border border-border p-2 hover:bg-muted disabled:opacity-50"
          aria-label="Previous cards"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-hidden">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${cardsPerView}, 1fr)` }}
          >
            {visibleCards.map((card) => (
              <button
                key={card.id}
                onClick={() => onCardClick?.(card)}
                className="text-left transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Card
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="flex-shrink-0 rounded-md border border-border p-2 hover:bg-muted disabled:opacity-50"
          aria-label="Next cards"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1">
        {Array.from({ length: Math.ceil(cards.length / cardsPerView) }).map(
          (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * cardsPerView)}
              className={`h-2 rounded-full transition-all ${
                i * cardsPerView === currentIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-border"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i * cardsPerView === currentIndex}
            />
          ),
        )}
      </div>
    </div>
  );
}
