import RRule, { ByWeekday } from "rrule";
import { ButtonGroup } from "react-native-elements";

interface Props {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const weekdayButtons: string[] = [
  "MO",
  "TU",
  "WE",
  "TH",
  "FR",
  "SA",
  "SU",
];

export const WeekdayInput = ({ selectedIndex, onSelect }: Props) => {
  return (
    <ButtonGroup
      onPress={onSelect}
      buttons={weekdayButtons}
      selectedIndex={selectedIndex}
      containerStyle={{ height: 80 }}
    />
  );
};
