import { Star, Clock, DollarSign, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareButtons from "@/components/share-buttons";
import { useState } from "react";
import type { Portfolio } from "@shared/schema";

interface PortfolioCardProps {
  portfolio: Portfolio;
  viewMode: "grid" | "list";
  onViewCaseStudy: () => void;
  onImageClick: () => void;
}

export default function PortfolioCard({
  portfolio,
  viewMode,
  onViewCaseStudy,
  onImageClick,
}: PortfolioCardProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      grooming: "bg-pet-sage",
      training: "bg-pet-blue",
      veterinary: "bg-pet-coral",
      photography: "bg-pet-gold",
      boarding: "bg-purple-500",
    };
    return colors[category as keyof typeof colors] || "bg-pet-gray";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      grooming: "scissors",
      training: "graduation-cap",
      veterinary: "user-md",
      photography: "camera",
      boarding: "home",
    };
    return icons[category as keyof typeof icons] || "paw";
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${
        viewMode === "list" ? "flex" : ""
      }`}
      data-testid={`card-portfolio-${portfolio.id}`}
    >
      <div className={`relative ${viewMode === "list" ? "w-1/3 flex-shrink-0" : ""}`}>
        <img
          src={portfolio.afterImage}
          alt={portfolio.title}
          className={`w-full object-cover cursor-pointer ${
            viewMode === "list" ? "h-full" : "h-48"
          }`}
          onClick={onImageClick}
          data-testid={`img-portfolio-${portfolio.id}`}
        />
        <div className="absolute top-4 left-4">
          <span 
            className={`${getCategoryColor(portfolio.category)} text-white px-3 py-1 rounded-full text-xs font-medium capitalize`}
          >
            {portfolio.category === "photography" ? "Photography" : 
             portfolio.category === "boarding" ? "Pet Boarding" :
             portfolio.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
              onClick={() => setShowShareMenu(!showShareMenu)}
              data-testid={`button-share-${portfolio.id}`}
            >
              <Share className="w-4 h-4 text-pet-orange" />
            </Button>
            
            {showShareMenu && (
              <div className="absolute top-10 right-0 z-10 bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
                <ShareButtons
                  url={`${window.location.origin}/case-study/${portfolio.id}`}
                  title={portfolio.title}
                  description={portfolio.description}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full mt-2 text-pet-gray"
                  onClick={() => setShowShareMenu(false)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
        <h3 
          className="font-poppins font-semibold text-lg text-pet-charcoal mb-2"
          data-testid={`text-title-${portfolio.id}`}
        >
          {portfolio.title}
        </h3>
        <p 
          className="text-pet-gray text-sm mb-4"
          data-testid={`text-description-${portfolio.id}`}
        >
          {portfolio.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pet-beige rounded-full flex items-center justify-center">
              <i className={`fas fa-${getCategoryIcon(portfolio.category)} text-pet-orange text-sm`}></i>
            </div>
            <div>
              <p className="font-medium text-sm" data-testid={`text-business-${portfolio.id}`}>
                {portfolio.businessName}
              </p>
              <p className="text-xs text-pet-gray" data-testid={`text-location-${portfolio.id}`}>
                {portfolio.location}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-pet-gold fill-current" />
            <span className="text-sm font-medium" data-testid={`text-rating-${portfolio.id}`}>
              {portfolio.rating}
            </span>
            <span className="text-xs text-pet-gray">
              ({portfolio.reviewCount})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-pet-gray">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {portfolio.duration}
            </span>
            <span className="flex items-center">
              <DollarSign className="w-3 h-3 mr-1" />
              {portfolio.price}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-pet-orange font-medium hover:text-pet-coral transition-colors"
            onClick={onViewCaseStudy}
            data-testid={`button-view-case-study-${portfolio.id}`}
          >
            View Case Study
            <i className="fas fa-arrow-right ml-1"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
