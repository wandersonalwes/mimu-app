import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type NotificationsStore = {
  isEnabled: boolean
  setIsEnabled: (isEnabled: boolean) => void
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set) => ({
      isEnabled: true,
      setIsEnabled: (isEnabled) => {
        set({ isEnabled })
      },
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
