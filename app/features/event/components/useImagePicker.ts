import React, { useEffect, useState } from "react";
import ImagePicker, { Image, Options } from "react-native-image-crop-picker";
import { CroppedImage } from "components/AvatarEditor/AvatarEditor";

export type ImagePickerMode = "active" | "inactive";

export const useImagePicker = (mode: ImagePickerMode) => {
  const [image, setImage] = useState<CroppedImage>({
    width: 0,
    height: 0,
    uri: ""
  });
  useEffect(() => {
    const startPickerFlow = async () => {
      const selected = (await ImagePicker.openPicker(pickerOptions)) as Image;
      setImage({
        uri: `data:${selected.mime};base64,` + selected.data,
        width: selected.width,
        height: selected.height
      });
    };
    if (mode === "active") {
      startPickerFlow();
    }
  }, [mode]);
  return image;
};

const CARD_WIDTH = 247;
const pickerOptions: Options = {
  mediaType: "image",
  width: CARD_WIDTH,
  height: 192,
  cropping: true,
  cropperCircleOverlay: true,
  includeBase64: true,
  includeExif: true,
  avoidEmptySpaceAroundImage: true,
  freeStyleCropEnabled: true
};
