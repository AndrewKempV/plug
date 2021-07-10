import React, { PureComponent } from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  elevation: number;
  cornerRadius: number;
  shadowOpacity?: number;
}

export default class Card extends PureComponent<CardProps> {
  public static defaultProps: CardProps = {
    elevation: 0,
    cornerRadius: 0,
    shadowOpacity: 0
  };

  public render() {
    const { elevation, cornerRadius, shadowOpacity } = this.props;
    if (elevation > 0) {
      return (
        <View
          style={[
            {
              shadowOffset: {
                width: 0,
                height: elevation
              },
              shadowOpacity,
              shadowRadius: elevation,
              borderRadius: cornerRadius
            },
            this.props.style
          ]}
        >
          {this.props.children}
        </View>
      );
    } else {
      return (
        <View
          style={[
            {
              borderRadius: cornerRadius
            },
            this.props.style
          ]}
        >
          {this.props.children}
        </View>
      );
    }
  }
}
