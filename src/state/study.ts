import { observable } from '@legendapp/state'
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { configureSynced, syncObservable } from '@legendapp/state/sync'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { generateId } from '@/libs/generate-id'
import {
  buildPracticeQueue,
  buildStudyQueue,
  calculateNextReview,
  localDateKey,
  type CardProgress,
  type DailyStudyStats,
  type ReviewRating,
  type StudyMode,
  type StudySession,
} from '@/libs/study'
import { cardActions } from '@/state/card'

type StudyStore = {
  progressByCardId: Record<string, CardProgress>
  sessions: StudySession[]
  dailyStats: DailyStudyStats[]
}

export const studyStore$ = observable<StudyStore>({
  progressByCardId: {},
  sessions: [],
  dailyStats: [],
})

const persistOptions = configureSynced({
  persist: { plugin: observablePersistAsyncStorage({ AsyncStorage }) },
})

syncObservable(
  studyStore$,
  persistOptions({ persist: { name: 'studyStore' } })
)

function getSession(sessionId: string) {
  return studyStore$.sessions.get().find((session) => session.id === sessionId)
}

export const studyActions = {
  createSession(input: {
    listId: string
    mode: StudyMode
    size: number
    practice?: boolean
  }) {
    const cards = cardActions.getCardsByListId(input.listId)
    const progress = studyStore$.progressByCardId.get()
    const selected = input.practice
      ? buildPracticeQueue(cards, progress, input.size)
      : buildStudyQueue(cards, progress, input.size)
    const session: StudySession = {
      id: generateId(),
      listId: input.listId,
      mode: input.mode,
      cardIds: selected.map((card) => card.id),
      currentIndex: 0,
      practice: Boolean(input.practice),
      startedAt: Date.now(),
      completedAt: null,
      correct: 0,
      incorrect: 0,
      ratings: {},
      failedCardIds: [],
    }
    const existing = studyStore$.sessions.get()
    const active = existing.filter((item) => !item.completedAt)
    const recentCompleted = existing
      .filter((item) => item.completedAt)
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
      .slice(0, 99)
    studyStore$.sessions.set([...active, ...recentCompleted, session])
    return session
  },

  recordAnswer(sessionId: string, cardId: string, rating: ReviewRating) {
    const session = getSession(sessionId)
    if (!session || session.completedAt) return

    const index = studyStore$.sessions.get().findIndex((item) => item.id === sessionId)
    if (index === -1) return
    if (session.ratings?.[cardId]) return
    const correct = rating !== 'again'

    if (!session.practice) {
      const current = studyStore$.progressByCardId[cardId].peek()
      const next = calculateNextReview(current, rating)
      next.cardId = cardId
      studyStore$.progressByCardId[cardId].set(next)

      const dateKey = localDateKey()
      const key = `${dateKey}:${session.listId}:${session.mode}`
      const stats = studyStore$.dailyStats.get()
      const statsIndex = stats.findIndex((item) => item.key === key)
      if (statsIndex === -1) {
        studyStore$.dailyStats.push({
          key,
          dateKey,
          listId: session.listId,
          mode: session.mode,
          reviewed: 1,
          correct: correct ? 1 : 0,
          incorrect: correct ? 0 : 1,
          sessionsCompleted: 0,
        })
      } else {
        studyStore$.dailyStats[statsIndex].reviewed.set((value) => value + 1)
        studyStore$.dailyStats[statsIndex][correct ? 'correct' : 'incorrect'].set(
          (value) => value + 1
        )
      }
    }

    studyStore$.sessions[index].ratings[cardId].set(rating)
    studyStore$.sessions[index][correct ? 'correct' : 'incorrect'].set(
      (value) => value + 1
    )
  },

  advanceSession(sessionId: string, count = 1) {
    const session = getSession(sessionId)
    if (!session || session.completedAt) return
    const index = studyStore$.sessions.get().findIndex((item) => item.id === sessionId)
    if (index === -1) return
    studyStore$.sessions[index].currentIndex.set((value) =>
      Math.min(value + count, session.cardIds.length)
    )
  },

  markFailedAttempt(sessionId: string, cardId: string) {
    const session = getSession(sessionId)
    if (!session || session.completedAt || session.failedCardIds?.includes(cardId)) return
    const index = studyStore$.sessions.get().findIndex((item) => item.id === sessionId)
    if (index === -1) return
    studyStore$.sessions[index].failedCardIds.push(cardId)
  },

  completeSession(sessionId: string) {
    const session = getSession(sessionId)
    if (!session || session.completedAt) return
    const index = studyStore$.sessions.get().findIndex((item) => item.id === sessionId)
    if (index === -1) return
    studyStore$.sessions[index].completedAt.set(Date.now())

    if (!session.practice) {
      const key = `${localDateKey()}:${session.listId}:${session.mode}`
      const statsIndex = studyStore$.dailyStats.get().findIndex((item) => item.key === key)
      if (statsIndex !== -1) {
        studyStore$.dailyStats[statsIndex].sessionsCompleted.set((value) => value + 1)
      }
    }
  },

  getResumableSession(listId: string, mode: StudyMode) {
    return [...studyStore$.sessions.get()]
      .reverse()
      .find(
        (session) =>
          session.listId === listId &&
          session.mode === mode &&
          !session.completedAt &&
          session.currentIndex < session.cardIds.length
      )
  },

  removeCardProgress(cardId: string) {
    studyStore$.progressByCardId[cardId].delete()
    studyStore$.sessions.set(
      studyStore$.sessions.get().map((session) => ({
        ...session,
        cardIds: session.cardIds.filter((id) => id !== cardId),
      }))
    )
  },

  removeListProgress(listId: string) {
    const cardIds = new Set(cardActions.getCardsByListId(listId).map((card) => card.id))
    const progress = { ...studyStore$.progressByCardId.get() }
    for (const cardId of cardIds) delete progress[cardId]
    studyStore$.progressByCardId.set(progress)
    studyStore$.sessions.set(studyStore$.sessions.get().filter((item) => item.listId !== listId))
    studyStore$.dailyStats.set(
      studyStore$.dailyStats.get().filter((item) => item.listId !== listId)
    )
  },
}
