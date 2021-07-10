import React from "react";
import {
  Image as RNImage,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet
} from "react-native";
import { Box, TouchableBox, Icon } from "app/components";
import { CroppedImage } from "components/AvatarEditor/AvatarEditor";
import { Heading } from "components/Typography";
import strings from "../screens/CreateEvent/strings";
import { Colors } from "config/styles";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const CARD_HEIGHT = 192;
const CARD_WIDTH = 247;

interface Props {
  item: CroppedImage;
  onRemove: (item: CroppedImage, idx?: number) => void;
  onPressAdd: () => void;
  onImageSelected: (image: CroppedImage) => void;
}

export const ImageInput = ({ item, onPressAdd, onRemove }: Props) => {
  const remove = () => onRemove(item);
  return item.uri ? (
    <Box
      height={CARD_HEIGHT}
      width={CARD_WIDTH}
      borderColor={Colors.iceBlue}
      borderWidth={1}
      borderRadius={5}
      shadowRadius={6}
      shadowColor={"rgba(0, 0, 0, 0.16)"}
      shadowOpacity={1}
      shadowOffset={{
        width: 3,
        height: 3
      }}
    >
      <MaterialIcon
        name={"cancel"}
        size={20}
        color={Colors.charcoalGreyTwo}
        style={styles.closeButton}
        onPress={remove}
      />
      <RNImage
        width={item.width}
        height={item.height}
        source={{ uri: item.uri }}
        style={styles.image}
        fadeDuration={400}
      />
    </Box>
  ) : (
    <TouchableBox
      backgroundColor={Colors.snow}
      height={CARD_HEIGHT}
      width={CARD_WIDTH}
      elevation={5}
      borderColor={Colors.lightBlueGrey}
      borderWidth={1}
      borderRadius={6}
      justifyContent={"center"}
      alignItems={"center"}
      onPress={onPressAdd}
    >
      <Icon name={"payments"} size={20} />
      <Heading size={"h4"}>{strings.addPhotos}</Heading>
    </TouchableBox>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: "flex-end",
    width: 21,
    height: 21,
    marginTop: -10,
    left: 235,
    position: "absolute",
    zIndex: 999
  },
  image: {
    height: CARD_HEIGHT,
    width: "100%",
    borderRadius: 5
  }
});
