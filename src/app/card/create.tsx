import { useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { useTolgee } from '@tolgee/react'
import { Stack, useRouter } from 'expo-router'

import { Fab } from '@/components/fab'
import { LanguagePickerSheet } from '@/components/language-picker-sheet'
import { LanguageSelector } from '@/components/language-selector'
import { useKeyboardHeight } from '@/hooks/use-keyboard-height'
import { PlusIcon } from '@/icons'
import { generateId } from '@/libs/generate-id'
import { toast } from '@/libs/toast'
import { validateCards, validateListTitle } from '@/libs/validation'
import { cardActions } from '@/state/card'
import { listActions } from '@/state/list'
import { useLanguageStore } from '@/stores/language'

type CardInput = {
  id: string
  front: string
  back: string
}

type LanguageCode = 'pt-BR' | 'en-US' | 'es-ES'

export default function CreateCardScreen() {
  const router = useRouter()
  const scrollRef = useRef<ScrollView>(null)
  const termLanguageSheetRef = useRef<BottomSheet>(null)
  const definitionLanguageSheetRef = useRef<BottomSheet>(null)
  const { t } = useTolgee(['language'])
  const { language: userLanguage } = useLanguageStore()
  const [title, setTitle] = useState('')
  const [termLanguage, setTermLanguage] = useState<LanguageCode>(userLanguage as LanguageCode)
  const [definitionLanguage, setDefinitionLanguage] = useState<LanguageCode>(
    userLanguage as LanguageCode
  )
  const [cards, setCards] = useState<CardInput[]>([{ id: generateId(), front: '', back: '' }])
  const [isSaving, setIsSaving] = useState(false)
  const keyboardHeight = useKeyboardHeight()

  function handleAddCard() {
    const newCard: CardInput = {
      id: generateId(),
      front: '',
      back: '',
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
    setCards(cards.filter((card) => card.id !== id))
  }

  function validateForm(): { isValid: boolean; message?: string } {
    // Validar título
    const titleValidation = validateListTitle(title)
    if (!titleValidation.isValid) {
      return titleValidation
    }

    // Validar cartões
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
      // Criar a lista
      const listId = generateId()
      listActions.addList({
        id: listId,
        name: title.trim(),
        termLanguage,
        definitionLanguage,
      })

      // Filtrar e adicionar apenas cartões válidos
      const validCards = cards
        .filter((card) => card.front.trim() && card.back.trim())
        .map((card) => ({
          id: generateId(),
          front: card.front.trim(),
          back: card.back.trim(),
          listId,
        }))

      cardActions.addCards(validCards)

      toast.success({ title: t('cardForm.success.created') })

      router.back()
    } catch (error) {
      console.error('Error saving list:', error)
      toast.error({
        title: t('cardForm.error.save'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  function headerRight() {
    return (
      <TouchableOpacity
        onPressIn={handleSave}
        disabled={isSaving}
        className="bg-primary dark:bg-primary-dark px-6 py-2.5 rounded-lg active:opacity-80"
      >
        <Text className="text-sm font-manrope-semibold text-white">
          {isSaving ? t('common.saving') : t('common.save')}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerRight }} />

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
              {/* Language Info */}
              <View className="mb-6 p-4 bg-card dark:bg-card-dark rounded-xl">
                <Text className="text-xs font-manrope-regular text-muted-foreground dark:text-muted-foreground leading-4">
                  {t('cardForm.languageInfo')}
                </Text>
              </View>

              {/* Language Selectors */}
              <LanguageSelector
                label={t('cardForm.termLanguage')}
                value={termLanguage}
                onPress={() => termLanguageSheetRef.current?.expand()}
                disabled={isSaving}
              />

              <LanguageSelector
                label={t('cardForm.definitionLanguage')}
                value={definitionLanguage}
                onPress={() => definitionLanguageSheetRef.current?.expand()}
                disabled={isSaving}
              />

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
                      <Text className="text-xs font-manrope-medium text-muted dark:text-foreground-dark">
                        Cartão {index + 1}
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

      <LanguagePickerSheet
        ref={termLanguageSheetRef}
        selectedLanguage={termLanguage}
        onSelectLanguage={(code) => setTermLanguage(code as LanguageCode)}
      />

      <LanguagePickerSheet
        ref={definitionLanguageSheetRef}
        selectedLanguage={definitionLanguage}
        onSelectLanguage={(code) => setDefinitionLanguage(code as LanguageCode)}
      />
    </>
  )
}
