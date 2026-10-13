import RecommendationCard from '../RecommendationCard';
import type { Recommendation } from '../../../types/conversation';

export default function GemstoneCard({ item }: { item: Recommendation }) {
  return <RecommendationCard item={item} icon="diamond" accentColor="#2563eb" />;
}
