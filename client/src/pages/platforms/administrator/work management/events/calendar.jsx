import React from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import { useSelector } from "react-redux";

export default function ReactCalendar() {
  const { collections } = useSelector(({ events }) => events);

  return (
    <Calendar
      localizer={Calendar.momentLocalizer(moment)}
      defaultDate={new Date()}
      defaultView="month"
      events={collections}
      style={{ height: "70vh", marginBottom: "1.5rem" }}
    />
  );
}
