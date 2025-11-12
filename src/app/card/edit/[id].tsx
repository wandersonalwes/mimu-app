import { useEffect, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

import { Fab } from '@/components/fab'
import { useKeyboardHeight } from '@/hooks'
import { PlusIcon } from '@/icons'
import { generateId } from '@/libs/generate-id'
import { toast } from '@/libs/toast'
import { validateCards, validateListTitle } from '@/libs/validation'
import { cardActions } from '@/state/card'
import { listActions } from '@/state/list'

type CardInput = {
  id: string
  front: string
  back: string
  isNew?: boolean
}

export default function EditCardScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const scrollRef = useRef<ScrollView>(null)
  const { t } = useTolgee(['language'])

  const [title, setTitle] = useState('')
  const [cards, setCards] = useState<CardInput[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [deletedCardIds, setDeletedCardIds] = useState<string[]>([])
  const keyboardHeight = useKeyboardHeight()

  useEffect(() => {
    const list = listActions.getListById(id)
    const existingCards = cardActions.getCardsByListId(id)

    if (list) {
      setTitle(list.name)
    }

    if (existingCards.length > 0) {
      setCards(
        existingCards.map((card) => ({
          id: card.id,
          front: card.front,
          back: card.back,
        }))
      )
    }
  }, [id])

  function handleAddCard() {
    const newCard: CardInput = {
      id: generateId(),
      front: '',
      back: '',
      isNew: true,
    }
    setCards([...cards, newCard])

    // Scroll para o final após adicionar o card
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  function updateCard(id: string, field: 'front' | 'back', value: string) {
    setCards(cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)))
  }

  function removeCard(id: string) {
    if (cards.length <= 1) {
      toast.warning({ title: t('cardForm.error.minCards') })
      return
    }

    // Se não é um cartão novo, adiciona à lista de deletados
    const card = cards.find((c) => c.id === id)
    if (card && !card.isNew) {
      setDeletedCardIds([...deletedCardIds, id])
    }

    setCards(cards.filter((card) => card.id !== id))
  }

  function validateForm(): { isValid: boolean; message?: string } {
    const titleValidation = validateListTitle(title)
    if (!titleValidation.isValid) {
      return titleValidation
    }

    const cardsValidation = validateCards(cards)
    if (!cardsValidation.isValid) {
      return cardsValidation
    }

    return { isValid: true }
  }

  function handleSave() {
    const validation = validateForm()

    if (!validation.isValid) {
      toast.error({
        title: validation.message || t('cardForm.error.fillFields'),
      })
      return
    }

    setIsSaving(true)

    try {
      // Atualizar a lista
      listActions.updateList(id, {
        name: title.trim(),
      })

      // Remover cartões deletados
      deletedCardIds.forEach((cardId) => {
        cardActions.removeCard(cardId)
      })

      // Processar cartões
      cards.forEach((card) => {
        if (card.front.trim() && card.back.trim()) {
          if (card.isNew) {
            // Adicionar novo cartão
            cardActions.addCard({
              id: generateId(),
              front: card.front.trim(),
              back: card.back.trim(),
              listId: id,
            })
          } else {
            // Atualizar cartão existente
            cardActions.updateCard(card.id, {
              front: card.front.trim(),
              back: card.back.trim(),
            })
          }
        }
      })

      toast.success({ title: t('cardForm.success.updated') })

      router.back()
    } catch (error) {
      console.error('Error updating list:', error)
      toast.error({
        title: t('common.error'),
        description: t('cardForm.error.update'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!cards.length && !title) {
    return null
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: t('cardForm.editTitle'),
          headerRight: () => (
            <TouchableOpacity
              onPressIn={handleSave}
              disabled={isSaving}
              className="bg-primary dark:bg-primary-dark px-6 py-2.5 rounded-lg active:opacity-80"
            >
              <Text className="text-sm font-manrope-semibold text-white">
                {isSaving ? t('common.saving') : t('common.save')}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 bg-background dark:bg-background-dark">
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 100 : 100 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View className="px-5 py-6">
              <Text className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark mb-2.5">
                {t('common.title')}
              </Text>
              <View className="bg-card dark:bg-card-dark rounded-xl px-4 py-4 mb-6">
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder={t('cardForm.titlePlaceholder')}
                  placeholderTextColor="#9D9D9D"
                  className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark"
                  editable={!isSaving}
                />
              </View>

              {/* Cartões Section */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark">
                  {t('common.cards')} ({cards.length})
                </Text>
              </View>

              {/* Card List */}
              <View className="gap-5">
                {cards.map((card, index) => (
                  <View key={card.id} className="relative">
                    {/* Card Number and Remove Button */}
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-xs font-manrope-medium text-muted dark:text-muted-dark">
                        {t('common.card')} {index + 1}
                        {card.isNew && ` (${t('cardForm.new')})`}
                      </Text>
                      {cards.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeCard(card.id)}
                          disabled={isSaving}
                          className="active:opacity-60"
                        >
                          <Text className="text-xs font-manrope-medium text-destructive dark:text-destructive-dark">
                            {t('cardForm.removeCard')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Term Input */}
                    <View className="bg-card dark:bg-card-dark rounded-t-xl px-4 py-4">
                      <TextInput
                        value={card.front}
                        onChangeText={(value) => updateCard(card.id, 'front', value)}
                        placeholder={t('cardForm.frontPlaceholder')}
                        placeholderTextColor="#9D9D9D"
                        className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark"
                        editable={!isSaving}
                        multiline
                      />
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-background dark:bg-background-dark" />

                    {/* Definition Input */}
                    <View className="bg-card dark:bg-card-dark rounded-b-xl px-4 py-4">
                      <TextInput
                        value={card.back}
                        onChangeText={(value) => updateCard(card.id, 'back', value)}
                        placeholder={t('cardForm.backPlaceholder')}
                        placeholderTextColor="#9D9D9D"
                        className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark"
                        editable={!isSaving}
                        multiline
                      />
                    </View>
                  </View>
                ))}
              </View>

              {/* Bottom spacing for FAB */}
              <View className="h-24" />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>

        {/* FAB */}
        {!isSaving && (
          <Fab onPress={handleAddCard} keyboardOffset={keyboardHeight}>
            <PlusIcon size={24} className="text-white" />
          </Fab>
        )}
      </View>
    </>
  )
}
