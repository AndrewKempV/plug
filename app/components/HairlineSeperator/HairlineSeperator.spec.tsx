import { StyleProp, ViewStyle } from "react-native";
import renderer from "react-test-renderer";
import Metrics from "../../config/metrics";
import mockRNLocalization from "../../config/mocks/react-native-localization-mock";
import HairlineSeparatorWithText from "./HairlineSeperator";

jest.mock("react-native-localization", () => mockRNLocalization);
const hairLineStyle = {
  style: { marginBottom: Metrics.margin2x * 3 } as StyleProp<ViewStyle>
};

test("Hairline seperator renders correctly", () => {
  const tree = renderer
    .create(HairlineSeparatorWithText(hairLineStyle))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
