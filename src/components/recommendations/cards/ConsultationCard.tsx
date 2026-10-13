import RecommendationCard from '../RecommendationCard';
import type { Recommendation } from '../../../types/conversation';

export default function ConsultationCard({ item }: { item: Recommendation }) {
  return <RecommendationCard item={item} icon="person-circle" accentColor="#059669" />;
}
