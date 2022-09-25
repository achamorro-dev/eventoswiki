import type { FC } from "react";
import { Card } from "../../atoms/card/card";
import { Tag } from "../../atoms/tag/tag";
import { Calendar } from "../../atoms/icons/Calendar";
import { Datetime } from "../../../datetime/datetime";
import { MapPin } from "../../atoms/icons/MapPin";

type EventCardProps = {
  title: string;
  description?: string;
  image: string;
  tags: string[];
  tagColor?: string;
  className?: string;
  location?: string;
  startDate?: string;
  href?: string;
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
    href = "#",
    tagColor,
  } = props;

  return (
    <a href={href} className={className}>
      <Card className="relative transition-shadow duration-300 lg:hover:shadow-md">
        <img className="object-cover w-full h-56" src={image} />
        <div className="relative top-0 left-3 -mt-3 flex items-center flex-wrap gap-1 rounded-full">
          {tags.map((t) => (
            <Tag color={tagColor}>{t}</Tag>
          ))}
        </div>
        <h3 className="text-base font-bold p-4 pb-0 sm:text-lg md:text-xl text-black dark:text-gray-100">
          {title}
        </h3>
        <p className="py-0 px-4 mt-2 text-sm text-gray-500 line-clamp-3 dark:text-gray-50">
          {description}
        </p>
        <div className="w-full flex gap-4 items-center p-4">
          {startDate && (
            <div className="flex items-center">
              <Calendar />
              <p className="text-sm text-gray-500 dark:text-gray-50">
                {Datetime.toDateString(startDate)}
              </p>
            </div>
          )}
          {location && (
            <div className="flex items-center">
              <MapPin />
              <p className="text-sm text-gray-500 dark:text-gray-50">
                {location}
              </p>
            </div>
          )}
        </div>
      </Card>
    </a>
  );
};
