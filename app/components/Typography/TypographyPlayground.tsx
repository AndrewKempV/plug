import React from "react";
import { ScrollView } from "react-native";
import { Playground } from "app/components/Wrapper/Playground";
import { TextInput } from "components/Input/ThemedInput";
import { Heading, Paragraph, Label } from "./index";
import { Box } from "../Box";
import { Colors } from "app/config/styles";
import { Divider } from "../Divider";
import Metrics from "app/config/metrics";
import { defaultTheme } from "app/theme/defaultTheme";
import { useTheme, TextColorUnion } from "app/theme";
import { StringUnion } from "app/utils/helpers";
import InputScrollView from "react-native-input-scroll-view";
import { getTextColor, getTextSize } from "app/components/Typography/Text";
import { useLayout } from "components/Layout";

const HeaderType = StringUnion("h1", "h2", "h3", "h4", "h5", "h6");

export const TypographyPlayground = () => {
  const theme = useTheme();
  const layout = useLayout();
  const spacerWidth = Metrics.DEVICE_WIDTH - 32;

  return (
    <Playground>
      <InputScrollView keyboardShouldPersistTaps={"always"}>
        <Box height={defaultTheme.spacing.medium} spaceBottom={"xxxxlarge"} />
        <Heading>{`Current breakpoint - ${layout.currentScreenSize}`}</Heading>
        <Box spaceVertical={"large"}>
          <Heading size={"h1"} color={theme.colors.text.primary}>
            {"Heading"}
          </Heading>
        </Box>
        <Box spaceBottom={"large"} justifyContent={"center"} maxWidth={"100%"}>
          {/* {TextColorUnion.values.map((v, i) => (
            <Box
              shape={"square"}
              borderWidth={1}
              borderColor={Colors.iceBlue}
              spaceHorizontal={"medium"}
              backgroundColor={
                v === "white" || v === "selected"
                  ? Colors.onyx
                  : theme.colors.background.base
              }
            >
              <Box
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"flex-start"}
              >
                <Paragraph
                  size={"large"}
                  align={"left"}
                  color={
                    v === "white" || v === "selected"
                      ? Colors.snow
                      : theme.colors.text.primary
                  }
                >
                  {` ${v.toString().toUpperCase()}`}
                </Paragraph>
                <Box
                  height={20}
                  width={20}
                  backgroundColor={getTextColor(theme.colors.text)(v)}
                  marginHorizontal={30}
                />
              </Box>
              {HeaderType.values.map((header, index) => (
                <Heading size={header} align={"left"} color={v}>
                  {"Aa"}
                </Heading>
              ))}
            </Box> */}
          {/* ))} */}
          <Box
            shape={"square"}
            borderWidth={1}
            borderColor={Colors.iceBlue}
            spaceHorizontal={"medium"}
            backgroundColor={theme.colors.background.base}
          >
            <Heading
              size={"h1"}
              align={"left"}
              color={Colors.onyx}
              weight={"bold"}
            >
              {"H1 - Aa"}
            </Heading>
            <Heading
              size={"h2"}
              align={"left"}
              color={Colors.onyx}
              weight={"bold"}
            >
              {"H2 - Aa"}
            </Heading>
            <Heading
              size={"h3"}
              align={"left"}
              color={Colors.onyx}
              weight={"bold"}
            >
              {"H3-B - Aa"}
            </Heading>
            <Heading
              size={"h3"}
              align={"left"}
              color={Colors.charcoalGreyTwo}
              weight={"600"}
            >
              {"H3-M - Aa"}
            </Heading>
            <Heading
              size={"h4"}
              align={"left"}
              color={Colors.onyx}
              weight={"bold"}
            >
              {"H4-B - Aa"}
            </Heading>
            <Heading
              size={"h4"}
              align={"left"}
              color={Colors.charcoalGreyTwo}
              weight={"normal"}
            >
              {"H4-R - Aa"}
            </Heading>
            <Heading
              size={"h5"}
              align={"left"}
              color={Colors.onyx}
              weight={"bold"}
            >
              {"H5 - Aa"}
            </Heading>
          </Box>
        </Box>
        {/* <Divider color={Colors.paleGrey} size={"medium"} /> */}
        <Box
          shape={"square"}
          borderWidth={1}
          borderColor={Colors.iceBlue}
          spaceHorizontal={"medium"}
          backgroundColor={theme.colors.background.base}
        >
          <Box spaceVertical={"large"}>
            <Heading size={"h1"} color={theme.colors.text.primary}>
              {"Label"}
            </Heading>
          </Box>
          <Box spaceBottom={"large"}>
            <Box spaceTop={"large"} flexDirection={"column"}>
              <Label position={"left"} label={"Left label"}>
                <Box
                  width={100}
                  height={40}
                  borderColor={Colors.paleGrey}
                  borderWidth={1}
                />
              </Label>
              <Box height={defaultTheme.spacing.small} />
              <Label position={"right"} label={"Right label"}>
                <Box
                  width={100}
                  height={40}
                  borderColor={Colors.paleGrey}
                  borderWidth={1}
                />
              </Label>
              <Box height={defaultTheme.spacing.small} />
              <Label position={"top"} label={"Top label"}>
                <Box
                  width={100}
                  height={40}
                  borderColor={Colors.paleGrey}
                  borderWidth={1}
                />
              </Label>
            </Box>
          </Box>
        </Box>
        <Divider color={Colors.paleGrey} size={"medium"} />
        <Box spaceVertical={"large"}>
          <Heading size={"h1"} color={Colors.onyx}>
            {"Spacing"}
          </Heading>
        </Box>
        <Box justifyContent={"center"}>
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.xxsmall}
          />
          <Box height={defaultTheme.spacing.small} />
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.xsmall}
          />
          <Box height={defaultTheme.spacing.small} />
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.small}
          />
          <Box height={defaultTheme.spacing.small} />
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.medium}
          />
          <Box height={defaultTheme.spacing.small} />
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.large}
          />
          <Box height={defaultTheme.spacing.small} />
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.xlarge}
          />
          <Box height={defaultTheme.spacing.small} />
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.xxlarge}
          />
          <Box height={defaultTheme.spacing.small} />
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.xxxlarge}
          />
          <Box height={defaultTheme.spacing.small} />
          <Box
            backgroundColor={"#4aa564"}
            width={spacerWidth}
            height={defaultTheme.spacing.xxxxlarge}
          />
        </Box>
        <Box spaceVertical={"large"}>
          <Heading size={"h3"} weight={"bold"}>
            {"Inputs"}
          </Heading>
        </Box>
        <Box spaceBottom={"large"}>
          <TextInput
            shape={"rounded"}
            borderWidth={1}
            size={"large"}
            placeholder={"Large"}
          />
          <TextInput size={"medium"} placeholder={"Medium"} />
          <TextInput size={"small"} placeholder={"Small"} />
        </Box>
        <Divider color={Colors.paleGrey} size={"medium"} />
        <Box spaceBottom={"xxxxlarge"} />
      </InputScrollView>
    </Playground>
  );
};
