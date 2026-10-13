import RecommendationCard from '../RecommendationCard';
import type { Recommendation } from '../../../types/conversation';

export default function TarotCard({ item }: { item: Recommendation }) {
  return <RecommendationCard item={item} icon="sparkles" accentColor="#9333ea" />;
}
