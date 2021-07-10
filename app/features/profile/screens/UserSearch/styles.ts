import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../../../config/metrics";
import { Colors, Layout } from "../../../../config/styles";

const styles = StyleSheet.create({
  container: {
    ...Layout.container
  },
  contentContainer: {},
  divider: {
    backgroundColor: Colors.paleBlue,
    height: verticalScale(7)
  },
  facebookListItem: {
    marginVertical: verticalScale(5)
  },
  headerContainer: {
    ...Layout.horizontalCenter,
    backgroundColor: Colors.burgundy,
    height: verticalScale(130),
    paddingTop: verticalScale(30),
    width: scale(375)
  },
  listContainer: {
    height: Metrics.DEVICE_HEIGHT - verticalScale(130 + 55 + 24 + 10),
    width: scale(375)
  },
  searchBarInput: {
    fontSize: 14
  },
  sectionLabel: {
    color: Colors.black,
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 24,
    marginTop: verticalScale(10),
    paddingLeft: scale(10),
    textAlign: "center",
    width: scale(182)
  }
});

export default styles;
