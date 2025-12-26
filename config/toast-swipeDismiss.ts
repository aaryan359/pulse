// toast-swipeDismiss.ts
import { PanResponder } from "react-native";

export const swipeDismiss = (onHide: () => void) =>
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 15,
    onPanResponderRelease: (_, g) => {
      if (Math.abs(g.dx) > 80) {
        onHide();
      }
    },
  });
