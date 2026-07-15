import { describe, expect, test } from 'bun:test'

import type { Card } from '@/state/card'
import {
  addLocalDays,
  buildStudyQueue,
  calculateNextReview,
  getDefaultCardProgress,
  getStreak,
  getStudySummary,
  startOfLocalDay,
} from './study'

const NOW = new Date(2026, 6, 14, 12).getTime()

function card(index: number): Card {
  return {
    id: `card-${index}`,
    front: `Front ${index}`,
    back: `Back ${index}`,
    listId: 'list-1',
    isFavorite: false,
    createdAt: index,
    updatedAt: index,
  }
}

describe('calculateNextReview', () => {
  test('uses the 1, 3, 7 and 14 day progression', () => {
    let progress = getDefaultCardProgress('card-1')
    progress = calculateNextReview(progress, 'good', NOW)
    expect(progress.intervalDays).toBe(1)
    progress = calculateNextReview(progress, 'good', NOW)
    expect(progress.intervalDays).toBe(3)
    progress = calculateNextReview(progress, 'good', NOW)
    expect(progress.intervalDays).toBe(7)
    progress = calculateNextReview(progress, 'good', NOW)
    expect(progress.intervalDays).toBe(14)
    expect(progress.status).toBe('mastered')
  })

  test('easy skips one stage and again returns to learning', () => {
    let progress = calculateNextReview(getDefaultCardProgress('card-1'), 'easy', NOW)
    expect(progress.intervalDays).toBe(3)
    progress = calculateNextReview(progress, 'again', NOW)
    expect(progress.intervalDays).toBe(1)
    expect(progress.status).toBe('learning')
    expect(progress.lapses).toBe(1)
  })

  test('caps intervals at 180 days', () => {
    let progress = getDefaultCardProgress('card-1')
    for (let index = 0; index < 20; index += 1) {
      progress = calculateNextReview(progress, 'easy', NOW)
    }
    expect(progress.intervalDays).toBe(180)
  })
})

describe('buildStudyQueue', () => {
  test('prioritizes oldest due cards and fills with oldest new cards', () => {
    const cards = [card(1), card(2), card(3), card(4)]
    const progress = {
      'card-2': { ...getDefaultCardProgress('card-2'), status: 'review' as const, stage: 2, intervalDays: 7, dueAt: addLocalDays(NOW, -1) },
      'card-3': { ...getDefaultCardProgress('card-3'), status: 'review' as const, stage: 2, intervalDays: 7, dueAt: addLocalDays(NOW, -3) },
      'card-4': { ...getDefaultCardProgress('card-4'), status: 'review' as const, stage: 2, intervalDays: 7, dueAt: addLocalDays(NOW, 1) },
    }
    expect(buildStudyQueue(cards, progress, 3, NOW).map((item) => item.id)).toEqual([
      'card-3',
      'card-2',
      'card-1',
    ])
  })

  test('never exceeds the selected size for a 10,000 card list', () => {
    const cards = Array.from({ length: 10_000 }, (_, index) => card(index))
    expect(buildStudyQueue(cards, {}, 20, NOW)).toHaveLength(20)
  })
})

describe('study summaries', () => {
  test('counts due, stages and accuracy', () => {
    const reviewed = {
      ...getDefaultCardProgress('card-1'),
      status: 'mastered' as const,
      stage: 3,
      intervalDays: 14,
      dueAt: startOfLocalDay(NOW),
      attempts: 4,
      correct: 3,
    }
    const summary = getStudySummary([card(1), card(2)], { 'card-1': reviewed }, NOW)
    expect(summary).toMatchObject({ total: 2, due: 1, new: 1, mastered: 1, accuracy: 75 })
  })

  test('calculates current and best calendar-day streaks', () => {
    const keys = [
      new Date(addLocalDays(NOW, -4)).toLocaleDateString('sv-SE'),
      new Date(addLocalDays(NOW, -2)).toLocaleDateString('sv-SE'),
      new Date(addLocalDays(NOW, -1)).toLocaleDateString('sv-SE'),
      new Date(NOW).toLocaleDateString('sv-SE'),
    ]
    expect(getStreak(keys, NOW)).toEqual({ current: 3, best: 3 })
  })
})
