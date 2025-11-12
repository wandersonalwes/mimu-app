import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): Partial<ExpoConfig> => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
  },
  ios: {
    ...config.ios,
    googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST || './GoogleService-Info.plist',
  },
})
