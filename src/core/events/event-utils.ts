import { Datetime } from "../datetime/datetime";
import type { AstroEvent, FilterEvent } from "./astro-event";

export class EventUtils {
  static getNextEvents(events: AstroEvent[], filter?: FilterEvent): AstroEvent[] {
    return events.filter((event) => {
      if (!event.frontmatter.endDate) return false;

      if (filter && filter.location) {
        if (this.slugify(event.frontmatter.location) !== filter.location) return false;
      }

      if (filter && filter.tags?.length) {
        const tags = event.frontmatter.tags ?? [];
        if (!tags.some((tag) => filter.tags?.includes(tag))) return false;
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

      if (filter && filter.tags?.length) {
        const tags = event.frontmatter.tags ?? [];
        if (!tags.some((tag) => filter.tags?.includes(tag))) return false;
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

  static getLocationName(events: AstroEvent[], location: string): string {
    return events
      .find((event) => this.slugify(event.frontmatter.location) === location)
      ?.frontmatter.location ?? '';
  }

  static getTagsEvents(events: AstroEvent[]): string[] {
    const tags = events
      .map((event) => event.frontmatter.tags ?? '')
      .flat()
    return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
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

  static getLink(url: URL, tag: string) {
    const tags = url.searchParams.getAll('tag');
    const index = tags.indexOf(tag);
    if (index !== -1) {
      tags.splice(index, 1);
    } else {
      tags.push(tag);
    }
    const newUrl = new URL(url.origin + url.pathname)
    tags.forEach((tag) => newUrl.searchParams.append('tag', tag));
    return newUrl.toString()
  }
}
