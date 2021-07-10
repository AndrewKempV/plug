import { StyleSheet } from "react-native";
import { Colors, Layout } from "../../../../config/styles";

const styles = StyleSheet.create({
  cancelSearch: {
    alignSelf: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    position: "absolute",
    textAlign: "center"
  },
  input: {
    backgroundColor: Colors.snow,
    color: Colors.snow,
    flex: 1,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 10
  },
  search: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    borderRadius: 6,
    backgroundColor: "red"
  },
  searchContainer: {
    borderBottomColor: "#00000033",
    flexDirection: "row",
    height: 72,
    paddingTop: 100
  },
  searchIcon: {
    padding: 10
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    ...Layout.alignLeft,

    backgroundColor: Colors.snow,
    borderRadius: 25,
    elevation: 4,
    marginHorizontal: 20,
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
