import { useEffect, useState } from 'react'
import Purchases, { CustomerInfo } from 'react-native-purchases'

export function useCustomerInfo() {
  const [isLoading, setIsLoading] = useState(true)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)

  useEffect(() => {
    async function getCustomerInfo() {
      setIsLoading(true)

      try {
        const customerInfo = await Purchases.getCustomerInfo()
        setCustomerInfo(customerInfo)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    getCustomerInfo()
  }, [])

  return { isLoading, customerInfo }
}
