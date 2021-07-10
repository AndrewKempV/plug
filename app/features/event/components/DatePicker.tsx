import React from "react";
import {
  TouchableOpacity,
  Platform,
  Text,
  StyleSheet,
  View
} from "react-native";
import DateTimePicker, { AndroidEvent } from "@react-native-community/datetimepicker";
import { Colors } from "config/styles";

const styles = StyleSheet.create({
  header: {
    width: "100%",
    padding: 16,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: Colors.paleBlue,
    borderBottomWidth: 1,
    borderColor: "grey"
  },
  container: {
    backgroundColor: `${Platform.OS === "ios" ? "#00000066" : "transparent"}`,
    position: "absolute",
    justifyContent: "flex-end",
    top: "0%",
    width: "100%",
    height: "100%"
  }
});

interface Props {
  date: Date;
  pickerMode: "date" | "time";
  display?: "spinner" | "clock" | "calendar" | "default";
  onClose: (date?: Date) => void;
  onChange: (date: Date) => void;
}

interface State {
  date: Date;
}

export default class DatePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      date: new Date(this.props.date)
    };
  }

  render() {
    const { onClose, onChange } = this.props;
    const { date } = this.state;

    const close = () => onClose(this.state.date);
    const handleDateChange = (e: AndroidEvent, d?: Date) => {
      if (Platform.OS === "ios" && d) {
        this.setState({ date: d });
        onChange(d);
      } else {
        onClose(d);
      }
    };
    return (
      <TouchableOpacity style={styles.container} onPress={close}>
        {Platform.OS === "ios" && (
          <View style={styles.header}>
            <TouchableOpacity onPress={close}>
              <Text style={{ color: "blue", fontWeight: "700" }}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
        <DateTimePicker
          value={date}
          mode={this.props.pickerMode}
          display={this.props.display}
          onChange={handleDateChange}
          style={{ backgroundColor: Colors.paleGrey }}
        />
      </TouchableOpacity>
    );
  }
}
