import { useEffect, useRef } from 'react'

import { usePathname } from 'expo-router'

import { logAnalyticsEvent } from '@/libs/analytics'

export function useAnalyticsScreenTracking() {
  const pathname = usePathname()
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    if (pathname && pathname !== prevPath.current) {
      prevPath.current = pathname

      logAnalyticsEvent('screen_view', { screen_name: pathname })
    }
  }, [pathname])
}
