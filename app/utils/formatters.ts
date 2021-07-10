import moment, { ISO_8601, Moment } from "moment";
import { hours24to12 } from "./helpers";

export const createDateFormatter = (date?: string) => moment(date, ISO_8601);
// Sun, Sep 1 • 10:00PM

export const formatStartTime = (start: string) => {
  const startDate = moment(start, ISO_8601);
  if (startDate.isValid()) {
    const minutes = startDate.minutes();
    const timeOfDay = `${getHour12(startDate)}${":" +
      (minutes === 0 ? "00" : minutes.toString())}${startDate
      .format("a")
      .toUpperCase()}`;
    const dayOfWeek = startDate.format("ddd");
    const monthDay = `${startDate.format("MMM")} ${startDate.date()}`;
    return `${dayOfWeek}, ${monthDay} • ${timeOfDay}`;
  }
  return "";
};
export const formatEventTime = (start: string, end: string) => {
  try {
    const startDate = moment(start, ISO_8601);
    const endDate = moment(end, ISO_8601);
    if (startDate.isValid()) {
      const startMinutes = startDate.minutes();
      const endMinutes = endDate.minutes();
      if (startDate.date() === endDate.date()) {
        return (
          `${startDate.format("MMM")} ${startDate.date()}: ${
            hours24to12(startDate.hour()).hour
          }${
            startMinutes === 0 ? "" : ":" + startMinutes.toString()
          } ${startDate.format("a").toUpperCase()}` +
          ` - ${hours24to12(endDate.hour()).hour}${
            endMinutes === 0 ? " " : ":" + endMinutes.toString()
          } ${endDate.format("a").toUpperCase()}`
        );
      }
      return (
        `${startDate.format("MMM")} ${startDate.date()}: ${
          hours24to12(startDate.hour()).hour
        }${
          startMinutes === 0 ? "" : ":" + startMinutes.toString()
        } ${startDate.format("a").toUpperCase()}` +
        ` - ${endDate.format("MMM")} ${endDate.date()}: ${
          hours24to12(endDate.hour()).hour
        }${
          endMinutes === 0 ? "" : ":" + endMinutes.toString()
        } ${endDate.format("a").toUpperCase()}`
      );
    }
    return " ";
  } catch (error) {
    return " ";
  }
};

export const getTime = (date: moment.Moment) => {
  if (date.isValid()) {
    const minutes = date.minutes();
    return `${hours24to12(date.hour()).hour}${
      minutes === 0 ? " " : ":" + minutes.toString()
    }`;
  }
  return " ";
};

export const getTimeWithMeridian = (date: moment.Moment) => {
  if (date.isValid()) {
    const minutes = date.minutes();
    return `${getHour12(date)}${
      minutes === 0 ? ":00" : ":" + minutes.toString()
    } ${date.format("a").toUpperCase()}`;
  }
  return " ";
};

export const getMonth = (date: moment.Moment) =>
  date.isValid() ? date.format("MMM") : " ";

export const getDay = (date: moment.Moment) =>
  date.isValid() ? date.date().toString() : " ";

export const getHour12 = (date: moment.Moment) =>
  date.isValid() ? hours24to12(date.hour()).hour : " ";
