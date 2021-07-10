import React from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import { EventPackage } from "../types";
import { Box, TouchableBox, Heading, Divider, Spacing } from "app/components";
import { useTheme } from "app/theme";

const PackageItem = (props: { package: EventPackage }) => {
  const { packageType = "FREE", packageName, price, quantity } = props.package;
  return (
    <Box width={"100%"}>
      <Box
        flexDirection={"row"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        height={25}
      >
        <Heading
          size={"h4"}
          style={{ lineHeight: 0 }}
        >{`${quantity} ${packageType?.charAt(0) + packageType?.slice(1).toLowerCase()} Tickets`}</Heading>
      </Box>
      <Box
        flexDirection={"row"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        height={25}
      >
        <Heading
          size={"h3"}
          weight={"500"}
          style={{ lineHeight: 0 }}
        >{`${packageName}: $${price}`}</Heading>
      </Box>
    </Box>
  );
};

interface Props {
  packages: EventPackage[];
}

export const PackageList = ({ packages }: Props) => {
  const theme = useTheme();
  const renderSeperator = () => (
    <Box spaceBottom={"medium"}>
      <Divider size={1} color={theme.colors.border.muted} />
    </Box>
  );
  const renderImage = ({ index, item }: ListRenderItemInfo<EventPackage>) => {
    return <PackageItem package={item} />;
  };
  return (
    <FlatList
      stickyHeaderIndices={[0]}
      data={packages}
      renderItem={renderImage}
      ItemSeparatorComponent={renderSeperator}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};
