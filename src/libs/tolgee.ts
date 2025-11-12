import { FormatIcu } from '@tolgee/format-icu'
import { DevTools, Tolgee } from '@tolgee/react'

import enUS from '@/i18n/en-US.json'
import esES from '@/i18n/es-ES.json'
import ptBR from '@/i18n/pt-BR.json'

import { env } from '@/env'

export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatIcu())
  .init({
    language: 'pt-BR',
    apiUrl: env.EXPO_PUBLIC_TOLGEE_API_URL,
    apiKey: env.EXPO_PUBLIC_TOLGEE_API_KEY,
    staticData: { 'en-US': enUS, 'pt-BR': ptBR, 'es-ES': esES },
  })
