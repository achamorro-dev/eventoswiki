import { Datetime } from "../datetime/datetime";
import type { AstroEvent, FilterEvent } from "./astro-event";

export class EventUtils {
  static getNextEvents(events: AstroEvent[], filter?: FilterEvent): AstroEvent[] {
    return events.filter((event) => {
      if (!event.frontmatter.endDate) return false;

      if (filter && filter.location) {
        if (this.slugify(event.frontmatter.location) !== filter.location) return false;
      }

      return Datetime.isAfterYesterday(event.frontmatter.endDate);
    });
  }

  static getLastEvents(events: AstroEvent[], filter?: FilterEvent): AstroEvent[] {
    return events.filter((event) => {
      if (!event.frontmatter.endDate) return false;

      if (filter && filter.location) {
        if (this.slugify(event.frontmatter.location) !== filter.location) return false;
      }

      return Datetime.isBeforeToday(event.frontmatter.endDate);
    });
  }

  static getLocationEvents(events: AstroEvent[]): string[] {
    const locations = events
      .map((event) => event.frontmatter.location ?? '')
      .filter((location) => location !== '');
    return [...new Set(locations)];
  }

  static getLocationName(events: AstroEvent[], slug: string): string {
    return events
      .find((event) => this.slugify(event.frontmatter.location) === slug)
      ?.frontmatter.location ?? '';
  }

  static sortByStartDateAsc(events: AstroEvent[]): AstroEvent[] {
    return events.sort((eventA, eventB) => {
      return Datetime.sortByDateAsc(
        eventA.frontmatter.startDate,
        eventB.frontmatter.startDate
      );
    });
  }

  static sortByStartDateDesc(events: AstroEvent[]): AstroEvent[] {
    return events.sort((eventA, eventB) => {
      return Datetime.sortByDateDesc(
        eventA.frontmatter.startDate,
        eventB.frontmatter.startDate
      );
    });
  }

  static slugify(text?: string): string {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .trim()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
}
