import React from "react";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import fontelloConfig from "app/assets/icons/config.json";
import getIconType, { IconType } from "app/utils/getIconType";
import { TextColor, TextSize, useTheme, ControlSizes } from "app/theme";
import { getTextColor, getTextSize } from "app/components/Typography/Text";
import DynamicSvgIcon, { SvgIconProps } from "./SvgIcon";
import Svgs from "app/assets/svgs";

export const SvgIcon = (props: Omit<SvgIconProps, "svgs">) => (
  <DynamicSvgIcon {...props} svgs={Svgs} />
);
const Icon = createIconSetFromIcoMoon(
  fontelloConfig,
  "icomoon",
  "plugg-icons.tff"
);
export default Icon;
export { Icon };

// interface IconProps {
//     size?: keyof ControlSizes | number;
//     name: string;
//     color?: TextColor;
//     iconType: IconType | 'Plugg';
// };

// export const Icon = ({
//     name,
//     iconType,
//     color = 'default',
//     size = 'medium',
// }: IconProps) => {
//     const theme = useTheme();
//     const WrappedIcon = iconType === 'Plugg' ? PluggIcon : getIconType(iconType);
//     const { fontSize = 16 } = getTextSize(theme.textSizes)(size);
//     const iconSize = typeof size === 'string' ? fontSize + 8 : size;
//     return (
//     <WrappedIcon
//       name={name}
//       color={getTextColor(theme.colors.text)(color)}
//       size={iconSize}
//     />
//     );
// }
