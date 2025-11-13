import { useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ConfirmDeleteSheet } from '@/components/confirm-delete-sheet'
import { ListOptionsSheet } from '@/components/list-options-sheet'
import { SortOptionsSheet, type SortOption } from '@/components/sort-options-sheet'
import { useCardsByListId } from '@/hooks/use-cards'
import { useList } from '@/hooks/use-lists'
import { useSpeech } from '@/hooks/use-speech'
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

export default function CardDetailScreen() {
  const { t } = useTolgee(['language'])

  const data = [
    {
      title: t('cardDetail.studyModes.flashcards'),
      slug: 'flashcards',
      icon: CardsIcon,
    },
    {
      title: t('cardDetail.studyModes.questions'),
      slug: 'questions',
      icon: SealQuestionIcon,
    },
    {
      title: t('cardDetail.studyModes.combine'),
      slug: 'combine',
      icon: PuzzlePieceIcon,
    },
  ] as const
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const deleteCardSheetRef = useRef<BottomSheet>(null)
  const deleteListSheetRef = useRef<BottomSheet>(null)
  const sortSheetRef = useRef<BottomSheet>(null)
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<SortOption>('createdAtAsc')

  const list = useList(id)
  const cards = useCardsByListId(id)
  const { speak } = useSpeech()

  const comparators = {
    createdAtAsc: (a: Card, b: Card) => a.createdAt - b.createdAt,
    createdAtDesc: (a: Card, b: Card) => b.createdAt - a.createdAt,
    alphabeticalAsc: (a: Card, b: Card) => a.front.localeCompare(b.front),
    alphabeticalDesc: (a: Card, b: Card) => b.front.localeCompare(a.front),
  } as const

  const sortedCards = [...cards].sort(comparators[sortOption] ?? (() => 0))

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
      toast.warning({ title: t('cardDetail.delete.card.lastCard') })
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

  function handleSpeak(text: string) {
    speak(text)
  }

  function showSortOptions() {
    sortSheetRef.current?.expand()
  }

  function handleSelectSort(sort: SortOption) {
    setSortOption(sort)
  }

  const sortLabels = {
    createdAtAsc: 'cardDetail.sort.createdAtAsc',
    createdAtDesc: 'cardDetail.sort.createdAtDesc',
    alphabeticalAsc: 'cardDetail.sort.alphabeticalAsc',
    alphabeticalDesc: 'cardDetail.sort.alphabeticalDesc',
  } as const

  const getSortLabel = () => t(sortLabels[sortOption] ?? 'cardDetail.sort.original')

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
            {cardsInList} {cardsInList === 1 ? t('common.term') : t('common.terms')}
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
            {t('common.cards')}
          </Text>
          <TouchableOpacity className="flex-row items-center gap-4" onPress={showSortOptions}>
            <Text className="text-foreground text-sm font-manrope-medium dark:text-foreground-dark">
              {getSortLabel()}
            </Text>

            <FunnelIcon size={20} className="text-foreground dark:text-foreground-dark" />
          </TouchableOpacity>
        </View>

        <View className="gap-3">
          {sortedCards.map((card: Card) => (
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
                <TouchableOpacity onPress={() => handleSpeak(card.front)}>
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
        title={t('cardDetail.delete.card.title')}
        message={t('cardDetail.delete.card.message')}
        onConfirm={confirmDeleteCard}
      />

      <ConfirmDeleteSheet
        ref={deleteListSheetRef}
        title={t('cardDetail.delete.list.title')}
        message={t('cardDetail.delete.list.message')}
        onConfirm={confirmDeleteList}
      />

      <SortOptionsSheet
        ref={sortSheetRef}
        currentSort={sortOption}
        onSelectSort={handleSelectSort}
      />
    </>
  )
}
