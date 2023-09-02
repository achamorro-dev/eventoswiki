import { AddToCalendarButton as AddToCalendar } from 'add-to-calendar-button-react';
import { type FC } from "react";
import "./add-to-calendar-button.css";

type AddToCalendarButtonProps = {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export const AddToCalendarButton: FC<AddToCalendarButtonProps> = (props) => {
  return (
    <AddToCalendar {...props} listStyle='dropdown' trigger='click' iCalFileName={props.title} label='Añadir a calendario' options={["Apple", "Google", "iCal", "Microsoft365", "Outlook.com"]} timeZone='Europe/Madrid' />
  );
};
