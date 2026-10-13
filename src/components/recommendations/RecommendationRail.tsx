import { memo, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { Recommendation } from '../../types/conversation';
import { resolveRecommendationCard } from './registry';

interface Props {
  recommendations: Recommendation[];
}

function RecommendationRail({ recommendations }: Props) {
  const renderItem = useCallback(({ item }: { item: Recommendation }) => {
    const Card = resolveRecommendationCard(item.type);
    return <Card item={item} />;
  }, []);

  return (
    <FlatList
      data={recommendations}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 16,
  },
});

export default memo(RecommendationRail);
