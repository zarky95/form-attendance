import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  images?: string[];
  currentIndex?: number;
  onNavigate?: (direction: "prev" | "next") => void;
}

export default function ImageLightbox({
  image,
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: ImageLightboxProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
      onClick={handleBackdropClick}
      data-testid="lightbox-modal"
    >
      <div className="relative max-w-4xl max-h-full">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          onClick={onClose}
          data-testid="button-close-lightbox"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <img
          src={image}
          alt="Portfolio image"
          className="max-w-full max-h-full object-contain rounded-lg"
          data-testid="img-lightbox"
        />

        {/* Navigation buttons */}
        {images && images.length > 1 && onNavigate && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              onClick={() => onNavigate("prev")}
              disabled={currentIndex === 0}
              data-testid="button-previous-image"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              onClick={() => onNavigate("next")}
              disabled={currentIndex === images.length - 1}
              data-testid="button-next-image"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
