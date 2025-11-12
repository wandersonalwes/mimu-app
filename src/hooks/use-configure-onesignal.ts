import { useEffect, useState } from 'react'
import { LogLevel, OneSignal } from 'react-native-onesignal'

import { env } from '@/env'
import { useNotificationsStore } from '@/stores/notifications'

export const useConfigureOneSignal = () => {
  const [isOneSignalConfigured, setIsOneSignalConfigured] = useState(false)
  const isNotificationsEnabled = useNotificationsStore((state) => state.isEnabled)

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose)
    OneSignal.initialize(env.EXPO_PUBLIC_ONESIGNAL_APP_ID)
    OneSignal.Notifications.requestPermission(false)

    setIsOneSignalConfigured(true)
  }, [])

  useEffect(() => {
    if (isOneSignalConfigured) {
      if (isNotificationsEnabled) {
        OneSignal.User.pushSubscription.optIn()
      } else {
        OneSignal.User.pushSubscription.optOut()
      }
    }
  }, [isOneSignalConfigured, isNotificationsEnabled])

  return { isOneSignalConfigured }
}
