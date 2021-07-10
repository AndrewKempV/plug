import React from "react";

import { Box } from "app/components/Box";

export interface PlaygroundProps {
  children: React.ReactNode;
}

export const Playground = (props: PlaygroundProps) => {
  const { children } = props;

  return (
    <Box justifyContent={"center"} spaceVertical={"large"} spaceHorizontal={15}>
      {children}
    </Box>
  );
};
