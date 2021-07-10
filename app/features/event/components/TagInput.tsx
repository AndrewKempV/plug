import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  TextInputProps,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
  TextStyle
} from "react-native";
import invariant from "invariant";
import { Box } from "app/components/Box";

const windowWidth = Dimensions.get("window").width;

// type KeyboardShouldPersistTapsProps =
//   | "always"
//   | "never"
//   | "handled"
//   | false
//   | true;

type RequiredProps<T> = {
  /**
   * An array of tags, which can be any type, as long as labelExtractor below
   * can extract a string from it
   */
  value: T[];
  /**
   * A handler to be called when array of tags change. The parent should update
   * the value prop when this is called if they want to enable removal of tags
   */
  onChange: (items: T[]) => void;
  /**
   * Function to extract string value for label from item
   */
  labelExtractor: (tagData: T) => string;
  //| React.ElementType<any>,
  /**
   * The text currently being displayed in the TextInput following the list of
   * tags
   */
  text: string;
  /**
   * This callback gets called when the user types in the TextInput. The parent
   * should update the text prop when this is called if they want to enable
   * input. This is also where any parsing to detect new tags should occur
   */
  onChangeText: (text: string) => void;
};
type OptionalProps = {
  /**
   * If false, text input is not editable and existing tags cannot be removed.
   */
  editable: boolean;
  /**
   * Background color of tags
   */
  tagColor: string;
  /**
   * Text color of tags
   */
  tagTextColor: string;
  /**
   * Styling override for container surrounding tag text
   */
  tagContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Styling override for tag's text component
   */
  tagTextStyle?: StyleProp<TextStyle>;
  /**
   * Width override for text input's default width when it's empty and showing placeholder
   */
  inputDefaultWidth: number;
  /**
   * Color of text input
   */
  inputColor: string;
  /**
   * Any misc. TextInput props (autoFocus, placeholder, returnKeyType, etc.)
   */
  inputProps?: TextInputProps;
  /**
   * Max height of the tag input on screen (will scroll if max height reached)
   */
  maxHeight: number;
  /**
   * Callback that gets passed the new component height when it changes
   */
  onHeightChange?: (height: number) => void;
  /**
   * Any ScrollView props (horizontal, showsHorizontalScrollIndicator, etc.)
   */
  scrollViewProps?: ScrollViewProps;
};

type Props<T> = RequiredProps<T> & OptionalProps;
type State = {
  inputWidth: number;
  wrapperHeight: number;
};

class TagInput<T> extends React.PureComponent<Props<T>, State> {

  state: State;
  wrapperWidth = windowWidth;
  spaceLeft = 0;
  // scroll to bottom
  contentHeight = 0;
  // refs
  tagInput: TextInput | null = null;
  scrollView: ScrollView | null = null;

  static defaultProps = {
    editable: true,
    tagColor: "#dddddd",
    tagTextColor: "#777777",
    inputDefaultWidth: 90,
    inputColor: "#777777",
    maxHeight: 75
  };

  static inputWidth(
    text: string,
    spaceLeft: number,
    inputDefaultWidth: number,
    wrapperWidth: number
  ) {
    if (text === "") {
      return inputDefaultWidth;
    } else if (spaceLeft >= 100) {
      return spaceLeft - 10;
    } else {
      return wrapperWidth;
    }
  }

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      inputWidth: props.inputDefaultWidth,
      wrapperHeight: 36
    };
  }

  componentWillReceiveProps(nextProps: Props<T>) {
    const inputWidth = TagInput.inputWidth(
      nextProps.text,
      this.spaceLeft,
      nextProps.inputDefaultWidth,
      this.wrapperWidth
    );
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
    const wrapperHeight = Math.min(nextProps.maxHeight, this.contentHeight);
    if (wrapperHeight !== this.state.wrapperHeight) {
      this.setState({ wrapperHeight });
    }
  }

  componentWillUpdate(nextProps: Props<T>, nextState: State) {
    if (
      this.props.onHeightChange &&
      nextState.wrapperHeight !== this.state.wrapperHeight
    ) {
      this.props.onHeightChange(nextState.wrapperHeight);
    }
  }

  measureWrapper = (event: { nativeEvent: { layout: { width: number } } }) => {
    this.wrapperWidth = event.nativeEvent.layout.width;
    const inputWidth = TagInput.inputWidth(
      this.props.text,
      this.spaceLeft,
      this.props.inputDefaultWidth,
      this.wrapperWidth
    );
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
  };

  onBlur = (event: { nativeEvent: { text: string } }) => {
    invariant(Platform.OS === "ios", "only iOS gets text on TextInput.onBlur");
    this.props.onChangeText(event.nativeEvent.text);
  };

  onKeyPress = (event: { nativeEvent: { key: string } }) => {
    if (this.props.text !== "" || event.nativeEvent.key !== "Backspace") {
      return;
    }
    const tags = [...this.props.value];
    tags.pop();
    this.props.onChange(tags);
    
    this.scrollToEnd();
    this.focus();
  };

  focus = () => {
    invariant(this.tagInput, "should be set");
    this.tagInput?.focus();
  };

  removeIndex = (index: number) => {
    const tags = [...this.props.value];
    tags.splice(index, 1);
    this.props.onChange(tags);
  };

  scrollToEnd = () => {
    const scrollView = this.scrollView;
    invariant(
      scrollView,
      "this.scrollView ref should exist before scrollToEnd called"
    );
    setTimeout(() => scrollView?.scrollToEnd({ animated: true }), 0);
  };

  render() {
    const tags = this.props.value.map((tag, index) => (
      <Tag
        index={index}
        label={this.props.labelExtractor(tag)}
        isLastTag={this.props.value.length === index + 1}
        onLayoutLastTag={this.onLayoutLastTag}
        removeIndex={this.removeIndex}
        tagColor={this.props.tagColor}
        tagTextColor={this.props.tagTextColor}
        tagContainerStyle={this.props.tagContainerStyle}
        tagTextStyle={this.props.tagTextStyle}
        key={index}
        editable={this.props.editable}
      />
    ));

    return (
      <TouchableWithoutFeedback
        onPress={this.focus}
        style={styles.container}
        onLayout={this.measureWrapper}
      >
        <View style={[styles.wrapper, { height: this.state.wrapperHeight }]}>
          <ScrollView
            ref={ref => this.scrollViewRef(ref!)}
            style={styles.tagInputContainerScroll}
            onContentSizeChange={this.onScrollViewContentSizeChange}
            keyboardShouldPersistTaps={"handled"}
            {...this.props.scrollViewProps}
          >
            <Box flexDirection={'row'} flex={1} flexWrap={'wrap'}>
              {tags}
              <View
                style={[
                  styles.textInputContainer,
                  { width: this.state.inputWidth }
                ]}
              >
                <TextInput
                  ref={this.tagInputRef}
                  blurOnSubmit={false}
                  onKeyPress={this.onKeyPress}
                  value={this.props.text}
                  style={[
                    styles.textInput,
                    {
                      width: this.state.inputWidth,
                      color: this.props.inputColor
                    }
                  ]}
                  onBlur={Platform.OS === "ios" ? this.onBlur : undefined}
                  onChangeText={this.props.onChangeText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Start typing"
                  returnKeyType="done"
                  keyboardType="default"
                  editable={this.props.editable}
                  underlineColorAndroid="rgba(0,0,0,0)"
                
                  {...this.props.inputProps}
                />
              </View>
            </Box>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  tagInputRef = (tagInput: TextInput) => {
    invariant(typeof tagInput === "object", "TextInput ref is object");
    this.tagInput = tagInput;
  };

  scrollViewRef = (scrollView: ScrollView) => {
    invariant(typeof scrollView === "object", "ScrollView ref is object");
    this.scrollView = scrollView;
  };

  onScrollViewContentSizeChange = (w: number, h: number) => {
    if (this.contentHeight === h) {
      return;
    }
    const nextWrapperHeight = Math.min(this.props.maxHeight, h);
    if (nextWrapperHeight !== this.state.wrapperHeight) {
      this.setState(
        { wrapperHeight: nextWrapperHeight },
        this.contentHeight < h ? this.scrollToEnd : undefined
      );
    } else if (this.contentHeight < h) {
      this.scrollToEnd();
    }
    this.contentHeight = h;
  };

  onLayoutLastTag = (endPosOfTag: number) => {
    const margin = 3;
    this.spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
    const inputWidth = TagInput.inputWidth(
      this.props.text,
      this.spaceLeft,
      this.props.inputDefaultWidth,
      this.wrapperWidth
    );
    // console.log(this.state);
    // console.log(`next input width: ${inputWidth}`);
    // console.log(`spaceLeft: ${this.spaceLeft}`);

    if (inputWidth !== this.state.inputWidth) { 
      this.setState({ inputWidth });
    }
  };
}

interface TagProps {
  index: number;
  label: string | React.ReactElement<any>;
  isLastTag: boolean;
  editable: boolean;
  onLayoutLastTag: (endPosOfTag: number) => void;
  removeIndex: (index: number) => void;
  tagColor: string;
  tagTextColor: string;
  tagContainerStyle?: StyleProp<ViewStyle>;
  tagTextStyle?: StyleProp<TextStyle>;
}
class Tag extends React.PureComponent<TagProps> {
  curPos: number | null = null;

  componentWillReceiveProps(nextProps: TagProps) {
    if (
      !this.props.isLastTag &&
      nextProps.isLastTag &&
      this.curPos !== null &&
      this.curPos !== undefined
    ) {
      this.props.onLayoutLastTag(this.curPos);
    }
  }

  render() {
    let tagLabel;
    if (React.isValidElement(this.props.label)) {
      tagLabel = this.props.label;
    } else {
      tagLabel = (
        <Text
          style={[
            styles.tagText,
            { color: this.props.tagTextColor },
            this.props.tagTextStyle
          ]}
        >
          {this.props.label}
          &nbsp;&times;
        </Text>
      );
    }
    return (
      <TouchableOpacity
        disabled={!this.props.editable}
        onPress={this.onPress}
        onLayout={this.onLayoutLastTag}
        style={[
          styles.tag,
          { backgroundColor: this.props.tagColor },
          this.props.tagContainerStyle
        ]}
      >
        {tagLabel}
      </TouchableOpacity>
    );
  }

  onPress = () => {
    this.props.removeIndex(this.props.index);
  };

  onLayoutLastTag = (event: {
    nativeEvent: { layout: { x: number; width: number } };
  }) => {
    const layout = event.nativeEvent.layout;
    this.curPos = layout.width + layout.x;
    if (this.props.isLastTag) {
      this.props.onLayoutLastTag(this.curPos);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tag: {
    borderRadius: 2,
    height: 24,
    justifyContent: "center",
    marginRight: 3,
    marginTop: 6,
    padding: 8
  },
  tagInputContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tagInputContainerScroll: {
    flex: 1
  },
  tagText: {
    margin: 0,
    padding: 0
  },
  textInput: {
    flex: 0.6,
    fontSize: 16,
    height: 36,
    marginBottom: 6,
    padding: 0
  },
  textInputContainer: {
    height: 36
  },
  wrapper: {
    flex: 1,
    flexDirection: "row",
    marginTop: 3,
    marginBottom: 2,
    alignItems: "flex-start"
  }
});

export default TagInput;
