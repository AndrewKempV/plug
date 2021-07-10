import { FieldProps } from "formik";
import _ from "lodash";
import * as React from "react";
import {
  Image as NativeImage,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";

// import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker'
import { Avatar } from "react-native-elements";
import ImagePicker, { Image, Options } from "react-native-image-crop-picker";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";

export interface CroppedImage {
  uri: string;
  width: number;
  height: number;
  type?: "images/png" | "images/jpeg" | string;
  fileName?: string;
}
interface IProps extends FieldProps<{ uri: string }> {
  firstName?: string;
  lastName?: string;
  mediaType?: "photo" | "video" | "mixed";
  allowsEditing?: boolean;
  log?: boolean;
  width?: number;
  height?: number;
  uri?: string;
  onExitCropper?: (result: Image) => void;
}

interface IState {
  changed: boolean;
  image: CroppedImage;
  isEditing: boolean;
}

export class AvatarEditor extends React.Component<IProps, IState> {
  public static defaultProps: IProps | any = {
    width: 150,
    height: 150
  };

  public readonly state = {
    isEditing: false,
    changed: false,
    image: {
      uri: "",
      width: AvatarEditor.defaultProps.width,
      height: AvatarEditor.defaultProps.height
    }
  };

  public componentDidMount() {
    this.setState({
      image: {
        uri: this.props.uri!,
        width: AvatarEditor.defaultProps.width,
        height: AvatarEditor.defaultProps.height
      }
    });
  }

  public onImage = () => {
    const options: Options = {
      mediaType: this.props.mediaType || AvatarEditor.defaultProps.mediaType,
      width: AvatarEditor.defaultProps.width,
      height: AvatarEditor.defaultProps.height,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
      includeExif: true,
      avoidEmptySpaceAroundImage: true,
      freeStyleCropEnabled: true
    };
    ImagePicker.openPicker(options)
      .then(selected => {
        const image = selected as Image;
        const formatted = {
          uri: `data:${image.mime};base64,` + image.data,
          width: image.width,
          height: image.height
        };
        this.setState({ changed: true, image: formatted, isEditing: true });
        if (!_.isNil(this.props.onExitCropper)) {
          this.props.onExitCropper(image);
        }
      })
      .catch(error => error)
      .finally(() => this.setState({ isEditing: false }));
  };

  public render() {
    const { uri, width, height } = this.state.image;
    const borderRadius = width;
    return (
      <React.Fragment>
        <View style={[styles.container, { height }]}>
          {_.isNil(uri) || uri === "" ? ( // Avatar with Title
            <Avatar
              onPress={this.onImage}
              rounded={true}
              title={
                this.props.firstName!.charAt(0) + this.props.lastName!.charAt(0)
              }
              size={"xlarge"}
            />
          ) : (
            <TouchableOpacity
              onPress={this.onImage}
              style={[styles.avatarContainer, { width, height, borderRadius }]}
            >
              <NativeImage
                source={{
                  uri: _.isNil(uri) || uri === "" ? this.props.uri! : uri
                }}
                resizeMode={"cover"}
                style={{ width, height }}
              />
            </TouchableOpacity>
          )}
          <View style={styles.editIconContainer}>
            <SimpleLineIcon name={"pencil"} size={Metrics.icons.small} />
          </View>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  avatarContainer: {
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 11,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  editIconContainer: {
    backgroundColor: Colors.snow,
    borderColor: Colors.paleGrey,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    padding: 10,
    position: "absolute",
    right: 135,
    top: 110,
    width: 50,
    zIndex: 1
  }
});
