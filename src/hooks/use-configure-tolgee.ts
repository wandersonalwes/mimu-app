import { useEffect } from 'react'

import { tolgee } from '@/libs/tolgee'
import { useLanguageStore } from '@/stores/language'

export function useConfigureTolgee() {
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    if (tolgee.getLanguage() !== language) {
      tolgee.changeLanguage(language)
    }
  }, [language])
}
