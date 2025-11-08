import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

import { CheckIcon } from '@/icons'
import { cn } from '@/libs/cn'

type Plan = 'annual' | 'monthly'

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('annual')

  const benefits = [
    'Remover anúncios',
    'Criar cartões com imagens e audio',
    'Ocultar o texto da pergunta no teste',
    'Mudar ordenação das perguntas',
  ]

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
                <View className="absolute -top-2 right-0 z-10 bg-primary dark:bg-primary-dark rounded-xl px-2 py-0.5">
                  <Text className="text-[10px] font-manrope-semibold text-primary-foreground dark:text-primary-foreground-dark">
                    Melhor oferta
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedPlan('annual')}
                  className="bg-card dark:bg-card-dark rounded-xl px-6 py-4 flex-row items-center gap-6"
                >
                  <View
                    className={cn(
                      'w-6 h-6 rounded-xl border-2 border-gray-300 dark:border-zinc-500 items-center justify-center',
                      {
                        'border-primary dark:border-primary-dark': selectedPlan === 'annual',
                      }
                    )}
                  >
                    {selectedPlan === 'annual' && (
                      <View className="w-2.5 h-2.5 rounded-lg bg-primary dark:bg-primary-dark" />
                    )}
                  </View>

                  <View className="flex-1 gap-0.5">
                    <Text className="text-base font-manrope-semibold text-foreground dark:text-foreground-dark">
                      Plano anual
                    </Text>
                    <Text className="text-sm font-manrope-regular text-foreground dark:text-foreground-dark">
                      Apenas R$ 36 por ano
                    </Text>
                  </View>

                  <View className="items-end gap-1.5">
                    <Text className="text-base font-manrope-semibold text-foreground dark:text-foreground-dark">
                      R$ 3
                    </Text>
                    <Text className="text-xs font-manrope-medium text-foreground dark:text-foreground-dark">
                      por mês
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedPlan('monthly')}
                  className="bg-card dark:bg-card-dark rounded-xl px-6 py-4 flex-row items-center gap-6"
                >
                  <View
                    className={cn(
                      'w-6 h-6 rounded-xl border-2 border-gray-300 dark:border-zinc-500 items-center justify-center',
                      {
                        'border-primary dark:border-primary-dark': selectedPlan === 'monthly',
                      }
                    )}
                  >
                    {selectedPlan === 'monthly' && (
                      <View className="w-2.5 h-2.5 rounded-lg bg-primary dark:bg-primary-dark" />
                    )}
                  </View>

                  <View className="flex-1 gap-0.5">
                    <Text className="text-base font-manrope-semibold text-foreground dark:text-foreground-dark">
                      Plano mensal
                    </Text>
                  </View>

                  <View className="items-end gap-1.5">
                    <Text className="text-base font-manrope-semibold text-foreground dark:text-foreground-dark">
                      R$ 5
                    </Text>
                    <Text className="text-xs font-manrope-medium text-foreground dark:text-foreground-dark">
                      por mês
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View className="px-5 pb-6 pt-4">
            <TouchableOpacity className="bg-primary dark:bg-primary-dark rounded-xl py-4 items-center mb-3">
              <Text className="text-sm font-manrope-semibold text-primary-foreground dark:text-primary-foreground-dark">
                Continuar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-transparent rounded-xl py-4 items-center">
              <Text className="text-base font-manrope-medium text-foreground dark:text-foreground-dark">
                Restaurar compras
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
