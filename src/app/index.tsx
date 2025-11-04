import { Text, View } from 'react-native'

import { Fab } from '@/components/fab'
import { PlusIcon } from '@/icons'
import { Link } from 'expo-router'

const screens = ['/card/[id]', '/settings', '/language', '/theme', '/subscription', '/study/[type]']

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-2xl text-foreground font-manrope-bold">Mimu</Text>

      {screens.map((screen) => (
        // @ts-ignore
        <Link key={screen} href={screen} className="mt-4 px-4 py-2 bg-primary rounded">
          <Text className="text-foreground">{screen}</Text>
        </Link>
      ))}

      <Fab>
        <PlusIcon size={24} className="text-white" />
      </Fab>
    </View>
  )
}
