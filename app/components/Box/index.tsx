import React from "react";
import {
  View,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
  TouchableOpacityProps,
  StyleProp,
  StyleSheet
} from "react-native";
import {
  BackgroundColor,
  ContainerShape,
  SpacingSize,
  Theme,
  useTheme
} from "app/theme";
import { getSpacing } from "app/components/Spacing";
import { randomHexColor } from "app/utils/LayoutDebugger";
import Animated from "react-native-reanimated";

export interface SpacingProps {
  space?: SpacingSize | number;
  spaceBottom?: SpacingSize | number;
  spaceEnd?: SpacingSize | number;
  spaceHorizontal?: SpacingSize | number;
  spaceLeft?: SpacingSize | number;
  spaceRight?: SpacingSize | number;
  spaceStart?: SpacingSize | number;
  spaceTop?: SpacingSize | number;
  spaceVertical?: SpacingSize | number;
}
export type BoxProps = {
  children?: React.ReactNode;
  testID?: string;
  shape?: ContainerShape;
  backgroundColor?: BackgroundColor;
  debug?: boolean;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
} & SpacingProps &
  ViewStyle;

type BoxProp = keyof Omit<Omit<BoxProps, "children">, "testID">;

const propToAction: Partial<
  {
    [key in BoxProp]: (
      prop: NonNullable<BoxProps[key]>,
      theme: Theme
    ) => ViewStyle;
  }
> = {
  backgroundColor: (color: BackgroundColor | string, theme: Theme) => {
    if (theme.colors.background[color]) {
      return { backgroundColor: theme.colors.background[color] };
    }

    return { backgroundColor: color };
  },

  elevation: (elevation: number, theme: Theme) => theme.elevations[elevation],

  shape: (shape: ContainerShape, theme: Theme) => theme.containerShapes[shape],

  space: (size: SpacingSize | number, theme: Theme) => ({
    padding: getSpacing(size, theme)
  }),
  spaceBottom: (size: SpacingSize | number, theme: Theme) => ({
    paddingBottom: getSpacing(size, theme)
  }),
  spaceEnd: (size: SpacingSize | number, theme: Theme) => ({
    paddingEnd: getSpacing(size, theme)
  }),
  spaceHorizontal: (size: SpacingSize | number, theme: Theme) => ({
    paddingHorizontal: getSpacing(size, theme)
  }),
  spaceLeft: (size: SpacingSize | number, theme: Theme) => ({
    paddingLeft: getSpacing(size, theme)
  }),
  spaceRight: (size: SpacingSize | number, theme: Theme) => ({
    paddingRight: getSpacing(size, theme)
  }),
  spaceStart: (size: SpacingSize | number, theme: Theme) => ({
    paddingStart: getSpacing(size, theme)
  }),
  spaceTop: (size: SpacingSize | number, theme: Theme) => ({
    paddingTop: getSpacing(size, theme)
  }),
  spaceVertical: (size: SpacingSize | number, theme: Theme) => ({
    paddingVertical: getSpacing(size, theme)
  })
};

export const Box = ({ style, ...rest }: BoxProps) => {
  const { children, testID, debug = false, ...viewStyles } = rest;
  const theme = useTheme();
  const transformedStyles = [];
  const pureStyles: ViewStyle = {};

  for (const prop in viewStyles) {
    if (prop) {
      const getStyle = propToAction[prop as BoxProp];
      if (getStyle) {
        // @ts-ignore
        const style = getStyle(viewStyles[prop as BoxProp], theme);
        transformedStyles.push(style);
      } else {
        // @ts-ignore
        pureStyles[prop as keyof ViewStyle] = viewStyles[prop as BoxProp];
      }
    }
  }

  const styles = !debug
    ? [pureStyles, transformedStyles]
    : [
        { borderColor: randomHexColor(), borderWidth: 1 },
        pureStyles,
        transformedStyles
      ];
  const Container = !rest.animated ? View : Animated.View;
  return (
    <Container testID={testID} style={StyleSheet.flatten([styles, style])}>
      {children}
    </Container>
  );
};

export interface TouchableBoxProps
  extends BoxProps,
    Omit<TouchableOpacityProps, "style"> {
  onPress?: (event?: GestureResponderEvent) => void;
}

export const TouchableBox = ({
  onPress,
  disabled,
  ...rest
}: TouchableBoxProps) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <Box {...rest} />
    </TouchableOpacity>
  );
};
