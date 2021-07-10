import { shallow } from "enzyme";
import "react-native";
import { StyleProp, ViewStyle } from "react-native";
import mockRNLocalization from "../../config/mocks/react-native-localization-mock";
import { SignUpTermsOfService } from "./TermsOfService";

jest.mock("react-native-localization", () => mockRNLocalization);

const containerStyle = {
  marginBottom: 200,
  marginTop: 10,
  flexDirection: "column"
} as StyleProp<ViewStyle>;
const tos = "Terms of Service";
describe("SignUpTermsOfService", () => {
  const wrapper = shallow(SignUpTermsOfService(containerStyle));
  it("should match the terms of service string", () => {
    expect(wrapper.find("Text").prop("children")).toBe(tos);
    expect(wrapper).toMatchSnapshot();
  });
});
