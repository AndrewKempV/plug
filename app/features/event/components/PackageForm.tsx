import React, { useState } from "react";
import { Modal, ScrollView, FlatList, ListRenderItemInfo, StyleProp, TextStyle } from "react-native";
import { useTheme } from "app/theme";
import {
  Box,
  Spacing,
  Divider,
  Heading,
  Label,
  TextInput,
  DoneButton,
  ThemedButton
} from "app/components";
import { EventPackage, PackageType } from "../types";
import NumericTextInput from "components/Input/NumericInput";
import { Header } from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Colors, buildCircle } from "app/config/styles";
import strings from "../screens/CreateEvent/strings";
import Color from "color";
import { produce } from "immer";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view"
interface Props {
  visible?: boolean;
  onClose: () => void;
  onSubmit: (fields: EventPackage[]) => void;
}

export const PackageForm = ({ visible, onClose, onSubmit }: Props) => {
  const [packages, setPackages] = useState<EventPackage[]>([]);
  const addPackage = (packageType: PackageType) => {
    setPackages([
      { packageType, packageName: "", price: 0, description: "" },
      ...packages
    ]);
  };
  const removePackage = (index: number) => {
    setPackages(packages.filter((p, idx) => index !== idx));
  };
  const updatePackage = (index: number) => (ticket: EventPackage) => {
    setPackages(
      produce(packages, draft => {
        draft[index] = ticket;
      })
    );
  };
  const renderPackage = ({ item, index }: ListRenderItemInfo<EventPackage>) => {
    const remove = () => removePackage(index);
    return (
      <PackageInputSection
        packageType={item.packageType}
        packageModel={item}
        onRemove={remove}
        updatePackage={updatePackage(index)}
      />
    );
  };
  const addPaidPackage = () => addPackage("PAID");
  const addFreePackage = () => addPackage("FREE");
  const addDonationPackage = () => addPackage("DONATION");
  const submit = () => {
    onSubmit(packages);
    onClose();
  };
  const validate = (value: EventPackage, index: number, array: EventPackage[]) => {
    const isValid = value.packageName && value.packageName.length > 0 && value.quantity
    switch (value.packageType) {
      case "FREE":
        return isValid;
      case "DONATION":
        return isValid;
      case "PAID": 
        return isValid && value.price;
    }
  }
  const ItemSeparator = () => (
    <Box spaceBottom={"medium"}>
      <Divider size={8} color={Colors.iceBlue} />
    </Box>
  );
  const canSubmit = packages.length > 0 && packages.every(validate);
  const first = packages.length > 0 ? packages[0] : undefined;
  const theme = useTheme();
  return (
    <Modal
      transparent={false}
      presentationStyle={"pageSheet"}
      animationType={"slide"}
      visible={visible}
    >
      <Box paddingBottom={theme.spacing.small}>
        <Header
          backgroundColor={theme.colors.background.base}
          leftComponent={
            <MaterialIcon
              name={"close"}
              size={20}
              color={theme.colors.text.muted}
              onPress={onClose}
              style={{
                ...buildCircle({
                  radius: 16,
                  backgroundColor: Colors.transparent,
                  borderColor: Color(theme.colors.border.muted)
                    .a(0.5)
                    .toString(),
                  borderWidth: 1
                }),
                paddingLeft: 5,
                paddingTop: 5
              }}
            />
          }
          centerComponent={
            <Heading
              size={"h3"}
              color={theme.colors.text.default}
              weight={"500"}
            >
              {strings.ticket}
            </Heading>
          }
          rightComponent={
            <DoneButton
              onPress={submit}
              active={canSubmit}
            />
          }
        />

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flex: 1, minWidth: 450, height: 60 }}
        >
          <Spacing size={theme.layout.gutterWidth} orientation={"horizontal"} />
          <ThemedButton
            shape={"pill"}
            width={113}
            height={40}
            spaceHorizontal={"small"}
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            backgroundColor={first?.packageType === "PAID" ? Colors.veryLightPink : Colors.snow}
            borderWidth={1}
            borderColor={first?.packageType === "PAID" ? Colors.burgundy : Colors.iceBlue}
            title={"Paid ticket"}
            onPress={addPaidPackage}
            appearance={"outline"}
            overrides={{
              IconBefore: {
                component: AddIcon
              }
            }}
          />
          <Spacing size={theme.layout.gutterWidth} orientation={"horizontal"} />
          <ThemedButton
            shape={"pill"}
            width={113}
            height={40}
            spaceHorizontal={"small"}
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            backgroundColor={first?.packageType === "FREE" ? Colors.veryLightPink : Colors.snow}
            borderWidth={1}
            borderColor={first?.packageType === "FREE" ? Colors.burgundy : Colors.iceBlue}
            title={"Free ticket"}
            onPress={addFreePackage}
            appearance={"outline"}
            overrides={{
              IconBefore: {
                component: AddIcon
              }
            }}
          />
          <Spacing size={theme.layout.gutterWidth} orientation={"horizontal"} />
          <ThemedButton
            shape={"pill"}
            width={113}
            height={40}
            spaceHorizontal={"small"}
            flexDirection={"row"}
            backgroundColor={first?.packageType === "DONATION" ? Colors.veryLightPink : Colors.snow}
            borderColor={first?.packageType === "DONATION" ? Colors.burgundy : Colors.iceBlue}
            borderWidth={1}
            justifyContent={"center"}
            alignItems={"center"}
            title={"Donation"}
            onPress={addDonationPackage}
            appearance={"outline"}
            overrides={{
              IconBefore: { 
                component: AddIcon
            }}}
          />
          <Spacing size={theme.layout.gutterWidth} orientation={"horizontal"} />
        </ScrollView>
      </Box>
      <Divider color={Colors.iceBlue} size={8} />
      <Box spaceTop={"medium"}>
        <KeyboardAwareFlatList
          data={packages}
          renderItem={renderPackage}
          ItemSeparatorComponent={ItemSeparator}
          enableAutomaticScroll={true}
          enableOnAndroid={true}
        />
      </Box>
    </Modal>
  );
};

interface PackageInputProps {
  packageType?: PackageType;
  packageModel: EventPackage;
  updatePackage: (ticket: EventPackage) => void;
  onRemove?: () => void;
}
const PackageInputSection = ({
  packageModel,
  onRemove,
  updatePackage
}: PackageInputProps) => {
  
  const theme = useTheme();
  const inputStyle: StyleProp<TextStyle> = {
    ...textInputStyle,
    ...theme.headingSizes.h3,
    ...{ fontWeight: "600" }
  };
  const {
    packageType = "PAID",
    packageName,
    price,
    quantity,
    description
  } = packageModel;

  const updatePrice = (price?: number) => updatePackage({ ...packageModel, price });
  const updateQuantity = (quantity?: number) => updatePackage({ ...packageModel, quantity });
  const updatePackageName = (packageName: string) => updatePackage({ ...packageModel, packageName });
  const updateDescription = (description: string) => {
    if (description.length <= 250) {
      updatePackage({ ...packageModel, description });
    }
  }
  
  return (
    <Box>
      <Box flexDirection={"row"} justifyContent={"space-between"} paddingHorizontal={15}>
        <Heading size={"h3"} weight={"600"}>
          {packageType?.charAt(0) + packageType?.slice(1).toLowerCase()}
        </Heading>
        <Box shape={"circle"} height={32} width={32} marginTop={5} justifyContent={"center"} alignItems={"center"} borderColor={Colors.iceBlue} borderWidth={1}>
          <MaterialIcon name={"delete"} onPress={onRemove} size={20} />
        </Box>
      </Box>
      <Box paddingHorizontal={15}>
      <Label label={"Ticket name"}>
        <TextInput
          onValueChange={updatePackageName}
          value={packageName}
          placeholder={packageType?.charAt(0) + packageType?.slice(1).toLowerCase()}
          style={inputStyle}
          
        />
      </Label>
      <Spacing size={"medium"}/>
      <Label label={"Quantity"}>
        <NumericTextInput
          onUpdate={updateQuantity}
          value={quantity}
          placeholder={"100"}
          style={inputStyle}
        />
      </Label>
      <Spacing size={"medium"} />
      {packageType === "PAID" && (
        <Box spaceBottom={"medium"}>
          <Label label={"Price"}>
            <NumericTextInput
              onUpdate={updatePrice}
              value={price}
              type={"currency"}
              locale={"en-US"}
              currency={"USD"}
              placeholder={"$10.00"}
              style={inputStyle}
            />
          </Label>
        </Box>
        )}
      </Box>
      <Divider size={8} color={theme.colors.border.muted} />
      <Box paddingHorizontal={15}>
        <Spacing size={"small"} />
        <Label label={"Ticket Description"}>
          <TextInput
            onValueChange={updateDescription}
            value={description}
            style={inputStyle}
            multiline={true}
          />
        
          <Box spaceTop={"xsmall"} flexDirection={"row"} justifyContent={"flex-end"}>
            <Heading size={12} color={Colors.warmGrey}>
              {`${description ? description.length : 0}/250`}
            </Heading>
          </Box>
          </Label>
      </Box>
      <Spacing size={"medium"} />
    </Box>
  );
};

const AddIcon = () => <MaterialIcon name={"add"} size={20} color={Colors.onyx}/>

const textInputStyle = {
  borderBottomWidth: 1,
  borderBottomColor: Colors.iceBlue,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderTopWidth: 0
};
