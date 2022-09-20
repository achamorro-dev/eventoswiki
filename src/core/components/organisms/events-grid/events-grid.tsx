import type { FC } from "react";
import type { AstroEvent } from "../../../events/astro-event";
import { EventCard } from "../../molecules/event-card/event-card";

export const EventsGrid: FC<{ events: AstroEvent[] }> = ({ events }) => {
  return (
    <div className="grid grid-cols-12 col-span-12 gap-7">
      {events.map((event: AstroEvent) => {
        return (
          <EventCard
            title={event.frontmatter.title}
            tags={event.frontmatter.tags}
            tagColor={event.frontmatter.tagColor}
            image={event.frontmatter.thumbnail}
            location={event.frontmatter.location}
            startDate={event.frontmatter.startDate}
            href={event.url}
            className="col-span-12 md:col-span-6 lg:col-span-4"
          />
        );
      })}
    </div>
  );
};
