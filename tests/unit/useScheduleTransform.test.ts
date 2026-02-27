import { describe, expect, it } from 'vitest'
import { ScheduleMode } from '../../app/const/schedule'
import {
  addDays,
  buildDateMapFromBlocks,
  endOfMonth,
  formatDateKey,
  mapEverydaySchedules,
  mapToEverydaySchedules,
  startOfMonth,
} from '../../app/composables/useScheduleTransform'

describe('useScheduleTransform', () => {
  it('formatDateKey pads month and day', () => {
    expect(formatDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('startOfMonth and endOfMonth return correct boundaries', () => {
    const source = new Date(2026, 1, 17)

    expect(formatDateKey(startOfMonth(source))).toBe('2026-02-01')
    expect(formatDateKey(endOfMonth(source))).toBe('2026-02-28')
  })

  it('addDays handles month boundary', () => {
    const next = addDays(new Date(2026, 0, 31), 1)
    expect(formatDateKey(next)).toBe('2026-02-01')
  })

  it('mapEverydaySchedules trims and filters invalid intervals', () => {
    const result = mapEverydaySchedules([
      {
        date: '2026-03-10',
        intervals: [
          { startTime: ' 09:00 ', endTime: ' 11:00 ' },
          { startTime: '', endTime: '12:00' },
        ],
      },
      {
        date: '2026-03-10',
        intervals: [{ startTime: '13:00', endTime: '15:00' }],
      },
      {
        intervals: [{ startTime: '10:00', endTime: '11:00' }],
      },
    ])

    expect(result).toEqual({
      '2026-03-10': [
        { startTime: '09:00', endTime: '11:00' },
        { startTime: '13:00', endTime: '15:00' },
      ],
    })
  })

  it('mapToEverydaySchedules sorts dates and keeps only valid intervals', () => {
    const result = mapToEverydaySchedules({
      '2026-03-12': [{ startTime: ' 12:00 ', endTime: ' 14:00 ' }],
      '2026-03-10': [
        { startTime: '08:00', endTime: '10:00' },
        { startTime: '', endTime: '11:00' },
      ],
      '2026-03-11': [],
    })

    expect(result).toEqual([
      {
        date: '2026-03-10',
        intervals: [{ startTime: '08:00', endTime: '10:00' }],
      },
      {
        date: '2026-03-12',
        intervals: [{ startTime: '12:00', endTime: '14:00' }],
      },
    ])
  })

  it('buildDateMapFromBlocks merges ALL_DAYS and WEEKLY intervals', () => {
    const result = buildDateMapFromBlocks(
      [
        {
          mode: ScheduleMode.ALL_DAYS,
          schedules: [
            {
              intervals: [{ startTime: '09:00', endTime: '10:00' }],
            },
          ],
        },
        {
          mode: ScheduleMode.WEEKLY,
          schedules: [
            {
              dayOfWeek: 1,
              intervals: [{ startTime: '18:00', endTime: '19:00' }],
            },
          ],
        },
      ],
      new Date(2026, 2, 8),
      new Date(2026, 2, 9)
    )

    expect(result['2026-03-08']).toEqual([{ startTime: '09:00', endTime: '10:00' }])
    expect(result['2026-03-09']).toEqual([
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '18:00', endTime: '19:00' },
    ])
  })

  it('buildDateMapFromBlocks gives EVERYDAY priority for exact date', () => {
    const result = buildDateMapFromBlocks(
      [
        {
          mode: ScheduleMode.ALL_DAYS,
          schedules: [
            {
              intervals: [{ startTime: '09:00', endTime: '10:00' }],
            },
          ],
        },
        {
          mode: ScheduleMode.EVERYDAY,
          schedules: [
            {
              date: '2026-03-10',
              intervals: [{ startTime: '20:00', endTime: '21:00' }],
            },
          ],
        },
      ],
      new Date(2026, 2, 10),
      new Date(2026, 2, 10)
    )

    expect(result['2026-03-10']).toEqual([{ startTime: '20:00', endTime: '21:00' }])
  })
})
