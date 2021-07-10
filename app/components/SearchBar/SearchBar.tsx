import React, { createRef, PureComponent, RefObject } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  LayoutChangeEvent,
  StyleProp,
  TextInput,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { LayoutEvent } from "react-navigation";
import Images from "../../assets/images";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";
import { OptionalPromise, timing } from "../../utils/helpers";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const containerHeight = 40;

type SearchLayoutState = "Expanded" | "Collapsed";
interface SearchBarProps {
  beforeFocus?: () => Promise<void>;
  onFocus?: (text: string) => Promise<void>;
  afterFocus?: () => Promise<void>;

  beforeSearch?: (text: string) => Promise<void>;
  onSearch?: (text: string) => Promise<void>;
  afterSearch?: (text: string) => Promise<void>;

  onChangeText?: (text: string) => OptionalPromise<void>;

  beforeCancel?: () => Promise<void>;
  onCancel?: () => Promise<void>;
  afterCancel?: () => Promise<void>;

  beforeDelete?: () => Promise<void>;
  onDelete?: () => OptionalPromise<void>;
  afterDelete?: () => Promise<void>;

  /**
   * styles
   */
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  placeholderTextColor?: string;
  titleCancelColor?: string;
  tintColorSearch?: string;
  tintColorDelete?: string;
  inputStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  direction?: "ltr" | "rtl";
  cancelButtonStyle?: StyleProp<TextStyle>;
  onLayout?: (e: LayoutChangeEvent) => void;
  cancelButtonTextStyle?: StyleProp<TextStyle>;
  cancelButtonViewStyle?: StyleProp<ViewStyle>;

  /**
   * text input
   */
  defaultValue?: string;
  placeholder?: string;
  cancelTitle?: string;
  iconDelete?: object;
  iconSearch?: object;
  returnKeyType?: string;
  keyboardType?: string;
  keyboardAppearance?: string;
  autoCapitalize?: string;
  inputHeight?: number;
  inputBorderRadius?: number;
  contentWidth?: number;
  middleWidth?: number;
  editable?: boolean;
  blurOnSubmit?: boolean;
  keyboardShouldPersist?: boolean;
  useClearButton?: boolean;
  autoFocus?: boolean;

  /**
   * Positioning
   */
  positionRightDelete?: number;
  searchIconCollapsedMargin?: number;
  searchIconExpandedMargin?: number;
  searchIconVerticalOffset: number;
  placeholderCollapsedMargin?: number;
  placeholderExpandedMargin?: number;

  /**
   * Shadow
   */
  shadowOffsetHeightCollapsed?: number;
  shadowOffsetHeightExpanded?: number;
  shadowOffsetWidth?: number;
  shadowColor: string;
  shadowOpacityCollapsed?: number;
  shadowOpacityExpanded?: number;
  shadowRadius?: number;
  shadowVisible?: boolean;

  /**
   * Animation rate
   */
  animationConfig?: Animated.TimingAnimationConfig;

  hasCancel?: boolean;
  animated?: boolean;
}

type DefaultProps = Partial<SearchBarProps>;
const defaultProps = {
  inputHeight: verticalScale(40),
  defaultValue: "",
  editable: true,
  blurOnSubmit: true,
  keyboardShouldPersist: false,
  searchIconCollapsedMargin: scale(10),
  searchIconExpandedMargin: scale(10),
  placeholderCollapsedMargin: scale(-5),
  placeholderExpandedMargin: scale(20),
  shadowOffsetWidth: 0,
  shadowOffsetHeightCollapsed: verticalScale(2),
  shadowOffsetHeightExpanded: verticalScale(4),
  shadowColor: "#000",
  shadowOpacityCollapsed: 0.12,
  shadowOpacityExpanded: 0.24,
  shadowRadius: 4,
  shadowVisible: false,
  useClearButton: true,
  direction: "ltr",
  animationConfig: { duration: 200 } as Animated.TimingAnimationConfig,
  hasCancel: true,
  animated: true,
  searchIconVerticalOffset: 13
};

interface SearchBarState {
  mode: SearchLayoutState;
  keyword: string;
}

const initialState: SearchBarState = {
  mode: "Collapsed",
  keyword: defaultProps.defaultValue
};

class SearchBar extends PureComponent<SearchBarProps, SearchBarState> {
  public static readonly defaultProps = defaultProps;
  public readonly state = initialState;

  public input: RefObject<TextInput> = createRef<TextInput>();
  protected contentWidth: number;
  protected middleWidth: number;
  protected cancelButtonWidth: number;
  protected iconSearchAnimated: Animated.Value;
  protected iconDeleteAnimated: Animated.Value;
  protected inputFocusWidthAnimated: Animated.Value;
  protected inputFocusPlaceholderAnimated: Animated.Value;
  protected btnCancelAnimated: Animated.Value;
  protected shadowOpacityAnimated: Animated.Value;
  protected placeholder: string;
  protected cancelTitle: string;
  protected autoFocus: boolean;
  protected shadowHeight: number;
  protected animationConfig: Animated.TimingAnimationConfig;

  constructor(props: SearchBarProps) {
    super(props);
    const { width } = Dimensions.get("window");
    const { contentWidth } = this.props;

    this.contentWidth =
      contentWidth || this.props.animated
        ? width - Metrics.margin
        : width - 60;
    this.middleWidth = 35; // width / 2;// width / 2;
    this.cancelButtonWidth = /*this.props.cancelButtonWidth || */ 50;

    /**
     * Animated values
     */
    this.iconSearchAnimated = new Animated.Value(
      this.middleWidth -
        scale(
          this.props.searchIconCollapsedMargin ||
            SearchBar.defaultProps.searchIconCollapsedMargin
        )
    );
    this.iconDeleteAnimated = new Animated.Value(0);
    this.inputFocusWidthAnimated = new Animated.Value(
      this.contentWidth - scale(10)
    );
    this.inputFocusPlaceholderAnimated = new Animated.Value(
      this.middleWidth -
        scale(
          this.props.placeholderCollapsedMargin ||
            SearchBar.defaultProps.placeholderCollapsedMargin
        )
    );
    this.btnCancelAnimated = new Animated.Value(this.contentWidth);

    /**
     * functions
     */
    this.onFocus = this.onFocus.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.focus = this.focus.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.onLayout = this.onLayout.bind(this);

    /**
     * local variables
     */
    this.placeholder = this.props.placeholder || "Where?";
    this.cancelTitle = this.props.cancelTitle || "Cancel";
    this.autoFocus = this.props.autoFocus || false;

    /**
     * Shadow
     */
    this.shadowOpacityAnimated = new Animated.Value(
      this.props.shadowOpacityCollapsed || defaultProps.shadowOpacityCollapsed
    );
    this.shadowHeight =
      this.props.shadowOffsetHeightCollapsed ||
      defaultProps.shadowOffsetHeightCollapsed;
    this.animationConfig =
      this.props.animationConfig || defaultProps.animationConfig;
  }

  public componentDidMount() {
    if (this.autoFocus) {
      this.setState({ mode: "Expanded" });
      if (this.input.current && this.input.current.focus) {
        this.input.current.focus();
      }
    }
  }

  public onLayout = (event: LayoutEvent) => {
    const contentWidth = event.nativeEvent.layout.width;
    // console.log(contentWidth);
    this.contentWidth = contentWidth;
    this.middleWidth = 35; // contentWidth / 2;
  };

  /**
   * onSearch
   * async await
   */
  public onSearch = async () => {
    if (this.props.beforeSearch) {
      this.props.beforeSearch(this.state.keyword);
    }
    if (this.props.keyboardShouldPersist === false) {
      Keyboard.dismiss();
    }
    if (this.props.onSearch) {
      this.props.onSearch(this.state.keyword);
    }
    if (this.props.afterSearch) {
      this.props.afterSearch(this.state.keyword);
    }
  };

  /**
   * onChangeText
   * async await
   */
  public onChangeText = async (text: string) => {
    this.setState({ keyword: text });
    await new Promise((resolve, reject) => {
      Animated.timing(this.iconDeleteAnimated, {
        toValue: text.length > 0 ? 1 : 0,
        duration: 200
      }).start(() => resolve());
    });
    if (this.props.onChangeText) {
      await this.props.onChangeText(this.state.keyword);
    }
  };

  /**
   * onFocus
   * async await
   */
  public onFocus = async () => {
    if (this.props.beforeFocus) {
      await this.props.beforeFocus();
    }
    if (this.input.current?.isFocused()) {
      this.input.current?.focus();
    }
    if (this.props.onFocus) {
      await this.props?.onFocus(this.state.keyword);
    }
    if (this.props.animated) {
      await this.expand().then(this.onExpandDone);
    }

    if (this.props.afterFocus) {
      await this.props.afterFocus();
    }
  };

  /**
   * focus
   * async await
   */
  public focus = async (text = "") => {
    await this.setState({ keyword: text });
    await this.input.current!.focus();
  };

  public onDelete = async () => {
    if (this.props.beforeDelete) {
      await this.props.beforeDelete();
    }
    // await timing(this.iconDeleteAnimated, {
    //    toValue: 0,
    //    duration: 200,
    // });
    await new Promise((resolve, reject) => {
      Animated.timing(this.iconDeleteAnimated, {
        toValue: 0,
        duration: 200
      }).start(() => resolve());
    });
    await this.setState({ keyword: "" });
    if (this.props.onDelete) {
      this.props.onDelete();
    }
    if (this.props.afterDelete) {
      this.props.afterDelete();
    }
  };

  public onCancel = async () => {
    if (this.props.beforeCancel) {
      await this.props.beforeCancel();
    }
    if (this.props.onCancel) {
      await this.props.onCancel();
    }
    await this.collapse().then(this.onCollapseDone);
    if (this.props.afterCancel) {
      await this.props.afterCancel();
    }
  };

  public onCollapseDone = () =>
    this.setState(prevState => ({ mode: "Collapsed", keyword: "" }));

  public onExpandDone = () => this.setState({ mode: "Expanded" });

  public expand = async () => {
    return await new Promise(resolve => {
      Animated.parallel(
        [
          Animated.timing(this.inputFocusWidthAnimated, {
            toValue: this.contentWidth - this.cancelButtonWidth,
            ...this.animationConfig
          }),
          Animated.timing(this.btnCancelAnimated, {
            toValue: 10,
            ...this.animationConfig
          }),
          Animated.timing(this.iconDeleteAnimated, {
            toValue: this.state.keyword.length > 0 ? 1 : 0,
            ...this.animationConfig
          }),
          Animated.timing(this.shadowOpacityAnimated, {
            toValue:
              this.props.shadowOpacityExpanded ||
              defaultProps.shadowOpacityExpanded,
            ...this.animationConfig
          })
        ],
        { stopTogether: false }
      ).start(() => {
        this.shadowHeight =
          this.props.shadowOffsetHeightExpanded ||
          defaultProps.shadowOffsetHeightExpanded;
        resolve();
      });
    });
  };

  public collapse = async () => {
    return await new Promise(resolve => {
      Animated.parallel(
        [
          // this.props.keyboardShouldPersist === false ? Keyboard.dismiss() : null,
          Animated.timing(this.inputFocusWidthAnimated, {
            toValue: this.contentWidth - scale(10), // this.cancelButtonWidth,//
            ...this.animationConfig
          }),
          Animated.timing(this.btnCancelAnimated, {
            toValue: this.contentWidth,
            ...this.animationConfig
          }),
          Animated.timing(this.iconDeleteAnimated, {
            toValue: 0,
            ...this.animationConfig
          }),
          Animated.timing(this.shadowOpacityAnimated, {
            toValue:
              this.props.shadowOpacityCollapsed ||
              defaultProps.shadowOpacityCollapsed,
            ...this.animationConfig
          })
        ],
        { stopTogether: false }
      ).start(() => {
        this.shadowHeight =
          this.props.shadowOffsetHeightCollapsed ||
          defaultProps.shadowOffsetHeightCollapsed;

        resolve();
      });
    });
  };

  public render() {
    const isRtl = this.props.direction === "rtl";
    const styles = getStyles(
      this.props.inputHeight || defaultProps.inputHeight,
      this.props.searchIconVerticalOffset ||
        defaultProps.searchIconVerticalOffset,
      isRtl
    );
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.containerStyle,
          this.props.backgroundColor && {
            backgroundColor: this.props.backgroundColor
          }
        ]}
        onLayout={this.onLayout}
      >
        <AnimatedTextInput
          ref={this.input}
          style={[
            styles.input,
            this.props.placeholderTextColor && {
              color: this.props.placeholderTextColor
            },
            this.props.inputStyle && this.props.inputStyle,
            this.props.inputHeight && { height: this.props.inputHeight },
            this.props.inputBorderRadius && {
              borderRadius: this.props.inputBorderRadius
            },
            {
              width: this.inputFocusWidthAnimated,
              [isRtl ? "paddingRight" : "paddingLeft"]: this
                .inputFocusPlaceholderAnimated
            },
            this.props.shadowVisible && {
              shadowOffset: {
                width: this.props.shadowOffsetWidth,
                height: this.shadowHeight
              },
              shadowColor: this.props.shadowColor,
              shadowOpacity: this.shadowOpacityAnimated,
              shadowRadius: this.props.shadowRadius
            }
          ]}
          editable={this.props.editable}
          value={this.state.keyword}
          onChangeText={this.onChangeText}
          placeholder={this.placeholder}
          placeholderTextColor={
            this.props.placeholderTextColor || styles.placeholderColor
          }
          selectionColor={Colors.black}
          onSubmitEditing={this.onSearch}
          autoCorrect={false}
          blurOnSubmit={this.props.blurOnSubmit}
          returnKeyType={this.props.returnKeyType || "search"}
          keyboardType={this.props.keyboardType || "default"}
          keyboardAppearance={this.props.keyboardAppearance || "default"}
          autoCapitalize={this.props.autoCapitalize}
          onFocus={this.onFocus}
          underlineColorAndroid="transparent"
          accessibilityTraits="search"
        />
        <TouchableWithoutFeedback onPress={this.onFocus}>
          {this.props.iconSearch ? (
            <Animated.View
              style={[styles.iconSearch, { left: this.iconSearchAnimated }]}
            >
              {this.props.iconSearch}
            </Animated.View>
          ) : (
            <Animated.Image
              source={require("../../assets/images/search.png")}
              style={[
                styles.iconSearch,
                styles.iconSearchDefault,
                this.props.tintColorSearch && {
                  tintColor: this.props.tintColorSearch
                },
                {
                  left: this.iconSearchAnimated
                }
              ]}
            />
          )}
        </TouchableWithoutFeedback>
        {this.props.useClearButton && (
          <TouchableWithoutFeedback onPress={this.onDelete}>
            {this.props.iconDelete ? (
              <Animated.View
                style={[
                  styles.iconDelete,
                  this.props.positionRightDelete && {
                    [isRtl ? "left" : "right"]: this.props.positionRightDelete
                  },
                  { opacity: this.iconDeleteAnimated }
                ]}
              >
                {this.props.iconDelete}
              </Animated.View>
            ) : (
              <Animated.Image
                source={require("../../assets/images/delete.png")}
                style={[
                  styles.iconDelete,
                  styles.iconDeleteDefault,
                  this.props.tintColorDelete && {
                    tintColor: this.props.tintColorDelete
                  },
                  this.props.positionRightDelete && {
                    [isRtl ? "left" : "right"]: this.props.positionRightDelete
                  },
                  { opacity: this.iconDeleteAnimated }
                ]}
              />
            )}
          </TouchableWithoutFeedback>
        )}
        {this.props.hasCancel && (
          <TouchableOpacity onPress={this.onCancel}>
            <Animated.View
              style={[
                styles.cancelButton,
                this.props.cancelButtonStyle && this.props.cancelButtonStyle,
                this.props.cancelButtonViewStyle &&
                  this.props.cancelButtonViewStyle,
                { [isRtl ? "right" : "left"]: this.btnCancelAnimated }
              ]}
            >
              <Image source={Images.cancel} />
            </Animated.View>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
}

const getStyles = (
  inputHeight: number,
  searchIconVerticalOffset: number,
  isRtl: boolean
) => {
  let middleHeight = verticalScale(20);
  if (typeof inputHeight === "number") {
    middleHeight = (verticalScale(10) + verticalScale(inputHeight)) / 2;
  }

  return {
    container: {
      backgroundColor: Colors.transparent,
      height: containerHeight,
      flexDirection: isRtl ? "row-reverse" : "row",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 5
    },
    input: {
      height: containerHeight - verticalScale(10),
      paddingTop: verticalScale(5),
      paddingBottom: verticalScale(5),
      paddingLeft: scale(15),
      [isRtl ? "paddingRight" : "paddingLeft"]: scale(20),
      textAlign: isRtl ? "right" : "left",
      borderColor: "#444",
      backgroundColor: Colors.snow,
      fontSize: Fonts.size.input,
      fontFamily: Fonts.type.bold,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4
    },
    placeholderColor: "grey",
    iconSearch: {
      flex: 1,
      position: "absolute",
      top: middleHeight - searchIconVerticalOffset,
      height: 16,
      width: 16
    },
    iconSearchDefault: {
      tintColor: "grey"
    },
    iconDelete: {
      position: "absolute",
      [isRtl ? "left" : "right"]: 70,
      top: middleHeight - searchIconVerticalOffset,
      height: 14,
      width: 14
    },
    iconDeleteDefault: {},
    cancelButton: {
      justifyContent: "center",
      alignItems: isRtl ? "flex-end" : "flex-start",
      backgroundColor: "transparent",
      width: 60,
      height: 50
    },
    cancelButtonText: {
      fontSize: 14,
      color: "#fff"
    }
  };
};

export default SearchBar;
