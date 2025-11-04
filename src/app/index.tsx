import { Image, Text, TouchableOpacity, View } from 'react-native'

import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Images } from '@/assets/images'
import { CardListItem } from '@/components/card-list-item'
import { Fab } from '@/components/fab'
import { MimuLogo } from '@/components/mimu-logo'
import { GearSixIcon, PlusIcon } from '@/icons'

export default function HomeScreen() {
  const router = useRouter()

  function handleCardPress(cardId: string) {
    router.push(`/card/${cardId}`)
  }
  return (
    <View className="flex-1 bg-background">
      <Image source={Images.headerBackgroundLight} className="absolute top-0 left-0 right-0" />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="h-16 items-center flex-row px-5 justify-between">
          <MimuLogo />
          <Link href="/settings" asChild>
            <TouchableOpacity>
              <GearSixIcon size={24} className="text-foreground" />
            </TouchableOpacity>
          </Link>
        </View>

        <View className="px-5 py-8">
          <Text className="text-base font-manrope-bold mb-3">Lista de cartões</Text>

          <View className="gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <CardListItem
                key={index}
                title={`Cartão ${index + 1}`}
                subtitle="25 termos"
                onPress={() => handleCardPress((index + 1).toString())}
              />
            ))}
          </View>
        </View>

        <Fab>
          <PlusIcon size={24} className="text-white" />
        </Fab>
      </SafeAreaView>
    </View>
  )
}
