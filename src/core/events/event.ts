import type { Sociable } from "../social/sociable";

export type Event = Sociable & {
  title: string;
  shortDescription: string;
  thumbnail: string;
  image: string;
  altImage?: string;
  tags: string[];
  tagColor?: string;
  startDate: string;
  endDate: string;
  web?: string;
  location?: string;
};
