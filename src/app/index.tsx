import { useRef } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useValue } from '@legendapp/state/react'

import { Images } from '@/assets/images'
import { CardListItem } from '@/components/card-list-item'
import { EmptyState } from '@/components/empty-state'
import { Fab } from '@/components/fab'
import { HomeActionsSheet } from '@/components/home-actions-sheet'
import { type BaseBottomSheetRef } from '@/components/base-bottom-sheet.shared'
import { BooksIcon, GearSixIcon, MimuIcon, PlusIcon } from '@/icons'
import { cardActions } from '@/state/card'
import { listStore$ } from '@/state/list'
import { useUniwind } from 'uniwind'
import { StudyOverviewCard } from '@/components/study/study-overview-card'

export default function HomeScreen() {
  const router = useRouter()
  const actionsSheetRef = useRef<BaseBottomSheetRef>(null)

  const { t } = useTolgee(['language'])

  const lists = useValue(listStore$.lists)

  const { theme } = useUniwind()
  const isDark = theme === 'dark'

  function handleCardPress(cardId: string) {
    router.push(`/card/${cardId}`)
  }

  function handleCreateCardPress() {
    actionsSheetRef.current?.close()
    setTimeout(() => router.push('/card/create'), 300)
  }

  function handleImportPress() {
    actionsSheetRef.current?.close()
    setTimeout(() => router.push('/card/import'), 300)
  }

  function showHomeActions() {
    actionsSheetRef.current?.expand()
  }

  function handleEmptyCreatePress() {
    router.push('/card/create')
  }

  const renderItem = ({ item }: { item: (typeof lists)[number] }) => {
    const cardsInList = cardActions.getCardsByListId(item.id).length
    const termText = cardsInList === 1 ? t('common.term') : t('common.terms')
    return (
      <CardListItem
        title={item.name}
        subtitle={`${cardsInList} ${termText}`}
        onPress={() => handleCardPress(item.id)}
      />
    )
  }

  return (
    <View className="flex-1 bg-background">
      <Image
        source={isDark ? Images.headerBackgroundDark : Images.headerBackgroundLight}
        className="absolute top-0 left-0 right-0"
        resizeMode="contain"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="h-16 items-center flex-row px-5 justify-between">
          <MimuIcon className="text-foreground" />
          <Link href="/settings" asChild>
            <TouchableOpacity>
              <GearSixIcon size={24} className="text-foreground" />
            </TouchableOpacity>
          </Link>
        </View>

        <View className="px-5 py-8 flex-1">
          <Text className="text-base font-manrope-bold mb-3 text-foreground">
            {t('home.cardList')}
          </Text>

          {lists.length === 0 ? (
            <EmptyState
              icon={BooksIcon}
              title={t('home.emptyState.title')}
              description={t('home.emptyState.description')}
              buttonText={t('home.emptyState.button')}
              onButtonPress={handleEmptyCreatePress}
              secondaryButtonText={t('csvImport.action')}
              onSecondaryButtonPress={() => router.push('/card/import')}
            />
          ) : (
            <FlatList
              data={lists}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View className="h-3" />}
              ListHeaderComponent={<StudyOverviewCard />}
              contentInsetAdjustmentBehavior="automatic"
            />
          )}
        </View>

        <Fab onPress={showHomeActions}>
          <PlusIcon size={24} className="text-white" />
        </Fab>
      </SafeAreaView>

      <HomeActionsSheet
        ref={actionsSheetRef}
        onCreate={handleCreateCardPress}
        onImport={handleImportPress}
      />
    </View>
  )
}
