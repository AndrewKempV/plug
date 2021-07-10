import React, { Component } from "react";
import {
  StyleProp,
  ViewStyle,
  ListRenderItemInfo,
  FlatList
} from "react-native";
import { Box } from "app/components/Box";
interface RadioGroupProps<T> {
  onSelect: (index: number, value: string) => void;
  selectedIndex?: number;
  renderItem: (item: ListRenderItemInfo<T>) => JSX.Element;
  data: T[];
}

interface RadioGroupState {
  selectedIndex: number;
}

export default class RadioGroup<T> extends Component<
  RadioGroupProps<T>,
  RadioGroupState
> {
  constructor(props: RadioGroupProps<T>) {
    super(props);

    this.state = {
      selectedIndex: this.props.selectedIndex || -1
    };
  }

  public onSelect = (index: number, value: string) => {
    this.setState({ selectedIndex: index });
    this.props.onSelect(index, value);
  };

  public render() {
    const { data, renderItem, selectedIndex } = this.props;
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        extraData={selectedIndex}
        scrollEnabled={false}
      />
    );
  }
}
