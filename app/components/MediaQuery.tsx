import React from "react";
import { PixelRatio, Platform } from "react-native";
import { useDimensions } from "app/hooks";
import { ScreenSize } from "app/theme";
import { useLayout } from "app/components";

type Orientation = "landscape" | "portrait";

export interface MediaQuery {
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  minAspectRatio?: number;
  maxAspectRatio?: number;
  minPixelRatio?: number;
  maxPixelRatio?: number;
  orientation?: Orientation;
  condition?: boolean;
  platform?: string;
  breakpoint?: ScreenSize;
}

export const isInInterval = (
  value: number,
  min?: number,
  max?: number
): boolean =>
  (min === undefined || value >= min) && (max === undefined || value <= max);

export const mediaQuery = (
  {
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    minAspectRatio,
    maxAspectRatio,
    orientation,
    platform,
    minPixelRatio,
    maxPixelRatio,
    condition,
    breakpoint
  }: MediaQuery,
  width: number,
  height: number
): boolean => {
  const currentOrientation: Orientation =
    width > height ? "landscape" : "portrait";
  if (breakpoint) {
    const { currentScreenSize } = useLayout();
    return breakpoint === currentScreenSize;
  }

  return (
    isInInterval(width, minWidth, maxWidth) &&
    isInInterval(height, minHeight, maxHeight) &&
    isInInterval(width / height, minAspectRatio, maxAspectRatio) &&
    isInInterval(PixelRatio.get(), minPixelRatio, maxPixelRatio) &&
    (orientation === undefined || orientation === currentOrientation) &&
    (platform === undefined || platform === Platform.OS) &&
    (condition === undefined || condition)
  );
};

interface MediaQueryProps extends MediaQuery {
  children: React.ReactNode;
}

export default ({ children, ...props }: MediaQueryProps): React.ReactNode => {
  const { width, height } = useDimensions();
  const shouldRender = mediaQuery(props, width, height);
  if (shouldRender) {
    return children;
  }
  return null;
};
