import { FC, useEffect, useState, CSSProperties, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./big-calendar.css";
import type { CalendarEvent } from "./calendar-event";
import { Datetime } from "../../../datetime/datetime";

moment.locale("es", {
  week: {
    dow: 1,
  },
});

const localizer = momentLocalizer(moment);

type BigCalendarProps = {
  events: CalendarEvent[];
};

interface CustomCSS extends CSSProperties {
  "--event-background-color": string;
}

// @ts-ignore
const allViews = [Views.MONTH, Views.WEEK, Views.AGENDA];
const agendaView = [Views.AGENDA];

export const BigCalendar: FC<BigCalendarProps> = ({ events }) => {
  const [isSmallView, setIsSmallView] = useState<boolean>();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    setIsSmallView(window.innerWidth < 768);
  }, []);

  const formats = useMemo(
    () => ({
      dayFormat: Datetime.toDayString,
      dateFormat: Datetime.toDayNumberString,
      agendaDateFormat: Datetime.toDayString,
      monthHeaderFormat: Datetime.toMonthYearString,
      weekdayFormat: Datetime.toWeekdayString,
      dayRangeHeaderFormat: (range: { start: Date; end: Date }) =>
        Datetime.toDateRangeString(range.start, range.end),
      agendaHeaderFormat: (range: { start: Date; end: Date }) =>
        Datetime.toDateRangeString(range.start, range.end),
    }),
    []
  );

  const onSelectEvent = (event: CalendarEvent) => {
    window.location.href = event.url;
  };

  return (
    <section className="calendar-wrapper">
      <Calendar
        className="big-calendar"
        localizer={localizer}
        events={events}
        views={isSmallView ? agendaView : allViews}
        view={isSmallView ? agendaView[0] : undefined}
        formats={formats}
        popup
        messages={{
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          allDay: "Todo el día",
          week: "Semana",
          work_week: "Semana de trabajo",
          day: "Día",
          month: "Mes",
          previous: "Anterior",
          next: "Siguiente",
          yesterday: "Ayer",
          tomorrow: "Mañana",
          today: "Hoy",
          agenda: "Agenda",
          noEventsInRange: "No hay eventos dentro del rango de fechas",
          showMore: (e) => `+${e} más`,
        }}
        eventPropGetter={(event) => ({
          className: "event",
          style: {
            "--event-background-color": event.color,
          } as CustomCSS,
        })}
        onSelectEvent={onSelectEvent}
      />
    </section>
  );
};
