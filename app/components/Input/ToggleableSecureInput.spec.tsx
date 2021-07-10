import { shallow } from "enzyme";
import React from "react";
import "react-native";
import PasswordTextInput from "./ToggleableSecureInput";

describe("PasswordTextInput", () => {
  const wrapper = shallow(<PasswordTextInput placeholder="Password" />);

  it("should be empty", () => {
    expect(wrapper.state("text")).toBe("");
    expect(wrapper.find("TextInput").prop("placeholder")).toBe("Password");
    expect(wrapper.find("Text").prop("children")).toBe("Show");
    expect(wrapper).toMatchSnapshot();
  });

  it("should store password", () => {
    wrapper.find("TextInput").simulate("changeText", "password123");
    expect(wrapper.state("text")).toBe("password123");
    expect(wrapper.find("TextInput").prop("secureTextEntry")).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("should show password when clicked", () => {
    wrapper.find("TouchableOpacity").simulate("press");
    expect(wrapper.find("Text").prop("children")).toBe("Hide");
    expect(wrapper.find("TextInput").prop("secureTextEntry")).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("should hide password when clicked again", () => {
    wrapper.find("TouchableOpacity").simulate("press");
    expect(wrapper.find("Text").prop("children")).toBe("Show");
    expect(wrapper.find("TextInput").prop("secureTextEntry")).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
