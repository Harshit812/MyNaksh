import { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConversationStore } from '../store/conversationStore';
import MessageList from '../components/chat/MessageList';
import Composer from '../components/chat/Composer';
import { colors } from '../theme/colors';

export default function ConversationScreen() {
  const status = useConversationStore((s) => s.status);
  const messages = useConversationStore((s) => s.messages);
  const loadConversation = useConversationStore((s) => s.loadConversation);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {status === 'loading' ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.centeredText}>Loading conversation...</Text>
          </View>
        ) : status === 'error' ? (
          <View style={styles.centered}>
            <Text style={styles.centeredEmoji}>⚠️</Text>
            <Text style={styles.centeredText}>Unable to load conversation.</Text>
            <Pressable style={styles.retryButton} onPress={() => loadConversation()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.centeredEmoji}>✨</Text>
            <Text style={styles.centeredText}>Start your conversation.</Text>
          </View>
        ) : (
          <MessageList messages={messages} />
        )}
        <Composer />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  centeredEmoji: {
    fontSize: 32,
    marginBottom: 2,
  },
  centeredText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 24,
    marginTop: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
