import { env } from '@/env'
import { CustomerInfo } from 'react-native-purchases'

export function checkIsSubscribed(customerInfo: CustomerInfo | null) {
  return (
    typeof customerInfo?.entitlements.active[env.EXPO_PUBLIC_ENTITLEMENT_IDENTIFIER] !== 'undefined'
  )
}
