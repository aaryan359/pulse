import { Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

export const CANVAS_HEIGHT = 65;
export const SCREEN_WIDTH = width;

export const EDGE_PADDING = 1.5;
export const BUTTON_COUNT_DIVISOR = 3.2;
export const SPACING_MULTIPLIER = 2.0;

export const BUTTON_SIZE = 60;
export const BUTTON_CENTER_OFFSET = BUTTON_SIZE / 2;

export const ICON_SIZE_REGULAR = 24;
export const ICON_SIZE_FAB = 28;
export const ICON_COLOR = "#9333EA";

export const FADE_DURATION_MULTIPLIER = 0.4;
export const OPACITY_INTERACTION_MULTIPLIER = 0.6;

// FAB position calculation
// The metaball effect uses smin with k=0.5, which causes the visual center to shift
// k * 0.25 = 0.5 * 0.25 = 0.125 is the maximum expansion in normalized coords
export const METABALL_SHIFT_NORMALIZED = 0.125;

export const FAB_SHRINK_AMOUNT = 0.21;