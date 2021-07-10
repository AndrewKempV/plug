import React, { useState, useEffect } from "react";
import { Modal, FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { Box } from "app/components/Box";
import { Heading } from "app/components/Typography";
// import SearchBar from "app/components/SearchBar";
import { SearchBar } from "react-native-elements";
import { MapboxAutoComplete } from "app/components/AutoCompleteSearch/MapboxAutoComplete";
import { useTheme } from "app/theme";
import { mapboxToLocation, mapboxItemToLocation } from "features/location/actions";
import { Colors, buildCircle } from "app/config/styles";
import MapboxApiKey from "app/config/mapbox";
import strings from "../screens/CreateEvent/strings";
import { notEmpty } from "app/utils/helpers";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Header, ListItem } from 'react-native-elements';
import { MapboxLocation, MapboxService } from "app/utils/MapboxService"
import { BoundedLocation } from "app/models/Location";
import Metrics from "app/config/metrics";

interface Props {
  visible?: boolean;
  homeLocation: BoundedLocation;
  onClose: () => void;
  onSubmit: (venueName: string, location: BoundedLocation) => void;
}

export const LocationForm = ({ visible, homeLocation, onClose, onSubmit }: Props) => {

  const theme = useTheme();
  const renderLocationItem = ({ item, index }: ListRenderItemInfo<MapboxLocation>) => {
    const { text, place_name } = item;
    const subtitle = place_name.replace(", United States", "").replace("of America", "").trim();
    return (
      <ListItem
        title={text}
        subtitle={subtitle}
        titleStyle={{ ...theme.textSizes.medium, fontWeight: '700' }}
        subtitleStyle={{ ...theme.textSizes.small, fontWeight: '500' }}
        onPress={() => {
          const location = mapboxItemToLocation(item)
          if (location) {
            onSubmit(text, location);
            onClose();
          }

        }} />
    );
  }
  return (
    <Modal
      transparent={false}
      presentationStyle={"pageSheet"}
      animationType={"slide"}
      visible={visible}
    >
      <Box height={'100%'}>
        <Box height={85} backgroundColor={Colors.lightBurgundy}>
          <Header
            backgroundColor={Colors.lightBurgundy}
            style={{ borderWidth: 0, borderColor: Colors.transparent, backgroundColor: Colors.lightBurgundy }}
            containerStyle={{ borderWidth: 0, borderColor: Colors.transparent }}
            barStyle={"light-content"}
            leftComponent={
              <Box spaceLeft={'small'}>
                <MaterialIcon
                  name={"close"}
                  size={20}
                  color={theme.colors.text.white}
                  onPress={onClose}
                  style={{
                    ...buildCircle({
                      radius: 16,
                      backgroundColor: Colors.transparent,
                      borderColor: theme.colors.text.white,
                      borderWidth: 1
                    }),
                    paddingLeft: 5,
                    paddingTop: 5
                  }}
                />
              </Box>
            }
            centerComponent={
              <Heading size={"h3"} color={theme.colors.text.white} weight={"500"}>
                {strings.locationInputLabel}
              </Heading>
            }
            centerContainerStyle={{ borderColor: Colors.transparent, borderWidth: 0 }}
          />
        </Box>
        <MapboxAutoComplete apiKey={MapboxApiKey} debounce={300} queryTypes={['poi', 'address']} bbox={homeLocation?.bbox} limit={100}>
          {({
            handleTextChange,
            locationResults,
            clearSearch,
            inputValue
          }) => {
            console.log(locationResults);
            return (
              <React.Fragment>
                <Box height={67} backgroundColor={Colors.lightBurgundy} spaceTop={'medium'} spaceHorizontal={15}>
                  <SearchBar
                    containerStyle={styles.searchBar}
                    inputStyle={StyleSheet.flatten([styles.searchBarInput, theme.textSizes.medium])}
                    inputContainerStyle={styles.searchBarInputContainer}
                    searchIcon={{ name: "search", size: 20 }}
                    lightTheme={true}
                    onChangeText={handleTextChange}
                    onClear={clearSearch}
                    value={inputValue}
                    placeholder={"Enter a venue"}
                    placeholderTextColor={Colors.charcoalGreyA350}
                  />
                </Box>
                <Box height={'75%'} minHeight={'50%'} maxHeight={'75%'} spaceTop={'small'}>
                  <FlatList
                    data={locationResults?.features.filter(notEmpty) || []}
                    renderItem={renderLocationItem}>
                  </FlatList>
                </Box>
              </React.Fragment>
            )
          }}
        </MapboxAutoComplete>

      </Box>
    </Modal>
  );
};



const styles = StyleSheet.create({
  searchBar: {
    width: "70%",
    minWidth: 312,
    height: 40,
    maxHeight: 40,
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: Colors.snow,
    // shadowColor: "#00000029",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowRadius: 4,
    // shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.paleGrey
  },
  searchBarInput: {
    minHeight: 40,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.onyx
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
})