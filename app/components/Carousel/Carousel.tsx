import _ from "lodash";
import { Component } from "react";
import React from "react";
import {
  FlatList,
  ImageSourcePropType,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Colors, Layout } from "../../config/styles";
import Theme from "../../config/Theme";
import { ValueOrDefault } from "../../utils/helpers";
import { SocialIdentityProviderType } from "../SocialIconCarousel/constants";
import styles from "./styles";
import { Box } from "components/Box";

interface Props {
  // tslint:disable-next-line:array-type
  data: any[];
  renderItem: ({ item, index }: any) => JSX.Element;
  viewSize: number;
  style: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  marginRight?: number;
}

interface State {
  currentIndex: number;
}

const initialState = {
  currentIndex: 0
};

export default class Carousel extends Component<Props, State> {
  public readonly state = initialState;

  public componentWillMount() {
    this.setState(initialState);
  }

  public goPrev = () => {
    this.setState(prevState => ({
      currentIndex: Math.min(prevState.currentIndex - 1, 0)
    }));
  };

  public goNext = () => {
    this.setState(prevState => ({
      currentIndex:
        prevState.currentIndex + 1 < _.size(this.props.data)
          ? prevState.currentIndex + 1
          : 0
    }));
  };

  public reset = () => this.setState({ currentIndex: 0 });

  public renderItem = ({
    item,
    index
  }: ListRenderItemInfo<ImageButtonType>) => (
    <Box key={index.toString()}>{this.props.renderItem({ item, index })}</Box>
  );

  public render() {
    return (
      <View style={this.props.style}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          contentOffset={{ x: 0, y: 0 }}
          contentContainerStyle={ValueOrDefault(
            this.props.contentContainerStyle,
            [Layout.horizontalLeftAlign, Layout.alignCentered]
          )}
          horizontal={true}
          data={getCircularSlice<ImageButtonType>(
            this.props.data,
            this.state.currentIndex,
            this.props.viewSize
          )}
          renderItem={this.renderItem}
          extraData={this.state}
          scrollEnabled={false}
        />
        {/* marginRight: scale(30), marginTop: verticalScale(13), paddingLeft: */}
        {/* scale(20) */}
        <Box
          debug
          marginRight={this.props.marginRight || 30}
          marginTop={13}
          spaceLeft={20}
        >
          <FeatherIcon
            // style={
            //   _.isNil(this.props.marginRight)
            //     ? styles.nextIcon
            //     : [styles.nextIcon, { marginRight: this.props.marginRight }]
            // }
            name={"chevron-right"}
            size={Theme.Metrics.icons.xsmall}
            color={Colors.steelGrey}
            onPress={() => this.goNext()}
          />
        </Box>
      </View>
    );
  }
}

export interface ImageButtonType {
  source: ImageSourcePropType;
  type: SocialIdentityProviderType;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

function getCircularSlice<T>(
  // tslint:disable-next-line:array-type
  collection: T[],
  index: number,
  size: number
) {
  let result = [collection[index]];
  for (let i = 0; i < size - 1; ++i) {
    const right = collection[mod(index + i + 1, _.size(collection))];
    result = [...result, right];
  }
  return result;
}
