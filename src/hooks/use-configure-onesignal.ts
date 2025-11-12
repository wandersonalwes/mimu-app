import { useEffect, useState } from 'react'
import { LogLevel, OneSignal } from 'react-native-onesignal'

import { env } from '@/env'

export const useConfigureOneSignal = () => {
  const [isOneSignalConfigured, setIsOneSignalConfigured] = useState(false)

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose)
    OneSignal.initialize(env.EXPO_PUBLIC_ONESIGNAL_APP_ID)
    OneSignal.Notifications.requestPermission(false)

    setIsOneSignalConfigured(true)
  }, [])

  return { isOneSignalConfigured }
}
