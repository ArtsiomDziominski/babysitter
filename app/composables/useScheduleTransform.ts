import type { BabysitterScheduleBlock, BabysitterSchedule, TimeInterval } from './useBabysitter'
import { ScheduleMode } from '~/const/schedule'

export type DateIntervalsMap = Record<string, TimeInterval[]>

const pad = (value: number) => value.toString().padStart(2, '0')

export const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1)

export const endOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0)

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const normalizeInterval = (interval: TimeInterval): TimeInterval => ({
  startTime: interval?.startTime?.trim() || '',
  endTime: interval?.endTime?.trim() || '',
})

const mergeIntervals = (target: DateIntervalsMap, dateKey: string, intervals?: TimeInterval[]) => {
  if (!intervals || !intervals.length) return
  const normalized = intervals
    .map(normalizeInterval)
    .filter(interval => interval.startTime && interval.endTime)

  if (!normalized.length) return

  target[dateKey] = [...(target[dateKey] || []), ...normalized]
}

export const mapEverydaySchedules = (schedules?: BabysitterSchedule[]): DateIntervalsMap => {
  const result: DateIntervalsMap = {}
  if (!schedules?.length) return result

  schedules.forEach(item => {
    if (!item.date) return
    mergeIntervals(result, item.date, item.intervals)
  })

  return result
}

export const mapToEverydaySchedules = (map: DateIntervalsMap): BabysitterSchedule[] => {
  return Object.entries(map)
    .filter(([_, intervals]) => intervals?.length)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, intervals]) => ({
      date,
      intervals: intervals.map(normalizeInterval).filter(interval => interval.startTime && interval.endTime),
    }))
}

export const buildDateMapFromBlocks = (
  blocks: BabysitterScheduleBlock[] | undefined,
  start: Date,
  end: Date
): DateIntervalsMap => {
  const result: DateIntervalsMap = {}
  if (!blocks?.length) return result

  const endTime = end.getTime()
  for (let current = new Date(start); current.getTime() <= endTime; current = addDays(current, 1)) {
    const dateKey = formatDateKey(current)
    const dayOfWeek = current.getDay()

    blocks.forEach(block => {
      if (!block.schedules?.length) return

      if (block.mode === ScheduleMode.ALL_DAYS) {
        mergeIntervals(result, dateKey, block.schedules[0]?.intervals)
        return
      }

      if (block.mode === ScheduleMode.WEEKLY) {
        const match = block.schedules.find(schedule => schedule.dayOfWeek === dayOfWeek)
        if (match) mergeIntervals(result, dateKey, match.intervals)
        return
      }

      if (block.mode === ScheduleMode.EVERYDAY) {
        const match = block.schedules.find(schedule => schedule.date === dateKey)
        if (match) mergeIntervals(result, dateKey, match.intervals)
      }
    })
  }

  return result
}

