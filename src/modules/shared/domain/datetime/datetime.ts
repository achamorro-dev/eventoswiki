import dayjs from 'dayjs'

import 'dayjs/locale/es'

type ValidDate = string | Date

export enum DateFormat {
  DD_MM_YYYY = 'DD/MM/YYYY',
  DD_MMM_YYYY = 'DD MMM YYYY',
  DD_MMMM_YYYY = 'DD MMMM YYYY',
  DDD_MMM_YYYY = 'ddd MMM YYYY',
}

export enum DateTimeFormat {
  DD_MM_YYYY_HH_MM = 'DD/MM/YYYY HH:mm',
  DD_MMM_YYYY_HH_MM = 'DD MMM YYYY HH:mm',
  DD_MMMM_YYYY_HH_MM = 'DD MMMM YYYY HH:mm',
  DDD_MMM_YYYY_HH_MM = 'ddd DD MMM YYYY HH:mm',
  DDD_MMM_YYYY = 'ddd DD MMM YYYY',
}

export type TimeUnit = 'month' | 'year' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'

export class Datetime {
  static now(): Date {
    return dayjs().locale('es').toDate()
  }

  static compare(dateA: Date, dateB: Date): number {
    return dayjs(dateA).diff(dateB, 'minute')
  }

  static toDate(dateString: string): Date {
    return dayjs(dateString).locale('es').toDate()
  }

  static toDateString(dateToFormat: ValidDate, format = 'DD/MM/YYYY'): string {
    if (!dateToFormat) return ''

    return dayjs(dateToFormat).locale('es').format(format)
  }

  static toTimeString(dateToFormat: ValidDate, format = 'HH:mm'): string {
    if (!dateToFormat) return ''

    return dayjs(dateToFormat).locale('es').format(format)
  }

  static toDateTimeString(dateToFormat: ValidDate, format = DateTimeFormat.DD_MM_YYYY_HH_MM): string {
    if (!dateToFormat) return ''

    return dayjs(dateToFormat).locale('es').format(format)
  }

  static toIsoString(dateToFormat: ValidDate): string {
    if (!dateToFormat) return ''

    return dayjs(dateToFormat).locale('es').toISOString()
  }

  static toDateIsoString(dateToFormat: ValidDate): string {
    if (!dateToFormat) return ''

    return dayjs(dateToFormat).locale('es').format('YYYY-MM-DD')
  }

  static toTimeIsoString(dateToFormat: ValidDate): string {
    if (!dateToFormat) return ''

    return dayjs(dateToFormat).locale('es').format('HH:mm')
  }

  static toDateTimeIsoString(dateToFormat: ValidDate): string {
    if (!dateToFormat) return ''
    return dayjs(dateToFormat).locale('es').toISOString()
  }

  static isBeforeToday(date: ValidDate): boolean {
    if (!date) return false

    const today = dayjs()
    return dayjs(date).isBefore(today, 'day')
  }

  static isAfter(dateA: ValidDate, dateB: ValidDate): boolean {
    if (!dateA || !dateB) return false

    return dayjs(dateA).isAfter(dateB, 'minute')
  }

  static add(date: Date, value: number, unit: TimeUnit): Date {
    return dayjs(date).add(value, unit).toDate()
  }

  static subtract(date: Date, value: number, unit: TimeUnit): Date {
    return dayjs(date).subtract(value, unit).toDate()
  }

  static isBefore(dateA: ValidDate, dateB: ValidDate): boolean {
    if (!dateA || !dateB) return false

    return dayjs(dateA).isBefore(dateB, 'minute')
  }

  static isAfterYesterday(date: ValidDate): boolean {
    if (!date) return false

    const yesterday = dayjs().subtract(1, 'day')
    return dayjs(date).isAfter(yesterday, 'day')
  }

  static sortByDateDesc(dateA?: ValidDate, dateB?: string | Date): number {
    if (!dateA) return -1
    if (!dateB) return 1
    return dayjs(dateA).isBefore(dateB) ? 1 : -1
  }

  static sortByDateAsc(dateA?: ValidDate, dateB?: string | Date): number {
    if (!dateA) return 1
    if (!dateB) return -1
    return dayjs(dateA).isBefore(dateB) ? -1 : 1
  }

  static toMonthString(date: Date): string {
    return dayjs(date).locale('es').format('MMMM')
  }

  static toMonthYearString(date: Date): string {
    return dayjs(date).locale('es').format('MMMM YYYY')
  }

  static toWeekdayString(date: Date): string {
    return dayjs(date).locale('es').format('ddd')
  }

  static toDayNumberString(date: Date): string {
    return dayjs(date).locale('es').format('DD')
  }

  static toDayString(date: Date): string {
    return dayjs(date).locale('es').format('dddd DD MMM')
  }

  static toDateRangeString(startDate: Date, endDate: Date): string {
    const start = dayjs(startDate).locale('es').format('DD MMMM YY')
    const end = dayjs(endDate).locale('es').format('DD MMMM YY')
    return `${start} - ${end}`
  }

  static isSameDay(dateA?: ValidDate, dateB?: ValidDate): boolean {
    if (!dateA || !dateB) return false

    return dayjs(dateA).isSame(dateB, 'day')
  }

  static isSameMonth(dateA?: ValidDate, dateB?: ValidDate): boolean {
    if (!dateA || !dateB) return false

    return dayjs(dateA).isSame(dateB, 'month')
  }

  static getFirstMondayOfMonthWeek(date: Date): Date {
    return dayjs(date).locale('es').startOf('month').startOf('week').toDate()
  }

  static getLastSundayOfMonth(date: Date): Date {
    return dayjs(date).locale('es').endOf('month').endOf('week').toDate()
  }
}
