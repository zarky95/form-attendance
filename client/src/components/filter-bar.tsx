import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const categories = [
  { value: "all", label: "All" },
  { value: "grooming", label: "Dog Grooming" },
  { value: "training", label: "Training" },
  { value: "veterinary", label: "Veterinary" },
  { value: "boarding", label: "Pet Boarding" },
  { value: "photography", label: "Pet Photography" },
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "az", label: "A-Z" },
];

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <section className="bg-white py-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center space-x-2 space-y-2 lg:space-y-0">
            <span className="text-sm font-medium text-pet-gray mr-4">Filter by category:</span>
            {categories.map((category) => (
              <Button
                key={category.value}
                size="sm"
                variant={selectedCategory === category.value ? "default" : "outline"}
                className={`rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-pet-orange text-white hover:bg-pet-orange/90"
                    : "bg-gray-100 text-pet-gray border-gray-200 hover:bg-pet-sage hover:text-white"
                }`}
                onClick={() => onCategoryChange(category.value)}
                data-testid={`filter-${category.value}`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "border-pet-orange bg-pet-orange/10"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => onViewModeChange("grid")}
                data-testid="view-grid"
              >
                <Grid className={`w-4 h-4 ${viewMode === "grid" ? "text-pet-orange" : "text-pet-gray"}`} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "border-pet-orange bg-pet-orange/10"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => onViewModeChange("list")}
                data-testid="view-list"
              >
                <List className={`w-4 h-4 ${viewMode === "list" ? "text-pet-orange" : "text-pet-gray"}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
