import type { FC } from "react";
import { Datetime } from "../../../datetime/datetime";
import { Calendar } from "../../atoms/icons/calendar";

export const EventDatePeriod: FC<{ startDate: string; endDate?: string }> = ({
  startDate,
  endDate,
}) => {
  const startDateHumanized = Datetime.toDateTimeString(startDate);
  const endDateHumanized = Datetime.toDateTimeString(endDate);

  return (
    <div className="flex">
      {startDate && (
        <div className="flex items-center gap-1">
          <Calendar color="white" size="1.2rem" />
          <p
            className="text-sm text-white py-2"
            aria-label={`Fecha de inicio ${startDateHumanized}`}
            tabIndex={0}
          >
            {startDateHumanized}
          </p>
        </div>
      )}
      {endDate && (
        <div className="flex items-center">
          <p
            className="text-sm text-white py-2"
            tabIndex={0}
            aria-label={`Fecha de fin ${endDateHumanized}`}
          >
            &nbsp;· {endDateHumanized}
          </p>
        </div>
      )}
    </div>
  );
};
