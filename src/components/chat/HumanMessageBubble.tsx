import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import type { HumanMessage } from '../../types/conversation';
import { useConversationStore } from '../../store/conversationStore';
import MessageActionsSheet, { MessageAction } from './MessageActionsSheet';
import SwipeToReply from './SwipeToReply';
import { colors } from '../../theme/colors';
import { BUBBLE_MAX_WIDTH_WIDE } from '../../utils/layout';

interface Props {
  message: HumanMessage;
  isGrouped?: boolean;
}

function HumanMessageBubble({ message, isGrouped }: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const deleteMessage = useConversationStore((s) => s.deleteMessage);
  const setReplyTarget = useConversationStore((s) => s.setReplyTarget);

  const actions: MessageAction[] = [
    {
      label: 'Reply',
      icon: 'arrow-undo',
      onPress: () =>
        setReplyTarget({ id: message.id, text: message.text, authorLabel: 'Astrologer' }),
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
        align="left"
        onSwipeReply={() =>
          setReplyTarget({ id: message.id, text: message.text, authorLabel: 'Astrologer' })
        }
      >
        <Pressable
          onLongPress={() => setSheetVisible(true)}
          style={[styles.wrap, isGrouped && styles.wrapGrouped]}
        >
          {!isGrouped ? <Text style={styles.label}>🪔 Human Astrologer</Text> : null}
          <View style={styles.bubble}>
            <Text style={styles.text}>{message.text}</Text>
          </View>
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
    alignSelf: 'flex-start',
    maxWidth: BUBBLE_MAX_WIDTH_WIDE,
    marginTop: 10,
    marginBottom: 3,
    paddingHorizontal: 16,
  },
  wrapGrouped: {
    marginTop: 2,
  },
  label: {
    fontSize: 11,
    color: colors.humanAccent,
    fontWeight: '700',
    marginBottom: 3,
    marginLeft: 2,
  },
  bubble: {
    backgroundColor: colors.humanBubble,
    borderWidth: 1,
    borderColor: colors.humanBubbleBorder,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  text: {
    color: '#7C2D12',
    fontSize: 15.5,
    lineHeight: 21,
  },
});

export default memo(HumanMessageBubble);
