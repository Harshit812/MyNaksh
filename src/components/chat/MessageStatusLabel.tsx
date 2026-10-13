import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MessageStatus } from '../../types/conversation';
import { colors } from '../../theme/colors';

interface Props {
  status: MessageStatus;
  onRetry?: () => void;
}

function MessageStatusLabel({ status, onRetry }: Props) {
  if (status === 'sending') {
    return <Text style={styles.text}>Sending…</Text>;
  }
  if (status === 'sent') {
    return <Text style={styles.text}>Sent</Text>;
  }
  return (
    <View style={styles.failedRow}>
      <Text style={styles.failedText}>Failed to send</Text>
      <Pressable onPress={onRetry} hitSlop={6}>
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  failedRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 4,
    gap: 6,
  },
  failedText: {
    fontSize: 11,
    color: colors.danger,
  },
  retryText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default memo(MessageStatusLabel);
