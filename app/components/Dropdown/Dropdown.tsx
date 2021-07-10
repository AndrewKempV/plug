import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import React, {
  forwardRef,
  RefForwardingComponent,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Dimensions
} from "react-native";
import styled from "styled-components";
import { Colors } from "app/config/styles";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Option {
  id: string;
  title: string;
  onSelect: () => void;
}

const Container = styled(Modal).attrs({
  supportedOrientations: [
    "portrait",
    "portrait-upside-down",
    "landscape",
    "landscape-left",
    "landscape-right"
  ]
})``;
const Bg = styled(TouchableOpacity).attrs({ activeOpacity: 1 })`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${Colors.transparent};
`;
const Content = styled(View)`
  position: absolute;
  padding: 4px 0;
  border-width: 2px;
  border-radius: 4px;
  border-color: ${Colors.lightBlueGrey};
`;
const ContentScrollView = styled(ScrollView)`
  flex-grow: 0;
`;
const OptionView = styled(TouchableOpacity)<{
  selected: boolean;
  tintColor: string;
}>`
  background-color: ${props =>
    props.selected ? props.tintColor : "transparent"};
  padding: 8px;
`;
const OptionBg = styled(View)<{ selected: boolean; tintColor: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-color: ${props =>
    props.selected ? props.tintColor : "transparent"};
  opacity: 0.08;
`;
const OptionText = styled(Text)<{
  selected: boolean;
  textColor: string;
  tintColor: string;
}>`
  color: ${props => (props.selected ? props.tintColor : props.textColor)};
  font-size: 15px;
  line-height: 17px;
  font-weight: normal;
`;

export interface StyleProps {
  animationStyle?: "none" | "fade";

  backgroundColor?: string;
  tintColor?: string;
  textColor?: string;

  buttonMenuSpacing?: number;
  maxContentHeight?: number;
}

interface Props extends StyleProps {
  options: Option[];
  selectedId: string;
  direction: "above" | "below";
}

export interface Handler {
  showFrom: (sourceRect: Rect) => void;
}

const Popup: RefForwardingComponent<Handler, Props> = (
  {
    options,
    selectedId,
    direction,
    animationStyle = "fade",
    backgroundColor = Colors.snow,
    tintColor = Colors.black,
    textColor = Colors.black,
    buttonMenuSpacing = 4,
    maxContentHeight = 200
  },
  ref
) => {
  const [sourceRect, setSourceRect] = useState<O.Option<Rect>>(O.none);
  const [visible, setVisible] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const contentStyle: O.Option<ViewStyle> = useMemo(
    () =>
      pipe(
        sourceRect,
        O.map(rect => {
          if (direction === "below") {
            return {
              top: rect.y + rect.height + buttonMenuSpacing,
              left: rect.x,
              minWidth: rect.width,
              maxHeight: maxContentHeight
            };
          } else {
            return {
              bottom: windowHeight - rect.y + buttonMenuSpacing,
              left: rect.x,
              minWidth: rect.width,
              maxHeight: maxContentHeight
            };
          }
        })
      ),
    [sourceRect, windowHeight, direction, buttonMenuSpacing, maxContentHeight]
  );
  useImperativeHandle(ref, () => ({
    showFrom: rect => {
      setWindowHeight(Dimensions.get("window").height);
      setSourceRect(O.some(rect));
      setVisible(true);
    }
  }));

  return pipe(
    contentStyle,
    O.map(contentStyle_ => (
      <Container
        animationType={animationStyle}
        transparent={true}
        visible={visible}
      >
        <Bg onPress={() => setVisible(false)} />
        <Content style={[contentStyle_, { backgroundColor }]}>
          <ContentScrollView>
            {options.map(option => (
              <OptionView
                key={option.id}
                onPress={() => {
                  option.onSelect();
                  setVisible(false);
                }}
                selected={selectedId === option.id}
                tintColor={Colors.lightBlueGrey}
              >
                <OptionBg
                  selected={selectedId === option.id}
                  tintColor={Colors.lightBlueGrey}
                />
                <OptionText
                  selected={selectedId === option.id}
                  textColor={textColor}
                  tintColor={tintColor}
                >
                  {option.title}
                </OptionText>
              </OptionView>
            ))}
          </ContentScrollView>
        </Content>
      </Container>
    )),
    O.toNullable
  );
};

export default forwardRef(Popup);
