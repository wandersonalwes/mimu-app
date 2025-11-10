import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import {
  CardsIcon,
  FunnelIcon,
  HeartIcon,
  PuzzlePieceIcon,
  SealQuestionIcon,
  SpeakerHighIcon,
} from '@/icons'
import { cardActions, type Card } from '@/state/card'
import { listActions } from '@/state/list'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const data = [
  {
    title: 'Flashcards',
    slug: 'flashcards',
    icon: CardsIcon,
  },
  {
    title: 'Perguntas',
    slug: 'questions',
    icon: SealQuestionIcon,
  },
  // {
  //   title: 'Teste Rápido',
  //   slug: 'quick-test',
  //   icon: TargetIcon,
  // },
  {
    title: 'Combinar',
    slug: 'combine',
    icon: PuzzlePieceIcon,
  },
] as const

const cards = [
  {
    front: 'Awesome',
    back: 'Incrível',
  },
  {
    front: 'Cool',
    back: 'Legal',
  },
  { front: 'Great', back: 'Ótimo' },
  { front: 'Interesting', back: 'Interessante' },
  { front: 'Fun', back: 'Divertido' },
  {
    front: 'Easy',
    back: 'Fácil',
  },
]

export default function CardDetailScreen() {
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const list = listActions.getListById(id)
  const cards = cardActions.getCardsByListId(id)

  const cardsInList = cards.length

  if (!list) {
    return null
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: bottom + 20 }}
      className="bg-background dark:bg-background-dark"
    >
      <Text className="font-manrope-bold mb-1 text-foreground dark:text-foreground-dark">
        {list.name}
      </Text>
      <Text className="text-sm text-muted-foreground mb-6">
        {cardsInList} {cardsInList === 1 ? 'termo' : 'termos'}
      </Text>

      <View className="gap-3 mb-8">
        {data.map((item) => (
          <TouchableOpacity
            key={item.title}
            className="flex-row gap-4 items-center px-5 py-3.5 bg-card dark:bg-card-dark rounded-2xl"
            onPress={() => router.push({ pathname: `/study/${item.slug}`, params: { id } })}
          >
            <item.icon size={24} className="text-foreground dark:text-foreground-dark" />
            <Text className="text-foreground text-sm dark:text-foreground-dark">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-manrope-bold text-base text-foreground dark:text-foreground-dark">
          Cartões
        </Text>
        <TouchableOpacity className="flex-row items-center gap-4">
          <Text className="text-foreground text-sm font-manrope-medium dark:text-foreground-dark">
            Ordem original
          </Text>
          <FunnelIcon size={20} />
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        {cards.map((card: Card, index: number) => (
          <TouchableOpacity
            key={card.id}
            className="bg-card dark:bg-card-dark rounded-2xl px-5 py-4 flex-row items-start justify-between"
          >
            <View className="gap-2">
              <Text className="text-foreground dark:text-foreground-dark text-sm font-manrope-regular">
                {card.front}
              </Text>
              <Text className="text-foreground dark:text-foreground-dark text-sm font-manrope-regular">
                {card.back}
                {card.back}
              </Text>
            </View>

            <View className="flex-row gap-3 items-center">
              <TouchableOpacity>
                <SpeakerHighIcon size={20} className="text-foreground dark:text-foreground-dark" />
              </TouchableOpacity>
              <TouchableOpacity>
                <HeartIcon size={20} className="text-foreground dark:text-foreground-dark" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}
