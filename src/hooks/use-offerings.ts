import { useEffect, useState } from 'react'
import Purchases, { PurchasesOfferings } from 'react-native-purchases'

export function useOfferings() {
  const [isLoading, setIsLoading] = useState(false)
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null)

  useEffect(() => {
    getOfferings()
  }, [])

  async function getOfferings() {
    setIsLoading(true)

    try {
      const offerings = await Purchases.getOfferings()

      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        setOfferings(offerings)
      }

      console.log('📢 offerings', JSON.stringify(offerings, null, 2))
    } catch (error) {
      console.error('Error fetching offerings', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { offerings, isLoading }
}
