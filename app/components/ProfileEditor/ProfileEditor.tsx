import _ from "lodash";
import React, { Component } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  ListRenderItemInfo
} from "react-native";
import { Header } from "react-native-elements";
import { Image } from "react-native-image-crop-picker";
import InputScrollView from "react-native-input-scroll-view";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ApiClient } from "../../api/client";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors, Layout } from "../../config/styles";
import { GetPropsFromDispatch } from "../../store/ActionCreators";
import AppActions from "../../store/AppActions";
import { StateStore } from "../../store/AppReducer";
import AvatarEditor from "../AvatarEditor";
import { BackButton, DoneButton } from "../Button";
import { LabeledInput } from "../Input";
import ModalDialog from "../ModalDialog";
import RadioGroup, { RadioButton } from "../RadioGroup";
import { Box } from "app/components";
import strings from "./strings";
import {
  formatIncompletePhoneNumber,
  parseIncompletePhoneNumber,
  isValidNumber
} from "libphonenumber-js";
import Storage from "../../utils/storage";

const GenderOptions = ["Male", "Female", "Other", "Prefer not to say"];

type ActionCreators = typeof AppActions;

type StateFromDispatch = ReturnType<typeof mapStateToProps>;

type PropsFromDispatch = GetPropsFromDispatch<ActionCreators>;

const mapStateToProps = (state: StateStore) => ({
  AuthState: state.authReducer,
  ProfileState: state.profileReducer
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<ActionCreators, PropsFromDispatch>(AppActions, dispatch);

type APIProps = StateFromDispatch & PropsFromDispatch;

interface FormEditorProps {
  firstName: string;
  lastName: string;
  username: string;
  website: string;
  email: string;
  bio: string;
  phone: string;
  gender: string;
  profileUri?: string;
}

type ProfileEditorProps = FormEditorProps & APIProps & NavigationScreenProps;

interface ProfileEditorState {
  editable: boolean;
  selected: boolean;
  showCancel: boolean;
  showModal: boolean;
  username: string;
  firstName: string;
  lastName: string;
  website: string;
  email: string;
  phone: string;
  bio: string;
  gender: string;
  targetImage?: Image;
  profileImageUrl?: string;
  editingGender: boolean;
  hasUnsavedChanges: boolean;
}

class ProfileEditor extends Component<ProfileEditorProps, ProfileEditorState> {
  public data: FormEditorProps & { wasAvatarUpdated: boolean };

  constructor(props: ProfileEditorProps) {
    super(props);
    this.data = {
      firstName: props.firstName,
      lastName: props.lastName,
      username: props.username,
      website: props.website,
      email: props.email,
      phone: props.phone,
      bio: props.bio,
      profileUri: props.ProfileState.profile.profileImageUrl,
      gender: props.gender || "",
      wasAvatarUpdated: false
    };
    this.state = {
      editingGender: false,
      editable: true,
      selected: false,
      showCancel: false,
      showModal: false,
      profileImageUrl: props.ProfileState.profile.profileImageUrl,
      firstName: props.firstName,
      lastName: props.lastName,
      username: props.username,
      website: props.website,
      email: props.email,
      phone: props.phone,
      bio: props.bio,
      gender: props.gender || "",
      hasUnsavedChanges: false
    };
  }

  public async componentDidMount() {
    this.props.getOwnUserProfile();
    try {
      const client = ApiClient.instance;
      const profile = await client.getOwnUserProfile();
      if (profile && profile.data && profile.data.data) {
        const data = profile.data.data.pop()!;

        await this.setState({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          bio: data.bio || "",
          website: data.websiteUrl || "",
          profileImageUrl: data.profileImageUrl || "",
          username: data.username || "",
          phone: parseIncompletePhoneNumber(data.phoneNumber || "+1"),
          gender: data.gender || ""
        });
        this.saveFormData();
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public render() {
    return (
      <View>
        <View>
          <Header
            backgroundColor={Colors.snow}
            leftComponent={<BackButton onPress={this.handlePressBack} />}
            centerComponent={
              <Text style={styles.title}>{strings.screenTitle}</Text>
            }
            rightComponent={
              <DoneButton
                onPress={this.onPressDone}
                active={this.hasUnsavedChanges()}
              />
            }
          />
        </View>

        <InputScrollView
          style={styles.container}
          contentContainerStyle={styles.contentInContainer}
        >
          <View style={styles.avatarContainer}>
            <AvatarEditor
              firstName={this.state.firstName}
              lastName={this.state.lastName}
              uri={
                _.isNil(this.props.ProfileState.profileImage)
                  ? this.state.profileImageUrl
                  : `data:${this.props.ProfileState.profileImage.contentType};base64,` +
                    this.props.ProfileState.profileImage.base64EncodedImage
              }
              onExitCropper={this.changeAvatar}
            />
          </View>
          <LabeledInput
            containerStyle={styles.inputContainer}
            editable={this.state.editable}
            value={this.state.firstName}
            placeholder={strings.firstNameInputPlaceholder}
            onChangeTextValue={this.changeFirstName}
          />
          <LabeledInput
            containerStyle={styles.inputContainer}
            editable={this.state.editable}
            value={this.state.lastName}
            placeholder={strings.lastNameInputPlaceholder}
            onChangeTextValue={this.changeLastName}
          />
          <LabeledInput
            containerStyle={styles.inputContainer}
            editable={this.state.editable}
            value={this.state.username}
            placeholder={strings.usernameInputPlaceholder}
            onChangeTextValue={this.changeUsername}
          />
          <LabeledInput
            containerStyle={styles.inputContainer}
            style={{ maxWidth: Metrics.DEVICE_WIDTH }}
            editable={this.state.editable}
            value={this.state.bio}
            placeholder={strings.bioInputPlaceholder}
            onChangeTextValue={this.changeBio}
          />
          <LabeledInput
            containerStyle={styles.inputContainer}
            editable={this.state.editable}
            value={this.state.website}
            keyboardType={"url"}
            placeholder={strings.websiteInputPlaceholder}
            onChangeTextValue={this.changeWeb}
          />
          <View style={styles.sectionDivider} />
          <Text style={[styles.title, { marginTop: 10 }]}>
            {strings.privateDetailsTitle}
          </Text>
          <LabeledInput
            containerStyle={styles.inputContainer}
            editable={this.state.editable}
            keyboardType={"default"}
            value={this.state.gender}
            placeholder={strings.genderInputPlaceholder}
            onChangeTextValue={this.changeGender}
            onFocus={() => this.setState({ editingGender: true })}
          />
          <LabeledInput
            containerStyle={styles.inputContainer}
            editable={this.state.editable}
            keyboardType={"phone-pad"}
            value={this.state.phone}
            placeholder={strings.phoneInputPlaceholder}
            onChangeTextValue={this.changePhone}
          />
        </InputScrollView>
        {this.renderModalPopup()}
        {this.renderGenderPopup()}
      </View>
    );
  }

  private renderModalPopup() {
    return (
      <ModalDialog
        title={strings.modalTitle}
        subTitle={strings.modalSubTitle}
        active={this.state.showModal}
        transparent={false}
        buttons={[
          {
            containerStyle: styles.leaveButton,
            labelStyle: styles.leaveLabel,
            label: strings.leaveLabel,
            onPress: this.goBack
          },
          {
            containerStyle: styles.saveChangesButton,
            labelStyle: styles.saveChangesLabel,
            label: strings.saveChangesLabel,
            onPress: this.onPressDone
          }
        ]}
      />
    );
  }

  private renderGenderPopup() {
    return (
      <Modal
        transparent={false}
        presentationStyle={"pageSheet"}
        animationType={"slide"}
        visible={this.state.editingGender}
      >
        <View style={Layout.container}>
          <Header
            backgroundColor={Colors.snow}
            leftComponent={
              <BackButton onPress={this.handlePressBackOnGenderPopup} />
            }
            rightComponent={
              <DoneButton
                onPress={this.handlePressDoneOnGenderPopup}
                active={this.state.gender !== this.data.gender}
              />
            }
          />
          <RadioGroup
            renderItem={this.renderRadioButton}
            data={GenderOptions}
            selectedIndex={this.findIndexOrUndefined()}
            onSelect={(index, value) => this.onSelectGender(value)}
          />
        </View>
      </Modal>
    );
  }

  private renderRadioButton = ({ item, index }: ListRenderItemInfo<string>) => {
    const isSelected = this.findIndexOrUndefined() === index;
    return (
      <Box spaceLeft={20}>
        <RadioButton
          key={item}
          title={item}
          size={22}
          color={Colors.burgundy}
          isSelected={isSelected}
          thickness={2}
          onPress={() => this.onSelectGender(item)}
          radioPosition={"right"}
        />
      </Box>
    );
  };

  private saveFormData() {
    this.data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      username: this.state.username,
      website: this.state.website,
      email: this.state.email,
      phone: this.state.phone,
      bio: this.state.bio,
      gender: this.state.gender,
      wasAvatarUpdated: this.data.wasAvatarUpdated
    };
    this.ensureNoUnsavedChanges();
  }

  private onPressDone = async () => {
    this.saveFormData();
    const {
      firstName,
      lastName,
      username,
      website,
      bio,
      gender,
      phone
    } = this.data;
    const phone_number = parseIncompletePhoneNumber(phone);
    await this.props.updateProfile({
      websiteUrl: website,
      bio
    });
    if (isValidNumber(phone_number)) {
      await this.props.updateUserAttributes({
        family_name: lastName,
        given_name: firstName,
        preferred_username: username,
        phone_number,
        gender
      });
    } else {
      await this.props.updateUserAttributes({
        family_name: lastName,
        given_name: firstName,
        preferred_username: username,
        gender
      });
    }
    const { targetImage } = this.state;
    if (this.data.wasAvatarUpdated && targetImage && targetImage.data) {
      await this.props.updateProfileImage({
        contentType: targetImage.mime,
        base64EncodedImage: targetImage.data
      });
      await Storage.setRawProfileImage({
        contentType: targetImage.mime,
        base64EncodedImage: targetImage.data
      });
    }
    await this.setState({ showModal: false });
    this.goBack();
  };

  private changeAvatar = (image: Image) => {
    this.data = {
      ...this.data,
      wasAvatarUpdated: true
    };
    this.setState({ targetImage: image });
  };

  private changeUsername = (text: string) => {
    this.setState({ username: text });
    this.ensureNoUnsavedChanges();
  };

  private changeFirstName = (text: string) => {
    this.setState({ firstName: text });
    this.ensureNoUnsavedChanges();
  };

  private changeLastName = (text: string) => {
    this.setState({ lastName: text });
    this.ensureNoUnsavedChanges();
  };

  private changeWeb = (text: string) => {
    this.setState({ website: text });
    this.ensureNoUnsavedChanges();
  };

  private changePhone = (text: string) => {
    const phone = formatIncompletePhoneNumber(text, "US");
    this.setState({ phone });
    this.ensureNoUnsavedChanges();
  };

  private changeGender = (text: string) => {
    this.setState({ gender: text });
    this.ensureNoUnsavedChanges();
  };

  private changeBio = (text: string) => {
    this.setState({ bio: text });
    this.ensureNoUnsavedChanges();
  };

  private ensureNoUnsavedChanges() {
    const hasUnsavedChanges = this.hasUnsavedChanges();
    this.setState({ hasUnsavedChanges });
  }

  private hasUnsavedChanges() {
    return (
      this.state.firstName !== this.data.firstName ||
      this.state.lastName !== this.data.lastName ||
      this.state.bio !== this.data.bio ||
      this.state.website !== this.data.website ||
      this.state.username !== this.data.username ||
      this.state.phone !== this.data.phone ||
      this.state.gender !== this.data.gender ||
      this.data.wasAvatarUpdated
    );
  }

  private handleShowModal() {
    this.setState({ showModal: true });
  }

  private handlePressBack = () => {
    this.hasUnsavedChanges() ? this.handleShowModal() : this.goBack();
  };

  private goBack = () => {
    this.props.navigation.navigate("Profile");
  };

  private handlePressBackOnGenderPopup = () => {
    this.setState({ editingGender: false, gender: this.data.gender || "" });
  };

  private handlePressDoneOnGenderPopup = () => {
    this.setState({ editingGender: false });
  };

  private onSelectGender(value: string) {
    this.changeGender(value);
  }

  private findIndexOrUndefined() {
    const selected = GenderOptions.findIndex(
      value => value === this.state.gender
    );
    if (selected !== -1) {
      return selected;
    } else {
      return 0;
    }
  }
}

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(ProfileEditor);

const styles = StyleSheet.create({
  avatar: {
    borderColor: "#009688",
    borderRadius: 100,
    borderWidth: 5,
    height: 200,
    margin: 10,
    width: 200
  },
  avatarContainer: {
    ...Layout.alignCentered,
    alignContent: "center",
    marginTop: verticalScale(30)
  },
  backButton: {
    borderColor: Colors.paleGrey,
    borderRadius: 15,
    borderWidth: 1,
    height: Metrics.icons.medium,
    width: Metrics.icons.medium
  },
  backButtonIcon: {
    paddingLeft: scale(7.5),
    paddingTop: verticalScale(1.5)
  },
  container: {
    backgroundColor: Colors.snow,
    height: Metrics.DEVICE_HEIGHT,
    width: Metrics.DEVICE_WIDTH
  },
  contentInContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: Metrics.DEVICE_WIDTH
  },
  doneButtonContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.transparent,
    borderColor: Colors.paleGrey,
    borderRadius: 11,
    borderStyle: "solid",
    borderWidth: 1,
    height: verticalScale(32),
    paddingHorizontal: verticalScale(10),
    paddingVertical: scale(5),
    width: scale(64)
  },
  doneButtonLabel: {
    ...Layout.textFullCenter,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 13,
    fontWeight: "600",
    height: 19,
    width: scale(32)
  },
  genderPopupContainer: {
    ...Layout.alignCentered
  },
  genderRadioButtons: {
    justifyContent: "space-evenly"
  },
  inputContainer: {
    marginLeft: Metrics.margin2x + 5,
    marginRight: Metrics.margin - 2,
    marginVertical: Metrics.margin
  },
  leaveButton: {
    ...Layout.alignCentered,
    backgroundColor: Colors.burgundy,
    borderRadius: 20,
    height: verticalScale(38),
    marginTop: verticalScale(25),
    width: scale(216)
  },
  leaveLabel: {
    ...Layout.textFullCenter,
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500"
  },
  modalContainer: {
    ...Layout.containerCentered,
    backgroundColor: Colors.eggplantA430
  },
  modalDialog: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderRadius: 15,
    height: 232,
    padding: Metrics.margin2x,
    shadowColor: "rgba(0, 0, 0, 0.16)",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    width: 264
  },
  modalText: {
    color: Colors.darkGrey,
    fontFamily: "Roboto",
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "normal",
    height: 36,
    marginTop: 10,
    textAlign: "center",
    width: 216
  },
  modalTitle: {
    color: Colors.onyx,
    fontFamily: "Roboto",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 24,
    textAlign: "left",
    width: 218
  },
  privateFormContainer: {},
  publicFormContainer: {
    backgroundColor: Colors.snow,
    width: Metrics.DEVICE_WIDTH
  },
  saveChangesButton: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 20,
    borderWidth: 1,
    height: verticalScale(38),
    marginTop: verticalScale(17),
    width: scale(216)
  },
  saveChangesLabel: {
    ...Layout.textFullCenter,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500"
  },
  sectionDivider: {
    ...Layout.alignCentered,
    backgroundColor: Colors.paleGrey,
    height: Metrics.margin,
    marginHorizontal: scale(15),
    marginTop: verticalScale(10),
    width: Metrics.DEVICE_WIDTH
  },
  title: {
    ...Layout.textFullCenter,
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 18
  }
});
