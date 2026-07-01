import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SubscriptionScreen() {
  const { t } = useTolgee(['language'])
  const router = useRouter()

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View className="flex-1 w-full max-w-xl self-center px-5 py-6 justify-center gap-6">
          <View className="gap-3">
            <Text className="text-2xl font-manrope-bold text-foreground">
              Assinatura
            </Text>
            <Text className="text-sm font-manrope-regular text-muted-foreground leading-5">
              A experiência principal do Mimu funciona no navegador. Assinaturas e restauração de compras ficam disponíveis nos apps mobile.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center rounded-xl bg-primary py-4"
          >
            <Text className="text-sm font-manrope-semibold text-primary-foreground">
              {t('common.back')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}
