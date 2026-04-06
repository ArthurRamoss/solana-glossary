import { allTerms, getCategories, getTermsByCategory } from "@/lib/glossary";
import { categoryMeta } from "@/lib/categories";
import HomeClient from "@/components/HomeClient";

export default function HomePage() {
  const categories = getCategories().map((slug) => ({
    slug,
    label: categoryMeta[slug].label,
    color: categoryMeta[slug].color,
    count: getTermsByCategory(slug).length,
    description: categoryMeta[slug].description,
  }));

  return <HomeClient terms={allTerms} categories={categories} />;
}
