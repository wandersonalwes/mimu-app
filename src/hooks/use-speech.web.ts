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
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    try {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language || detectLanguage(text)
      utterance.pitch = 1
      utterance.rate = 0.85
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Error speaking:', error)
      setIsSpeaking(false)
    }
  }

  const stop = async () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    try {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } catch (error) {
      console.error('Error stopping speech:', error)
    }
  }

  return { speak, stop, isSpeaking }
}
