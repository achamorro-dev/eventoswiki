import { FC, useEffect, useState, CSSProperties } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./big-calendar.css";
import type { CalendarEvent } from "./calendar-event";

moment.locale("es");

const localizer = momentLocalizer(moment);

type BigCalendarProps = {
  events: CalendarEvent[];
};

interface CustomCSS extends CSSProperties {
  "--event-background-color": string;
}

// @ts-ignore
const allViews = Object.keys(Views).map((k) => Views[k]);
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
