import { Progress } from '@/components/progress'
import { HeartIcon, SpeakerHighIcon } from '@/icons'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const sampleCards = [
  { front: 'Awesome', back: 'Incrível' },
  { front: 'Cool', back: 'Legal' },
  { front: 'Great', back: 'Ótimo' },
  { front: 'Interesting', back: 'Interessante' },
  { front: 'Fun', back: 'Divertido' },
  { front: 'Easy', back: 'Fácil' },
]

export default function FlashcardsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [learningCount, setLearningCount] = useState(0)
  const [understoodCount, setUnderstoodCount] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const card = sampleCards[index]
  const toggleSide = () => setShowBack((s) => !s)

  const toggleFavorite = () => {
    setFavorites((f) => {
      const n = new Set(f)
      if (n.has(index)) n.delete(index)
      else n.add(index)
      return n
    })
  }

  const handleLearning = () => {
    setLearningCount((count) => count + 1)
    nextCard()
  }

  const handleUnderstood = () => {
    setUnderstoodCount((count) => count + 1)
    nextCard()
  }

  const nextCard = () => {
    setShowBack(false)
    const nextIndex = index + 1
    if (nextIndex >= sampleCards.length) {
      setIsCompleted(true)
    } else {
      setIndex(nextIndex)
    }
  }

  const handleRestart = () => {
    setIndex(0)
    setShowBack(false)
    setLearningCount(0)
    setUnderstoodCount(0)
    setIsCompleted(false)
  }

  const handleGoBack = () => {
    router.back()
  }

  // Tela de resumo
  if (isCompleted) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Resumo' }} />

        <View className="flex-1 p-5 gap-6 bg-background justify-center">
          <View className="bg-card rounded-xl p-8 gap-6">
            <Text className="text-foreground text-2xl font-manrope-bold text-center">
              Parabéns! 🎉
            </Text>

            <Text className="text-foreground text-base font-manrope-regular text-center">
              Você completou todos os flashcards!
            </Text>

            <View className="gap-4 mt-4">
              <View className="bg-[#EF4444]/10 rounded-xl p-4">
                <Text className="text-[#EF4444] text-lg font-manrope-semibold text-center">
                  Aprendendo
                </Text>
                <Text className="text-[#EF4444] text-3xl font-manrope-bold text-center mt-2">
                  {learningCount}
                </Text>
                <Text className="text-foreground/60 text-sm font-manrope-regular text-center mt-1">
                  {learningCount === 1 ? 'palavra' : 'palavras'}
                </Text>
              </View>

              <View className="bg-[#4CC9F0]/10 rounded-xl p-4">
                <Text className="text-[#4CC9F0] text-lg font-manrope-semibold text-center">
                  Entendo bem
                </Text>
                <Text className="text-[#4CC9F0] text-3xl font-manrope-bold text-center mt-2">
                  {understoodCount}
                </Text>
                <Text className="text-foreground/60 text-sm font-manrope-regular text-center mt-1">
                  {understoodCount === 1 ? 'palavra' : 'palavras'}
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-4">
            <TouchableOpacity
              onPress={handleRestart}
              className="h-14 rounded-xl items-center justify-center bg-primary"
            >
              <Text className="text-white text-base font-manrope-semibold">
                Reiniciar Flashcards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoBack}
              className="h-14 rounded-xl items-center justify-center bg-card"
            >
              <Text className="text-foreground text-base font-manrope-semibold">Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Stack.Screen options={{ title: `${index + 1} / ${sampleCards.length}` }} />

      <View className="flex-1 p-5 gap-6 bg-background">
        {/* Barra de progresso fina, conforme Figma */}
        <Progress progress={(index + 1) / sampleCards.length} />

        {/* Cartão principal com ícones no topo e termo central */}
        <View className="flex-1">
          <TouchableOpacity
            onPress={toggleSide}
            className="flex-1 w-full bg-card rounded-xl p-8 justify-center"
            activeOpacity={0.9}
          >
            {/* Ícones posicionados no topo do card */}
            <View className="absolute left-8 top-8">
              <SpeakerHighIcon size={24} className="text-foreground" />
            </View>
            <TouchableOpacity
              onPress={toggleFavorite}
              className="absolute right-8 top-8"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <HeartIcon
                size={24}
                weight={favorites.has(index) ? 'fill' : 'regular'}
                className={favorites.has(index) ? 'text-red-500' : 'text-foreground'}
              />
            </TouchableOpacity>

            <Text className="text-foreground text-xl font-manrope-semibold text-center">
              {showBack ? card.back : card.front}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botões inferiores lado a lado conforme Figma */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={handleLearning}
            className="flex-1 h-14 rounded-xl items-center justify-center bg-[#EF4444]"
          >
            <Text className="text-white text-base font-manrope-medium">
              Aprendendo ({learningCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUnderstood}
            className="flex-1 h-14 rounded-xl items-center justify-center bg-[#4CC9F0]"
          >
            <Text className="text-white text-base font-manrope-medium">
              Entendo bem ({understoodCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
