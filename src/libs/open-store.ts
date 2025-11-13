import * as Application from 'expo-application'
import { Linking, Platform } from 'react-native'

const APP_STORE_ID = ''

async function safelyLaunchLink(url: string): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(url)

    if (!canOpen) return false

    await Linking.openURL(url)
    return true
  } catch (error) {
    console.error(`Failed to open URL: ${url}`, error)
    return false
  }
}

export async function openStore() {
  if (Platform.OS === 'android') {
    const packageName = Application.applicationId
    if (!packageName) return

    const marketUrl = `market://details?id=${packageName}`
    const webUrl = `https://play.google.com/store/apps/details?id=${packageName}`

    const success = await safelyLaunchLink(marketUrl)

    if (!success) {
      await safelyLaunchLink(webUrl)
    }

    return
  }

  // iOS
  if (APP_STORE_ID) {
    const appStoreUrl = `https://apps.apple.com/us/app/id${APP_STORE_ID}`
    await safelyLaunchLink(appStoreUrl)
  }
}
