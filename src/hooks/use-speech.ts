import * as Speech from 'expo-speech'
import { useState } from 'react'

function detectLanguage(text: string): string {
  const portuguesePattern = /[áàâãéêíóôõúüç]/i

  const portugueseWords = /\b(o|a|os|as|de|da|do|em|para|com|que|não|um|uma)\b/i

  if (portuguesePattern.test(text) || portugueseWords.test(text)) {
    return 'pt-BR'
  }

  return 'en-US'
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = async (text: string, language?: string) => {
    try {
      if (isSpeaking) {
        await Speech.stop()
        setIsSpeaking(false)
        return
      }

      setIsSpeaking(true)

      const detectedLanguage = language || detectLanguage(text)

      Speech.speak(text, {
        language: detectedLanguage,
        pitch: 1.0,
        rate: 0.85,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      })
    } catch (error) {
      console.error('Error speaking:', error)
      setIsSpeaking(false)
    }
  }

  const stop = async () => {
    try {
      await Speech.stop()
      setIsSpeaking(false)
    } catch (error) {
      console.error('Error stopping speech:', error)
    }
  }

  return { speak, stop, isSpeaking }
}
