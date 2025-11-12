import { checkIsSubscribed } from '@/libs/check-is-subscribed'
import { useCustomerInfo } from './use-customer-info'

export function useIsSubscribed() {
  const { customerInfo, isLoading } = useCustomerInfo()

  return {
    isLoading,
    isSubscribed: checkIsSubscribed(customerInfo),
  }
}
