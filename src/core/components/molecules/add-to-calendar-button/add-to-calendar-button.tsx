import { FC, useEffect } from "react";
import { atcb_init } from "add-to-calendar-button";
import "add-to-calendar-button/assets/css/atcb.css";
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
  const {
    title,
    description = "",
    location = "",
    startDate,
    endDate,
    startTime,
    endTime,
  } = props;

  useEffect(atcb_init, []);

  return (
    <div className="atcb">
      {"{"}
      "name":"{title}", "description":"{description}", "startDate":"{startDate}
      ", "endDate":"{endDate}", "startTime":"{startTime}", "endTime":"{endTime}
      ", "location":"{location}", "label":"Añadir a calendario", "options":[
      "Apple", "Google", "iCal", "Microsoft365", "Outlook.com"],
      "timeZone":"Europe/Madrid", "iCalFileName":"{title}", "listStyle":
      "dropdown", "trigger": "click"
      {"}"}
    </div>
  );
};
