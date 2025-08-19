import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareButtons from "@/components/share-buttons";
import type { Portfolio, CaseStudy } from "@shared/schema";

interface CaseStudyModalProps {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
  onImageClick: (image: string) => void;
}

export default function CaseStudyModal({
  portfolio,
  isOpen,
  onClose,
  onImageClick,
}: CaseStudyModalProps) {
  const { data: caseStudy } = useQuery<CaseStudy>({
    queryKey: ["/api/portfolios", portfolio.id, "case-study"],
    enabled: isOpen,
  });

  if (!isOpen || !caseStudy) return null;

  const processSteps = JSON.parse(caseStudy.processSteps);
  const resultMetrics = JSON.parse(caseStudy.resultMetrics);
  const additionalImages = JSON.parse(caseStudy.additionalImages);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      data-testid="modal-case-study"
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="font-poppins font-bold text-2xl text-pet-charcoal">
            {portfolio.title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6">
          {/* Before/After Gallery */}
          <div className="mb-8">
            <h3 className="font-poppins font-semibold text-lg mb-4">Before & After</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalImages.map((image: string, index: number) => (
                <div key={index} className="relative cursor-pointer">
                  <img
                    src={image}
                    alt={index === 0 ? "Before treatment" : "After treatment"}
                    className="w-full h-64 object-cover rounded-lg"
                    onClick={() => onImageClick(image)}
                    data-testid={`img-modal-${index === 0 ? 'before' : 'after'}`}
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium text-white ${
                    index === 0 ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    {index === 0 ? 'Before' : 'After'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge */}
          <div className="mb-8">
            <h3 className="font-poppins font-semibold text-lg mb-4">The Challenge</h3>
            <p className="text-pet-gray leading-relaxed" data-testid="text-modal-challenge">
              {caseStudy.challenge}
            </p>
          </div>

          {/* Process */}
          <div className="mb-8">
            <h3 className="font-poppins font-semibold text-lg mb-4">Our Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {processSteps.map((step: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-pet-beige rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas fa-${step.icon} text-pet-orange text-xl`}></i>
                  </div>
                  <h4 className="font-medium mb-2">{step.title}</h4>
                  <p className="text-sm text-pet-gray">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <h3 className="font-poppins font-semibold text-lg mb-4">Results & Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {resultMetrics.map((metric: any, index: number) => (
                <div key={index} className="text-center p-4 bg-pet-beige bg-opacity-30 rounded-lg">
                  <div className="text-2xl font-bold text-pet-orange">
                    {metric.value}{metric.suffix}
                  </div>
                  <div className="text-sm text-pet-gray">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="mb-8 bg-pet-cream p-6 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-pet-orange rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-quote-left text-white"></i>
              </div>
              <div>
                <p className="text-pet-charcoal italic mb-3" data-testid="text-modal-testimonial">
                  "{caseStudy.testimonial}"
                </p>
                <p className="font-medium text-pet-charcoal">
                  - {caseStudy.testimonialAuthor}
                </p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-poppins font-semibold text-lg mb-4">Share This Case Study</h3>
            <ShareButtons
              url={`${window.location.origin}/case-study/${portfolio.id}`}
              title={portfolio.title}
              description={portfolio.description}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
