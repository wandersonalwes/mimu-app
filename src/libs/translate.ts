import { googleTranslateApi } from './axios'

type LanguageCode = 'pt-BR' | 'en-US' | 'es-ES'

// Map our language codes to Google Translate API codes
const languageMap: Record<LanguageCode, string> = {
  'pt-BR': 'pt',
  'en-US': 'en',
  'es-ES': 'es',
}

export async function translateText(
  text: string,
  sourceLanguage: LanguageCode,
  targetLanguage: LanguageCode
): Promise<string> {
  if (!text.trim()) {
    return ''
  }

  if (sourceLanguage === targetLanguage) {
    return text
  }

  try {
    const response = await googleTranslateApi.post('', {
      q: text,
      source: languageMap[sourceLanguage],
      target: languageMap[targetLanguage],
      format: 'text',
    })

    const translatedText = response.data.data.translations[0].translatedText
    return translatedText
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}
