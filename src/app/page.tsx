import {
  BarChart3,
  Layers,
  Lightbulb,
  SparklesIcon,
  Workflow,
  Zap,
} from "lucide-react";
import { CARDS_DATA, GALLERY_IMAGES } from "../data/thumbProducts";
import { AdaptiveCardCarousel } from "./components/productSlider/adaptivecardcraousel";
import MainImageThumbnailCarousel from "./components/thumbSlider/thumbSlider";
import AdaptiveCardCarousels from "./components/productSlider/productSlider";

const CARD_DATA = [
  {
    id: "1",
    title: "Performance",
    description: "Optimized rendering with memoization smooth 60fps animations",
    icon: <Zap className="h-8 w-8 text-blue-500" />,
  },
  {
    id: "2",
    title: "Responsive",
    description:
      "Automatically adapts to mobile, tablet, and desktop with configurable breakpoints",
    icon: <Layers className="h-8 w-8 text-purple-500" />,
  },
  {
    id: "3",
    title: "Accessible",
    description:
      "Full keyboard navigation, ARIA labels, and semantic HTML for screen readers",
    icon: <SparklesIcon className="h-8 w-8 text-pink-500" />,
  },
  {
    id: "4",
    title: "Analytics",
    description:
      "Built-in event callbacks to track user interactions and engagement metrics",
    icon: <BarChart3 className="h-8 w-8 text-green-500" />,
  },
  {
    id: "5",
    title: "Workflow",
    description:
      "Simple, composable API that integrates seamlessly with your React applications",
    icon: <Workflow className="h-8 w-8 text-orange-500" />,
  },
  {
    id: "6",
    title: "Innovation",
    description:
      "Built with the latest React 19 features and Next.js 16 best practices",
    icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
  },
];
export default function Home() {
  return (
    <main className="min-h-screen space-y-16 bg-background px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-4xl space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
          High-Performance Carousel Components
        </h1>
        <p className="text-lg text-muted-foreground">
          Responsive, accessible, and optimized carousel components built with
          React 19 and Next.js 16
        </p>
      </div>

      {/* Image Thumbnail Carousel */}
      <section className="mx-auto w-full max-w-4xl space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Image Gallery with Thumbnails
          </h2>
          <p className="text-muted-foreground">
            Navigate images with arrow buttons or click thumbnails. Use arrow
            keys for keyboard navigation.
          </p>
        </div>

        <AdaptiveCardCarousel
          cards={CARD_DATA}
          cardsPerViewConfig={{ mobile: 1, tablet: 2, desktop: 3 }}
          // onCardClick={(card) => console.log("Card clicked:", card.title)}
        />
        <AdaptiveCardCarousels
          cards={CARDS_DATA}
          cardsToShow={{ mobile: 1.2, tablet: 2.5, desktop: 3.5 }}
          gap={16}
        />

        <MainImageThumbnailCarousel
          images={GALLERY_IMAGES}
          initialIndex={1}
          thumbsVisible={6}
          countVisible={true}
        />
      </section>
    </main>
  );
}
