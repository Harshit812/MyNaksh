import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

const THRESHOLD = 56;
const MAX_SWIPE = 76;
const ICON_SLOT = 40;

interface Props {
  children: ReactNode;
  onSwipeReply: () => void;
  align?: 'left' | 'right';
}

export default function SwipeToReply({ children, onSwipeReply, align = 'left' }: Props) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX(12)
    .failOffsetY([-8, 8])
    .onUpdate((event) => {
      translateX.value = Math.max(0, Math.min(event.translationX, MAX_SWIPE));
    })
    .onEnd(() => {
      if (translateX.value > THRESHOLD) {
        runOnJS(onSwipeReply)();
      }
      translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
    });

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: Math.min(translateX.value / THRESHOLD, 1),
    transform: [{ scale: 0.6 + 0.4 * Math.min(translateX.value / THRESHOLD, 1) }],
  }));

  return (
    <View
      style={[
        styles.row,
        { justifyContent: align === 'right' ? 'flex-end' : 'flex-start' },
      ]}
    >
      <Animated.View style={[styles.iconSlot, iconStyle]} pointerEvents="none">
        <View style={styles.iconBubble}>
          <Ionicons name="arrow-undo" size={16} color={colors.primary} />
        </View>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={contentStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSlot: {
    width: ICON_SLOT,
    marginRight: -ICON_SLOT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
