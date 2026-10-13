import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FEEDBACK_CHIPS } from '../../types/conversation';
import type { AiFeedback } from '../../types/conversation';
import { useConversationStore } from '../../store/conversationStore';
import { colors } from '../../theme/colors';

interface Props {
  messageId: string;
  feedback?: AiFeedback;
}

function FeedbackBar({ messageId, feedback }: Props) {
  const setFeedback = useConversationStore((s) => s.setFeedback);
  const expanded = useSharedValue(feedback?.disliked ? 1 : 0);

  const toggleLike = useCallback(() => {
    setFeedback(messageId, { liked: !feedback?.liked, disliked: false });
    expanded.value = withTiming(0, { duration: 180 });
  }, [feedback?.liked, messageId]);

  const toggleDislike = useCallback(() => {
    const next = !feedback?.disliked;
    setFeedback(messageId, { disliked: next, liked: false });
    expanded.value = withTiming(next ? 1 : 0, { duration: 220 });
  }, [feedback?.disliked, messageId]);

  const toggleChip = useCallback(
    (chip: string) => {
      const current = feedback?.chips ?? [];
      const next = current.includes(chip)
        ? current.filter((c) => c !== chip)
        : [...current, chip];
      setFeedback(messageId, { chips: next });
    },
    [feedback?.chips, messageId]
  );

  const chipsStyle = useAnimatedStyle(() => ({
    opacity: expanded.value,
    maxHeight: expanded.value * 60,
    marginTop: expanded.value * 8,
  }));

  return (
    <View>
      <View style={styles.row}>
        <Pressable
          onPress={toggleLike}
          hitSlop={8}
          style={[styles.iconButton, feedback?.liked && styles.iconButtonLiked]}
        >
          <Ionicons
            name={feedback?.liked ? 'thumbs-up' : 'thumbs-up-outline'}
            size={14}
            color={feedback?.liked ? colors.primary : colors.textMuted}
          />
        </Pressable>
        <Pressable
          onPress={toggleDislike}
          hitSlop={8}
          style={[styles.iconButton, feedback?.disliked && styles.iconButtonDisliked]}
        >
          <Ionicons
            name={feedback?.disliked ? 'thumbs-down' : 'thumbs-down-outline'}
            size={14}
            color={feedback?.disliked ? colors.danger : colors.textMuted}
          />
        </Pressable>
      </View>
      <Animated.View style={[styles.chipRow, chipsStyle]}>
        {FEEDBACK_CHIPS.map((chip) => {
          const selected = feedback?.chips?.includes(chip);
          return (
            <Pressable
              key={chip}
              onPress={() => toggleChip(chip)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {chip}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.aiBubble,
  },
  iconButtonLiked: {
    backgroundColor: colors.primaryLight,
  },
  iconButtonDisliked: {
    backgroundColor: '#FDE8E8',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    overflow: 'hidden',
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipSelected: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  chipText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: '#fff',
  },
});

export default memo(FeedbackBar);
