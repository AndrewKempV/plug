import React, { Component } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
  Text
} from "react-native";
import styles from "./styles";
import { Issuer } from "../CreditCard/types";
import SavedPaymentCard from "../SavedPaymentCard";

export interface PaymentItem {
  id: string;
  last4: string;
  issuer: Issuer;
  default?: boolean;
}

interface SavedPaymentListProps {
  profileId?: string;
  containerStyle?: StyleProp<ViewStyle>;
  items: PaymentItem[];
  onPressItem?: (item: PaymentItem) => void;
}

interface SavedPaymentListState {
  loading: boolean;
  items: PaymentItem[];
  defaultIndex: number;
}

const initialState: SavedPaymentListState = {
  loading: false,
  items: [],
  defaultIndex: 0
};

class SavedPaymentList extends Component<
  SavedPaymentListProps,
  SavedPaymentListState
> {
  static defaultProps: SavedPaymentListProps = {
    onPressItem: () => {
      return;
    },
    items: []
  };

  readonly state = initialState;

  static getDerivedStateFromProps(
    nextProps: SavedPaymentListProps,
    state: SavedPaymentListState
  ): SavedPaymentListState | null {
    return {
      ...state,
      items: nextProps.items
    };
  }

  componentDidMount() {
    const { items } = this.props;
    this.setState({ items });
  }

  render() {
    const { containerStyle } = this.props;
    const { items } = this.state;
    return (
      <View style={containerStyle}>
        <FlatList
          style={styles.list}
          keyExtractor={this.extractKey}
          data={items}
          renderItem={this.renderEventCard}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          ListHeaderComponent={this.renderHeader}
          ItemSeparatorComponent={this.renderSeparator}
          stickyHeaderIndices={[0]}
        />
      </View>
    );
  }

  renderEventCard = ({ item }: ListRenderItemInfo<PaymentItem>) => {
    return (
      <SavedPaymentCard
        payment={item}
        onPress={() => this.handlePressItem(item)}
      />
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.listHeaderContainer}>
        <Text style={styles.savedPaymentListLabel}>
          {"Saved Payment methods"}
        </Text>
      </View>
    );
  };

  renderSeparator = () => {
    return <View style={styles.itemDivider} />;
  };

  extractKey = (item: PaymentItem) => item.id;

  remove = (item: PaymentItem) => {
    const { items } = this.state;
    const index = items.findIndex(i => i.id === item.id);
    const start = items.slice(0, index);
    const end = items.slice(index + 1);
    this.setState({
      items: start.concat(end)
    });
  };

  add = (item: PaymentItem) => {
    const { items } = this.state;
    this.setState({
      items: [...items, item]
    });
  };

  handlePressItem = (item: PaymentItem) => {
    const { onPressItem } = this.props;
    if (onPressItem) {
      onPressItem(item);
    }
  };
}

export default SavedPaymentList;
