import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationScreen from '../screens/ConversationScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Conversation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '700',
            color: colors.textPrimary,
          },
        }}
      >
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={{ title: '✦ AI Astrologer' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
