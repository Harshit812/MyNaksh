import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { Message } from '../../types/conversation';
import { buildTimelineItems, TimelineItem } from '../../utils/dateGrouping';
import DateSeparator from './DateSeparator';
import SystemMessage from './SystemMessage';
import UserMessageBubble from './UserMessageBubble';
import AiMessageBubble from './AiMessageBubble';
import HumanMessageBubble from './HumanMessageBubble';

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  const listRef = useRef<FlatList<TimelineItem>>(null);
  const items = useMemo(() => buildTimelineItems(messages), [messages]);

  useEffect(() => {
    if (items.length > 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [items.length]);

  const renderItem = useCallback(({ item }: { item: TimelineItem }) => {
    if (item.kind === 'separator') {
      return <DateSeparator label={item.label} />;
    }

    switch (item.message.type) {
      case 'system':
        return <SystemMessage message={item.message} />;
      case 'user':
        return <UserMessageBubble message={item.message} isGrouped={item.isGrouped} />;
      case 'ai':
        return <AiMessageBubble message={item.message} isGrouped={item.isGrouped} />;
      case 'human':
        return <HumanMessageBubble message={item.message} isGrouped={item.isGrouped} />;
      default:
        return null;
    }
  }, []);

  return (
    <FlatList
      ref={listRef}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 12,
    flexGrow: 1,
  },
});
