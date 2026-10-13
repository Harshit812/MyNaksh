import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SystemMessage as SystemMessageType } from '../../types/conversation';
import { colors } from '../../theme/colors';

function SystemMessage({ message }: { message: SystemMessageType }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginVertical: 8,
    maxWidth: '85%',
  },
  text: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default memo(SystemMessage);
