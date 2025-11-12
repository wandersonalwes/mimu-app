import { getAnalytics, logEvent } from '@react-native-firebase/analytics'
import { getApp } from '@react-native-firebase/app'

const app = getApp()
const analytics = getAnalytics(app)

export const logAnalyticsEvent = async (eventName: string, params?: Record<string, any>) => {
  await logEvent(analytics, eventName, params)
}
