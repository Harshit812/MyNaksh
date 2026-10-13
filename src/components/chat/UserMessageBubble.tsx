import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import type { UserMessage } from '../../types/conversation';
import { useConversationStore } from '../../store/conversationStore';
import MessageActionsSheet, { MessageAction } from './MessageActionsSheet';
import MessageStatusLabel from './MessageStatusLabel';
import SwipeToReply from './SwipeToReply';
import { colors } from '../../theme/colors';
import { BUBBLE_MAX_WIDTH } from '../../utils/layout';

interface Props {
  message: UserMessage;
  isGrouped?: boolean;
}

function UserMessageBubble({ message, isGrouped }: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const deleteMessage = useConversationStore((s) => s.deleteMessage);
  const setReplyTarget = useConversationStore((s) => s.setReplyTarget);
  const retryMessage = useConversationStore((s) => s.retryMessage);

  const actions: MessageAction[] = [
    {
      label: 'Reply',
      icon: 'arrow-undo',
      onPress: () =>
        setReplyTarget({ id: message.id, text: message.text, authorLabel: 'You' }),
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
      <SwipeToReply
        align="right"
        onSwipeReply={() =>
          setReplyTarget({ id: message.id, text: message.text, authorLabel: 'You' })
        }
      >
        <Pressable
          onLongPress={() => setSheetVisible(true)}
          style={[styles.wrap, isGrouped && styles.wrapGrouped]}
        >
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
          {message.status ? (
            <MessageStatusLabel
              status={message.status}
              onRetry={() => retryMessage(message.id)}
            />
          ) : null}
        </Pressable>
      </SwipeToReply>
      <MessageActionsSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        actions={actions}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-end',
    maxWidth: BUBBLE_MAX_WIDTH,
    marginTop: 10,
    marginBottom: 3,
    paddingHorizontal: 16,
  },
  wrapGrouped: {
    marginTop: 2,
  },
  bubble: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    borderTopRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  text: {
    color: '#fff',
    fontSize: 15.5,
    lineHeight: 21,
  },
  replyPreview: {
    backgroundColor: colors.primaryLight,
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

export default memo(UserMessageBubble);
