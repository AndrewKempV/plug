import React from "react";
import { NavigationScreenProps } from "react-navigation";
import AutoCompleteSearch from "../../../../components/AutoCompleteSearch/AutoCompleteSearch";
import strings from "./strings";

interface State {
  isNavBarShowing: boolean;
}
const initialState = {
  isNavBarShowing: true
};
export default class LocationScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public state = initialState;

  public handleFocus = () => {
    this.setState({ isNavBarShowing: false });
  };

  public handleBlur = () => {
    this.setState({ isNavBarShowing: true });
  };

  public render = () => {
    return (
      <AutoCompleteSearch
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        placeholder={strings.inputPlaceholder}
        navigation={this.props.navigation}
      />
    );
  };
}
