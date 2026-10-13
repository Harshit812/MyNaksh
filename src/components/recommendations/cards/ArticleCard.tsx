import RecommendationCard from '../RecommendationCard';
import type { Recommendation } from '../../../types/conversation';

export default function ArticleCard({ item }: { item: Recommendation }) {
  return <RecommendationCard item={item} icon="book" accentColor="#ea580c" />;
}
