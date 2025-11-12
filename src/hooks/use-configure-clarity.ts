import { env } from '@/env'
import * as Clarity from '@microsoft/react-native-clarity'

import { useEffect } from 'react'

export function useConfigureClarity() {
  useEffect(() => {
    Clarity.initialize(env.EXPO_PUBLIC_CLARITY_ID, {
      logLevel: Clarity.LogLevel.None,
    })
  }, [])
}
