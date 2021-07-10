import React, { useRef } from "react";
import { FlatList, ListRenderItemInfo, Modal, StyleSheet } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import { Box, TouchableBox, Heading, Divider } from "app/components";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Colors } from "app/config/styles";
import Animated, { Easing } from "react-native-reanimated";
import { delay } from "app/utils/helpers";

const SNAP_POINTS = [392, 0];
interface CategoryMenuProps {
  selected: string;
  categories: string[];
  onChange: (category: string) => void;
  onClose: () => void;
  visible: boolean;
}
export const CategoryMenu = ({
  selected,
  categories,
  onChange,
  onClose,
  visible,
}: CategoryMenuProps) => {
  const ref = useRef<BottomSheet>();
  let fall = new Animated.Value(1);

  const CategoryList = () => {
    const renderCategory = ({ item, index }: ListRenderItemInfo<string>) => {
      const change = () => {
        onChange(item);
        delay(500).finally(onClose);
        // onClose();
      };
      return (
        <TouchableBox
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          onPress={change}
          minHeight={48}
          height={48}
          width={"100%"}
          spaceTop={"medium"}
          spaceBottom={"small"}
          // debug={true}
        >
          <Heading size={"h4"} weight={"500"}>
            {item}
          </Heading>
          {item === selected && (
            <Ionicon name={"md-checkmark"} size={20} color={Colors.burgundy} />
          )}
        </TouchableBox>
      );
    };
    const renderItemSeperator = () => (
      <Divider size={1} color={Colors.iceBlue} />
    );
    return (
      <Box
        height={SNAP_POINTS[0]}
        spaceHorizontal={"large"}
        backgroundColor={Colors.snow}
        spaceTop={"small"}
      >
        <FlatList
          contentContainerStyle={styles.categoryListContainer}
          data={categories}
          renderItem={renderCategory}
          ItemSeparatorComponent={renderItemSeperator}
          extraData={selected}
        />
      </Box>
    );
  };
  const header = {
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

  const renderCategories = () => <CategoryList />;
  const renderHeader = () => {
    return (
      <Box {...(header as any)}>
        <Box
          backgroundColor={Colors.silver}
          borderRadius={28}
          height={6}
          width={56}
        />
        <Box spaceTop={"small"}>
          <Heading size={"h3"} weight={"500"}>
            {"Categories"}
          </Heading>
        </Box>
      </Box>
    );
  };

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
      <Animated.View style={styles.modalContainer}>
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
            renderContent={renderCategories}
            snapPoints={SNAP_POINTS}
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

const styles = StyleSheet.create({
  categoryListContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.A400,
    justifyContent: "center",
  },
});
