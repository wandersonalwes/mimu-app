import { observable } from '@legendapp/state'

import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { configureSynced, syncObservable } from '@legendapp/state/sync'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type List = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

type ListStore = {
  lists: List[]
}

type ListActions = {
  addList: (list: Omit<List, 'createdAt' | 'updatedAt'>) => void
  updateList: (id: string, updates: Partial<Omit<List, 'id' | 'createdAt'>>) => void
  removeList: (id: string) => void
  getListById: (id: string) => List | undefined
}

const listStore$ = observable<ListStore>({
  lists: [],
})

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
})

syncObservable(
  listStore$,
  persistOptions({
    persist: {
      name: 'listStore',
    },
  })
)

// Actions
export const listActions: ListActions = {
  addList: (list: Omit<List, 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newList: List = {
      ...list,
      createdAt: now,
      updatedAt: now,
    }
    listStore$.lists.push(newList)
  },

  updateList: (id: string, updates: Partial<Omit<List, 'id' | 'createdAt'>>) => {
    const lists = listStore$.lists.get()
    const index = lists.findIndex((list) => list.id === id)
    if (index !== -1) {
      listStore$.lists[index].set({
        ...lists[index],
        ...updates,
        updatedAt: Date.now(),
      })
    }
  },

  removeList: (id: string) => {
    listStore$.lists.set(listStore$.lists.get().filter((list) => list.id !== id))
  },

  getListById: (id: string): List | undefined => {
    return listStore$.lists.get().find((list) => list.id === id)
  },
}

export { listStore$ }
