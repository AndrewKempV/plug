import React, { useState, useMemo } from "react";
import { Modal, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import {
  Box,
  Spacing,
  ThemedButton,
  Heading,
  Label,
  Divider,
  TextInput,
  Text,
  useLayout,
  Popover,
} from "app/components";
import { useDropdownMenu, Option } from "app/components/Dropdown";
import { useTheme, Theme } from "app/theme";
import { Colors, buildCircle } from "app/config/styles";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { Header } from "react-native-elements";
import * as yup from "yup";
import useFormal from "@kevinwolf/formal";
import DatePicker from "./DatePicker";
import moment from "moment";
import Color from "color";
import { EventDateTimeFields } from "features/event/screens/CreateEvent/CreateEventScreen";
import RadioButtonGroup, { RadioButton } from "app/components/RadioGroup";
import RRule, { Frequency } from "rrule";
import NumericTextInput from "app/components/Input/NumericInput";
import { FormField } from "app/components/FormField";

type FrequencyOption = "Daily" | "Weekly" | "Monthly" | "Yearly";

const frequencyMap: Record<FrequencyOption, Frequency> = {
  Daily: RRule.DAILY,
  Weekly: RRule.WEEKLY,
  Monthly: RRule.MONTHLY,
  Yearly: RRule.YEARLY,
};

interface RecurrenceDropdownProps {
  frequency: FrequencyOption;
  date: Date;
  changeFrequency: (id: string) => () => void;
  value: string;
}

const ruleGenerator = (dtstart: Date, frequency: FrequencyOption) => {
  switch (frequency) {
    case "Daily":
      return new RRule({
        dtstart,
        freq: frequencyMap[frequency],
      });
    case "Weekly":
      return new RRule({
        dtstart,
        freq: frequencyMap[frequency],
      });
    case "Monthly":
      return new RRule({
        dtstart,
        freq: frequencyMap[frequency],
        byweekday: dtstart.getDay(),
      });
    case "Yearly":
      return new RRule({
        dtstart,
        freq: frequencyMap[frequency],
      });
  }
};

const RecurrenceDropdown = ({
  frequency,
  date,
  changeFrequency,
  value,
}: RecurrenceDropdownProps) => {
  const rule = ruleGenerator(date, frequency);
  // const rule = new RRule({
  //   dtstart: date,
  //   freq: frequencyMap[frequency],
  //   byweekday: date.getDay(),
  // });
  const selectionOptions = [
    {
      id: rule.toText(),
      title: rule.toText(),
    },
  ];
  console.log(rule.toText());

  const theme = useTheme();
  const styles = getStyles(theme);
  const chevron = (
    <Entypo
      name={"chevron-thin-down"}
      size={15}
      color={theme.colors.text.muted}
      style={styles.chevron}
    />
  );

  const options: Option[] = useMemo(
    () =>
      selectionOptions.map((option) => ({
        id: option.id,
        title: option.title,
        onSelect: changeFrequency(option.title),
      })),
    [frequency, date]
  );
  const { buttonRef, menu, toggle } = useDropdownMenu({
    options,
    selectedId: rule.toText(),
  });
  return (
    <Box>
      <TouchableOpacity
        ref={buttonRef}
        onPress={toggle}
        style={styles.pickerInput}
      >
        <Text>{value}</Text>
        <Box>{chevron}</Box>
      </TouchableOpacity>
      {menu}
    </Box>
  );
};

const schema = yup.object().shape({
  fromTime: yup.date().required(),
  toTime: yup.date().required(),
  fromDate: yup.date().required(),
  toDate: yup.date().required(),
  frequency: yup.string(),
});

interface Props {
  visible?: boolean;
  onClose: () => void;
  onSubmit: (fields: EventDateTimeFields) => void;
}

export const EventDateForm = ({ visible, onClose, onSubmit }: Props) => {
  const [mode, setMode] = useState<number>(0);
  // const [interval, setInterval] = useState<number>(1);
  const [frequency, setFreq] = useState<FrequencyOption>("Daily");
  const now = new Date(Date.now());
  now.setHours(18);
  now.setMinutes(0);
  now.setSeconds(0);
  const from = {
    fromTime: new Date(now),
    fromDate: new Date(now),
  };
  now.setHours(now.getHours() + 3);
  const to = {
    toTime: new Date(now),
    toDate: new Date(now),
  };
  const initialValues = {
    frequency: "",
    ...from,
    ...to,
  };

  const formal = useFormal(initialValues, {
    schema,
    onSubmit: (values) => {
      const from = values.fromDate;
      from.setTime(values.fromTime.getTime());
      const to = values.toDate;
      to.setTime(values.toTime.getTime());
      onSubmit({
        from,
        to,
        frequency: values.frequency,
      });
    },
  });

  type Field = keyof Omit<typeof formal.values, "frequency">;

  const layout = useLayout();
  const theme = useTheme();
  const styles = getStyles(theme);
  const inputStyle = {
    ...styles.pickerInput,
    ...{
      width: INPUT_WIDTH,
      paddingLeft: theme.layout.gutterWidth,
    },
  };
  const [focusedField, setFocusedField] = useState<Field | "none">("none");
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  const changeFrequency = (frequency: string) =>
    formal.change("frequency", frequency);

  const editField = (field: Field, type: "date" | "time") => {
    Keyboard.dismiss();
    setPickerMode(type);
    setFocusedField(field);
  };

  const editToDate = () => editField("toDate", "date");
  const editFromDate = () => editField("fromDate", "date");
  const editFromTime = () => editField("fromTime", "time");
  const editToTime = () => editField("toTime", "time");

  const submit = () => {
    const { fromDate, toDate, frequency } = formal.values;
    fromDate.setTime(formal.values.fromTime.getTime());
    toDate.setTime(formal.values.toTime.getTime());
    console.log(from);
    console.log(frequency);
    onSubmit({
      from: fromDate,
      to: toDate,
      frequency,
    });
    onClose();
  };

  const canSubmit =
    mode === 1
      ? formal.getSubmitButtonProps().disabled
      : formal.getSubmitButtonProps().disabled &&
        formal.values.frequency.length > 0;

  // const updateDropdownMenu = () => {
  //   return frequencySelect.map((option) => ({
  //     id: option.id,
  //     title: option.title,
  //     onSelect: changeFrequency(option.title),
  //   }));
  // };
  const OPTIONS: Option[] = useMemo(() => {
    return frequencySelect.map((option) => ({
      id: option.id,
      title: option.title,
      onSelect: () => {
        changeFrequency(
          ruleGenerator(formal.values.fromDate, option.id).toString()
        );
        setFreq(option.id);
      },
    }));
  }, [frequency]);

  const { buttonRef, menu, toggle } = useDropdownMenu({
    options: OPTIONS,
    selectedId: frequency,
  });

  const closePicker = () => setFocusedField("none");
  const chevron = (
    <Entypo
      name={"chevron-thin-down"}
      size={15}
      color={theme.colors.text.muted}
      style={styles.chevron}
    />
  );

  return (
    <Modal
      transparent={false}
      presentationStyle={"pageSheet"}
      animationType={"slide"}
      visible={visible}
    >
      <Box>
        <Header
          backgroundColor={Colors.snow}
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
                  borderWidth: 1,
                }),
                paddingLeft: 5,
                paddingTop: 5,
              }}
            />
          }
          centerComponent={
            <Heading size={"h3"} color={Colors.onyx} weight={"500"}>
              {"Event Date and Time"}
            </Heading>
          }
        />
        <Divider color={theme.colors.border.muted} size={0.5} />
        <Box
          paddingHorizontal={theme.layout.gutterWidth}
          marginTop={theme.spacing.medium}
          marginBottom={theme.spacing.small}
          width={TOP_SECTION_WIDTH + theme.layout.gutterWidth * 2}
        >
          <Label label={"How does this event occur?"}>
            <Spacing size={"large"} orientation={"vertical"} />
            <RadioButtonGroup
              onSelect={(index, item) => setMode(index)}
              selectedIndex={mode}
              data={formOptions}
              renderItem={(itemInfo) => {
                const { title, subtitle } = itemInfo.item;
                const press = () => setMode(itemInfo.index);
                const isSelected = itemInfo.index === mode;
                return (
                  <RadioButton
                    title={title}
                    subtitle={subtitle}
                    size={25}
                    thickness={2}
                    onPress={press}
                    isSelected={isSelected}
                    seperatorSpace={5}
                    radioPosition={"left"}
                  />
                );
              }}
            />
          </Label>
        </Box>
        {mode === 1 && (
          <Box
            paddingHorizontal={theme.layout.gutterWidth}
            width={BOTTOM_CONTAINER_WIDTH + theme.layout.gutterWidth * 2}
          >
            <Box
              flexDirection={"row"}
              justifyContent={"space-between"}
              paddingTop={theme.spacing.medium}
            >
              <Label label={"From"}>
                <TextInput
                  size={"small"}
                  style={inputStyle}
                  onFocus={editFromTime}
                  value={moment(formal.values.fromTime).format("h:mm a")}
                />
              </Label>
              <Label label={"To"}>
                <TextInput
                  size={"small"}
                  style={inputStyle}
                  onFocus={editToTime}
                  value={moment(formal.values.toTime).format("h:mm a")}
                />
              </Label>
            </Box>
          </Box>
        )}
        {mode === 1 && (
          <Box
            paddingHorizontal={theme.layout.gutterWidth}
            marginTop={theme.spacing.medium}
            marginBottom={theme.spacing.small}
            width={BOTTOM_CONTAINER_WIDTH + theme.layout.gutterWidth * 2}
          >
            <Heading
              size={"h3"}
              color={theme.colors.text.primary}
              weight={"bold"}
            >
              {"Schedule"}
            </Heading>
            <Spacing size={"large"} orientation={"vertical"} />
            {/* <TextInput size={"small"} style={inputStyle} value={frequency} /> */}
            {/* <FormField
              label={"Every"}
              description={"Every 2 weeks on Friday for 6 times"}
            >
              <TextInput
                size={"small"}
                style={inputStyle}
                onChangeText={(frequency) => changeFrequency(frequency)}
                value={frequency}
              />
            </FormField> */}

            <Label label={"Every"} position={"top"}>
              <TouchableOpacity
                ref={buttonRef}
                onPress={toggle}
                style={[styles.pickerInput]}
              >
                <Text>{reverseFreqMap[frequency]}</Text>
                <Box>{chevron}</Box>
              </TouchableOpacity>
              {menu}
            </Label>

            <Box
              flexDirection={"row"}
              justifyContent={"space-between"}
              paddingHorizontal={0}
              paddingTop={theme.spacing.medium}
            >
              <Label label={"Start date"}>
                <TextInput
                  size={"small"}
                  style={inputStyle}
                  onFocus={editFromDate}
                  value={moment(formal.values.fromDate).calendar("MM/DD/YYYY")}
                />
              </Label>
              <Label label={"End date"}>
                <TextInput
                  size={"small"}
                  style={inputStyle}
                  onFocus={editToDate}
                  value={moment(formal.values.toDate).calendar("MM/DD/YYYY")}
                />
              </Label>
            </Box>
          </Box>
        )}
        {mode === 0 && (
          <Box
            paddingHorizontal={theme.layout.gutterWidth}
            marginTop={theme.spacing.medium}
            marginBottom={theme.spacing.small}
            width={"100%"}
          >
            <Box
              flexDirection={"row"}
              justifyContent={"space-between"}
              spaceRight={25}
            >
              <Label label={"Start date"}>
                <TextInput
                  size={"small"}
                  style={inputStyle}
                  onFocus={editFromDate}
                  value={moment(formal.values.fromDate).calendar("MM/DD/YYYY")}
                />
              </Label>
              <Label label={"From"}>
                <TextInput
                  size={"small"}
                  style={inputStyle}
                  onFocus={editFromTime}
                  value={moment(formal.values.fromTime).format("h:mm a")}
                />
              </Label>
            </Box>
            <Spacing size={"large"} orientation={"vertical"} />
            <Box
              flexDirection={"row"}
              justifyContent={"space-between"}
              paddingRight={25}
            >
              <Label label={"End date"}>
                <TextInput
                  size={"small"}
                  style={inputStyle}
                  onFocus={editToDate}
                  value={moment(formal.values.toDate).calendar("MM/DD/YYYY")}
                />
              </Label>
              <Label label={"To"}>
                <TextInput
                  size={"small"}
                  style={inputStyle}
                  onFocus={editToTime}
                  value={moment(formal.values.toTime).format("h:mm a")}
                />
              </Label>
            </Box>
          </Box>
        )}
        <Box
          justifyContent={"center"}
          alignItems={"center"}
          paddingTop={
            layout.currentScreenSize !== "medium" &&
            layout.currentScreenSize !== "large"
              ? 20
              : 90
          }
        >
          <Heading size={"h5"} align={"center"}>
            {`Starts ${formal.values.fromDate.toDateString()} through to ${formal.values.toDate.toDateString()}`}
          </Heading>
          <Spacing size={"small"} />
          <ThemedButton
            color={"primary"}
            appearance={"primary"}
            size={"medium"}
            minWidth={296}
            minHeight={theme.controlHeights.medium}
            title={"Okay"}
            onPress={submit}
            disabled={canSubmit}
          />
        </Box>

        {focusedField !== "none" && (
          <DatePicker
            date={formal.values[focusedField]}
            pickerMode={pickerMode}
            onChange={(date) => formal.change(focusedField, date)}
            onClose={closePicker}
          />
        )}
      </Box>
    </Modal>
  );
};

const getStyles = (theme: Theme) => {
  // theme.colors.border.default;
  const styles = StyleSheet.create({
    pickerInput: {
      ...theme.containerShapes.rounded,
      borderWidth: 1,
      borderColor: theme.colors.border.secondary,
      height: theme.controlHeights.small,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: theme.layout.gutterWidth,
    },
    frequencyPicker: {},
    chevron: {
      paddingRight: 15,
      paddingTop: 7,
    },
  });

  return styles;
};

const TOP_SECTION_WIDTH = 272;
const BOTTOM_CONTAINER_WIDTH = 304;
const INPUT_WIDTH = 136;

const reverseFreqMap: Record<FrequencyOption, string> = {
  Daily: "Day",
  Weekly: "Week",
  Monthly: "Month",
  Yearly: "Year",
};
const frequencySelect: { id: FrequencyOption; title: string }[] = [
  { id: "Daily", title: "Day" },
  { id: "Weekly", title: "Week" },
  { id: "Monthly", title: "Month" },
  { id: "Yearly", title: "Year" },
];
const formOptions = [
  {
    title: "Single event",
    subtitle: "One time event that may last multiple days",
  },
  {
    title: "Recurring event",
    subtitle: "Repeats or occurs more than once",
  },
];
