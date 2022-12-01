import type { FC } from "react";
import { Datetime } from "../../../datetime/datetime";
import { Calendar } from "../../atoms/icons/calendar";

export const EventDatePeriod: FC<{ startDate: string; endDate?: string }> = ({
  startDate,
  endDate,
}) => {
  return (
    <div className="flex">
      {startDate && (
        <div className="flex items-center gap-1">
          <Calendar color="white" size="1.2rem" />
          <p className="text-sm text-white py-2">
            {Datetime.toDateTimeString(startDate)}
          </p>
        </div>
      )}
      {endDate && (
        <div className="flex items-center">
          <p className="text-sm text-white py-2">
            &nbsp;· {Datetime.toDateTimeString(endDate)}
          </p>
        </div>
      )}
    </div>
  );
};
