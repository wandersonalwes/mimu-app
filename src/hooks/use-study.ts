import { useSelector } from '@legendapp/state/react'

import { getStreak, getStudySummary, localDateKey, type StudyMode } from '@/libs/study'
import { cardStore$ } from '@/state/card'
import { studyActions, studyStore$ } from '@/state/study'

export function useStudySession(sessionId?: string) {
  return useSelector(() =>
    studyStore$.sessions.get().find((session) => session.id === sessionId)
  )
}

export function useResumableSession(listId: string, mode: StudyMode) {
  return useSelector(() => studyActions.getResumableSession(listId, mode))
}

export function useListStudySummary(listId: string) {
  return useSelector(() => {
    const cards = cardStore$.cards.get().filter((card) => card.listId === listId)
    return getStudySummary(cards, studyStore$.progressByCardId.get())
  })
}

export function useGlobalStudySummary() {
  return useSelector(() =>
    getStudySummary(cardStore$.cards.get(), studyStore$.progressByCardId.get())
  )
}

export function useStudyDashboard() {
  return useSelector(() => {
    const stats = studyStore$.dailyStats.get()
    const today = localDateKey()
    const todayStats = stats.filter((item) => item.dateKey === today)
    const reviewedToday = todayStats.reduce((sum, item) => sum + item.reviewed, 0)
    const correctToday = todayStats.reduce((sum, item) => sum + item.correct, 0)
    const activeDays = [...new Set(stats.filter((item) => item.reviewed > 0).map((item) => item.dateKey))]
    return {
      reviewedToday,
      accuracyToday: reviewedToday ? Math.round((correctToday / reviewedToday) * 100) : 0,
      streak: getStreak(activeDays),
      stats,
    }
  })
}

export function useCardProgress(cardId?: string) {
  return useSelector(() => (cardId ? studyStore$.progressByCardId[cardId].get() : undefined))
}
