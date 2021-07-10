import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import { StateStore } from "../../../../store/AppReducer";
import { bindActionCreators, Dispatch } from "redux";
import { NavigationScreenProps } from "react-navigation";
import React, { Component, createRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  Dimensions,
  Alert,
  ListRenderItemInfo,
  GeolocationReturnType,
  GeolocationError,
  ActivityIndicator,
  Platform
} from "react-native";
import { Header, Divider, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { Colors, Layout, Fonts, buildCircle } from "../../../../config/styles";
import { BetterButton } from "../../../../components/Button";
import Metrics from "../../../../config/metrics";
import { NavigationEvents } from "react-navigation";
import { EventModel } from "../../../../api/profile";
import { MapboxLocation, MapboxService } from "../../../../utils/MapboxService";
import Storage, { getHome } from "../../../../utils/storage";
import LargeEventCard from "../../components/LargeEventCard";
import FavoriteEventCard from "../../../../components/FavoriteEventCard";
import { TrendingCarousel } from "../../components/TrendingCarousel";
// import SearchBar from "../../../../components/SearchBar";
import ParallaxScrollView, {
  RenderBackgroundParams
} from "react-native-parallax-scroll-view";
import headerStyles from "./styles";
import Images from "../../../../assets/images";
import strings from "./strings";
import { Auth } from "aws-amplify";
import Permissions from "react-native-permissions";
import { requestLocationPermission } from "../../../../utils/permissions";
import _ from "lodash";
import eventActions from "../../../../features/event/actions";
import { splitEvery } from "ramda";
import locationActions from "../../../location/actions";
import LayoutDebugger from "../../../../utils/LayoutDebugger";
import { SearchBar } from "react-native-elements";
// import NotificationService from "app/utils/NotificationService";

type StateFromDispatch = ReturnType<typeof mapStateToProps>;
type PropsFromDispatch = GetPropsFromDispatch<
  typeof eventActions & typeof locationActions
>;
type ReduxProps = StateFromDispatch & PropsFromDispatch;
type ConnectedScreenProps = ReduxProps & NavigationScreenProps;

interface State {
  location?: MapboxLocation;
  zip?: MapboxLocation;
}

class HomeScreen extends Component<ConnectedScreenProps, State> {
  public readonly state: State = {};

  // public service: NotificationService = new NotificationService((token) => {return}, (notfication) => {return} );

  public async componentDidMount() {
    try {
      await this.setHomeLocation();
      this.props.getHomeLocation();
      this.refresh();

      Auth.currentAuthenticatedUser()
        .then(() => {})
        .catch(() => this.props.navigation.navigate("Landing"));

      if (Platform.OS === "android") {
        requestLocationPermission().then(granted => {
          if (!granted) {
            this.props.navigation.navigate("Location");
          } else {
            Storage.getHomeLocation().then(home => {
              if (!home) {
                this.setHomeLocationFromGPS();
              }
            });
          }
        });
      } else {
        Permissions.request("notification")
          .then(() => {
            requestLocationPermission()
              .then(granted => {
                if (!granted) {
                  this.props.navigation.navigate("Location");
                } else {
                  Storage.getHomeLocation().then(home => {
                    if (!home) {
                      this.setHomeLocationFromGPS();
                    }
                  });
                  if (!this.props.locationImage) {
                    this.props.updateHomeBannerFromStorage();
                  }
                }
              })
              .catch(error => console.log(error));
          })
          .catch(error => console.log(error));
      }
    } catch (error) {
      console.log(error);
    }
  }

  public render() {
    const { feed } = this.props;
    let nearby: EventModel[] = [];
    let trending: EventModel[] = [];
    if (feed.length >= 2) {
      const partition = Math.floor(feed.length / 2);
      const all = splitEvery(partition, feed);
      nearby = all[0];
      trending = all[1];
    }
    return (
      <ParallaxScrollView
        contentContainerStyle={styles.contentContainer}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        renderFixedHeader={this.renderFixedHeader}
        renderStickyHeader={this.renderStickyHeader}
        renderBackground={this.renderBackground}
        renderForeground={this.renderForeground}
        backgroundColor={Colors.snow}
        contentBackgroundColor={Colors.snow}
        fadeOutForeground={true}
        backgroundScrollSpeed={1}
        outputScaleValue={5}
        onChangeHeaderVisibility={value => value}
      >
        <View style={styles.childContainer}>
          <ListItem
            containerStyle={styles.sectionTitleContainer}
            titleStyle={styles.trendingSectionLabel}
            title={strings.trending}
          />
          <View style={styles.trendingContainer}>
            <TrendingCarousel
              events={trending}
              location={this.state.location}
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.nearbyEventsLabelContainer}>
            <Text style={styles.nearbyEventsLabel}>{strings.nearby}</Text>
          </View>
          {nearby.map((item, index) => this.renderNearbyItem({ item, index }))}
        </View>
        <NavigationEvents onWillFocus={() => this.refresh()} />
      </ParallaxScrollView>
    );
  }

  private renderNearbyItem = ({
    item,
    index
  }: Pick<ListRenderItemInfo<EventModel>, "item" | "index">) => {
    return index % 4 === 0 ? (
      <LargeEventCard
        key={item.eventId ? item.eventId : index.toString()}
        containerStyle={{
          marginTop: index !== 0 ? 42 : Metrics.margin2x,
          marginLeft: 16.5
        }}
        event={item}
        toggleFavoriteEvent={this.props.toggleFavoriteEvent}
      />
    ) : (
      <FavoriteEventCard
        key={item.eventId ? item.eventId : index.toString()}
        containerStyle={styles.favoriteEventContainer}
        event={item}
        accentColor={Colors.burgundy}
      />
    );
  };

  private renderStickyHeader = () => {
    const { location } = this.state;
    return (
      <View style={styles.container}>
        <Header
          style={headerStyles.header}
          backgroundColor={Colors.burgundy}
          statusBarProps={{
            showHideTransition: "fade",
            barStyle: "light-content",
            animated: true
          }}
          rightComponent={
            <View style={Layout.horizontalCenter}>
              <BetterButton
                style={StyleSheet.flatten([headerStyles.searchButton])}
                iconStyle={headerStyles.searchIcon}
                iconName={"search"}
                iconSize={Metrics.icons.xsmall}
                iconColor={Colors.snow}
                iconSetName={"material"}
              />
              <BetterButton
                style={StyleSheet.flatten([headerStyles.messageButton])}
                iconStyle={headerStyles.messageIcon}
                iconName={"mail"}
                iconSize={Metrics.icons.xsmall}
                iconColor={Colors.snow}
                iconSetName={"feather"}
              />
            </View>
          }
          leftComponent={
            <BetterButton
              style={styles.locationButtonContainer}
              label={location ? location.text : "New York"}
              labelStyle={styles.locationLabel}
              iconSetName={"material"}
              iconName={"keyboard-arrow-down"}
              iconSize={Metrics.icons.small}
              iconColor={Colors.snow}
              iconStyle={styles.downArrowIcon}
              iconPosition={"right"}
              labelPosition={"left"}
              onPress={this.goToChangeLocation}
            />
          }
          leftContainerStyle={headerStyles.locationLabelContainer}
        />
      </View>
    );
  };

  private renderFixedHeader = () => {
    return <View style={styles.fixedHeaderContainer} />;
  };

  private renderBackground = () => {
    const { locationImage } = this.props;
    if (locationImage) {
      return (
        <Image
          onLoad={() => console.log("done")}
          onError={e => console.warn(e)}
          onProgress={() => console.log("loading")}
          source={Images.homeHeaderBackground}
          // source={{ uri: locationImage }}
          width={Metrics.DEVICE_WIDTH}
          height={PARALLAX_HEADER_HEIGHT}
        />
      );
    }
    return (
      <Image
        source={Images.homeHeaderBackground}
        width={Metrics.DEVICE_WIDTH}
        height={PARALLAX_HEADER_HEIGHT}
      />
    );
  };

  private renderForeground = () => {
    const { location } = this.state;
    return (
      <View style={styles.foregroundContainer}>
        <View style={styles.spacingContainer} collapsable={true}>
          <View style={styles.leftHeaderContainer}>
            <View style={styles.rowContainer}>
              <Text style={headerStyles.headerCTA}>{strings.explore}</Text>
            </View>
            <BetterButton
              style={styles.locationButtonContainer}
              iconStyle={styles.downArrowIcon}
              labelStyle={styles.locationLabel}
              label={location ? location.text : "New York"}
              iconSetName={"material"}
              iconName={"keyboard-arrow-down"}
              iconSize={Metrics.icons.small}
              iconColor={Colors.snow}
              iconPosition={"right"}
              labelPosition={"left"}
              onPress={this.goToChangeLocation}
            />
          </View>
          <BetterButton
            style={styles.messageButtonContainer}
            iconSetName={"ionicon"}
            iconSize={Metrics.icons.xsmall + 2}
            iconName={"ios-mail"}
            iconColor={Colors.charcoalGrey}
            iconStyle={styles.messageIcon}
            onPress={this.pressMailbox}
          />
        </View>
        <View style={styles.searchBarContainer}>
          <SearchBar
            containerStyle={styles.searchBar}
            inputStyle={styles.searchBarInput}
            inputContainerStyle={styles.searchBarInputContainer}
            placeholder={strings.searchPlugg}
            searchIcon={{ name: "search", size: 20 }}
            lightTheme={true}
          />
        </View>
      </View>
    );
  };

  private async setHomeLocation() {
    const location = await Storage.getHomeLocation();
    if (location) {
      this.setState({ location });
    }
  }

  private refresh = () => {
    StatusBar.setBarStyle("light-content", true);
    if (this.props.home) {
      const [lon, lat] = this.props.home.center;
      this.props.getEventFeed({
        lat,
        lon,
        distanceInMiles: 100,
        offset: 0,
        limit: 30
      });
      this.props.updateHomeBannerFromStorage();
    } else if (this.state.location) {
      this.props.getEventFeed({
        lat: this.state.location ? this.state.location.center[1] : 41.05239,
        lon: this.state.location ? this.state.location.center[0] : -73.79158,
        distanceInMiles: 100,
        offset: 0,
        limit: 30
      });
    }
    // else {
    //   requestLocationPermission().then(granted => {
    //     if(!granted) {
    //       this.props.navigation.navigate('Location');
    //     } else {
    //       getHome().then()
    //       this.setHomeLocationFromGPS();
    //     // } else if(!this.props.locationImage) {
    //     //   this.props.setHomeBanner();
    //     // }
    //     }
    //   }).catch(error => error);
    // }
  };

  private goToChangeLocation = () => {
    this.props.navigation.navigate("ChangeHomeLocation", {
      fromRoute: "Home"
    });
  };

  private setHomeLocationFromGPS = () => {
    navigator.geolocation.getCurrentPosition(
      this.onGetCurrentPositionSuccess,
      this.onGetCurrentPositionFailure,
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  };

  private onGetCurrentPositionSuccess = (position: GeolocationReturnType) => {
    this.props.updateHomeLocationAndBannerFromGPS(position);
    console.log(position);
    MapboxService.search(
      `${position.coords.longitude},${position.coords.latitude}`
    ).then(response => {
      console.log(response);
      if (response.predictions.features.length > 0) {
        const location = response.predictions.features[0];
        this.setState({ location });
        Storage.setHomeLocation(location);
      }
    });
    this.props.getEventFeed({
      lon: position.coords.longitude,
      lat: position.coords.latitude,
      distanceInMiles: 100,
      offset: 0,
      limit: 100
    });
  };

  private onGetCurrentPositionFailure = (error: GeolocationError) => {
    console.log(error.message);
  };

  private pressMailbox = () => {
    Alert.alert("The messaging feature is not yet available");
  };
}

const mapStateToProps = (state: StateStore) => ({
  feed: state.eventReducer.feed,
  locationImage: state.locationReducer.homeBannerUrl,
  home: state.locationReducer.homeLocation
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<
    typeof eventActions & typeof locationActions,
    PropsFromDispatch
  >(
    {
      ...eventActions,
      ...locationActions
    },
    dispatch
  );

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);

const window = Dimensions.get("window");

const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 88;

const styles = StyleSheet.create({
  background: {
    height: PARALLAX_HEADER_HEIGHT,
    left: 0,
    position: "absolute",
    top: 0,
    width: window.width
  },
  bannerOverlay: {
    backgroundColor: "rgba(0, 0, 0, .6)",
    height: 350,
    width: Metrics.DEVICE_WIDTH
  },
  childContainer: {
    ...Layout.container
  },
  container: {
    ...Layout.container,
    backgroundColor: Colors.transparent
  },
  contentContainer: {
    flex: 1,
    marginTop: -100,
    paddingBottom: 100
  },
  divider: {
    backgroundColor: Colors.paleGrey,
    height: 8,
    width: Metrics.DEVICE_WIDTH
  },
  downArrowIcon: {
    paddingTop: 1.5
  },
  favoriteEventContainer: {
    marginTop: 26
  },
  fixedHeaderContainer: {
    backgroundColor: Colors.black,
    flex: 1,
    height: 300
  },
  fixedHeaderLabel: {
    color: "black",
    fontSize: 20,
    padding: 5,
    textAlign: "center"
  },
  foregroundContainer: {
    flex: 1,
    height: 330
  },
  leftHeaderContainer: {
    width: 200
  },
  locationButtonContainer: {
    backgroundColor: Colors.transparent,
    flexDirection: "row",
    height: 25,
    width: 190
  },
  locationLabel: {
    color: Colors.paleGrey,
    fontFamily: Fonts.type.base,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    textAlign: "left",
    textDecorationLine: "underline",
    textShadowColor: "#00000029",
    textShadowOffset: {
      width: 0,
      height: 3
    },
    textShadowRadius: 6
  },
  messageButtonContainer: {
    ...buildCircle({
      radius: 16,
      backgroundColor: "#ffffffd9",
      position: "relative"
    }),
    alignItems: "center",
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    marginLeft: 115,
    marginTop: 12,
    opacity: 0.9
  },
  messageIcon: {
    paddingTop: 4
  },
  nearbyEventsLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 24,
    paddingLeft: 15.5,
    textAlign: "center"
  },
  nearbyEventsLabelContainer: {
    ...Layout.alignCenterLeft,
    marginBottom: 0,
    marginTop: 21
  },
  rowContainer: {
    flexDirection: "row",
    maxWidth: 200
  },
  searchBar: {
    width: "80%",
    minWidth: 334,
    height: 48,
    maxHeight: 48,
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: Colors.snow,
    shadowColor: "#00000029",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.paleGrey
  },
  searchBarInput: {
    minHeight: 48,
    fontSize: 15,
    fontWeight: "600"
  },
  searchBarInputContainer: {
    backgroundColor: Colors.transparent
  },
  searchBarContainer: {
    alignItems: "center",
    height: 145,
    justifyContent: "center",
    marginBottom: 0,
    width: Metrics.DEVICE_WIDTH
  },
  sectionTitleContainer: {
    ...Layout.alignCenterLeft,
    marginBottom: 10
  },
  seeAllContainer: {
    marginLeft: -11,
    marginTop: 1
  },
  seeAllLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "500",
    marginLeft: 8,
    marginTop: 4,
    textAlign: "right",
    width: 80
  },
  seeMoreArrowContainer: {
    marginLeft: -8,
    marginTop: 2
  },
  spacingContainer: {
    flexDirection: "row",
    marginLeft: 15,
    paddingTop: 85
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: "flex-end",
    width: 300
  },
  trendingContainer: {
    paddingBottom: 23
  },
  trendingSectionLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 24,
    textAlign: "left"
  }
});
