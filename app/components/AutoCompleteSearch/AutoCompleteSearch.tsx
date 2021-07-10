import _ from "lodash";
import { List } from "native-base";
import React, { createRef, RefObject } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  GeolocationReturnType,
  Image,
  Keyboard,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  StatusBar,
  StyleProp,
  Text,
  TextInputFocusEventData,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { ListItem } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import Permissions from "react-native-permissions";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Rect } from "react-native-svg";
import { NavigationScreenProps } from "react-navigation";
import Images from "../../assets/images";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors, Layout } from "../../config/styles";
import Theme from "../../config/Theme";
import strings from "../../features/authentication/screens/Location/strings";
import { delay } from "../../utils/helpers";
import {
  MapboxLocation,
  MapboxLocationResponse,
  MapboxService
} from "../../utils/MapboxService";
import { checkLocationPermission } from "../../utils/permissions";
import storage, { setHome } from "../../utils/storage";
import ContentLoader from "../ContentLoader";
import { HairlineSeparator } from "../HairlineSeperator";
import SearchBar from "../SearchBar/SearchBar";
import { MapboxAutoComplete } from "./MapboxAutoComplete";
import styles from "./styles";
import { mapboxToLocation } from "../../features/location/actions";
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const EXPANDED_SEARCH_BAR_HEIGHT_OFFSET = verticalScale(140);
const COLLAPSED_SEARCH_BAR_HEIGHT_OFFSET = verticalScale(60);
const EXPANDED_HEADER_HEIGHT_OFFSET = verticalScale(0);
const COLLAPSED_HEADER_HEIGHT_OFFSET = verticalScale(-52.8);
const EXPANDED_SUBHEADER_HEIGHT_OFFSET = verticalScale(20);
const COLLAPSED_SUBHEADER_HEIGHT_OFFSET = verticalScale(-47);
const EXPANDED_SEPARATOR_HEIGHT_OFFSET = verticalScale(-20);
const COLLAPSED_SEPARATOR_HEIGHT_OFFSET = verticalScale(52.8);
const EXPANDED_LIST_CONTAINER_HEIGHT_OFFSET = verticalScale(250);
const COLLAPSED_LIST_CONTAINER_HEIGHT_OFFSET = verticalScale(175);
const EXPANDED_HEADER_TEXT_OPACITY = 1;
const COLLAPSED_HEADER_TEXT_OPACITY = 0;

const AnimationConfig = {
  duration: 500,
  easing: Easing.out(Easing.quad)
} as Animated.TimingAnimationConfig;
const SecondAnimationConfig = {
  duration: 500,
  easing: Easing.out(Easing.linear)
} as Animated.TimingAnimationConfig;
type MapboxQuerySource = "SearchInput" | "LocationAPI";

interface AutoCompleteInputProps {
  onFocus?: (event?: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: () => void;
  placeholder?: string;
  inputStyle?: StyleProp<TextStyle>;
  scrollViewStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  NavBar?: JSX.Element | null;
}

interface AutoCompleteInputState {
  searchBarFocused: boolean;
  location: GeolocationReturnType;
  suggested: MapboxLocation[] | null;
  isNavBarShowing: boolean;
  mode: MapboxQuerySource;
  isLoading: boolean;
}

const initialState = {
  searchBarFocused: false,
  isNavBarShowing: true,
  location: {
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      accuracy: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0
    },
    timestamp: 0
  },
  suggested: null,
  mode: "SearchInput" as MapboxQuerySource,
  isLoading: false
};

const MapboxApiKey =
  "pk.eyJ1IjoicGx1Z2duYXRpb24iLCJhIjoiY2p0d2VqejN3Mjc2czQ0bnN3bjB1YTRwaiJ9.PwsAg6FAogo51LeU3LZViw";
export default class AutoCompleteSearch extends React.Component<
  AutoCompleteInputProps & NavigationScreenProps,
  AutoCompleteInputState
> {
  public readonly state = initialState;

  public disabled: boolean = true;
  public homeLocationIndex: number = -1;
  private AnimatedSearchBarOffset: Animated.Value = new Animated.Value(
    EXPANDED_SEARCH_BAR_HEIGHT_OFFSET
  );
  private AnimatedHeaderOffset: Animated.Value = new Animated.Value(
    EXPANDED_HEADER_HEIGHT_OFFSET
  );
  private AnimatedSubHeaderOffset: Animated.Value = new Animated.Value(
    EXPANDED_SUBHEADER_HEIGHT_OFFSET
  );
  private AnimatedSeparatorOffset: Animated.Value = new Animated.Value(
    EXPANDED_SEPARATOR_HEIGHT_OFFSET
  );
  private AnimatedListContainerOffset: Animated.Value = new Animated.Value(
    EXPANDED_LIST_CONTAINER_HEIGHT_OFFSET
  );
  private AnimatedOpacity: Animated.Value = new Animated.Value(1);

  private SearchBarRef: RefObject<SearchBar> = createRef<SearchBar>();

  public renderNavBar = (): JSX.Element | null => {
    return (
      <View style={[{ zIndex: 1, alignItems: "center", alignSelf: "center" }]}>
        <Animated.Text
          style={[
            {
              fontSize: Fonts.size.input,
              fontFamily: Fonts.type.bold,
              color: Colors.snow,
              marginTop: verticalScale(Theme.Metrics.statusBarHeight),
              opacity: this.AnimatedOpacity
            }
          ]}
        >
          {strings.screenTitle}
        </Animated.Text>
        <Animated.Text
          style={[
            {
              fontSize: Fonts.size.h5,
              fontFamily: Fonts.type.bold,
              color: Colors.snow,
              marginTop: verticalScale(Theme.Metrics.margin2x),
              opacity: this.AnimatedOpacity
            }
          ]}
        >
          {strings.headerTitle}
        </Animated.Text>
        <Animated.Text
          style={[
            {
              fontSize: Fonts.size.input,
              fontFamily: Fonts.type.base,
              color: Colors.snow,
              opacity: this.AnimatedOpacity
            }
          ]}
        >
          {strings.headerSubtitle}
        </Animated.Text>
      </View>
    );
  };

  public RenderFoundLocations = (results: MapboxLocationResponse | null) => {
    if (_.isNil(results) || _.isEmpty(results)) {
      return (
        <View
          style={[Layout.horizontalLeftAlign, Layout.alignLeft, { zIndex: 1 }]}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.type.bold,
              textAlign: "left",
              alignContent: "flex-start"
            }}
          >
            {this.state.location.coords.latitude !== 0 &&
            this.state.location.coords.longitude !== 0
              ? strings.suggestedLocations
              : strings.foundLocations}
          </Text>
        </View>
      );
    } else {
      return (
        <List
          contentContainerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}
        >
          <FlatList
            contentContainerStyle={{
              flex: 0.5,
              paddingBottom: verticalScale(100),
              paddingTop: verticalScale(20)
            }}
            data={results.features}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderListHeader}
            renderItem={this.renderItem}
          />
        </List>
      );
    }
  };
  public renderSeparator = () => {
    return (
      <View
        style={{
          alignSelf: "center",
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  public setHomeLocation = async (item: ListRenderItemInfo<MapboxLocation>) => {
    this.homeLocationIndex = item.index;
    storage.setHomeLocation(item.item);
    const result = await MapboxService.reverseGeocode({
      geolocation: {
        longitude: item.item.center[0],
        latitude: item.item.center[1]
      },
      types: ["place", "postcode", "address"]
    });
    const home = mapboxToLocation(result.predictions);
    console.log(home);
    if (home) {
      await setHome(home);
    }
  };

  public renderItem = (item: ListRenderItemInfo<MapboxLocation>) => (
    <ListItem
      containerStyle={{ marginLeft: 0, paddingRight: 0, paddingLeft: 0 }}
      onPress={async () => {
        await this.setHomeLocation(item);
        await delay(500);
        this.props.navigation.navigate("Home");
      }}
      key={item.index}
      checkmark={{
        size: Metrics.icons.xsmall,
        name: "md-checkmark",
        color: Colors.darkBurgundy,
        type: "ionicon",
        disabled: item.index !== this.homeLocationIndex,
        disabledStyle: {
          width: 0,
          height: 0,
          backgroundColor: Colors.transparent
        }
      }}
      title={
        <Text
          style={{
            fontSize: 13,
            fontFamily: Fonts.type.medium,
            textAlign: "left"
          }}
        >
          {item.item.text}
        </Text>
      }
      subtitle={
        !_.isNil(item.item) && !_.isNil(item.item.context) ? (
          <Text
            style={{
              fontSize: 11,
              fontFamily: Fonts.type.light,
              textAlign: "left"
            }}
          >
            {item.item
              .context!.map(v => v.text)
              .reduce((acc, value) => acc + ", " + value)}
          </Text>
        ) : (
          undefined
        )
      }
    />
  );
  public renderListHeader = (isListEmpty: boolean) => {
    return (
      <View
        style={[
          Layout.horizontalLeftAlign,
          Layout.alignLeft,
          { marginTop: verticalScale(20), zIndex: 1 }
        ]}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.type.medium,
            textAlign: "left",
            alignContent: "flex-start"
          }}
        >
          {!isListEmpty
            ? !_.isNil(this.state.suggested) &&
              (this.state.location.coords.latitude !== 0 &&
                this.state.location.coords.longitude !== 0)
              ? strings.foundLocations
              : strings.foundLocations
            : ""}
        </Text>
      </View>
    );
  };

  public renderSkeleton = () => {
    return (
      <View>
        <ContentLoader
          primaryColor="#eeeeee"
          secondaryColor="#dddddd"
          height={500}
        >
          <Rect
            x={Metrics.margin + 5}
            y="100"
            rx="3"
            ry="3"
            width="200"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="120"
            rx="3"
            ry="3"
            width="360"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="150"
            rx="3"
            ry="3"
            width="200"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="170"
            rx="3"
            ry="3"
            width="360"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="200"
            rx="3"
            ry="3"
            width="200"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="220"
            rx="3"
            ry="3"
            width="360"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="250"
            rx="3"
            ry="3"
            width="200"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="270"
            rx="3"
            ry="3"
            width="360"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="300"
            rx="3"
            ry="3"
            width="200"
            height="10"
          />
          <Rect
            x={Metrics.margin + 5}
            y="320"
            rx="3"
            ry="3"
            width="360"
            height="10"
          />
        </ContentLoader>
      </View>
    );
  };

  public onFocus = async () => {
    // console.log(this.animatedHeaderScale);
    await new Promise((resolve: () => void) => {
      this.setState({ isNavBarShowing: false });
      Animated.parallel(
        [
          Animated.timing(this.AnimatedSearchBarOffset, {
            toValue: COLLAPSED_SEARCH_BAR_HEIGHT_OFFSET,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedHeaderOffset, {
            toValue: COLLAPSED_HEADER_HEIGHT_OFFSET,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedSubHeaderOffset, {
            toValue: COLLAPSED_SUBHEADER_HEIGHT_OFFSET,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedSeparatorOffset, {
            toValue: COLLAPSED_SEPARATOR_HEIGHT_OFFSET,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedOpacity, {
            toValue: COLLAPSED_HEADER_TEXT_OPACITY,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedListContainerOffset, {
            toValue: COLLAPSED_LIST_CONTAINER_HEIGHT_OFFSET,
            ...AnimationConfig
          })
        ],
        { stopTogether: false }
      ).start(() => {
        this.setState({
          searchBarFocused: true,
          mode: "SearchInput",
          suggested: null
        });
        resolve();
      });
    });
    // console.log(this.animatedHeaderScale);
  };

  public onCancel = async () => {
    // console.log(this.animatedHeaderScale);
    await new Promise((resolve: () => void) => {
      this.homeLocationIndex = -1;
      this.setState({ isNavBarShowing: true });
      Animated.parallel(
        [
          Animated.timing(this.AnimatedSearchBarOffset, {
            toValue: EXPANDED_SEARCH_BAR_HEIGHT_OFFSET,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedHeaderOffset, {
            toValue: EXPANDED_HEADER_HEIGHT_OFFSET,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedSubHeaderOffset, {
            toValue: EXPANDED_SUBHEADER_HEIGHT_OFFSET,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedSeparatorOffset, {
            toValue: EXPANDED_SEPARATOR_HEIGHT_OFFSET,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedOpacity, {
            toValue: EXPANDED_HEADER_TEXT_OPACITY,
            ...AnimationConfig
          }),
          Animated.timing(this.AnimatedListContainerOffset, {
            toValue: EXPANDED_LIST_CONTAINER_HEIGHT_OFFSET,
            ...AnimationConfig
          })
        ],
        { stopTogether: false }
      ).start(() => {
        this.setState({ searchBarFocused: false, mode: "LocationAPI" });
        Keyboard.dismiss();
        resolve();
      });
    });
  };

  public findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ location: position });
        this.queryMapbox();

        // this.LoadingAnimationRef.current!.play()
      },
      // tslint:disable-next-line:no-console
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  public queryMapbox = async () => {
    const { latitude, longitude } = this.state.location.coords;
    if (latitude !== 0 && longitude !== 0) {
      try {
        const result = await MapboxService.reverseGeocode({
          geolocation: { latitude, longitude },
          types: ["place"]
        });
        console.log(result);
        this.setState({
          suggested: result.predictions.features,
          isLoading: false
        });
        // if(result.predictions.features.length > 0) {
        //   const { features } = result.predictions;
        //   const place = filterMapboxFeature(features, 'place');
        //   // const zip = filterMapboxFeature(features, 'postcode');
        //   // const address = filterMapboxFeature(features, 'address');

        //   this.setState({ suggested: place, isLoading: false });

        //   const location = MapboxToLocation(result.predictions);
        //   if(location) {
        //     await setHome(location);
        //   }

        // }
      } catch (error) {
        console.log(error);
      }
    } else {
      return null;
    }
  };

  public findCurrentLocation = () => {
    this.setState({ isLoading: true });
    this.SearchBarRef.current!.collapse()
      .then(this.SearchBarRef.current!.onCollapseDone)
      .then(this.onCancel)
      .then(() => {
        this.setState({ mode: "LocationAPI" });
        this.findCoordinates();
      })
      // tslint:disable-next-line:no-console
      .catch(error => console.error(error));
  };

  public handlePressCurrentLocation = async () => {
    try {
      const hasPermission = await checkLocationPermission();
      if (hasPermission) {
        this.findCurrentLocation();
      } else {
        this.handleLocationPermissionDenied();
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };

  public handleLocationPermissionDenied = () => {
    Alert.alert(
      "Turn on Location Services",
      "Open Settings\nTap Location\nSelect 'While using the App'",
      [
        {
          text: "Cancel",
          // tslint:disable-next-line:no-console
          onPress: () => console.log("Permission denied"),
          style: "cancel"
        },
        { text: "Open Settings", onPress: Permissions.openSettings }
      ]
    );
  };

  public render = () => {
    return (
      <View style={[Layout.container]}>
        <View style={[Layout.verticalTopLeft]}>
          <MapboxAutoComplete
            apiKey={MapboxApiKey}
            debounce={300}
            queryTypes={"address"}
          >
            {({
              handleTextChange,
              locationResults,
              clearSearch,
              isSearching
            }) => (
              <React.Fragment>
                <StatusBar
                  networkActivityIndicatorVisible={true}
                  hidden={false}
                  barStyle={"light-content"}
                  translucent={true}
                />
                <AnimatedLinearGradient
                  colors={[Colors.purplishRed, Colors.burgundy]}
                  style={[
                    {
                      top: this.AnimatedHeaderOffset,
                      height: verticalScale(158.8),
                      width: "100%",
                      zIndex: 1,
                      elevation: 10
                    }
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  {this.renderNavBar()}
                </AnimatedLinearGradient>
                <Animated.View
                  style={[
                    Layout.horizontalLeftAlign,
                    {
                      maxHeight: "8%",
                      zIndex: 1,
                      paddingTop: verticalScale(Metrics.margin2x),
                      top: this.AnimatedSubHeaderOffset,
                      left: scale(15)
                    }
                  ]}
                >
                  <View style={styles.currentLocationButton}>
                    <Image
                      style={styles.currentLocationButton}
                      source={Images.needle}
                    />
                  </View>
                  <Text
                    onPress={this.handlePressCurrentLocation}
                    style={{
                      fontFamily: Fonts.type.medium,
                      color: Colors.niceBlue,
                      left: scale(6)
                    }}
                  >
                    {strings.currentLocation}
                  </Text>
                </Animated.View>
                <Animated.View
                  style={{
                    zIndex: 2,
                    position: "absolute",
                    top: this.AnimatedSearchBarOffset,
                    left: scale(5),
                    right: scale(5),
                    maxWidth: Metrics.DEVICE_WIDTH - scale(5)
                  }}
                >
                  <SearchBar
                    ref={this.SearchBarRef}
                    onChangeText={handleTextChange}
                    onDelete={clearSearch}
                    beforeFocus={this.onFocus}
                    afterCancel={this.onCancel}
                    animationConfig={SecondAnimationConfig}
                  />
                </Animated.View>
                <Animated.View style={{ bottom: this.AnimatedSeparatorOffset }}>
                  <HairlineSeparator />
                </Animated.View>
                <Animated.View
                  style={{
                    position: "absolute",
                    top: this.AnimatedListContainerOffset,
                    zIndex: 2
                  }}
                >
                  <FlatList
                    stickyHeaderIndices={[0]}
                    style={{ marginLeft: scale(Metrics.margin + 5) }}
                    contentContainerStyle={{
                      width: Metrics.DEVICE_WIDTH - Metrics.DEVICE_WIDTH / 3
                    }}
                    keyExtractor={(item: any, index: number) =>
                      index.toString()
                    }
                    data={
                      !_.isNil(locationResults) ||
                      !_.isNil(this.state.suggested)
                        ? this.state.mode === "SearchInput"
                          ? locationResults!.features
                          : this.state.suggested
                        : []
                    }
                    ListHeaderComponent={() =>
                      this.renderListHeader(
                        _.isNil(locationResults) &&
                          _.isNil(this.state.suggested)
                      )
                    }
                    renderItem={this.renderItem}
                    scrollEnabled={false}
                  />

                  {/* {  
                        (!this.state.isLoading && this.state.mode === 'LocationAPI') || (!isSearching && this.state.mode === 'SearchInput') ?
                          <FlatList 
                            stickyHeaderIndices={[0]}
                            style={{marginLeft: Metrics.baseMargin + 5}}
                            contentContainerStyle={{width: Metrics.DEVICE_WIDTH - Metrics.DEVICE_WIDTH/3}}
                            keyExtractor={(item: any, index: number)=> index.toString()}
                            data={!_.isNil(locationResults) || !_.isNil(this.state.suggested) ? (this.state.mode === 'SearchInput' ? locationResults!.features : this.state.suggested): []}
                            ListHeaderComponent={this.renderListHeader} 
                            renderItem={this.renderItem}
                            scrollEnabled={false}
                          /> : 
                          this.renderSkeleton()
                      } */}
                </Animated.View>
              </React.Fragment>
            )}
          </MapboxAutoComplete>
        </View>
      </View>
    );
  };
}
