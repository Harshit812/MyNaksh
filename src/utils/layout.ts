import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Computed in pixels rather than used as a style '%' string: bubbles are
// nested inside SwipeToReply's gesture wrappers, which have no explicit
// width of their own, so a percentage maxWidth can't reliably resolve
// against them (Yoga has no definite ancestor width to resolve against,
// which visibly collapses text to a near-zero-width column).
export const BUBBLE_MAX_WIDTH = Math.round(SCREEN_WIDTH * 0.82);
export const BUBBLE_MAX_WIDTH_WIDE = Math.round(SCREEN_WIDTH * 0.88);
