import React from "react";
import {
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  ActivityIndicator
} from "react-native";
import { TouchableBox, TouchableBoxProps, IconProps as TheIconProps } from "app/components";
import { ButtonColor, ControlSize, Theme, useTheme, FontWeight } from "app/theme";
import { getOverrides, getStyle, WithOverrides } from "utils/Overrides";
import { Text, TextProps } from "../Typography";
import { OptionalString } from "app/utils/types";
import { dlv } from "app/utils/helpers";
import { isControlSize } from "app/theme/controlSize";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Color from "color";

interface ButtonBaseProps extends TouchableBoxProps {
  /** Title of the button */
  title?: OptionalString;

  /**
   * The color of the button.
   * @default "default"
   */
  color?: ButtonColor;

  /**
   * The appearance of the button.
   * @default "primary"
   */
  appearance?: ButtonAppearance;

  /**
   * The size of the button.
   * @default "medium"
   */
  size?: ControlSize | number;

  width?: number;

  /**
   * When true, show a loading spinner before the title. This also disables the button.
   * @default false
   */
  isLoading?: boolean;

  /**
   * When true, the button is disabled. isLoading also sets the button to disabled.
   * @default false
   */
  disabled?: boolean;

  /** Called when button is pressed */
  // onPress?: (event: GestureResponderEvent) => void;

  /** Used to locate this view in end-to-end tests. */
  testID?: string;
  weight?: FontWeight;
  textColor?: string;
  ignoreAppearance?: boolean;
}

export interface ButtonOverrides {
  Touchable: TouchableProps;
  Title: TitleProps;
  IconBefore: IconProps;
  IconAfter: IconProps;
  Loading: LoadingProps;
}

export interface ButtonProps
  extends WithOverrides<ButtonBaseProps, ButtonOverrides> {}

export const Button = (props: ButtonProps) => {
  const {
    appearance = "primary",
    color = "default",
    disabled = false,
    isLoading = false,
    size = "medium",
    width,
    title,
    testID,
    overrides,
    weight,
    textColor,
    ignoreAppearance,
    ...rest
  } = props;
  const theme = useTheme();
  const [Touchable, touchableProps] = getOverrides(
    StyledTouchable,
    props,
    {
      appearance,
      color,
      disabled,
      isLoading,
      size,
      testID,
      ...rest
    },
    dlv(theme, "overrides.Button.Touchable"),
    overrides?.Touchable
  );
  const [Title, titleProps] = getOverrides(
    StyledTitle,
    props,
    {
      appearance,
      color: textColor || color,
      disabled,
      size,
      title,
      weight
    },
    dlv(theme, "overrides.Button.Title"),
    overrides?.Title
  );
  const [Loading, loadingProps] = getOverrides(
    StyledLoading,
    props,
    {
      appearance,
      color
    },
    dlv(theme, "overrides.Button.Loading"),
    overrides?.Loading
  );
  const [IconBefore, iconBeforeProps] = getOverrides(
    StyledIcon,
    props,
    {
      appearance,
      color,
      disabled,
      isLoading,
      size
    },
    dlv(theme, "overrides.Button.IconBefore"),
    overrides?.IconBefore
  );
  const [IconAfter, iconAfterProps] = getOverrides(
    StyledIcon,
    props,
    {
      appearance,
      color,
      disabled,
      isLoading,
      size
    },
    dlv(theme, "overrides.Button.IconAfter"),
    overrides?.IconAfter
  );

  return (
    <Touchable {...touchableProps}>
      <IconBefore {...iconBeforeProps} />
      {isLoading ? <Loading {...loadingProps} /> : <Title {...titleProps} />}
      <IconAfter {...iconAfterProps} />
    </Touchable>
  );
};

interface PropsWithChildren {
  children?: React.ReactNode;
}

interface ButtonAppearances {
  minimal: { [size in ButtonColor]: ViewStyle };
  primary: { [size in ButtonColor]: ViewStyle };
  outline: { [size in ButtonColor]: ViewStyle };
  label: { [size in ButtonColor]: ViewStyle };
}

type ButtonAppearance = keyof ButtonAppearances;

const getButtonAppearances = (
  theme: Theme,
  isLoading: boolean
): ButtonAppearances => {
  return {
    minimal: {
      default: {
        backgroundColor: theme.colors.background.content
      },
      danger: {
        backgroundColor: theme.colors.background.content
      },
      primary: {
        backgroundColor: theme.colors.background.content
      },
      secondary: {
        backgroundColor: theme.colors.background.content
      }
    },
    primary: {
      default: {
        backgroundColor: isLoading
          ? theme.colors.background.greyLight
          : theme.colors.button.default
      },
      danger: {
        backgroundColor: isLoading
          ? theme.colors.background.dangerLight
          : theme.colors.button.danger
      },
      primary: {
        backgroundColor: isLoading
          ? theme.colors.background.primaryLight
          : theme.colors.button.primary
      },
      secondary: {
        backgroundColor: isLoading
          ? theme.colors.background.secondaryLight
          : theme.colors.button.secondary
      }
    },

    outline: {
      default: {
        backgroundColor: theme.colors.background.content,
        borderColor: theme.colors.text.default,
        borderWidth: 1
      },
      danger: {
        backgroundColor: theme.colors.background.content,
        borderColor: theme.colors.border.danger,
        borderWidth: 1
      },
      primary: {
        backgroundColor: theme.colors.background.content,
        borderColor: theme.colors.border.primary,
        borderWidth: 1
      },
      secondary: {
        backgroundColor: theme.colors.background.content,
        borderColor: theme.colors.border.secondary,
        borderWidth: 1
      }
    },
    label: {
      default: {
        borderColor: "transparent",
        borderWidth: 0,
        backgroundColor: theme.colors.background.base
      },
      danger: {
        borderColor: "transparent",
        borderWidth: 0,
        backgroundColor: theme.colors.background.base
      },
      primary: {
        borderColor: "transparent",
        borderWidth: 0,
        backgroundColor: theme.colors.background.base
      },
      seondary: {
        borderColor: "transparent",
        borderWidth: 0,
        backgroundColor: theme.colors.background.base
      }

    }
  };
};

interface TouchableProps extends TouchableBoxProps, PropsWithChildren {
  color: ButtonColor;
  appearance: ButtonAppearance;
  size: ControlSize | number;
  width?: number;
  disabled: boolean;
  isLoading: boolean;
}

const StyledTouchable = (props: TouchableProps) => {
  const {
    appearance,
    color,
    disabled,
    isLoading,
    size,
    width,
    children,
    style,
    ...touchableProps
  } = props;
  const theme = useTheme();
  const buttonAppearances = getButtonAppearances(theme, isLoading);
  const config = isControlSize(
    size
  )
    ? {
        borderRadius: theme.controlBorderRadius[size],
        minHeight: theme.controlHeights[size],
        paddingLeft: theme.controlPaddings[size] + 8,
        paddingRight: theme.controlPaddings[size] + 8
      }
    : {
        borderRadius: theme.controlBorderRadius.medium,
        minHeight: size,
        paddingLeft: theme.controlPaddings.medium + 8,
        paddingRight: theme.controlPaddings.medium + 8
    };
  const { backgroundColor, ...rest } = buttonAppearances[appearance][color];
  
  return (
    <TouchableBox
      accessibilityRole="button"
      disabled={!!(disabled || isLoading)}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      style={style}
      backgroundColor={!disabled ? backgroundColor : Color(backgroundColor).alpha(.5).toString()}
      {...rest}
      {...config}
      width={width}
      
      {...touchableProps}
     
    >
      {children}
    </TouchableBox>
  );
};

interface ButtonTextColors {
  minimal: { [size in ButtonColor]: string };
  primary: { [size in ButtonColor]: string };
  outline: { [size in ButtonColor]: string };
  label: { [size in ButtonColor]: string };
}

const getButtonTextColor = (theme: Theme): ButtonTextColors => {
  return {
    minimal: {
      default: theme.colors.text.default,
      danger: theme.colors.text.danger,
      primary: theme.colors.text.primary,
      secondary: theme.colors.text.secondary
    },
    primary: {
      default: theme.colors.button.defaultText,
      danger: theme.colors.button.dangerText,
      primary: theme.colors.button.primaryText,
      secondary: theme.colors.button.secondaryText
    },

    outline: {
      default: theme.colors.text.default,
      danger: theme.colors.text.danger,
      primary: theme.colors.text.primary,
      secondary: theme.colors.text.secondary
    },
    label: {
      default: theme.colors.text.primary,
      primary: theme.colors.button.primary,
    }
  };
};

interface TitleProps extends TextProps {
  size: ControlSize | number;
  color: ButtonColor;
  title?: OptionalString;
  appearance: ButtonAppearance;
  disabled: boolean;
  weight?: FontWeight;
  ignoreAppearance?: boolean;
}

const StyledTitle = (props: TitleProps) => {
  const {
    appearance,
    color,
    disabled,
    size,
    title,
    style,
    ignoreAppearance,
    ...textProps
  } = props;
  const theme = useTheme();

  const textSize = isControlSize(size)
    ? theme.textSizes[size]
    : theme.textSizes.medium;

  if (!title) return null;

  return (
    <Text
      style={[
        {
          alignItems: "center",
          color: disabled 
            ? getButtonTextColor(theme)[appearance][color]
            : getButtonTextColor(theme)[appearance][color],
          display: "flex",
          fontWeight: "600",
          justifyContent: "center",
          textAlign: "center",
          paddingHorizontal: 8,
          ...textSize
        },
        getStyle(props, style)
      ]}
      {...textProps}
    >
      {title}
    </Text>
  );
};

interface LoadingProps {
  color: ButtonColor;
  appearance: ButtonAppearance;
}

const StyledLoading = (props: LoadingProps) => {
  const { appearance, color } = props;
  const theme = useTheme();

  return (
    <ActivityIndicator color={getButtonTextColor(theme)[appearance][color]} />
  );
};

interface IconProps extends PropsWithChildren, Omit<TheIconProps, 'size' | 'name'> {
  size: ControlSize | number;
  color: ButtonColor;
  title?: OptionalString;
  appearance: ButtonAppearance;
  disabled: boolean;
  isLoading: boolean;
  name?: string;
}

const StyledIcon = (props: IconProps) => {
  return !props.name ? <></> : <MaterialIcon name={props.name} />;
};
