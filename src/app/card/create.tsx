import { useState } from 'react'
import { ScrollView, Text, TextInput, View } from 'react-native'

import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Fab } from '@/components/fab'
import { PlusIcon } from '@/icons'

type CardTerm = {
  id: string
  term: string
  definition: string
}

export default function CreateCardScreen() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [cards, setCards] = useState<CardTerm[]>([
    { id: '1', term: '', definition: '' },
    { id: '2', term: '', definition: '' },
    { id: '3', term: '', definition: '' },
    { id: '4', term: '', definition: '' },
  ])

  function handleAddCard() {
    const newCard: CardTerm = {
      id: Date.now().toString(),
      term: '',
      definition: '',
    }
    setCards([...cards, newCard])
  }

  function updateCard(id: string, field: 'term' | 'definition', value: string) {
    setCards(cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)))
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 py-6">
            <Text className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark mb-2.5">
              Título
            </Text>
            <View className="bg-card dark:bg-card-dark rounded-xl px-4 py-4 mb-6">
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Tema, capítulo, unidade"
                placeholderTextColor="#9D9D9D"
                className="text-sm font-manrope-semibold text-foreground"
              />
            </View>

            {/* Cartões Section */}
            <Text className="text-sm font-manrope-semibold text-foreground mb-[15px]">Cartões</Text>

            {/* Card List */}
            <View className="gap-5">
              {cards.map((card, index) => (
                <View key={card.id} className="relative">
                  {/* Term Input */}
                  <View className="bg-card dark:bg-card-dark rounded-t-xl px-4 py-4">
                    <TextInput
                      value={card.term}
                      onChangeText={(value) => updateCard(card.id, 'term', value)}
                      placeholder="Termo"
                      placeholderTextColor="#9D9D9D"
                      className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark"
                    />
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-background dark:bg-background-dark" />

                  {/* Definition Input */}
                  <View className="bg-card dark:bg-card-dark rounded-b-xl px-4 py-4">
                    <TextInput
                      value={card.definition}
                      onChangeText={(value) => updateCard(card.id, 'definition', value)}
                      placeholder="Definição"
                      placeholderTextColor="#9D9D9D"
                      className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark"
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Bottom spacing for FAB */}
            <View className="h-24" />
          </View>
        </ScrollView>

        {/* FAB */}
        <Fab onPress={handleAddCard}>
          <PlusIcon size={24} className="text-white" />
        </Fab>
      </SafeAreaView>
    </View>
  )
}
