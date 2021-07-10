import React from "react";
import { ViewStyle } from "react-native";
import { Measurements } from "app/hooks/useMeasure";
import { useTheme } from "app/theme";
import { getOverrides, WithOverrides } from "app/utils/Overrides";
import {
  ViewMeasure,
  ViewMeasureProps
} from "app/components/Wrapper/ViewMeasure";
import { dlv } from "app/utils/helpers";

export type PositionerPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right";

export interface PositionerBaseProps {
  /**
   * Position of the content.
   * @default "bottom"
   */
  position?: PositionerPosition;

  /**
   * Wrapped component to open the positioner over.
   */
  children?: React.ReactNode;

  /**
   * Content revealed when positioner is opened.
   */
  content?: React.ReactNode;

  /**
   * When true, displays positioner.
   */
  isVisible?: boolean;
}

export interface PositionerOverrides {
  Root: RootProps;
  Target: ViewMeasureProps;
}

export interface PositionerProps
  extends WithOverrides<PositionerBaseProps, PositionerOverrides> {}

interface GetPositionerPositionParams {
  position: PositionerPosition;
  targetMeasurements: Measurements;
  positionerMeasurements: Measurements;
}

const DEFAULT_OFFSET = 14;

const getPositionerPosition = (params: GetPositionerPositionParams) => {
  const { position, targetMeasurements, positionerMeasurements } = params;

  switch (position) {
    case "top-left":
      return {
        left: 0,
        top: -positionerMeasurements.height - DEFAULT_OFFSET
      };
    case "top":
      return {
        left: targetMeasurements.width / 2,
        top: -positionerMeasurements.height - DEFAULT_OFFSET,
        transform: [
          {
            translateX: -positionerMeasurements.width / 2
          }
        ]
      };
    case "top-right":
      return {
        right: 0,
        top: -positionerMeasurements.height - DEFAULT_OFFSET
      };
    case "left":
      return {
        left: 0 - positionerMeasurements.width - DEFAULT_OFFSET,
        top: -positionerMeasurements.height / 2 + targetMeasurements.height / 2
      };
    case "right":
      return {
        right: 0 - positionerMeasurements.width - DEFAULT_OFFSET,
        top: -positionerMeasurements.height / 2 + targetMeasurements.height / 2
      };
    case "bottom-right":
      return {
        right: 0,
        top: targetMeasurements.height + DEFAULT_OFFSET
      };
    case "bottom":
      return {
        left: targetMeasurements.width / 2,
        top: targetMeasurements.height + DEFAULT_OFFSET,
        transform: [
          {
            translateX: -positionerMeasurements.width / 2
          }
        ]
      };
    case "bottom-left":
      return {
        left: 0,
        top: targetMeasurements.height + DEFAULT_OFFSET
      };
    default:
      return {};
  }
};

const initialMeasurements = {
  height: 0,
  pageX: 0,
  pageY: 0,
  width: 0,
  x: 0,
  y: 0
};

export const Positioner = (props: PositionerProps) => {
  const {
    children,
    content,
    isVisible = false,
    position = "top-left",
    overrides = {}
  } = props;
  const theme = useTheme();

  const [targetMeasurements, setTargetMeasurements] = React.useState(
    initialMeasurements
  );
  const [positionerMeasurements, setPositionerMeasurements] = React.useState(
    initialMeasurements
  );

  const isPositionerMeasurementsMeasured = !!(
    positionerMeasurements.width || positionerMeasurements.height
  );

  const positionStyle = getPositionerPosition({
    position,
    positionerMeasurements,
    targetMeasurements
  });

  const [Root, rootProps] = getOverrides(
    StyledRoot,
    props,
    {
      positionStyle,
      isPositionerMeasurementsMeasured,
      onMeasure: setPositionerMeasurements,
      isVisible
    },
    dlv(theme, "overrides.Positioner.Root"),
    overrides.Root
  );
  const [Target, targetProps] = getOverrides(
    ViewMeasure,
    props,
    { onMeasure: setTargetMeasurements },
    dlv(theme, "overrides.Positioner.Target"),
    overrides.Target
  );

  return (
    <>
      <Root {...rootProps}>{content}</Root>
      <Target {...targetProps}>{children}</Target>
    </>
  );
};

interface RootProps extends ViewMeasureProps {
  isPositionerMeasurementsMeasured?: boolean;
  positionStyle?: ViewStyle;
  isVisible: boolean;
}

const StyledRoot = (props: RootProps) => {
  const {
    style,
    positionStyle,
    isPositionerMeasurementsMeasured = false,
    isVisible,
    ...viewMeasureProps
  } = props;

  if (!isVisible) return null;

  return (
    <ViewMeasure
      style={[
        {
          opacity: isPositionerMeasurementsMeasured ? 1 : 0,
          position: "absolute",
          zIndex: 1
        },
        positionStyle,
        style
      ]}
      {...viewMeasureProps}
    />
  );
};
