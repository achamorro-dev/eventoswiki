import type { FC } from "react";
import type { AstroEvent } from "../../../events/astro-event";
import { EventCard } from "../../molecules/event-card/event-card";

export const EventsGrid: FC<{ events: AstroEvent[] }> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {events.map((event: AstroEvent) => {
        return (
          <EventCard
            title={event.frontmatter.title}
            description={event.frontmatter.shortDescription}
            tags={event.frontmatter.tags}
            tagColor={event.frontmatter.tagColor}
            image={event.frontmatter.thumbnail}
            location={event.frontmatter.location}
            startDate={event.frontmatter.startDate}
            endDate={event.frontmatter.endDate}
            href={event.url}
            className="inline-grid w-full"
          />
        );
      })}
    </div>
  );
};
