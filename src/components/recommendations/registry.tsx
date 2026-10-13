import type { ComponentType } from 'react';
import type { Recommendation, RecommendationType } from '../../types/conversation';
import RecommendationCard from './RecommendationCard';
import GemstoneCard from './cards/GemstoneCard';
import TarotCard from './cards/TarotCard';
import ConsultationCard from './cards/ConsultationCard';
import ArticleCard from './cards/ArticleCard';
import PromotionCard from './cards/PromotionCard';
import PanchangCard from './cards/PanchangCard';

type CardComponent = ComponentType<{ item: Recommendation }>;

// Single extension point: a future recommendation experience is added here —
// new RecommendationType union member + one card component + one entry below.
// No other file needs to change (MessageList / AiMessageBubble / RecommendationRail
// are all agnostic to the concrete set of types).
export const RECOMMENDATION_REGISTRY: Record<RecommendationType, CardComponent> = {
  gemstone: GemstoneCard,
  tarot: TarotCard,
  consultation: ConsultationCard,
  article: ArticleCard,
  promotion: PromotionCard,
  panchang: PanchangCard,
};

function FallbackCard({ item }: { item: Recommendation }) {
  return <RecommendationCard item={item} icon="star" accentColor="#64748b" />;
}

export function resolveRecommendationCard(type: RecommendationType): CardComponent {
  return RECOMMENDATION_REGISTRY[type] ?? FallbackCard;
}
