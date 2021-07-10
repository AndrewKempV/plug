import React, { Component } from "react";
import { Box, TouchableBox } from "app/components/Box";
import { Header } from "react-native-elements";
import { DoneButton } from "app/components/Button";
import { Colors } from "app/config/styles";
import { Heading, Label } from "app/components/Typography";
import TagInput from "../../components/TagInput";
import { EventDetailModel } from "api/profile";
import {
  Platform,
  TextInputProps,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
  ScrollView,
  StatusBar,
  Switch
} from "react-native";
import { ThemeContext } from "app/theme";
import Color from "color";
import { Spacing } from "app/components";
import { Divider } from "app/components/Divider";
import { EditableCarousel } from "../../components/EditableCarousel";
import InputScrollView from "react-native-input-scroll-view";
import ParsedText from "react-native-parsed-text";
import NavigationService from "app/utils/NavigationService";
import { NavigationEvents } from "react-navigation";
import strings from "./strings";
import { TextInput } from "components/Input/ThemedInput";
import Entypo from "react-native-vector-icons/Entypo";
import { State } from "components/Helpers/State";
import { CroppedImage } from "app/components/AvatarEditor/AvatarEditor";
import { ListItem } from "react-native-elements";
import { EventDateForm } from "../../components/EventDateForm";
import { PackageForm } from "../../components/PackageForm";
import { LocationForm } from "../../components/LocationForm";
import { PackageList } from "../../components/TicketList";
import ImagePicker, { Image, Options } from "react-native-image-crop-picker";
import { EventService } from "api/eventService";
import { TextStyle } from "react-native";
import { getHome } from "app/utils/storage";
import { BoundedLocation } from "app/models/Location";
import { EventPackage, SelectableTag } from "../../types";
import { CategoryMenu } from "../../components/CategoryMenu";
import { TagEditorSheet } from "../../components/TagEditorSheet";
import FontAwesome from "react-native-vector-icons/AntDesign";
import moment from "moment";
type EditorMode =
  | "none"
  | "date-time"
  | "location"
  | "categories"
  | "ambiance"
  | "music"
  | "ticket";

export interface EventDateTimeFields {
  from?: Date;
  to?: Date;
  frequency: string;
}
interface EditableFields {
  title: string;
  about: string;
  location: string;
  isPrivate: boolean;
}
const createImageDescriptor = (image: Image) => {
  return {
    uri: `data:${image.mime};base64,` + image.data,
    width: image.width,
    height: image.height,
    type: image.mime,
    fileName: image.filename
  };
};

type State = {
  tags: string[];
  text: string;
  horizontalTags: string[];
  horizontalText: string;
  canCreate: boolean;
  photos: CroppedImage[];
  fields: EditableFields & EventDateTimeFields;
  packages: EventPackage[];
  location: BoundedLocation;
  complete?: boolean;
  mode: EditorMode;
  home: BoundedLocation;
  categories: string[];
  selectedCategory: string;
  music: SelectableTag[];
  ambiance: SelectableTag[];
  eventData: EventDetailModel;
};

type Props = {};

export class CreateEventScreen extends Component<Props, State> {

  eventService: EventService = new EventService();
  horizontalTagInput: TagInput<string> | null = null;

  state: State = {
    tags: [],
    packages: [],
    text: "",
    horizontalTags: [],
    horizontalText: "",
    canCreate: false,
    photos: [{ width: 0, height: 0, uri: "" }],
    fields: {
      title: "",
      about: "",
      location: "",
      frequency: "",
      isPrivate: false
    },
    complete: false,
    mode: "none",
    location: {},
    home: {},
    categories: [],
    selectedCategory: '',
    music: [],
    ambiance: [],
    eventData: {}
  };

  componentDidMount = async () => {
    const categories = await this.eventService.getCategories({
      limit: 100,
      offset: 0
    });
    const response = await this.eventService.getAmbiances({
      category: categories[0] || "",
      limit: 100,
      offset: 0
    });
    this.setState({ categories });
    this.setState({
      ambiance: response.map<SelectableTag>(a => ({
        title: a,
        selected: false
      }))
    });

    const music = await this.eventService.getMusic({ limit: 100, offset: 0 });

    this.setState({
      music: music.map<SelectableTag>(m => ({
        title: m,
        selected: false
      }))
    });
  };

  changeCategory = async (category: string) => {
    const categoryAmbiance = await this.eventService.getAmbiances({
      category,
      limit: 100,
      offset: 0
    });
    this.setState({
      ambiance: categoryAmbiance.map<SelectableTag>(title => ({
        title,
        selected: false
      }))
    });
  };

  selectCategory = (selected: string) => {
    this.setState(
      prev => ({
        selectedCategory: selected
      }),
      () => this.changeCategory(selected)
    );
  };

  labelExtractor = (tag: string) => tag;

  onChangeTags = (horizontalTags: string[]) => {
    this.setState({ horizontalTags });
  };

  onChangeTagInput = (horizontalText: string) => {
    this.setState({ horizontalText });

    const lastTyped = horizontalText.charAt(horizontalText.length - 1);
    const parseWhen = [",", " ", ";", "\n"];

    if (parseWhen.indexOf(lastTyped) > -1 && horizontalText.length > 0) {
      this.setState({
        horizontalTags: [
          ...this.state.horizontalTags,
          `#${this.state.horizontalText}`
        ],
        horizontalText: ""
      });
    }
  };

  onRemoveImage = (image: CroppedImage) => {
    const { photos } = this.state;
    const idx = photos.findIndex(i => i.uri === image.uri);
    const start = photos.slice(0, idx);
    const end = photos.slice(idx + 1);
    this.setState({
      photos: start.concat(end)
    });
  };

  onAddImage = (image: CroppedImage) => {
    this.setState(prev => ({
      photos: [
        ...prev.photos.slice(0, prev.photos.length),
        prev.photos[prev.photos.length],
        image
      ]
    }));
  };

  openEditor = (mode: EditorMode) => {
    this.setState({ mode });
  };

  closeEditor = () => {
    this.openEditor("none");
  };

  addPhotos = (data: Image | Image[]) => {
    if (Array.isArray(data)) {
      const images = data.map((image) => createImageDescriptor(image));
      this.setState(prev => {
        const { photos } = prev;
        const count = photos.length;
        const old = photos.slice(0, count - 1);
        return {
          photos: [...old, ...images, prev.photos[count - 1]]
        };
      });
    } else {
      const image: CroppedImage = {
        uri: `data:${data.mime};base64,` + data.data,
        width: data.width,
        height: data.height,
        type: data.mime,
        fileName: data.filename
      };
      this.setState(prev => {
        const { photos } = prev;
        const count = photos.length;
        const old = photos.slice(0, count - 1);
        return {
          photos: [...old, image, prev.photos[count - 1]]
        };
      });
    }
  };

  pickPhotos = async () => {
    const selected = (await ImagePicker.openPicker(pickerOptions)) as
      | Image
      | Image[];
    return selected;
  };

  createEvent = async () => {
    const {
      fields: { title, about, from, to, location, isPrivate, frequency },
      location: { geolocation, city, state, street, zip },
      music,
      ambiance,
      horizontalTags,
      packages,
      photos,
      categories,
      selectedCategory
    } = this.state;
    const result = await this.eventService.createEvent(
      photos.slice(0, photos.length - 1),
      {
        recurrence: [frequency],
        eventName: title,
        eventDescription: about,
        eventStartTime: moment(from).format("YYYY-MM-DD HH:mm:ss"),
        eventEndTime: moment(to).format("YYYY-MM-DD HH:mm:ss"),
        venueName: location,
        state, 
        city,
        address: street,
        latitude: geolocation?.latitude?.toString(),
        longitude: geolocation?.longitude?.toString(),
        packages,
        tags: horizontalTags,
        music: music.filter(x => x.selected).map(x=> x.title),
        ambience: ambiance.filter(x => x.selected).map(x => x.title),
        category: selectedCategory,
        zipCode: zip,
        privateEvent: isPrivate
      }
    );
    console.log(result);
  };

  handleCreateEvent = () => {
    const goBack = () => NavigationService.goBack();
    this.createEvent()
      .then(goBack)
      .catch(goBack);
  }

  changeAbout = (about: string) => {
    this.setState({
      fields: { ...this.state.fields, about }
    });
  };

  changeFields = (fields: EventDateTimeFields) => {
    this.setState(prev => ({
      fields: { ...prev.fields, ...fields }
    }));
  };

  changeTitle = (title: string) => {
    this.setState({
      fields: { ...this.state.fields, title }
    });
  };

  changeLocation = (venueName: string, location: BoundedLocation) => {
    this.setState(prev => ({
      ...prev,
      fields: { ...prev.fields, location: venueName },
      location
    }));
  };

  changeSelectedMusic = (tags: SelectableTag[]) => {
    this.setState(() => ({
      music: [...tags]
    }));
  };

  changeSelectedAmbiance = (tags: SelectableTag[]) => {
    this.setState(() => ({
      ambiance: [...tags]
    }));
  };

  changePackages = (packages: EventPackage[]) => {
    this.setState({ packages });
  };

  runPickerFlow = () => {
    this.pickPhotos()
      .then(this.addPhotos)
      .catch(console.log);
  };

  // runCropperFlow = async(photo: CroppedImage, index: number) => {
  //   const cropped = await ImagePicker.openCropper({
  //     ...cropperOptions,
  //     path: photo.path
  //   });
  //   this.state.photos[index] = cropped;
  // }

  refresh = () => {
    getHome().then(home => {
      if (home) {
        this.setState({ home });
      }
    });
  };

  canSubmit = () => {
    return (
      this.state.photos.length > 0 &&
      this.state.fields.title.length > 0 &&
      this.state.fields.from !== undefined &&
      this.state.fields.to !== undefined &&
      this.state.fields.location.length > 0 && 
      this.state.packages.length > 0
    );
  }

  render() {
    const Chevron = () => (
      <Box justifyContent={"center"} alignItems={"center"}>
        <Entypo
          name={"chevron-thin-down"}
          size={15}
          color={Colors.onyx}
          // style={styles.chevron}
        />
      </Box>
    );
    const canSubmit = this.canSubmit();
    return (
      <ThemeContext.Consumer>
        {theme => {
          const inputStyle: StyleProp<TextStyle> = {
            ...textInputStyle,
            ...theme.headingSizes.h3,
            ...{ fontWeight: "600" }
          };
          return (
            <Box flex={1}>
              <Header
                backgroundColor={Colors.burgundy}
                leftComponent={
                  <Heading
                    style={{ marginLeft: 4 }}
                    onPress={() => NavigationService.goBack()}
                    size={"h4"}
                    weight={"normal"}
                    color={Colors.iceBlue}
                  >
                    {strings.cancel}
                  </Heading>
                }
                centerComponent={
                  <Heading
                    size={"h3"}
                    align={"center"}
                    color={Colors.snow}
                    weight={"500"}
                  >
                    {strings.screenTitle}
                  </Heading>
                }
                rightComponent={
                  <DoneButton
                    active={canSubmit}
                    color={
                      canSubmit
                        ? Colors.iceBlue
                        : Color(Colors.iceBlue)
                            .alpha(0.29)
                            .toString()
                    }
                    onPress={this.handleCreateEvent}
                  />
                }
              />

              <InputScrollView
                keyboardShouldPersistTaps={"always"}
                
                contentContainerStyle={{ paddingBottom: 80 }}
              >
                <Box
                  height={216}
                  backgroundColor={Colors.iceBlue}
                  paddingTop={theme.spacing.small}
                  paddingBottom={theme.spacing.small}
                >
                  <EditableCarousel
                    images={this.state.photos}
                    onRemove={this.onRemoveImage}
                    onImageSelected={this.onAddImage}
                    onPressAdd={this.runPickerFlow}
                  />
                </Box>
                <Divider size={12} color={Colors.snow} />
                <Box
                  flexDirection={"row"}
                  paddingHorizontal={theme.layout.gutterWidth}
                  marginBottom={theme.spacing.xlarge}
                >
                  <ParsedText
                    style={{
                      ...theme.headingSizes.h5,
                      ...{ lineHeight: 14 }
                    }}
                    childrenProps={{ allowFontScaling: false }}
                    parse={[
                      {
                        pattern: /Photos: (\d+)\/(\d+)/,
                        style: {
                          ...theme.headingSizes.h5,
                          ...{ fontWeight: "bold", lineHeight: 14 }
                        }
                      }
                    ]}
                  >
                    {`${strings.photos}: ${this.state.photos.length - 1}/10 ${
                      strings.photoCta
                    }`}
                  </ParsedText>
                </Box>
                <Box paddingHorizontal={theme.layout.gutterWidth}>
                  <Label label={strings.titleInputLabel}>
                    <TextInput
                      size={"small"}
                      style={inputStyle}
                      placeholder={strings.titleInputPlaceholder}
                      value={this.state.fields.title}
                      onValueChange={this.changeTitle}
                      multiline={true}
                    />
                  </Label>
                </Box>
                <Box
                  paddingHorizontal={theme.layout.gutterWidth}
                  marginTop={theme.spacing.medium}
                  marginBottom={theme.spacing.small}
                >
                  <Label label={strings.aboutInputLabel}>
                    <TextInput
                      size={"small"}
                      style={inputStyle}
                      placeholder={strings.aboutInputPlaceholder}
                      value={this.state.fields.about}
                      onValueChange={this.changeAbout}
                      multiline={true}
                    />
                  </Label>
                </Box>
                <Divider size={8} color={Colors.iceBlue} />
                <Box
                  paddingHorizontal={theme.layout.gutterWidth}
                  marginTop={theme.spacing.medium}
                >
                  <Label label={strings.dateTimeInputLabel}>
                    <TextInput
                      size={"small"}
                      style={{
                        ...inputStyle,
                        // ...{ textAlignVertical: "center", lineHeight: 0 }
                      }}
                      placeholder={strings.dateTimeInputPlaceholder}
                      value={
                        this.state.fields.from
                          ? moment(this.state.fields.from).calendar()
                          : ""
                      }
                      onFocus={() => this.openEditor("date-time")}
                    />
                  </Label>
                </Box>
                <Box
                  paddingHorizontal={theme.layout.gutterWidth}
                  marginTop={theme.spacing.medium}
                  marginBottom={theme.spacing.small}
                >
                  <Label label={strings.locationInputLabel}>
                    <TextInput
                      size={"small"}
                      style={{
                        ...inputStyle,
                        // ...{ textAlignVertical: "center", lineHeight: 0 }
                      }}
                      placeholder={strings.locationInputPlaceholder}
                      value={this.state.fields.location}
                      onFocus={() => this.openEditor("location")}
                    />
                  </Label>
                </Box>
                <Divider size={8} color={Colors.iceBlue} />
                <TouchableBox
                  height={48}
                  spaceHorizontal={theme.layout.gutterWidth}
                  spaceTop={"medium"}
                  onPress={() => this.openEditor("ticket")}
                >
                  <ListItem
                    containerStyle={{ padding: 0, borderColor: "transparent" }}
                    title={strings.createTicket}
                    titleStyle={{ paddingBottom: 0, ...{ fontSize: 15 } }}
                    chevron={{ size: 15, color: Colors.battleShipGrey }}
                  />
                </TouchableBox>
                <Box
                  spaceHorizontal={theme.layout.gutterWidth}
                  spaceBottom={this.state.packages.length > 0 ? "medium" : "xsmall"}
                >
                  <PackageList packages={this.state.packages} />
                </Box>
                <Divider size={8} color={Colors.iceBlue} />
                <Box spaceVertical={"small"}>
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{ height: 44, alignItems: "center" }}
                    showsHorizontalScrollIndicator={false}
                  >
                    <TouchableBox
                      key={"open-category-menu"}
                      flexDirection={"row"}
                      shape={"ellipticalPill"}
                      borderColor={
                        !this.state.selectedCategory
                          ? Colors.lightBlueGrey
                          : Colors.lightBurgundy
                      }
                      backgroundColor={
                        !this.state.selectedCategory
                          ? Colors.snow
                          : Colors.veryLightPink
                      }
                      borderWidth={1}
                      spaceHorizontal={16}
                      spaceVertical={"xsmall"}
                      marginHorizontal={8}
                      justifyContent={"space-between"}
                      onPress={() => this.openEditor("categories")}
                    >
                      <Heading size={"h4"}>{"categories"}</Heading>
                      <Spacing size={10} orientation={"horizontal"} />
                      <Chevron />
                    </TouchableBox>
                    <TouchableBox
                      key={"open-ambiance-menu"}
                      flexDirection={"row"}
                      shape={"ellipticalPill"}
                      borderColor={
                        !this.state.ambiance.some(tag => tag.selected)
                          ? Colors.lightBlueGrey
                          : Colors.lightBurgundy
                      }
                      backgroundColor={
                        !this.state.ambiance.some(tag => tag.selected)
                          ? Colors.snow
                          : Colors.veryLightPink
                      }
                      borderWidth={1}
                      spaceHorizontal={16}
                      spaceVertical={"xsmall"}
                      marginHorizontal={8}
                      justifyContent={"space-between"}
                      onPress={() => this.openEditor("ambiance")}
                    >
                      <Heading size={"h4"}>{"ambiance"}</Heading>
                      <Spacing size={10} orientation={"horizontal"} />
                      <Chevron />
                    </TouchableBox>
                    <TouchableBox
                      key={"open-music-menu"}
                      flexDirection={"row"}
                      shape={"ellipticalPill"}
                      borderColor={
                        !this.state.music.some(tag => tag.selected)
                          ? Colors.lightBlueGrey
                          : Colors.lightBurgundy
                      }
                      backgroundColor={
                        !this.state.music.some(tag => tag.selected)
                          ? Colors.snow
                          : Colors.veryLightPink
                      }
                      borderWidth={1}
                      spaceHorizontal={16}
                      spaceVertical={"xsmall"}
                      marginHorizontal={8}
                      justifyContent={"space-between"}
                      onPress={() => this.openEditor("music")}
                    >
                      <Heading size={"h4"}>{"music"}</Heading>
                      <Spacing size={10} orientation={"horizontal"} />
                      <Chevron />
                    </TouchableBox>
                  </ScrollView>
                </Box>
                <Divider size={8} color={Colors.iceBlue} />
                <Box
                  flexDirection={"column"}
                  height={77}
                  maxHeight={77}
                  paddingVertical={5}
                  paddingHorizontal={theme.layout.gutterWidth}
                >
                  <Label label={strings.tagsInputLabel} position={"left"} />
                  <TagInput
                    ref={horizontalTagInput => {
                      this.horizontalTagInput = horizontalTagInput!;
                    }}
                    value={this.state.horizontalTags}
                    onChange={this.onChangeTags}
                    labelExtractor={this.labelExtractor}
                    text={this.state.horizontalText}
                    onChangeText={this.onChangeTagInput}
                    tagColor={Color(Colors.burgundy)
                      .alpha(0.1)
                      .toString()}
                    tagTextColor={theme.colors.text.primary}
                    tagContainerStyle={tagContainerStyle}
                    inputProps={{
                      ...horizontalInputProps,
                      placeholder:
                        this.state.horizontalTags.length === 0
                          ? strings.tagsInputPlaceholder
                          : "",
                      ...theme.headingSizes.h3
                    }}
                    inputDefaultWidth={300}
                    maxHeight={70}
                    scrollViewProps={horizontalScrollViewProps}
                  />
                </Box>
                <Divider size={8} color={Colors.iceBlue} />
                <Box paddingHorizontal={theme.layout.gutterWidth} flexDirection={"row"} spaceTop={"medium"} justifyContent={"space-between"} alignItems={"center"}>
                  <Box>
                    <Box flexDirection={"row"}>
                      <Heading size={"h4"}>
                        {"Private event"}
                      </Heading>
                      <Spacing orientation={"horizontal"} size={8}/>
                      <FontAwesome name={"questioncircle"} size={15} color={Colors.charcoalGrey}/>
                    </Box>
                    <Heading size={"h5"} color={Colors.charcoalGrey}>
                      {"Only invited guests will see your event"}
                    </Heading>
                  </Box>
                  <Box justifyContent={"center"}>
                    <Switch
                      style={{ height: 24, width: 44 }}
                      onTintColor={Colors.purplishRed}
                      value={this.state.fields.isPrivate}
                      // ios_backgroundColor={Colors.iceBlue}
                      onValueChange={isPrivate =>
                        this.setState({
                          fields: { ...this.state.fields, isPrivate }
                        })
                      }
                    />
                  </Box>
                </Box>
         
              </InputScrollView>
              <EventDateForm
                visible={this.state.mode === "date-time"}
                onClose={this.closeEditor}
                onSubmit={this.changeFields}
              />
              <PackageForm
                visible={this.state.mode === "ticket"}
                onClose={this.closeEditor}
                onSubmit={this.changePackages}
              />
              <LocationForm
                visible={this.state.mode === "location"}
                onClose={this.closeEditor}
                homeLocation={this.state.home}
                onSubmit={this.changeLocation}
              />
              <CategoryMenu
                visible={this.state.mode === "categories"}
                categories={this.state.categories}
                selected={this.state.selectedCategory}
                onClose={this.closeEditor}
                onChange={this.selectCategory}
              />
              <TagEditorSheet
                visible={this.state.mode === "ambiance"}
                title={"Ambiance"}
                tags={this.state.ambiance}
                onClose={this.closeEditor}
                onChange={this.changeSelectedAmbiance}
              />
              <TagEditorSheet
                visible={this.state.mode === "music"}
                title={"Music"}
                tags={this.state.music}
                onClose={this.closeEditor}
                onChange={this.changeSelectedMusic}
              />
              <NavigationEvents
                onDidFocus={() => StatusBar.setBarStyle("light-content", true)}
              />
            </Box>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const CARD_WIDTH = 247;
const CROPPED_IMAGE_HEIGHT = 180;
const CROPPED_IMAGE_WIDTH = 320;
const pickerOptions: Options = {
  mediaType: "image",
  width: CROPPED_IMAGE_WIDTH,
  height: CROPPED_IMAGE_HEIGHT,
  cropping: true,
  cropperCircleOverlay: false,
  includeBase64: true,
  includeExif: true,
  avoidEmptySpaceAroundImage: true,
  freeStyleCropEnabled: true,
  // multiple: true,
  // maxFiles: 10,
};

const cropperOptions: Options = {
  mediaType: "image",
  width: CROPPED_IMAGE_WIDTH,
  height: CROPPED_IMAGE_WIDTH,
  cropping: true,
  cropperCircleOverlay: false,
  includeBase64: true,
  includeExif: true,
  avoidEmptySpaceAroundImage: true,
  freeStyleCropEnabled: true,
}

const textInputStyle = {
  borderBottomWidth: 1,
  borderBottomColor: Colors.iceBlue,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderTopWidth: 0
};

const tagContainerStyle: StyleProp<ViewStyle> = {
  alignItems: "center",
  justifyContent: "center",
  margin: 0,
  paddingHorizontal: 3,
  padding: 0,
  height: 24,
  minWidth: 40,
  borderRadius: 12
};

const horizontalInputProps: TextInputProps = {
  keyboardType: "default",
  returnKeyType: "default",
  placeholder: strings.tagsInputPlaceholder,
  style: {
    marginVertical: Platform.OS == "ios" ? 10 : 10,
    height: 24,
    width: "100%",
    lineHeight: 0
  }
};

const horizontalScrollViewProps: ScrollViewProps = {
  horizontal: true,
  showsHorizontalScrollIndicator: false
};

export default CreateEventScreen;
