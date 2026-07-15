import type { Card } from '@/state/card'

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60, 120, 180] as const

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'
export type CardStudyStatus = 'new' | 'learning' | 'review' | 'mastered'
export type StudyMode = 'flashcards' | 'questions' | 'combine'

export type CardProgress = {
  cardId: string
  stage: number
  status: CardStudyStatus
  intervalDays: number
  dueAt: number
  lastReviewedAt: number | null
  attempts: number
  correct: number
  lapses: number
}

export type StudySession = {
  id: string
  listId: string
  mode: StudyMode
  cardIds: string[]
  currentIndex: number
  practice: boolean
  startedAt: number
  completedAt: number | null
  correct: number
  incorrect: number
  ratings: Record<string, ReviewRating>
  failedCardIds: string[]
}

export type DailyStudyStats = {
  key: string
  dateKey: string
  listId: string
  mode: StudyMode
  reviewed: number
  correct: number
  incorrect: number
  sessionsCompleted: number
}

export type StudySummary = {
  total: number
  due: number
  new: number
  learning: number
  review: number
  mastered: number
  attempts: number
  correct: number
  accuracy: number
  nextDueAt: number | null
}

export function startOfLocalDay(value: number | Date = Date.now()) {
  const date = value instanceof Date ? new Date(value) : new Date(value)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function addLocalDays(value: number, days: number) {
  const date = new Date(startOfLocalDay(value))
  date.setDate(date.getDate() + days)
  return date.getTime()
}

export function localDateKey(value: number | Date = Date.now()) {
  const date = value instanceof Date ? value : new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDefaultCardProgress(cardId: string): CardProgress {
  return {
    cardId,
    stage: -1,
    status: 'new',
    intervalDays: 0,
    dueAt: 0,
    lastReviewedAt: null,
    attempts: 0,
    correct: 0,
    lapses: 0,
  }
}

export function calculateNextReview(
  current: CardProgress | undefined,
  rating: ReviewRating,
  now = Date.now()
): CardProgress {
  const progress = current ?? getDefaultCardProgress('')
  let stage: number

  if (rating === 'again') stage = 0
  else if (rating === 'hard') stage = Math.max(0, progress.stage)
  else if (rating === 'good') stage = Math.min(progress.stage + 1, REVIEW_INTERVALS.length - 1)
  else stage = Math.min(progress.stage + 2, REVIEW_INTERVALS.length - 1)

  const intervalDays = REVIEW_INTERVALS[stage]
  const isCorrect = rating !== 'again'

  return {
    ...progress,
    stage,
    intervalDays,
    dueAt: addLocalDays(now, intervalDays),
    lastReviewedAt: now,
    attempts: progress.attempts + 1,
    correct: progress.correct + (isCorrect ? 1 : 0),
    lapses: progress.lapses + (rating === 'again' ? 1 : 0),
    status: rating === 'again' || intervalDays < 3
      ? 'learning'
      : intervalDays >= 14
        ? 'mastered'
        : 'review',
  }
}

export function getRatingInterval(
  current: CardProgress | undefined,
  rating: ReviewRating
) {
  return calculateNextReview(current, rating, Date.now()).intervalDays
}

export function buildStudyQueue(
  cards: Card[],
  progressByCardId: Record<string, CardProgress>,
  size: number,
  now = Date.now()
) {
  const today = startOfLocalDay(now)
  const due: Card[] = []
  const fresh: Card[] = []

  for (const card of cards) {
    const progress = progressByCardId[card.id]
    if (!progress || progress.status === 'new') fresh.push(card)
    else if (progress.dueAt <= today) due.push(card)
  }

  due.sort((a, b) => progressByCardId[a.id].dueAt - progressByCardId[b.id].dueAt)
  fresh.sort((a, b) => a.createdAt - b.createdAt)

  return [...due, ...fresh].slice(0, Math.max(0, size))
}

export function buildPracticeQueue(
  cards: Card[],
  progressByCardId: Record<string, CardProgress>,
  size: number
) {
  return [...cards]
    .sort((a, b) => {
      const aLast = progressByCardId[a.id]?.lastReviewedAt ?? 0
      const bLast = progressByCardId[b.id]?.lastReviewedAt ?? 0
      return aLast - bLast
    })
    .slice(0, Math.max(0, size))
}

export function getStudySummary(
  cards: Card[],
  progressByCardId: Record<string, CardProgress>,
  now = Date.now()
): StudySummary {
  const today = startOfLocalDay(now)
  const summary: StudySummary = {
    total: cards.length,
    due: 0,
    new: 0,
    learning: 0,
    review: 0,
    mastered: 0,
    attempts: 0,
    correct: 0,
    accuracy: 0,
    nextDueAt: null,
  }

  for (const card of cards) {
    const progress = progressByCardId[card.id]
    if (!progress || progress.status === 'new') {
      summary.new += 1
      continue
    }

    summary[progress.status] += 1
    summary.attempts += progress.attempts
    summary.correct += progress.correct
    if (progress.dueAt <= today) summary.due += 1
    if (summary.nextDueAt === null || progress.dueAt < summary.nextDueAt) {
      summary.nextDueAt = progress.dueAt
    }
  }

  summary.accuracy = summary.attempts
    ? Math.round((summary.correct / summary.attempts) * 100)
    : 0
  return summary
}

export function getStreak(activeDateKeys: string[], now = Date.now()) {
  const keys = new Set(activeDateKeys)
  let cursor = startOfLocalDay(now)
  if (!keys.has(localDateKey(cursor))) cursor = addLocalDays(cursor, -1)

  let current = 0
  while (keys.has(localDateKey(cursor))) {
    current += 1
    cursor = addLocalDays(cursor, -1)
  }

  const sorted = [...keys].sort()
  let best = 0
  let run = 0
  let previous: number | null = null
  for (const key of sorted) {
    const value = startOfLocalDay(new Date(`${key}T12:00:00`))
    run = previous !== null && addLocalDays(previous, 1) === value ? run + 1 : 1
    best = Math.max(best, run)
    previous = value
  }

  return { current, best }
}
