import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Colors, Layout } from "../../config/styles";
import Theme from "../../config/Theme";

const styles = StyleSheet.create({
  cancelSearch: {
    alignSelf: "center",
    justifyContent: "center",
    marginHorizontal: scale(16),
    position: "absolute",
    textAlign: "center"
  },
  currentLocationButton: {
    borderRadius: 8.5,
    flex: 1,
    height: 17,
    marginTop: 0,
    maxHeight: 17,
    maxWidth: 17,
    paddingTop: 0,
    width: 17
  },
  input: {
    backgroundColor: Colors.snow,
    color: Colors.black,
    flex: 1,
    paddingBottom: verticalScale(10),
    paddingLeft: scale(10),
    paddingRight: 0,
    paddingTop: verticalScale(10)
  },
  search: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.niceBlue,
    maxHeight: "5%",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4
  },
  searchContainer: {
    borderBottomColor: "#00000033",
    borderRadius: 36,
    flex: 1,
    flexDirection: "row",
    maxHeight: "15%",
    position: "absolute"
  },
  searchIcon: {
    ...Layout.alignLeft,
    marginBottom: 0,

    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    paddingHorizontal: scale(10),
    paddingVertical: 0
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    ...Layout.alignLeft,

    backgroundColor: Colors.snow,
    borderRadius: 25,
    elevation: 4,
    marginHorizontal: scale(20),
    maxHeight: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62
  }
});

export default styles;
