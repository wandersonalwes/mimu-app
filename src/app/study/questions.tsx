import { Progress } from '@/components/progress'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface QA {
  front: string
  back: string
  options: string[]
}

const buildQuestions = (): QA[] => {
  const base = [
    { front: 'Awesome', back: 'Incrível' },
    { front: 'Cool', back: 'Legal' },
    { front: 'Great', back: 'Ótimo' },
    { front: 'Interesting', back: 'Interessante' },
    { front: 'Fun', back: 'Divertido' },
    { front: 'Easy', back: 'Fácil' },
  ]
  return base.map((b, i) => {
    const distractors = base
      .filter((_, di) => di !== i)
      .slice(0, 3)
      .map((d) => d.back)
    const shuffled = [...distractors, b.back].sort(() => Math.random() - 0.5)
    return { front: b.front, back: b.back, options: shuffled }
  })
}

const questions = buildQuestions()

export default function QuestionsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const q = questions[qIndex]
  const answered = selected !== null

  const select = (opt: string) => {
    if (answered) return
    setSelected(opt)
    if (opt === q.back) setCorrectCount((c) => c + 1)
  }

  const next = () => {
    setSelected(null)
    setQIndex((i) => i + 1)
  }

  const handleRestart = () => {
    setQIndex(0)
    setSelected(null)
    setCorrectCount(0)
  }

  const handleGoBack = () => {
    router.back()
  }

  const finished = qIndex >= questions.length
  const wrongCount = finished ? questions.length - correctCount : 0
  const successRate = finished ? Math.round((correctCount / questions.length) * 100) : 0

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen
          options={{ title: finished ? 'Resumo' : `${qIndex + 1}/${questions.length}` }}
        />

        <View className="flex-1">
          {finished ? (
            <View className="flex-1 px-5 gap-6 justify-center">
              <View className="bg-card dark:bg-card-dark rounded-xl p-8 gap-6">
                <View className="items-center gap-2">
                  <Text className="text-6xl">
                    {successRate >= 80 ? '🎉' : successRate >= 50 ? '👍' : '💪'}
                  </Text>
                  <Text className="text-foreground dark:text-foreground-dark text-2xl font-manrope-bold text-center">
                    {successRate >= 80
                      ? 'Excelente!'
                      : successRate >= 50
                      ? 'Bom trabalho!'
                      : 'Continue praticando!'}
                  </Text>
                  <Text className="text-foreground dark:text-foreground-dark/60 text-base font-manrope-regular text-center">
                    Você completou todas as perguntas
                  </Text>
                </View>

                <View className="bg-background dark:bg-background-dark rounded-xl p-4">
                  <View className="flex-row items-center justify-center gap-2 mb-4">
                    <Text className="text-foreground dark:text-foreground-dark text-4xl font-manrope-bold">
                      {successRate}%
                    </Text>
                  </View>

                  <View className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View className="w-3 h-3 rounded-full bg-green-500" />
                        <Text className="text-foreground dark:text-foreground-dark text-sm font-manrope-regular">
                          Acertos
                        </Text>
                      </View>
                      <Text className="text-foreground dark:text-foreground-dark text-lg font-manrope-bold">
                        {correctCount}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View className="w-3 h-3 rounded-full bg-red-500" />
                        <Text className="text-foreground dark:text-foreground-dark text-sm font-manrope-regular">
                          Erros
                        </Text>
                      </View>
                      <Text className="text-foreground dark:text-foreground-dark text-lg font-manrope-bold">
                        {wrongCount}
                      </Text>
                    </View>

                    <View className="h-px bg-border my-1" />

                    <View className="flex-row items-center justify-between">
                      <Text className="text-foreground dark:text-foreground-dark text-sm font-manrope-semibold">
                        Total
                      </Text>
                      <Text className="text-foreground dark:text-foreground-dark text-lg font-manrope-bold">
                        {questions.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="gap-4">
                <TouchableOpacity
                  onPress={handleRestart}
                  className="h-14 rounded-xl items-center justify-center bg-primary dark:bg-primary-dark"
                >
                  <Text className="text-white text-base font-manrope-semibold">
                    Refazer Perguntas
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleGoBack}
                  className="h-14 rounded-xl items-center justify-center bg-card dark:bg-card-dark"
                >
                  <Text className="text-foreground dark:text-foreground-dark text-base font-manrope-semibold">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="flex-1 px-5 pt-5 gap-6">
              {/* Barra de progresso */}
              <Progress progress={(qIndex + 1) / questions.length} />

              {/* Palavra a ser traduzida */}
              <Text className="text-foreground dark:text-foreground-dark text-xl font-manrope-bold">
                {q.front}
              </Text>

              {/* Instrução */}
              <Text className="text-foreground dark:text-foreground-dark text-base font-manrope-regular">
                Escolha a resposta correta
              </Text>

              {/* Opções de resposta */}
              <View className="gap-3">
                {q.options.map((opt) => {
                  const isSelected = opt === selected
                  const isCorrect = answered && opt === q.back
                  const isWrong = answered && isSelected && opt !== q.back
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => select(opt)}
                      className={`px-5 py-3.5 rounded-xl flex-row items-center ${
                        isCorrect
                          ? 'bg-green-600/20'
                          : isWrong
                          ? 'bg-red-600/20'
                          : 'bg-card dark:bg-card-dark'
                      }`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`Opção ${opt}`}
                    >
                      <Text
                        className={`text-sm font-manrope-regular flex-1 ${
                          isCorrect
                            ? 'text-green-600'
                            : isWrong
                            ? 'text-red-600'
                            : 'text-foreground dark:text-foreground-dark'
                        }`}
                      >
                        {opt}
                      </Text>
                      {isCorrect && <Text className="text-xs text-green-600">✓</Text>}
                      {isWrong && <Text className="text-xs text-red-600">✗</Text>}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}

          {!finished && answered && (
            <View className="px-5 pb-5">
              <TouchableOpacity
                onPress={next}
                className="h-14 rounded-xl items-center justify-center bg-primary dark:bg-primary-dark"
              >
                <Text className="text-white text-base font-manrope-semibold">Próximo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}
