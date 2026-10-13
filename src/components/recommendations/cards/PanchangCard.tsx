import RecommendationCard from '../RecommendationCard';
import type { Recommendation } from '../../../types/conversation';

export default function PanchangCard({ item }: { item: Recommendation }) {
  return <RecommendationCard item={item} icon="calendar" accentColor="#0D9488" />;
}
