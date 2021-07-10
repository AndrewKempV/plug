import React from "react";
import { Platform, ViewProps, ViewStyle, StyleProp } from "react-native";
import Svg, { SvgProps, FillRule } from "react-native-svg";

export interface SvgIconProps {
  name: string;
  fill?: string;
  fillRule?: FillRule;
  height: number | string;
  width: number | string;
  style?: StyleProp<ViewStyle>;
  svgs: Record<string, any>;
  //   svgs: Record<string, React.ReactElement<SvgProps>>;
  stroke?: string;
  strokeWidth?: number | string;
  viewBox?: string;
  defaultViewBox?: string;
}

export const SvgIcon = (props: SvgIconProps) => {
  if (!props.name) {
    return null;
  }

  const name =
    props.svgs[`${props.name}.${Platform.OS}`] || props.svgs[props.name];
  console.log(name);
  if (!name) {
    return null;
  }

  const height = props.height && props.height.toString();
  const width = props.width && props.width.toString();
  const strokeWidth = props.strokeWidth && props.strokeWidth.toString();

  const isSimple = React.isValidElement(name);
  const svgEl = isSimple ? name : name.svg;

  let viewBox;

  if (props.viewBox && props.viewBox !== SvgIcon.defaultProps.viewBox) {
    viewBox = props.viewBox;
  } else if (!isSimple && name.viewBox) {
    viewBox = name.viewBox;
  } else if (props.defaultViewBox) {
    viewBox = props.defaultViewBox;
  } else {
    viewBox = SvgIcon.defaultProps.viewBox;
  }
  console.log(viewBox);
  console.log(svgEl);

  return (
    <Svg height={height} width={width} viewBox={viewBox} style={props.style}>
      {React.cloneElement(svgEl, {
        fill: props.fill,
        fillRule: props.fillRule,
        stroke: props.stroke,
        strokeWidth: strokeWidth
      })}
    </Svg>
  );
};

SvgIcon.defaultProps = {
  fill: "#000",
  fillRule: "evenodd",
  height: "44",
  width: "44",
  viewBox: "0 0 100 100"
};

export default SvgIcon;
