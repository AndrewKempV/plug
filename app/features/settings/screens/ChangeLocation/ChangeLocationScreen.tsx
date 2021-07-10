import _ from "lodash";
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
  StyleSheet,
  Text,
  TextInputFocusEventData,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { Divider, ListItem } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import Permissions from "react-native-permissions";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Rect } from "react-native-svg";
import {
  NavigationScreenProps,
  NavigationEvents,
  NavigationActions
} from "react-navigation";
import Images from "../../../../assets/images";
import { MapboxAutoComplete } from "../../../../components/AutoCompleteSearch/MapboxAutoComplete";
import { BackButton } from "../../../../components/Button";
import ContentLoader from "../../../../components/ContentLoader";
import { HairlineSeparator } from "../../../../components/HairlineSeperator";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import Fonts from "../../../../config/Fonts";
import Metrics from "../../../../config/metrics";
import { Colors, Layout } from "../../../../config/styles";
import Theme from "../../../../config/Theme";
import strings from "../../../../features/authentication/screens/Location/strings";
import { delay } from "../../../../utils/helpers";
import LayoutDebugger from "../../../../utils/LayoutDebugger";
import {
  MapboxLocation,
  MapboxLocationResponse,
  MapboxService
} from "../../../../utils/MapboxService";
import Storage from "../../../../utils/storage";
import styles from "./styles";
import { Location } from "../../../../features/location/reducer";
import locationActions from "../../../../features/location/actions";
import { connect } from "react-redux";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import { StateStore } from "../../../../store/AppReducer";
import { bindActionCreators, Dispatch } from "redux";
import NavigationService from "app/utils/NavigationService";
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

type MapboxQuerySource = "SearchInput" | "LocationAPI";

type StateFromDispatch = ReturnType<typeof mapStateToProps>;
type PropsFromDispatch = GetPropsFromDispatch<typeof locationActions>;

const mapStateToProps = (state: StateStore) => ({
  homeLocation: state.locationReducer.location
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<typeof locationActions, PropsFromDispatch>(
    locationActions,
    dispatch
  );

interface AutoCompleteInputState {
  searchBarFocused: boolean;
  location: GeolocationReturnType;
  suggested: MapboxLocation[] | null;
  isNavBarShowing: boolean;
  mode: MapboxQuerySource;
  isLoading: boolean;
  homeLocation: MapboxLocation | null;
  localLocation: Location | null;
}

const initialState: AutoCompleteInputState = {
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
  isLoading: false,
  homeLocation: null,
  localLocation: null
};

const MapboxApiKey =
  "pk.eyJ1IjoicGx1Z2duYXRpb24iLCJhIjoiY2p0d2VqejN3Mjc2czQ0bnN3bjB1YTRwaiJ9.PwsAg6FAogo51LeU3LZViw";
class ChangeLocationScreen extends React.Component<
  NavigationScreenProps & StateFromDispatch & PropsFromDispatch,
  AutoCompleteInputState
> {
  public static navigationOptions = () => {
    return {
      headerLeft: null,
      header: null
    };
  };

  public readonly state = initialState;

  public disabled: boolean = true;
  public homeLocationIndex: number = -1;
  public homeLocation: string = "";

  private AnimatedOpacity: Animated.Value = new Animated.Value(1);

  private SearchBarRef: RefObject<SearchBar> = createRef<SearchBar>();
  private fromRoute: string = "";
  public componentDidMount() {
    this.fromRoute = this.props.navigation.getParam("fromRoute") as string;
    console.log(this.fromRoute);
    Storage.getHomeLocation()
      .then(location => {
        if (!_.isNil(location)) {
          this.setState({ homeLocation: location });
          console.log(location);
        }
      })
      .catch(error => error);
  }

  public renderNavBar = (): JSX.Element | null => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <BackButton
            color={Colors.snow}
            borderColor={Colors.snow}
            onPress={this.goBack}
            containerStyle={styles.backButtonContainer}
          />
          <Animated.Text
            style={[
              {
                fontSize: Fonts.size.input,
                fontFamily: Fonts.type.bold,
                color: Colors.snow,
                opacity: this.AnimatedOpacity
              }
            ]}
          >
            {strings.screenTitle}
          </Animated.Text>
          <Text style={styles.search} onPress={this.queryMapbox}>
            {"Search"}
          </Text>
        </View>
        <Animated.Text
          style={[
            {
              fontSize: Fonts.size.h5,
              fontFamily: Fonts.type.bold,
              color: Colors.snow,
              marginTop: verticalScale(Theme.Metrics.margin),
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

  public renderHomeLocation = () => {
    if (!_.isNil(this.state.homeLocation)) {
      return (
        <ListItem
          containerStyle={styles.listItemContainer}
          title={
            <Text style={styles.titleLabel}>
              {this.state.homeLocation.text}
            </Text>
          }
          subtitle={
            <Text style={styles.subTitleLabel}>{"Current location"}</Text>
          }
          checkmark={{
            size: Metrics.icons.small,
            name: "md-checkmark",
            color: Colors.darkBurgundy,
            type: "ionicon",
            containerStyle: styles.checkmark
          }}
        />
      );
    } else {
      return null;
    }
  };

  public setHomeLocation = (index: number, item: MapboxLocation) => {
    this.setState({ homeLocation: item });
    Storage.setHomeLocation(item);
  };

  public renderLocationItem = (item: ListRenderItemInfo<MapboxLocation>) => (
    <ListItem
      containerStyle={styles.listItemContainer}
      onPress={() => this.setHomeLocation(item.index, item.item)}
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
      title={<Text style={styles.titleLabel}>{item.item.text}</Text>}
      subtitle={
        !_.isNil(item.item) && !_.isNil(item.item.context) ? (
          <Text style={styles.subTitleLabel}>
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

  public findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ location: position });
        this.queryMapbox();
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  public queryMapbox = async () => {
    if (
      this.state.location.coords.latitude !== 0 &&
      this.state.location.coords.longitude !== 0
    ) {
      try {
        const { longitude, latitude } = this.state.location.coords;
        const result = await MapboxService.reverseGeocode({
          geolocation: {
            longitude,
            latitude
          },
          types: ["place"]
        });
        this.setState({
          suggested: result.predictions.features,
          isLoading: false
        });
      } catch (error) {
        console.warn(error);
      }
    } else {
      return null;
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
      <View style={styles.screenContainer}>
        <View style={styles.container}>
          <MapboxAutoComplete apiKey={MapboxApiKey} debounce={300}>
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
                  style={styles.linearGradientContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  {this.renderNavBar()}
                </AnimatedLinearGradient>
                <Animated.View style={styles.homeLocationContainer}>
                  {this.renderHomeLocation()}
                </Animated.View>
                <Animated.View style={styles.searchBarContainer}>
                  <SearchBar
                    ref={this.SearchBarRef}
                    containerStyle={styles.searchInputContainer}
                    onChangeText={handleTextChange}
                    onDelete={clearSearch}
                    animated={false}
                  />
                </Animated.View>
                <Animated.View style={styles.dividerContainer}>
                  <Divider style={styles.divider} />
                </Animated.View>
                <Animated.View style={styles.listContainer}>
                  <FlatList
                    style={styles.list}
                    contentContainerStyle={styles.listContentContainer}
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
                    renderItem={this.renderLocationItem}
                    scrollEnabled={false}
                    stickyHeaderIndices={[0]}
                  />
                </Animated.View>
              </React.Fragment>
            )}
          </MapboxAutoComplete>
        </View>
        <NavigationEvents onWillFocus={props => this.refresh()} />
      </View>
    );
  };

  private refresh = () => {
    StatusBar.setBarStyle("light-content", true);
  };

  private goBack = () => {
    NavigationService.navigate(this.fromRoute || "Settings");
  };

  private onPressLocation = (index: number, item: MapboxLocation) => {
    this.setHomeLocation(index, item);
  };
}

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(ChangeLocationScreen);
