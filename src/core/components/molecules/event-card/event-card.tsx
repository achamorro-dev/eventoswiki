import { FC, useMemo } from "react";
import { Card } from "../../atoms/card/card";
import { Tag } from "../../atoms/tag/tag";
import { Calendar } from "../../atoms/icons/calendar";
import { Datetime } from "../../../datetime/datetime";
import { MapPin } from "../../atoms/icons/map-pin";

type EventCardProps = {
  title: string;
  description?: string;
  image: string;
  tags: string[];
  tagColor?: string;
  className?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  href?: string;
  altImage?: string;
};

export const EventCard: FC<EventCardProps> = (props) => {
  const {
    title,
    description = "",
    image,
    tags = [],
    className = "",
    location = "",
    startDate = "",
    endDate = "",
    href = "#",
    tagColor,
    altImage,
  } = props;

  const showEndDate = useMemo(() => {
    const start = Datetime.toDateString(startDate);
    const end = Datetime.toDateString(endDate);

    return start !== end;
  }, [startDate, endDate]);

  return (
    <a href={href} className={className}>
      <Card className="relative transition-shadow duration-300 lg:hover:shadow-md">
        <img
          className="object-cover w-full h-56"
          src={image}
          alt={altImage || `Foto de portada del evento ${title}`}
        />
        <div className="relative top-0 left-3 -mt-3 flex items-center flex-wrap gap-1 rounded-full">
          {tags.map((t) => (
            <Tag color={tagColor}>{t}</Tag>
          ))}
        </div>
        <div className="w-full flex flex-col-reverse justify-center items-start px-4 mt-2">
          <h3 className="text-base font-bold sm:text-lg md:text-xl text-black dark:text-gray-100 p-0 my-2">
            {title}
          </h3>
          {startDate && (
            <div className="flex items-center gap-1">
              <Calendar />
              <div className="flex items-center content-center">
                <p className="text-sm text-gray-500 dark:text-gray-50 p-0">
                  {Datetime.toDateString(startDate)}
                </p>
                {showEndDate && (
                  <p className="text-sm text-gray-500 dark:text-gray-50 p-0">
                    &nbsp;-&nbsp;
                    {Datetime.toDateString(endDate)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <p className="py-0 px-4 mt-2 text-sm text-gray-500 line-clamp-2 dark:text-gray-50">
          {description}
        </p>
        {location && (
          <div className="w-full flex items-center justify-end px-4">
            <MapPin />
            <p className="text-sm text-gray-500 dark:text-gray-50">
              {location}
            </p>
          </div>
        )}
        {/* </div> */}
      </Card>
    </a>
  );
};
