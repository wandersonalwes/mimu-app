import { Text, View } from 'react-native'

import { Fab } from '@/components/fab'
import { PlusIcon } from '@/icons'

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-2xl text-foreground font-manrope-bold">Mimu</Text>

      <Fab>
        <PlusIcon size={24} className="text-white" />
      </Fab>
    </View>
  )
}
