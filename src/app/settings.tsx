import { Link } from 'expo-router'
import { View } from 'react-native'

export default function SettingsScreen() {
  return (
    <View className="flex-1 p-5">
      <Link href="/subscription" className="text-primary">
        Subscription
      </Link>
      <Link href="/theme" className="text-primary">
        Theme
      </Link>
      <Link href="/language" className="text-primary">
        Language
      </Link>
    </View>
  )
}
