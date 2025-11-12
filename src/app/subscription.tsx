import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import Purchases, { PurchasesPackage } from 'react-native-purchases'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useOfferings } from '@/hooks/use-offerings'
import { CheckIcon } from '@/icons'
import { checkIsSubscribed } from '@/libs/check-is-subscribed'
import { cn } from '@/libs/cn'
import { toast } from '@/libs/toast'
import { useRouter } from 'expo-router'

const SUBSCRIPTION_DURATION_TEXT: Record<string, string> = {
  ANNUAL: 'Plano anual',
  MONTHLY: 'Plano mensal',
} as const

export default function SubscriptionScreen() {
  const router = useRouter()

  const [selectedPlan, setSelectedPlan] = useState<PurchasesPackage | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const { offerings, isLoading } = useOfferings()

  const benefits = [
    'Remover anúncios',
    'Criar cartões com imagens e audio',
    'Ocultar o texto da pergunta no teste',
    'Mudar ordenação das perguntas',
  ]

  const handleSubscribe = async () => {
    if (!selectedPlan) return toast.error({ title: 'Selecione um plano' })

    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPlan)

      const isSubscribed = checkIsSubscribed(customerInfo)

      if (isSubscribed) {
        toast.success({ title: 'Parabéns! Sua assinatura foi ativada.' })

        router.push('/')
      }
    } catch (e) {
      toast.error({ title: 'Erro ao processar compra. Tente novamente mais tarde.' })
      console.log('📢 error', e)
    }
  }

  const handleRestorePurchases = async () => {
    setIsRestoring(true)

    try {
      const customerInfo = await Purchases.restorePurchases()

      const isSubscribed = checkIsSubscribed(customerInfo)

      if (isSubscribed) {
        toast.success({ title: 'Compras restauradas com sucesso!' })
        router.push('/')
      } else {
        toast.error({ title: 'Nenhuma compra encontrada para restaurar.' })
      }
    } catch (e) {
      toast.error({ title: 'Erro ao restaurar compras. Tente novamente mais tarde.' })
      console.log('📢 error', e)
    } finally {
      setIsRestoring(false)
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" className="text-primary dark:text-primary-dark" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-5 py-6">
              <Text className="text-base font-manrope-semibold text-foreground mb-4">
                Benefícios
              </Text>

              <View className="gap-3 mb-8">
                {benefits.map((benefit, index) => (
                  <View key={index} className="flex-row gap-4">
                    <CheckIcon
                      size={24}
                      className="text-foreground dark:text-foreground-dark"
                      weight="bold"
                    />
                    <Text className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark flex-1">
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="gap-3 mb-8 relative">
                {offerings?.current?.availablePackages.map((pkg) => (
                  <TouchableOpacity
                    key={pkg.identifier}
                    onPress={() => setSelectedPlan(pkg)}
                    className="bg-card dark:bg-card-dark rounded-xl px-6 py-4 flex-row items-center gap-6 relative"
                  >
                    {pkg.packageType === 'ANNUAL' && (
                      <View className="absolute -top-2 right-0 z-10 bg-primary dark:bg-primary-dark rounded-xl px-2 py-0.5">
                        <Text className="text-[10px] font-manrope-semibold text-primary-foreground dark:text-primary-foreground-dark">
                          Melhor oferta
                        </Text>
                      </View>
                    )}

                    <View
                      className={cn(
                        'w-6 h-6 rounded-xl border-2 border-gray-300 dark:border-zinc-500 items-center justify-center',
                        {
                          'border-primary dark:border-primary-dark':
                            selectedPlan?.identifier === pkg.identifier,
                        }
                      )}
                    >
                      {selectedPlan?.identifier === pkg.identifier && (
                        <View className="w-2.5 h-2.5 rounded-lg bg-primary dark:bg-primary-dark" />
                      )}
                    </View>

                    <View className="flex-1 gap-0.5">
                      <Text className="text-base font-manrope-semibold text-foreground dark:text-foreground-dark">
                        {SUBSCRIPTION_DURATION_TEXT[pkg.packageType]}
                      </Text>
                      {pkg.packageType === 'ANNUAL' && (
                        <Text className="text-sm font-manrope-regular text-foreground dark:text-foreground-dark">
                          Apenas {pkg.product.pricePerYearString} por ano
                        </Text>
                      )}
                    </View>

                    <View className="items-end gap-1.5">
                      <Text className="text-base font-manrope-semibold text-foreground dark:text-foreground-dark">
                        {pkg.product.pricePerMonthString}
                      </Text>
                      <Text className="text-xs font-manrope-medium text-foreground dark:text-foreground-dark">
                        por mês
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View className="px-5 pb-6 pt-4">
            <TouchableOpacity
              className="bg-primary dark:bg-primary-dark rounded-xl py-4 items-center mb-3"
              onPress={handleSubscribe}
            >
              <Text className="text-sm font-manrope-semibold text-primary-foreground dark:text-primary-foreground-dark">
                Continuar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-transparent rounded-xl py-4 items-center"
              onPress={handleRestorePurchases}
              disabled={isRestoring}
            >
              <Text className="text-base font-manrope-medium text-foreground dark:text-foreground-dark">
                {isRestoring ? 'Restaurando...' : 'Restaurar compras'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
