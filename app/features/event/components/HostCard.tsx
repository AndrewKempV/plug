import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { UserProfileModel, UserRelationshipModel } from "app/api/profile";
import { Box, SpacingProps } from "app/components/Box";
import { Avatar } from "react-native-elements";
import { Colors, Fonts, buildCircle } from "app/config/styles";
import Icon from "app/components/Icon";
import { TouchableDebounce } from "app/components/TouchableDebounce/TouchableDebounce";
import { Spacing } from "app/components/Spacing";
import LayoutDebugger from "app/utils/LayoutDebugger";
import NavigationService from "app/utils/NavigationService";

const FOLLOW_BUTTON_WIDTH = 89.2;
const FOLLOWING_BUTTON_WIDTH = 98;
const BUTTON_DIAMETER = 29.1;
const CARD_HEIGHT = 70;

interface HostCardProps extends SpacingProps {
  user?: UserProfileModel;
  relation?: UserRelationshipModel;
  createFollower: (profileId: string) => void;
  removeFollower: (profileId: string) => void;
  message: () => void;
}

export const HostCard = ({
  user,
  relation,
  createFollower,
  removeFollower,
  message,
  ...spacing
}: HostCardProps) => {
  if (user && relation) {
    const { userProfileId, firstName, lastName, profileImageUrl } = user;
    const { following } = relation;
    const [isFollowing, setFollowing] = React.useState(following);
    const goToUserProfile = () =>
      NavigationService.push("OtherProfile", {
        profileId: userProfileId,
        priorRoute: NavigationService.getCurrentRoute()
      });
    const toggleFollowing = () => {
      isFollowing
        ? removeFollower(userProfileId || "")
        : createFollower(userProfileId || "");
      setFollowing(!isFollowing);
    };
    const extractInitial = (value?: string) => (value ? value[0] : "");
    const initials = extractInitial(firstName) + extractInitial(lastName);
    const AvatarWithFallback = profileImageUrl ? (
      <Avatar
        size={CARD_HEIGHT}
        rounded={true}
        source={{ uri: profileImageUrl }}
        containerStyle={styles.cleanSpacingContainer}
        onPress={goToUserProfile}
      />
    ) : (
      <Avatar
        containerStyle={styles.cleanSpacingContainer}
        size={CARD_HEIGHT}
        title={initials}
        rounded={true}
        onPress={goToUserProfile}
      />
    );
    return (
      <Box height={CARD_HEIGHT} flexDirection={"row"} {...spacing}>
        <Box spaceTop={7}>{AvatarWithFallback}</Box>
        <Box width={136} spaceLeft={8} flexDirection={"column"}>
          <Text
            ellipsizeMode={"tail"}
            numberOfLines={1}
            style={styles.usernameLabel}
            onPress={goToUserProfile}
          >
            {user.username || "--"}
          </Text>
          <Text
            ellipsizeMode={"tail"}
            numberOfLines={3}
            style={styles.bioLabel}
          >
            {user.bio || "--"}
          </Text>
        </Box>
        <Box
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <TouchableDebounce
            onPress={message}
            style={styles.messageButtonTouchableZone}
          >
            <Box
              width={BUTTON_DIAMETER}
              height={BUTTON_DIAMETER}
              shape={"circle"}
              borderWidth={2}
              borderStyle={"solid"}
              borderColor={Colors.burgundy}
              backgroundColor={Colors.snow}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Icon name={"direct-message"} color={Colors.burgundy} size={12} />
            </Box>
          </TouchableDebounce>
          <Spacing orientation={"horizontal"} size={10} />
          <TouchableDebounce
            onPress={toggleFollowing}
            style={
              isFollowing
                ? styles.followingButtonContainer
                : styles.followButtonContainer
            }
          >
            <Box
              width={isFollowing ? FOLLOWING_BUTTON_WIDTH : FOLLOW_BUTTON_WIDTH}
              height={BUTTON_DIAMETER}
              shape={"pill"}
              borderRadius={25}
              borderWidth={2}
              borderStyle={"solid"}
              borderColor={Colors.burgundy}
              backgroundColor={isFollowing ? Colors.snow : Colors.burgundy}
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Icon
                name={!isFollowing ? "follow" : "following"}
                color={!isFollowing ? Colors.snow : Colors.burgundy}
              />
              <Spacing orientation={"horizontal"} size={4} />
              <Text
                style={[
                  styles.followButtonLabel,
                  {
                    color: !isFollowing ? Colors.snow : Colors.burgundy
                  }
                ]}
              >
                {!isFollowing ? "Follow" : "Following"}
              </Text>
            </Box>
          </TouchableDebounce>
        </Box>
      </Box>
    );
  } else {
    return <View />;
  }
};

const styles = StyleSheet.create({
  bioLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    letterSpacing: -0.11,
    lineHeight: 14,
    textAlign: "left"
  },
  cleanSpacingContainer: {
    margin: 0,
    padding: 0
  },
  followButtonContainer: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.transparent,
    borderRadius: 25,
    borderStyle: "solid",
    borderWidth: 2,
    height: 29.1,
    width: FOLLOW_BUTTON_WIDTH
  },
  followButtonLabel: {
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 1.2,
    textAlign: "center"
  },
  followingButtonContainer: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.transparent,
    borderRadius: 25,
    borderStyle: "solid",
    borderWidth: 2,
    height: 29.1,
    width: FOLLOWING_BUTTON_WIDTH
  },
  messageButtonTouchableZone: {
    ...buildCircle({
      radius: 29.1 / 2,
      backgroundColor: Colors.transparent
    }),
    borderColor: Colors.transparent,
    borderWidth: 2
  },
  usernameLabel: {
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 35,
    textAlign: "left"
  }
});
