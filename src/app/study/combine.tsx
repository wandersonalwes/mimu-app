import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

import { EmptyState } from '@/components/empty-state'
import { Progress } from '@/components/progress'
import { MatchItem } from '@/components/study/match-item'
import { useCardsByListId } from '@/hooks/use-cards'
import { PuzzlePieceIcon } from '@/icons'

type Term = {
  front: string
  back: string
}

const ITEMS_PER_STEP = 4

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

export default function CombineScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const cards = useCardsByListId(id!)
  const { t } = useTolgee(['language'])

  // Transformar cards em Terms e dividir em steps - usar useState para não recalcular
  const [steps] = useState<{ left: Term[]; right: Term[] }[]>(() => {
    if (!cards || cards.length === 0) return []

    const allTerms = cards.map((card) => ({ front: card.front, back: card.back }))
    const shuffledTerms = shuffle(allTerms)

    // Dividir em grupos de ITEMS_PER_STEP
    const stepsArray: { left: Term[]; right: Term[] }[] = []
    for (let i = 0; i < shuffledTerms.length; i += ITEMS_PER_STEP) {
      const stepTerms = shuffledTerms.slice(i, i + ITEMS_PER_STEP)
      // Para cada step, embaralhar separadamente a esquerda e direita
      stepsArray.push({
        left: shuffle(stepTerms),
        right: shuffle(stepTerms),
      })
    }

    return stepsArray
  })

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matches, setMatches] = useState<Record<number, number>>({})
  const [currentStep, setCurrentStep] = useState(0)

  // Calcular o número total de steps
  const totalSteps = steps.length

  // Items do step atual
  const currentLeft = steps[currentStep]?.left || []
  const currentRight = steps[currentStep]?.right || []

  // Verificar se todos os items do step atual foram combinados
  const stepCompleted = Object.keys(matches).length === currentLeft.length

  // Calcular total de combinações
  const totalCombinations = cards?.length || 0
  const completedCombinations = currentStep * ITEMS_PER_STEP + Object.keys(matches).length

  // Verificar se todos os steps foram completados
  const allCompleted = currentStep === totalSteps - 1 && stepCompleted

  // Se não há cartões, mostrar mensagem
  if (!cards || cards.length === 0) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <EmptyState
          icon={PuzzlePieceIcon}
          title={t('combine.emptyState.title')}
          description={t('combine.emptyState.description')}
          buttonText={t('common.back')}
          onButtonPress={() => router.back()}
        />
      </View>
    )
  }

  const selectLeft = (i: number) => {
    setSelectedLeft(i === selectedLeft ? null : i)
  }

  const selectRight = (i: number) => {
    if (selectedLeft === null) return
    setMatches((m) => {
      const n = { ...m }
      // Validate correct match - comparar pelo back (tradução)
      if (currentLeft[selectedLeft].back === currentRight[i].back) {
        n[selectedLeft] = i
      }
      return n
    })
    setSelectedLeft(null)
  }

  const handleContinue = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedLeft(null)
      setMatches({}) // Resetar matches para o próximo step
    }
  }

  const handleFinish = () => {
    router.back()
  }

  return (
    <View className="flex-1 p-5 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen
          options={{
            title: `Step ${
              currentStep + 1
            } de ${totalSteps} - ${completedCombinations} / ${totalCombinations}`,
          }}
        />

        <View className="flex-1 gap-6">
          <Progress progress={completedCombinations / totalCombinations} />

          <Text className="text-base text-foreground dark:text-foreground-dark font-manrope-regular">
            {t('combine.instruction')}
          </Text>
          <View className="flex-1 flex-row gap-4">
            <View className="flex-1 gap-3">
              {currentLeft.map((t, i) => {
                return (
                  <MatchItem
                    key={i}
                    label={t.front}
                    matched={matches[i] !== undefined}
                    selected={i === selectedLeft}
                    onPress={() => selectLeft(i)}
                  />
                )
              })}
            </View>
            <View className="flex-1 gap-3">
              {currentRight.map((t, i) => {
                const matchedIndex = Object.values(matches).findIndex((v) => v === i)
                const matched = matchedIndex !== -1
                return (
                  <MatchItem
                    key={i}
                    label={t.back}
                    matched={matched}
                    onPress={() => selectRight(i)}
                  />
                )
              })}
            </View>
          </View>
          <View className="items-center gap-4">
            {stepCompleted ? (
              <>
                <Text className="text-green-500 font-manrope-bold">
                  {allCompleted ? t('combine.allComplete') : t('combine.stepComplete')}
                </Text>
                {allCompleted ? (
                  <TouchableOpacity
                    onPress={handleFinish}
                    className="bg-primary dark:bg-primary-dark px-8 py-3 rounded-lg w-full items-center justify-center"
                  >
                    <Text className="text-primary-foreground dark:text-primary-foreground-dark font-manrope-semibold">
                      {t('common.finish')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleContinue}
                    className="bg-primary dark:bg-primary-dark px-8 py-3 rounded-lg w-full items-center justify-center"
                  >
                    <Text className="text-primary-foreground dark:text-primary-foreground-dark font-manrope-semibold">
                      {t('combine.nextStep')}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text className="text-xs text-muted-foreground">
                {t('combine.selectInstruction')}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
