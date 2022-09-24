import dayjs from "dayjs";

type ValidDate = string | Date;

export class Datetime {
  static toDateString(dateToFormat: ValidDate): string {
    if (!dateToFormat) return "";

    return dayjs(dateToFormat).locale("es").format("DD/MM/YYYY");
  }

  static toDateTimeString(dateToFormat: ValidDate): string {
    if (!dateToFormat) return "";

    return dayjs(dateToFormat).locale("es").format("DD/MM/YYYY HH:mm");
  }

  static toDateIsoString(dateToFormat: ValidDate): string {
    if (!dateToFormat) return "";

    return dayjs(dateToFormat).locale("es").format("YYYY-MM-DD");
  }

  static toTimeIsoString(dateToFormat: ValidDate): string {
    if (!dateToFormat) return "";

    return dayjs(dateToFormat).locale("es").format("HH:mm");
  }

  static isBeforeToday(date: ValidDate): boolean {
    if (!date) return false;

    const today = dayjs();
    return dayjs(date).isBefore(today);
  }

  static isAfterYesterday(date: ValidDate): boolean {
    if (!date) return false;

    const yesterday = dayjs().subtract(1, "day");
    return dayjs(date).isAfter(yesterday);
  }

  static sortByDateDesc(dateA?: ValidDate, dateB?: string | Date): number {
    if (!dateA) return -1;
    if (!dateB) return 1;
    return dayjs(dateA).isBefore(dateB) ? 1 : -1;
  }

  static sortByDateAsc(dateA?: ValidDate, dateB?: string | Date): number {
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dayjs(dateA).isBefore(dateB) ? -1 : 1;
  }
}
