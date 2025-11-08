import { useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Stack, useLocalSearchParams } from 'expo-router'

import { Progress } from '@/components/progress'
import { MatchItem } from '@/components/study/match-item'

type Term = {
  front: string
  back: string
}

const base: Term[] = [
  { front: 'Awesome', back: 'Incrível' },
  { front: 'Cool', back: 'Legal' },
  { front: 'Great', back: 'Ótimo' },
  { front: 'Fun', back: 'Divertido' },
]

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

export default function CombineScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  console.log('id:', id)
  const [left] = useState(() => shuffle(base))
  const [right] = useState(() => shuffle(base))
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matches, setMatches] = useState<Record<number, number>>({})

  const allMatched = Object.keys(matches).length === base.length

  const selectLeft = (i: number) => {
    setSelectedLeft(i === selectedLeft ? null : i)
  }

  const selectRight = (i: number) => {
    if (selectedLeft === null) return
    setMatches((m) => {
      const n = { ...m }
      // Validate correct match
      if (left[selectedLeft].back === right[i].back) {
        n[selectedLeft] = i
      }
      return n
    })
    setSelectedLeft(null)
  }

  return (
    <View className="flex-1 p-5 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen options={{ title: `${Object.keys(matches).length} / ${right.length}` }} />

        <View className="flex-1 gap-6">
          <Progress progress={Object.keys(matches).length / right.length} />

          <Text className="text-base text-foreground dark:text-foreground-dark font-manrope-regular">
            Combine os pares
          </Text>
          <View className="flex-1 flex-row gap-4">
            <View className="flex-1 gap-3">
              {left.map((t, i) => (
                <MatchItem
                  key={i}
                  label={t.front}
                  matched={matches[i] !== undefined}
                  selected={i === selectedLeft}
                  onPress={() => selectLeft(i)}
                />
              ))}
            </View>
            <View className="flex-1 gap-3">
              {right.map((t, i) => {
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
          <View className="items-center">
            {allMatched ? (
              <Text className="text-green-500 font-manrope-bold">
                Todas as combinações corretas!
              </Text>
            ) : (
              <Text className="text-xs text-muted-foreground">
                Selecione um termo e depois sua tradução
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
