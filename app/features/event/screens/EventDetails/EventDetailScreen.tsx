import React, { Component } from "react";
import { View, Text, StatusBar, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import styles from './styles';
import { ParallaxScrollView } from "components/ParallaxScrollView";
import { Colors } from "config/styles";
import { StateStore } from "app/store/AppReducer";
import { bindActionCreators, Dispatch } from "redux";
import eventActions from "../../actions";
import locationActions from "app/features/location/actions";
import { connect } from "react-redux";
import { GetPropsFromDispatch } from "app/store/ActionCreators";
import { NavigationScreenProps, NavigationEvents } from "react-navigation";
import Metrics from "app/config/metrics";
import { BetterButton } from "app/components/Button";
import { Box } from "app/components/Box";
import { Spacing } from "app/components/Spacing";
import getIconType from "app/utils/getIconType";
import { ListItem, Header, Divider, Avatar } from "react-native-elements";
import Collapsible from "app/components/Collapsible/Collapsible";
import { TouchableHighlight } from "react-native-gesture-handler";
import Icon from "app/components/Icon";
import { EventDetailModel, UserProfileModel, EventModel, UserRelationshipModel, EventPackageModel } from "app/api/profile";
import { ApiClient } from "app/api/client";
import MapboxGL from '@react-native-mapbox-gl/maps';
import { EventCarousel } from "app/features/event/components/EventCarousel";
import NavigationService from "app/utils/NavigationService";
import EventDetailMenu from "../../components/EventDetailMenu";
import MessageKeyboardAccessory from 'components/MessageKeyboardAccessory';
import { HostCard } from "../../components/HostCard";
import profileActions from "app/features/profile/actions";
import moment, { ISO_8601 } from "moment";
import { getMonth, getDay, getTimeWithMeridian } from "app/utils/formatters";
import { notEmpty } from "app/utils/helpers";
import Animated, { Easing } from "react-native-reanimated";
import { Measurements } from "app/hooks/useMeasure";
import { Heading } from "app/components/Typography";
import { useTransition, bInterpolate, bin } from "react-native-redash";
import { EventDetailMap } from "../../components/EventDetailMap";
import BannerCarousel from 'react-native-banner-carousel';



interface AnimatedFooterProps {
  hidden: boolean;
}
const AnimatedFooter = ( { hidden }: AnimatedFooterProps ) => {
  // const [open, setOpen] = useState(visible);
  const transition = useTransition(
    hidden,
    Animated.not(bin(hidden)),
    bin(hidden),
    400,
    Easing.inOut(Easing.ease)
  );
  const footerPosition = bInterpolate(
    transition,
    Metrics.DEVICE_HEIGHT,
    Metrics.DEVICE_HEIGHT - FOOTER_HEIGHT
  );

  return (
    <Animated.View style={{ height: FOOTER_HEIGHT, width: '100%', position: 'absolute', left: 0, top: footerPosition, }}>     
      <Box 
        height={FOOTER_HEIGHT} 
        width={'100%'} 
        backgroundColor={Colors.snow}
        borderColor={Colors.iceBlue}
        borderWidth={1} 
      >
        <Box 
          flexDirection={'row'} 
          justifyContent={'space-between'} 
          spaceTop={21} 
          spaceLeft={17} 
          spaceRight={21}
        >
          <Box justifyContent={'center'} alignItems={'center'}>
            <Heading size={'h4'} align={'center'} color={Colors.onyx} weight={'bold'}>
              {'$30.00 - $90.00'}
            </Heading>
          </Box>
          <BetterButton
            style={[styles.ticketButton, { width: 194, borderRadius: 27 }]}
            labelStyle={styles.ticketButtonLabel} 
            label={'Ticket'}
          />
        </Box>
      </Box>
    </Animated.View>
  )
}

const PARALLAX_HEADER_HEIGHT = 278.1;
const STICKY_HEADER_HEIGHT = 88;

const FOOTER_HEIGHT = 118;

type StateFromDispatch = ReturnType<typeof mapStateToProps>;
type PropsFromDispatch = GetPropsFromDispatch<
  typeof eventActions & 
  typeof locationActions &
  Pick<typeof profileActions, 'createFollower' | 'removeFollower' | 'getOwnUserProfile'>
>;
type ReduxProps = StateFromDispatch & PropsFromDispatch;
type ConnectedScreenProps =  ReduxProps & NavigationScreenProps;

interface LocalState {
  event?: EventModel;
  eventDetail?: EventDetailModel;
  host?: UserProfileModel;
  relation?: UserRelationshipModel;
  menuState: 'Open' | 'Closed';
  keyboardAcessoryVisible?: boolean;
  collapsed: boolean;
  collapsedContentHeight: number;
  eventId: string;
  priorRoute: string;
  footerVisible: boolean;
}
class EventDetailScreen extends Component<ConnectedScreenProps, LocalState> {

  readonly state: LocalState = {
    collapsed: true,
    eventId: ' ',
    menuState: 'Closed',
    keyboardAcessoryVisible: false, 
    collapsedContentHeight: 0,
    priorRoute: ' ',
    footerVisible: false
  };

  componentDidMount() {
    const eventId = this.props.navigation.getParam('eventId') as string;
    const priorRoute = this.props.navigation.getParam('fromRoute') as string;
    // console.log(eventId);
    // console.log(priorRoute);
    this.setState({ eventId, priorRoute });
    if(eventId) {
      ApiClient.instance.getEventDetail(eventId).then(eventDetails=> {
        if(eventDetails) {
          this.setState({ eventDetail: eventDetails });
        }
      }).then(() => {
        if(this.state.eventDetail && this.state.eventDetail.ownerUserProfileId) {
          ApiClient.instance.getUserProfile(this.state.eventDetail.ownerUserProfileId).then(response=> {
            if(response && response.data.data) {
              const host = response.data.data.pop()!;
              this.setState({ host });
            }
          }).then(() => {
            if(this.state.eventDetail) {
              ApiClient.instance.getRelationship(this.state.eventDetail.ownerUserProfileId!).then(response => {
                if(response && response.data.data) {
                  const relation = response.data.data.pop()!;
                  this.setState({ relation });
                }
              }).catch(error=> console.log(error))
            }
          }).catch(error=> console.log(error))
        }
      }).then(() => {
        const event = this.props.feed.find(event => event.eventId === eventId);
        if(event) {
          this.setState({ event });
        } else {
          ApiClient.instance.getEvent(eventId).then(e => {
            if(e) {
              this.setState({ event: e });
            }
          }).catch(error => console.log(error));
        }
      }).catch(error=> console.log(error));
    }
  }

  render = () => { 
    const MaterialIcon = getIconType('material');
    const SimpleLineIcon = getIconType('simple-line-icon');
    const { createFollower, removeFollower, toggleFavoriteEvent, feed, ownProfile } = this.props;
    const { eventDetail, host, relation, menuState, keyboardAcessoryVisible, collapsed } = this.state;
    if(eventDetail && host) {
      const startMoment = moment(eventDetail.eventStartTime, ISO_8601);
      const endMoment = moment(eventDetail.eventEndTime, ISO_8601);
      const priceBoundary = getPriceBoundaries(eventDetail.packages);
      const high = priceBoundary && priceBoundary.high ? priceBoundary.high.price : undefined;
      const low = priceBoundary && priceBoundary.low ? priceBoundary.low.price : undefined;
      const { footerVisible } = this.state;
      const parseLatLon = (lon?: string, lat?: string) => {
        const latitude = lat ? parseFloat(lat) : -71;
        const longitude = lon ? parseFloat(lon) : 42;
        return [longitude, latitude];
      }

      const coordinates = parseLatLon(eventDetail.longitude, eventDetail.latitude);
      const profileImage = { uri: ownProfile.profileImageUrl };
      return (
        <Box flex={1}>        
          <ParallaxScrollView
            parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
            stickyHeaderHeight={STICKY_HEADER_HEIGHT}
            renderStickyHeader={this.renderStickyHeader}
            renderBackground={this.renderBackground}
            renderForeground={this.renderForeground}
            backgroundColor={Colors.snow}
            contentBackgroundColor={Colors.snow}
            fadeOutForeground={false}
            backgroundScrollSpeed={1}
            outputScaleValue={5}
            onChangeHeaderVisibility={this.transitionStatusBarColor}
          >
            <Box 
              spaceRight={15} 
              spaceLeft={16}
            >   
              <Box 
                flexDirection={'row'} 
                spaceVertical={"medium"} 
                spaceRight={16}
                height={96}
              >
                <Box 
                  alignItems={'center'} 
                  spaceRight={16} 
                  height={60}
                >
                  <Text style={styles.monthLabel}>{getMonth(startMoment)}</Text>
                  <Text style={styles.dayLabel}>{getDay(startMoment)}</Text>
                </Box>
                <Box alignItems={'flex-start'}>
                  <Text style={styles.titleLabel}>{`${eventDetail.venueName || ' '}`}</Text>
                  <Text style={styles.usernameLabel}>{`by ${host.username || ' '}`}</Text>
                  <Text style={styles.eventTagLabel}>{`${eventDetail.privateEvent ? 'Private' : 'Public'} ${eventDetail.tags ? eventDetail.tags.join(', ') : 'Public: Cocktails and Lounge'}`}</Text>
                </Box>
              </Box>
            </Box>
            <Divider style={styles.hairlineDivider}/>
            <Box position={'absolute'} width={'100%'} flexDirection={'row'} zIndex={2} marginTop={81} alignItems={'flex-end'} justifyContent={'flex-end'} >
                <Box spaceRight={13}>
                  <BetterButton
                    style={styles.shareButton}
                    iconSetName={"Plugg"}
                    iconName={"share"}
                    iconStyle={styles.shareIcon}
                    iconSize={Metrics.icons.xsmall+2}
                    iconColor={Colors.charcoalGrey}
                    onPress={() => Alert.alert("Event sharing is not available yet")}
                  />
                </Box>
                <Box spaceRight={15}>
                  <BetterButton
                    style={styles.favoriteButton}
                    iconSetName={"ionicon"}
                    iconName={eventDetail.favorite ? "md-heart" : "md-heart-empty"}
                    iconStyle={styles.favoriteIcon}
                    iconSize={Metrics.icons.xsmall+2}
                    iconColor={eventDetail.favorite ? Colors.burgundy : Colors.charcoalGreyTwo}
                    onPress={() => { 
                      this.props.toggleFavoriteEvent({ eventId: eventDetail.eventId!, favorite: eventDetail.favorite! });
                      this.setState({ eventDetail: { ...eventDetail, favorite: !eventDetail.favorite }})
                  }}
                  />
                </Box>
              </Box>
            <Box 
              spaceLeft={16}
              spaceTop={"medium"}
              spaceRight={15} 
            >
              <Box flexDirection={'column'} alignContent={'space-around'} height={149} width={'100%'}>
                <ListItem 
                  containerStyle={styles.listItemContainer}
                  contentContainerStyle={styles.listItemContentContainer}
                  leftElement={<Icon name={'event'} size={Metrics.icons.xsmall} color={Colors.warmGrey} style={styles.listIconContainer}/>}
                  titleStyle={StyleSheet.flatten([styles.detailItemLabel])}
                  title={`${getMonth(startMoment)} ${getDay(startMoment)}`}
                  subtitle={startMoment.isSame(endMoment, 'date') ? `${getTimeWithMeridian(startMoment)} - ${getTimeWithMeridian(endMoment)}` : `${getTimeWithMeridian(startMoment)}}`}
                  subtitleStyle={StyleSheet.flatten([styles.detailItemSubLabel, { marginTop: 5 }])}
                />
                <Spacing 
                  orientation={'vertical'}
                  size={10}
                />
                <ListItem 
                  containerStyle={styles.listItemContainer}
                  contentContainerStyle={styles.listItemContentContainer}
                  leftElement={<Icon name={'map-pin'} size={Metrics.icons.xsmall} color={Colors.warmGrey} style={styles.listIconContainer}/>}
                  titleStyle={styles.detailItemLabel}
                  title={eventDetail.venueName || ' '}
                  subtitle={`${eventDetail.address ? eventDetail.address + ',' : ' '} ${eventDetail.city ? eventDetail.city +',' : ' '} ${eventDetail.state ? eventDetail.state + ',': ' '} ${eventDetail.zipCode ? eventDetail.zipCode : ' '}`}
                  subtitleStyle={StyleSheet.flatten([styles.detailItemSubLabel, { marginTop: 5 }])}
                />
                <Spacing 
                  orientation={'vertical'}
                  size={10}
                />
                <ListItem 
                  containerStyle={styles.listItemContainer}
                  contentContainerStyle={styles.listItemContentContainer}
                  leftElement={<Icon name={'tickets'} size={Metrics.icons.xsmall} color={Colors.warmGrey} style={styles.listIconContainer}/>}
                  titleStyle={styles.detailItemLabel}
                  title={eventDetail.packages ? eventDetail.packages.length > 1 ? `$${high || '30.00'} - $${low || '90.00'}` : '$30.00 - $90.00' : '$30.00 - $90.00'}
                  subtitle={'On Plugg'}
                  subtitleStyle={StyleSheet.flatten([styles.detailItemSubLabel, { marginTop: 5 }])}
                />
              </Box>
              <Box alignItems={'center'} spaceVertical={24}>
                <BetterButton
                  style={styles.ticketButton}
                  labelStyle={styles.ticketButtonLabel} 
                  label={'Ticket'} 
                />
              </Box>
            </Box>
            <Divider style={styles.divider}/>
            <Box 
              flexDirection={'row'} 
              height={50} 
              spaceVertical={13} 
              spaceRight={15} 
              spaceLeft={16}
              justifyContent={'space-between'}
            > 
              <Text style={styles.sectionH1Label}>
                {'Chatroom'}
              </Text>
              
              <BetterButton
                style={styles.chatroomStatContainer}
                iconPosition={'left'}
                iconName={'message'}
                iconSetName={'entypo'}
                iconSize={Metrics.icons.small}
                iconColor={Colors.warmGrey}
                iconStyle={styles.chatBubbleIcon}
                label={'0'}
                labelPosition={'right'}
                labelStyle={styles.chatroomLabel}
              />
            </Box>
            <Box flexDirection={'row'} spaceBottom={12} spaceRight={15} spaceLeft={16}>
              <Avatar rounded={true} title={(ownProfile?.firstName?.charAt(0)?.toUpperCase() || '') + (ownProfile?.lastName?.charAt(0)?.toUpperCase() || '')} source={profileImage}/>
              <Text style={styles.chatroomCallToActionLabel}>
                {'Join the conversation…'}
              </Text>
            </Box>
            <Divider style={styles.divider}/>
            { eventDetail.eventDescription && 
                <Collapsible
                  renderHeader={this.renderCollapsibleHeader}
                  renderContent={this.renderCollapsibleContent}
                  renderFooter={this.renderCollapsibleFooter}
                  contentContainerStyle={{flex: 1}}
                  collapsedContentHeight={this.state.collapsedContentHeight}
                  contentHeight={this.state.collapsedContentHeight + 100}
                  open={collapsed}
                />
            }
            { eventDetail.eventDescription && 
                <Divider style={styles.hairlineDivider}/>
            }
            <Box flexDirection={'row'} spaceVertical={12} spaceRight={15} spaceLeft={16}>
              <ListItem        
                containerStyle={{ width: Metrics.DEVICE_WIDTH - 31, margin: 0, padding: 0 }}
                contentContainerStyle={{ width: Metrics.DEVICE_WIDTH - 31, margin: 0, padding: 0 }}
                leftElement={
                  <Text style={styles.detailItemLabel}>
                  {'Share'}
                  </Text>
                }
                rightElement={
                  <Icon
                    name={'share'}
                    size={Metrics.icons.xsmall}
                  />
                }
              />
            </Box>
            <Divider style={styles.hairlineDivider}/>
            <Box height={250} spaceVertical={"medium"}>
              <Box spaceLeft={16} spaceRight={15} spaceBottom={12}>
                <Text style={styles.sectionH1Label}>
                  {'Location'}
                </Text>
                <Text style={styles.detailItemSubLabel}>
                  {eventDetail.venueName || ' '}
                </Text>
              </Box>
              <EventDetailMap coordinates={coordinates}/>
            </Box>
            <Box height={153} spaceVertical={"medium"} spaceRight={15} spaceLeft={16}>
              <Text style={styles.sectionH1Label}>
                {'Host'}
              </Text>
              <HostCard
                user={host}
                relation={relation}
                createFollower={createFollower}
                removeFollower={removeFollower}
                message={this.openMessagingKeyboard}
                spaceTop={"medium"}
              />
            </Box>
            <Divider style={styles.divider}/>
            <Box height={425} spaceVertical={"medium"}>
              <Box spaceLeft={16} spaceBottom={20}>
                <Text style={styles.sectionH1Label}>
                  {'Similar Events'}
                </Text>
              </Box>
              <EventCarousel
                events={feed}
                onFavoriteEvent={toggleFavoriteEvent}
              />
            </Box> 
            <NavigationEvents
              onWillFocus={this.refresh}
            />
            <EventDetailMenu
              menuState={menuState}
              onCancel={this.closeMenu}
              onMessageHost={this.openMessagingKeyboard}
              onReportEvent={this.reportEvent}
              onShare={this.shareEvent}
            />
            { keyboardAcessoryVisible && 
              <MessageKeyboardAccessory 
                visible={true}
                onDismiss={this.hideKeyboardAccessory} 
              />
            }
            
          </ParallaxScrollView>
          <AnimatedFooter hidden={!footerVisible}/>
        </Box>
      );
    }
    return <View/>
  }

  renderFixedHeader = () => {
    return (
      <View style={styles.fixedHeaderContainer}/>
    );
  }

  renderStickyHeader = () => {
    return (
    <View style={styles.container}>
      <Header
        style={styles.stickyHeaderContainer}
        backgroundColor={Colors.burgundy}
        statusBarProps={{ showHideTransition: 'fade', barStyle: 'light-content' }}
        leftComponent={
          <BetterButton
            style={styles.stickyBackButtonContainer}
            iconSetName={'ionicon'}
            iconName={'ios-arrow-back'}
            iconSize={Metrics.icons.small}
            iconStyle={{ paddingRight: 3, paddingTop: 2 }}
            iconColor={Colors.snow}
            onPress={this.goBack}
          />
        }
        centerComponent={
          <Text style={styles.screenTitleLabel}>
            {this.state.eventDetail ? this.state.eventDetail.venueName || ' ' : ' '}
          </Text>
        }
        rightComponent={
          <BetterButton
            style={styles.stickyOverflowButtonContainer}
            iconSetName={'ionicon'}
            iconName={'ios-more'}
            iconSize={Metrics.icons.small}
            iconColor={Colors.snow}
            iconStyle={{ paddingTop: 2 }}
            onPress={this.openMenu}
          />
        }
      />
    </View>
    );
  }

  renderBackground = () => {
    const { eventDetail } = this.state;
    const renderImage = (uri: string, index: number) => {
      if (uri) {
        return (
          <Box key={index}>
            <Image
              source={{ uri }}
              width={Metrics.DEVICE_WIDTH}
              height={PARALLAX_HEADER_HEIGHT}
              fadeDuration={400}
              style={{ height: PARALLAX_HEADER_HEIGHT, width: '100%' }}
            />
          </Box>
        );
      } 
      // return null;
    }
    console.log(eventDetail);
    if (eventDetail) {
      if (eventDetail.images && eventDetail.images.length > 0) {
        const images = [eventDetail.primaryImageUrl!, ...eventDetail.images];
        return (
          <Box flex={1} justifyContent={"center"}>
            <BannerCarousel index={0} loop={true} showsPageIndicator={true}>
              {images.map((uri, index) => renderImage(uri, index))}
            </BannerCarousel>
          </Box>
        )
      }
    
      else if (eventDetail && eventDetail.primaryImageUrl) {
        return (
          <Image
            source={{ uri: eventDetail.primaryImageUrl }}
            width={Metrics.DEVICE_WIDTH}
            height={PARALLAX_HEADER_HEIGHT}
            fadeDuration={400}
            style={{ height: PARALLAX_HEADER_HEIGHT, width: '100%' }}
          />
        );
      }
    }
    return (
      <Box 
        width={Metrics.DEVICE_WIDTH} 
        height={PARALLAX_HEADER_HEIGHT}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <ActivityIndicator 
          size={'large'}
          color={Colors.warmGrey}
          animating={true}/>
      </Box>
    ) 
    
  }

  renderForeground = () => {
    return (
        <Box 
          flexDirection={'row'} 
          shape={'square'} 
          spaceLeft={16} 
          spaceRight={15}
          spaceTop={49}
        >
          <BetterButton
            style={styles.backButtonContainer}
            iconSetName={'ionicon'}
            iconName={'ios-arrow-back'}
            iconSize={Metrics.icons.small}
            iconStyle={{ paddingRight: 3, paddingTop: 2 }}
            iconColor={Colors.darkGrey}
            onPress={this.goBack}
          />
          <Spacing 
            orientation={'horizontal'} 
            size={275} 
            collapsable={true}
          />
          <BetterButton
            style={styles.overflowButtonContainer}
            iconSetName={'ionicon'}
            iconName={'ios-more'}
            iconSize={Metrics.icons.small}
            iconColor={Colors.charcoalGreyTwo}
            iconStyle={{ paddingTop: 2 }}
            onPress={this.openMenu}
          />
        </Box>
    );
  }

  renderCollapsibleContent = () => {
    return (
      <Box spaceLeft={16} spaceRight={15}>
        <Text style={styles.p1}>
          {this.state.eventDetail ? this.state.eventDetail.eventDescription || ' ' : ' '}
        </Text>
      </Box>
    );   
  }

  renderCollapsibleHeader = () => {
    return (
    <Box spaceTop={15} spaceBottom={12} spaceLeft={16} spaceRight={15}>
      <Text style={styles.sectionH1Label}>
        {'About'}
      </Text>
    </Box>
    );
  }

  renderCollapsibleFooter = () => {
    if(this.state.eventDetail?.eventDescription) {
    const MaterialIcon = getIconType('material');
    return (
      <TouchableHighlight style={{ backgroundColor: Colors.transparent, backfaceVisibility: 'hidden' }} onPress={this.toggleAboutSection} underlayColor={Colors.transparent}>
          <Box flexDirection={'row'} alignContent={'center'} spaceVertical={"medium"} spaceLeft={137} spaceRight={134}>
            <Text style={styles.seeMoreLabel}>
              {`See ${this.state.collapsed ? 'more' : 'less'}`}
            </Text>
            <MaterialIcon name={this.state.collapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={20}/>
          </Box>
        </TouchableHighlight>
      );
    } else {
      return <Box/>;
    }
  }

  onMeasureCollapsibleContent = (measurement: Measurements) => {
    this.setState({
      collapsedContentHeight: measurement.height
    });
   
  }
  onLayoutCollapsibleContent = (e: any) => {
    console.log(e);
  }

  toggleAboutSection = () => {
    this.setState(prev=> ({
      collapsed: !prev.collapsed 
    }));
  }

  transitionStatusBarColor = (visible: boolean) => {
    StatusBar.setBarStyle(visible ? 'dark-content' : 'light-content', true);
    this.setState({ footerVisible: !visible });
    
  }
  
  openMenu = () => this.setState({ menuState: 'Open' });

  closeMenu = () => this.setState({ menuState: 'Closed' });

  showKeyboardAccessory = () => this.setState({ keyboardAcessoryVisible: true });

  hideKeyboardAccessory = () => this.setState({ keyboardAcessoryVisible: false });

  reportEvent = () => Alert.alert('Sending reports is not yet supported');

  shareEvent = () => Alert.alert('Event sharing is not yet supported');

  openMessagingKeyboard = () => {
    this.closeMenu();
    this.showKeyboardAccessory();
  }

  refresh = () => {
    StatusBar.setBarStyle('dark-content', true);
  }

  goBack = () => {
    if(this.state.priorRoute) {
      NavigationService.navigate(this.state.priorRoute);
    } else {
      NavigationService.goBack();
    }
  }
}

const getPriceBoundaries = (packages?: EventPackageModel[]) => {
  if(packages) {
    const descending = packages.filter(notEmpty).sort((a, b) => { 
      if(a.price && b.price) {
        if(a.price < b.price) {
          return 1;
        } else if(a.price === b.price) {
          return 0;
        } else {
          return -1;
        }
      } else {
        return 0;
      }
    });
    const high = descending.pop()!;
    const low = descending[descending.length-1]!;
    return {
      high,
      low
    };
  }
}


const mapStateToProps = (state: StateStore) => ({
  feed: state.eventReducer.feed,
  locationImage: state.locationReducer.homeBannerUrl,
  home: state.locationReducer.homeLocation,
  ownProfile: state.profileReducer.profile
});
const relationshipActions = { 
  createFollower: profileActions['createFollower'], 
  removeFollower: profileActions['removeFollower'] 
};
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators<typeof eventActions & typeof locationActions & Pick<typeof profileActions, 'createFollower' | 'removeFollower'>, PropsFromDispatch>({ 
  ...eventActions, 
  ...locationActions,
  ...relationshipActions
}, dispatch);


export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(EventDetailScreen);
