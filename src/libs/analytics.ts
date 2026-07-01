import { getAnalytics, logEvent } from '@react-native-firebase/analytics'
import { getApp, initializeApp, ReactNativeFirebase } from '@react-native-firebase/app'
import { Platform } from 'react-native'

if (Platform.OS === 'web') {
  const firebaseConfig: ReactNativeFirebase.FirebaseAppOptions = {
    apiKey: 'AIzaSyAFUWcR5IT1RPlwQ88HyAZryFQvYQoA8lM',
    authDomain: 'mimu-11d13.firebaseapp.com',
    projectId: 'mimu-11d13',
    storageBucket: 'mimu-11d13.firebasestorage.app',
    messagingSenderId: '1007636090449',
    appId: '1:1007636090449:web:8893598551f85a58733270',
    measurementId: 'G-HKSNXWG2GN',
    databaseURL: 'https://mimu-11d13-default-rtdb.firebaseio.com',
  }

  initializeApp(firebaseConfig)
}

const app = getApp()
const analytics = getAnalytics(app)

export const logAnalyticsEvent = async (eventName: string, params?: Record<string, any>) => {
  await logEvent(analytics, eventName, params)
}
