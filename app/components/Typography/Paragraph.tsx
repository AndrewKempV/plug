import React from "react";
import { useTheme } from "app/theme";
import { Text, TextProps } from "./Text";

export const Paragraph = ({ size, ...rest }: TextProps) => {
  const theme = useTheme();
  // let fontSize: number;
  // if (size) {
  //   const style = getTextSize(theme.textSizes)(size);
  //   fontSize = style.fontSize!;
  //   return (
  //     <Text
  //       accessibilityLabel="p"
  //       style={{
  //         marginVertical: theme.textSizes.medium.fontSize
  //       }}
  //       {...fontSize}
  //       {...rest}
  //     />
  //   );
  // }
  return (
    <Text
      accessibilityLabel="p"
      style={{
        marginVertical: theme.textSizes.medium.fontSize
      }}
      {...rest}
    />
  );
};
