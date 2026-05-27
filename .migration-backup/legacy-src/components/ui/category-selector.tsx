import { cn } from "../../lib/utils";

interface CategorySelectorProps {
  categories: { id: string; label: string }[];
  activeCategory?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function CategorySelector({ categories, activeCategory, onSelect, className }: CategorySelectorProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border",
            activeCategory === category.id
              ? "bg-gold text-primary-base border-gold shadow-[0_0_15px_rgba(200,162,74,0.3)] scale-105"
              : "bg-surface-base text-gray-400 border-white/10 hover:border-gold/30 hover:text-white hover:bg-surface-hover hover:scale-105"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
