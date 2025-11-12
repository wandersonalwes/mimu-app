import { useEffect } from 'react'
import { Platform } from 'react-native'
import Purchases, { LOG_LEVEL } from 'react-native-purchases'

import { env } from '@/env'

export function useConfigurePurchases() {
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE)

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: env.EXPO_PUBLIC_REVENUE_CAT_IOS_API_KEY })
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: env.EXPO_PUBLIC_REVENUE_CAT_ANDROID_API_KEY })
    }
  }, [])
}
