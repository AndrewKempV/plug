import React from "react";
import renderer from "react-test-renderer";
import SocialIconCarousel from "./SocialIconCarousel";

test("SocialIconCarousel renders correctly", () => {
  const tree = renderer.create(<SocialIconCarousel />).toJSON();
  expect(tree).toMatchSnapshot();
});
