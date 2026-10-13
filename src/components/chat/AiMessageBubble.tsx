import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import type { AiMessage } from '../../types/conversation';
import { useConversationStore } from '../../store/conversationStore';
import MessageActionsSheet, { MessageAction } from './MessageActionsSheet';
import RecommendationRail from '../recommendations/RecommendationRail';
import FeedbackBar from './FeedbackBar';
import SwipeToReply from './SwipeToReply';
import { colors } from '../../theme/colors';
import { BUBBLE_MAX_WIDTH_WIDE } from '../../utils/layout';

interface Props {
  message: AiMessage;
  isGrouped?: boolean;
}

function AiMessageBubble({ message, isGrouped }: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const deleteMessage = useConversationStore((s) => s.deleteMessage);
  const setReplyTarget = useConversationStore((s) => s.setReplyTarget);

  const actions: MessageAction[] = [
    {
      label: 'Reply',
      icon: 'arrow-undo',
      onPress: () =>
        setReplyTarget({ id: message.id, text: message.text, authorLabel: 'AI Astrologer' }),
    },
    {
      label: 'Copy',
      icon: 'copy',
      onPress: () => Clipboard.setString(message.text),
    },
    {
      label: 'Delete',
      icon: 'trash',
      destructive: true,
      onPress: () => deleteMessage(message.id),
    },
  ];

  return (
    <>
      <View style={[styles.container, isGrouped && styles.containerGrouped]}>
        <SwipeToReply
          align="left"
          onSwipeReply={() =>
            setReplyTarget({ id: message.id, text: message.text, authorLabel: 'AI Astrologer' })
          }
        >
          <Pressable onLongPress={() => setSheetVisible(true)} style={styles.wrap}>
            {message.replyTo ? (
              <View style={styles.replyPreview}>
                <Text style={styles.replyAuthor}>{message.replyTo.authorLabel}</Text>
                <Text style={styles.replyText} numberOfLines={1}>
                  {message.replyTo.text}
                </Text>
              </View>
            ) : null}
            <View style={styles.bubble}>
              <Text style={styles.text}>{message.text}</Text>
            </View>
            <FeedbackBar messageId={message.id} feedback={message.feedback} />
          </Pressable>
        </SwipeToReply>
        {message.recommendations?.length ? (
          <RecommendationRail recommendations={message.recommendations} />
        ) : null}
      </View>
      <MessageActionsSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        actions={actions}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 3,
  },
  containerGrouped: {
    marginTop: 2,
  },
  wrap: {
    alignSelf: 'flex-start',
    maxWidth: BUBBLE_MAX_WIDTH_WIDE,
    paddingHorizontal: 16,
  },
  bubble: {
    backgroundColor: colors.aiBubble,
    borderWidth: 1,
    borderColor: colors.aiBubbleBorder,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 15.5,
    lineHeight: 21,
  },
  replyPreview: {
    backgroundColor: colors.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: 10,
    padding: 7,
    marginBottom: 5,
  },
  replyAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  replyText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default memo(AiMessageBubble);
