import dayjs from 'dayjs'

export class Datetime {
  static toDateString(dateToFormat: string | Date): string {
    if (!dateToFormat) return ''

    return dayjs(dateToFormat).locale('es').format('DD/MM/YYYY')
  }

  static isBeforeToday(date: string | Date): boolean {
    if (!date) return false

    const today = dayjs()
    return dayjs(date).isBefore(today)
  }

  static isAfterYesterday(date: string | Date): boolean {
    if (!date) return false

    const yesterday = dayjs().subtract(1, 'day')
    return dayjs(date).isAfter(yesterday)
  }

  static sortByDateDesc(dateA: string | Date, dateB: string | Date): number {
    return dayjs(dateA).isBefore(dateB) ? 1 : -1
  }

  static sortByDateAsc(dateA: string | Date, dateB: string | Date): number {
    return dayjs(dateA).isBefore(dateB) ? -1 : 1
  }
}
