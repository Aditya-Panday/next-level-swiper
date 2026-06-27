import { GALLERY_IMAGES } from "../data/thumbProducts";
import MainImageThumbnailCarousel from "./components/thumbSlider/thumbSlider";

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
