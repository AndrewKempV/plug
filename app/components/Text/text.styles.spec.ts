import { getStyleType } from "./text.styles";

describe("getStyleType", () => {
  it("should have cta styles", () => {
    const styles = getStyleType("cta");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have defailt styles", () => {
    const styles = getStyleType("default");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have error styles", () => {
    const styles = getStyleType("error");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have success styles", () => {
    const styles = getStyleType("success");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have B1 styles", () => {
    const styles = getStyleType("B1");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have B2 styles", () => {
    const styles = getStyleType("B2");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have H1 styles", () => {
    const styles = getStyleType("H1");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have H2 styles", () => {
    const styles = getStyleType("H2");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have H3 styles", () => {
    const styles = getStyleType("H3");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have H4 styles", () => {
    const styles = getStyleType("H4");
    expect(styles).toMatchSnapshot();
  });
});
describe("getStyleType", () => {
  it("should have H5 styles", () => {
    const styles = getStyleType("H5");
    expect(styles).toMatchSnapshot();
  });
});
