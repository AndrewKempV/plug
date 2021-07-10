import React, { useRef, useState } from "react";
import { Modal, ScrollView, StyleProp, ViewStyle } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import { Box, TouchableBox, Heading, Spacing } from "app/components";
import { Colors } from "app/config/styles";
import Animated from "react-native-reanimated";
import { SelectableTag } from "../types";
import { produce } from "immer";
import { useDimensions } from "app/hooks";
import AntIcon from "react-native-vector-icons/AntDesign";

interface TagEditorSheetProps {
  tags: SelectableTag[];
  onChange: (tags: SelectableTag[]) => void;
  onClose: () => void;
  visible: boolean;
  title: string;
}
export const TagEditorSheet = ({
  tags,
  onChange,
  onClose,
  visible,
  title,
}: TagEditorSheetProps) => {
  const dimensions = useDimensions();
  const sheetHeight = dimensions.height * 0.75;
  const [options, setOptions] = useState<SelectableTag[]>([...tags]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const anySelected = () =>
    options.some((option, index) => {
      if (index > -1 && tags && tags[index]) {
        return tags[index]?.selected;
      } 
      return false;
    });

  const [canClear, setCanClear] = useState(anySelected());
  const updateOption = (option: SelectableTag, index: number) => {
    setOptions(
      produce(options, (draft) => {
        const { title, selected } = option;
        if (index >= 0) {
          draft[index] = { title, selected: !selected };
        }
      })
    );
  };
  const clearAllSelected = () =>
    onChange([
      ...options.map((option) => {
        return { ...option, selected: false };
      }),
    ]);
  // const revertChanges = () => setOptions(tags);
  const applyChanges = () => onChange(options);
  const hasChanges = () =>
    options.some((option, index) => {
      if (index > -1 && tags && tags[index]) {
        return tags[index].selected !== option.selected;
      }
      return false;
    });

  const ref = useRef<BottomSheet>();
  let fall = new Animated.Value(1);

  const renderContent = () => {
    const items = options.map((option, index) => {
      const change = () => {
        updateOption(option, index);
      };
      const { title, selected } = option;
      return (
        <Box
          key={option.title}
          spaceHorizontal={"xsmall"}
          spaceVertical={"xsmall"}
        >
          <TouchableBox
            shape={"ellipticalPill"}
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            onPress={change}
            minHeight={32}
            height={32}
            minWidth={64}
            maxWidth={182}
            spaceHorizontal={15}
            borderWidth={1}
            borderColor={
              !selected ? Colors.lightBlueGrey : Colors.lightBurgundy
            }
            backgroundColor={!selected ? Colors.snow : Colors.veryLightPink}
          >
            <Heading size={"h4"}>{title}</Heading>
          </TouchableBox>
        </Box>
      );
    });
    return (
      <Box flex={1} height={sheetHeight} backgroundColor={Colors.snow}>
        <Box
          flex={0.7}
          height={320}
          spaceHorizontal={"large"}
          backgroundColor={Colors.snow}
          spaceTop={"small"}
        >
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              minHeight: 150,
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            {items}
          </ScrollView>
        </Box>
        <Box
          borderWidth={1}
          borderTopColor={Colors.iceBlue}
          borderLeftColor={Colors.iceBlue}
          borderRightColor={Colors.iceBlue}
          borderBottomColor={Colors.transparent}
          height={84}
          maxHeight={84}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <TouchableBox
            onPress={canClear || unsavedChanges ? clearAllSelected : undefined}
            disabled={!(canClear || unsavedChanges)}
            spaceHorizontal={"large"}
            spaceVertical={"small"}
          >
            <Heading
              size={"h4"}
              color={canClear || unsavedChanges ? Colors.burgundy : Colors.onyx}
              weight={canClear || unsavedChanges ? "bold" : "normal"}
            >
              {"Clear All"}
            </Heading>
          </TouchableBox>
          <TouchableBox
            onPress={unsavedChanges ? applyChanges : undefined}
            disabled={!unsavedChanges}
            spaceHorizontal={"large"}
            spaceVertical={"small"}
          >
            <Heading
              size={"h4"}
              color={unsavedChanges ? Colors.burgundy : Colors.onyx}
              weight={unsavedChanges ? "bold" : "normal"}
            >
              {"Apply"}
            </Heading>
          </TouchableBox>
        </Box>
      </Box>
    );
  };

  const renderHeader = () => {
    return (
      <Box {...(header as any)}>
        <Box
          width={"100%"}
          flexDirection={"row"}
          justifyContent={"center"}
          spaceVertical={"medium"}
        >
          <Heading size={"h3"} weight={"500"}>
            {title}
          </Heading>
          {/* <TouchableBox
            
            height={32}
            width={32}
            shape={"circle"}
            borderColor={Colors.paleBlue}
            borderWidth={1}
            justifyContent={"center"}
            alignItems={"center"}
            onPress={onClose}
          >
            <AntIcon name={"close"} size={20} color={Colors.charcoalGrey} />
          </TouchableBox> */}
        </Box>
      </Box>
    );
  };

  React.useEffect(() => {
    setOptions(tags);
  }, [tags]);

  React.useEffect(() => {
    setUnsavedChanges(hasChanges());
    setCanClear(anySelected());
  }, [options]);

  return (
    <Modal
      presentationStyle={"overFullScreen"}
      transparent={true}
      visible={visible}
      animationType={"fade"}
      onRequestClose={() => {
        return;
      }}
    >
      <Animated.View style={containerStyle}>
        <Box
          backgroundColor={Colors.snow}
          left={0}
          right={0}
          bottom={0}
          position={"absolute"}
        >
          <BottomSheet
            ref={(r) => (ref.current = r!)}
            callbackNode={fall}
            enabledInnerScrolling={false}
            renderHeader={renderHeader}
            renderContent={renderContent}
            snapPoints={[dimensions.height * 0.75, 0]}
            enabledBottomInitialAnimation={true}
            initialSnap={0}
            onCloseEnd={onClose}
          />
          <Box
            height={"50%"}
            width={"50%"}
            borderWidth={1}
            borderColor={Colors.transparent}
            zIndex={1}
          />
        </Box>
      </Animated.View>
    </Modal>
  );
};

const header: StyleProp<ViewStyle> = {
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: Colors.snow,
  borderBottomColor: Colors.transparent,
  borderBottomWidth: 0,
  borderLeftColor: Colors.paleGrey,
  borderLeftWidth: 1,
  borderRightColor: Colors.paleGrey,
  borderRightWidth: 1,
  borderTopColor: Colors.paleGrey,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  borderTopWidth: 1,
  paddingTop: 10,
  shadowColor: "#000000",
};

const containerStyle: StyleProp<ViewStyle> = {
  flex: 1,
  backgroundColor: Colors.A400,
  justifyContent: "center",
};
