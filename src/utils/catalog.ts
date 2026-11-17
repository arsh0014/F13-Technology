import type { InsightArticle, InsightCategory, ServiceItem } from '../data/siteContent';

export function filterInsightsByCategory(
  articles: InsightArticle[],
  category: InsightCategory,
): InsightArticle[] {
  if (category === 'All') {
    return articles;
  }
  return articles.filter((article) => article.category === category);
}

export function getServiceById(
  services: ServiceItem[],
  id: string,
): ServiceItem | undefined {
  return services.find((service) => service.id === id);
}

export function getNextSlideIndex(currentIndex: number, totalSlides: number): number {
  if (totalSlides <= 0) return 0;
  return (currentIndex + 1) % totalSlides;
}

export function getPrevSlideIndex(currentIndex: number, totalSlides: number): number {
  if (totalSlides <= 0) return 0;
  return (currentIndex - 1 + totalSlides) % totalSlides;
}
