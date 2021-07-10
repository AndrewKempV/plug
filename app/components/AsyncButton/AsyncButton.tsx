import React, { PureComponent } from "react";
import { BetterButton } from "../Button";
import { BetterButtonProps } from "../Button/Button";
import {
  TouchableDebounce,
  TouchableDebounceProps
} from "../TouchableDebounce/TouchableDebounce";

interface AsyncButtonProps {
  buttonProps: BetterButtonProps;
  animatedLoadingProps: TouchableDebounceProps;
}

class AsyncButton extends PureComponent<AsyncButtonProps> {
  public render() {
    const { buttonProps, animatedLoadingProps } = this.props;
    return (
      <TouchableDebounce {...animatedLoadingProps}>
        <BetterButton {...buttonProps} />
      </TouchableDebounce>
    );
  }
}

export default AsyncButton;
