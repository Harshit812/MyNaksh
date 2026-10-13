import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { Recommendation } from '../../types/conversation';
import { colors } from '../../theme/colors';

interface Props {
  item: Recommendation;
  icon: string;
  accentColor: string;
}

export default function RecommendationCard({ item, icon, accentColor }: Props) {
  const handlePress = () => {
    Alert.alert(item.title, item.subtitle ?? 'More details coming soon.');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: accentColor }]}>
          <Ionicons name={icon} size={18} color="#fff" />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: accentColor }]}>View</Text>
          <Ionicons name="chevron-forward" size={12} color={accentColor} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 152,
    height: 128,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    shadowColor: '#2A1E45',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pressed: {
    opacity: 0.75,
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  body: {
    flex: 1,
    padding: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 17,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
