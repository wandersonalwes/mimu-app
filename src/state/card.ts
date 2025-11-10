import { observable } from '@legendapp/state'

import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { configureSynced, syncObservable } from '@legendapp/state/sync'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Card = {
  id: string
  front: string
  back: string
  listId: string
  isFavorite: boolean
  createdAt: number
  updatedAt: number
}

type CardStore = {
  cards: Card[]
}

type CardActions = {
  addCard: (card: Omit<Card, 'createdAt' | 'updatedAt' | 'isFavorite'>) => void
  addCards: (cards: Omit<Card, 'createdAt' | 'updatedAt' | 'isFavorite'>[]) => void
  updateCard: (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt'>>) => void
  removeCard: (id: string) => void
  toggleFavorite: (id: string) => void
  getCardsByListId: (listId: string) => Card[]
  removeAllCardsByListId: (listId: string) => void
}

const cardStore$ = observable<CardStore>({
  cards: [],
})

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
})

syncObservable(
  cardStore$,
  persistOptions({
    persist: {
      name: 'cardStore',
    },
  })
)

// Actions
export const cardActions: CardActions = {
  addCard: (card: Omit<Card, 'createdAt' | 'updatedAt' | 'isFavorite'>) => {
    const now = Date.now()
    const newCard: Card = {
      ...card,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    }
    cardStore$.cards.push(newCard)
  },

  addCards: (cards: Omit<Card, 'createdAt' | 'updatedAt' | 'isFavorite'>[]) => {
    const now = Date.now()
    const newCards: Card[] = cards.map((card) => ({
      ...card,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    }))
    cardStore$.cards.push(...newCards)
  },

  updateCard: (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt'>>) => {
    const cards = cardStore$.cards.get()
    const index = cards.findIndex((card) => card.id === id)
    if (index !== -1) {
      cardStore$.cards[index].set({
        ...cards[index],
        ...updates,
        updatedAt: Date.now(),
      })
    }
  },

  removeCard: (id: string) => {
    cardStore$.cards.set(cardStore$.cards.get().filter((card) => card.id !== id))
  },

  toggleFavorite: (id: string) => {
    const cards = cardStore$.cards.get()
    const index = cards.findIndex((card) => card.id === id)
    if (index !== -1) {
      cardStore$.cards[index].set({
        ...cards[index],
        isFavorite: !cards[index].isFavorite,
        updatedAt: Date.now(),
      })
    }
  },

  getCardsByListId: (listId: string): Card[] => {
    return cardStore$.cards.get().filter((card) => card.listId === listId)
  },

  removeAllCardsByListId: (listId: string) => {
    cardStore$.cards.set(cardStore$.cards.get().filter((card) => card.listId !== listId))
  },
}

export { cardStore$ }
