import * as React from "react";
import { IconButtonProps } from "react-native-vector-icons/Icon";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HeaderButtons, {
  HeaderButton,
  HeaderButtonProps,
  HeaderButtonsProps
} from "react-navigation-header-buttons";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";
import { ValueOrDefault } from "../../utils/helpers";
import PluggIcons from "../Icon";

export const MaterialHeaderButton = (
  props: HeaderButtonProps & Pick<IconButtonProps, "size" | "color">
) => {
  const { color, size, ...rest } = props;
  return (
    <HeaderButton
      IconComponent={MaterialIcons}
      iconSize={ValueOrDefault(size, Metrics.icons.medium)}
      color={ValueOrDefault(color, Colors.black)}
      {...rest}
    />
  );
};

export const MaterialHeaderButtons = (props: HeaderButtonsProps) => {
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
      OverflowIcon={<MaterialIcons name="more-vert" size={23} color="white" />}
      {...props}
    />
  );
};

export const PluggHeaderButton = (
  props: HeaderButtonProps & Pick<IconButtonProps, "size" | "color">
) => {
  const { color, size, ...rest } = props;
  return (
    <HeaderButton
      IconComponent={PluggIcons}
      iconSize={ValueOrDefault(size, 23)}
      color={ValueOrDefault(color, Colors.black)}
      {...rest}
    />
  );
};

export const PluggHeaderButtons = (props: HeaderButtonsProps) => {
  return <HeaderButtons HeaderButtonComponent={PluggHeaderButton} {...props} />;
};

export const HeaderItem = HeaderButtons.Item;
