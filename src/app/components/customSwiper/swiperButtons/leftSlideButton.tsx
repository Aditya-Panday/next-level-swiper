import { ArrowLeft } from "lucide-react";

const LeftSlideButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Previous image"
      className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 backdrop-blur-sm transition-[background,scale] duration-150 hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-indigo-500 max-sm:h-8 max-sm:w-8"
    >
      <ArrowLeft className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
    </button>
  );
};

export default LeftSlideButton;
