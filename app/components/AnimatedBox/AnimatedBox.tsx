import { Box, BoxProps } from "app/components/Box";
import Animated from "react-native-reanimated";

interface AnimatedBoxProps extends BoxProps {}

export default (props: AnimatedBoxProps) => {
  return (
    <Animated.View>
      <Box {...props} />
    </Animated.View>
  );
};
