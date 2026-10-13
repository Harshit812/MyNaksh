import { useRef, useState, type ElementRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useConversationStore } from '../../store/conversationStore';
import { colors } from '../../theme/colors';

export default function Composer() {
  // Deliberately uncontrolled: feeding `value` back from state on every
  // keystroke races with Fabric's content-size remeasurement on multiline
  // inputs (RN #46207) and visibly fragments fast typing. `textRef` always
  // holds the latest text; `hasText` only drives the send-button enabled
  // state, so it re-renders the button, not the input.
  const textRef = useRef('');
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);
  const [hasText, setHasText] = useState(false);
  const replyTarget = useConversationStore((s) => s.replyTarget);
  const setReplyTarget = useConversationStore((s) => s.setReplyTarget);
  const sendMessage = useConversationStore((s) => s.sendMessage);

  const handleChangeText = (value: string) => {
    textRef.current = value;
    setHasText(value.trim().length > 0);
  };

  const handleSend = () => {
    const value = textRef.current;
    if (!value.trim()) return;
    sendMessage(value);
    textRef.current = '';
    setHasText(false);
    inputRef.current?.clear();
  };

  return (
    <View style={styles.wrap}>
      {replyTarget ? (
        <View style={styles.replyBar}>
          <View style={styles.replyAccent} />
          <View style={styles.replyTextWrap}>
            <Text style={styles.replyAuthor}>Replying to {replyTarget.authorLabel}</Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyTarget.text}
            </Text>
          </View>
          <Pressable onPress={() => setReplyTarget(null)} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : null}
      <View style={styles.row}>
        <TextInput
          ref={inputRef}
          defaultValue=""
          onChangeText={handleChangeText}
          placeholder="Ask your astrologer…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={handleSend}
          disabled={!hasText}
          style={[styles.sendButton, !hasText && styles.sendButtonDisabled]}
        >
          <Ionicons name="send" size={17} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 6,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 9,
    marginBottom: 8,
    overflow: 'hidden',
  },
  replyAccent: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  replyTextWrap: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  replyText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.aiBubble,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: colors.primaryLight,
    shadowOpacity: 0,
    elevation: 0,
  },
});
