import { useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ConfirmDeleteSheet } from '@/components/confirm-delete-sheet'
import { ListOptionsSheet } from '@/components/list-options-sheet'
import { useCardsByListId } from '@/hooks/use-cards'
import { useList } from '@/hooks/use-lists'
import {
  CardsIcon,
  DotsThreeIcon,
  FunnelIcon,
  HeartIcon,
  PuzzlePieceIcon,
  SealQuestionIcon,
  SpeakerHighIcon,
  TrashIcon,
} from '@/icons'
import { toast } from '@/libs/toast'
import { cardActions, type Card } from '@/state/card'
import { listActions } from '@/state/list'

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

export default function CardDetailScreen() {
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const deleteCardSheetRef = useRef<BottomSheet>(null)
  const deleteListSheetRef = useRef<BottomSheet>(null)
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  // Usar hooks reativos para atualização em tempo real
  const list = useList(id)
  const cards = useCardsByListId(id)

  const cardsInList = cards.length

  if (!list) {
    return null
  }

  function confirmDeleteList() {
    cardActions.removeAllCardsByListId(id)
    listActions.removeList(id)
    router.back()
  }

  function handleEditList() {
    bottomSheetRef.current?.close()
    setTimeout(() => {
      router.push(`/card/edit/${id}`)
    }, 300)
  }

  function handleToggleFavorite(cardId: string) {
    cardActions.toggleFavorite(cardId)
  }

  function handleDeleteCard(cardId: string) {
    if (cards.length <= 1) {
      toast.warning({ title: 'Não é possível excluir o último cartão. Exclua a lista completa.' })
      return
    }

    setCardToDelete(cardId)
    deleteCardSheetRef.current?.expand()
  }

  function confirmDeleteCard() {
    if (cardToDelete) {
      cardActions.removeCard(cardToDelete)
      setCardToDelete(null)
    }
  }

  function showListOptions() {
    bottomSheetRef.current?.expand()
  }

  function handleDeleteListFromSheet() {
    bottomSheetRef.current?.close()
    setTimeout(() => {
      deleteListSheetRef.current?.expand()
    }, 300)
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPressIn={showListOptions} className="p-2 -mr-2">
              <DotsThreeIcon size={24} className="text-foreground dark:text-foreground-dark" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: bottom + 20 }}
        className="bg-background dark:bg-background-dark"
      >
        <View className="flex-1 mb-6">
          <Text className="font-manrope-bold mb-1 text-foreground dark:text-foreground-dark">
            {list.name}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {cardsInList} {cardsInList === 1 ? 'termo' : 'termos'}
          </Text>
        </View>

        <View className="gap-3 mb-8">
          {data.map((item) => (
            <TouchableOpacity
              key={item.title}
              className="flex-row gap-4 items-center px-5 py-3.5 bg-card dark:bg-card-dark rounded-2xl"
              onPress={() => router.push({ pathname: `/study/${item.slug}`, params: { id } })}
            >
              <item.icon size={24} className="text-foreground dark:text-foreground-dark" />
              <Text className="text-foreground text-sm dark:text-foreground-dark">
                {item.title}
              </Text>
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
            <FunnelIcon size={20} className="text-foreground dark:text-foreground-dark" />
          </TouchableOpacity>
        </View>

        <View className="gap-3">
          {cards.map((card: Card, index: number) => (
            <View
              key={card.id}
              className="bg-card dark:bg-card-dark rounded-2xl px-5 py-4 flex-row items-start justify-between"
            >
              <View className="flex-1 gap-2 mr-4">
                <Text className="text-foreground dark:text-foreground-dark text-sm font-manrope-regular">
                  {card.front}
                </Text>
                <Text className="text-muted-foreground dark:text-muted-foreground text-sm font-manrope-regular">
                  {card.back}
                </Text>
              </View>

              <View className="flex-row gap-3 items-center">
                <TouchableOpacity>
                  <SpeakerHighIcon
                    size={20}
                    className="text-foreground dark:text-foreground-dark"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleFavorite(card.id)}>
                  <HeartIcon
                    size={20}
                    weight={card.isFavorite ? 'fill' : 'regular'}
                    className={
                      card.isFavorite
                        ? 'text-destructive dark:text-destructive-dark'
                        : 'text-foreground dark:text-foreground-dark'
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteCard(card.id)}>
                  <TrashIcon size={20} className="text-foreground dark:text-foreground-dark" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <ListOptionsSheet
        ref={bottomSheetRef}
        onEdit={handleEditList}
        onDelete={handleDeleteListFromSheet}
      />

      <ConfirmDeleteSheet
        ref={deleteCardSheetRef}
        title="Excluir Cartão"
        message="Tem certeza que deseja excluir este cartão?"
        onConfirm={confirmDeleteCard}
      />

      <ConfirmDeleteSheet
        ref={deleteListSheetRef}
        title="Excluir Lista"
        message="Tem certeza que deseja excluir esta lista e todos os seus cartões?"
        onConfirm={confirmDeleteList}
      />
    </>
  )
}
