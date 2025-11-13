import { env } from '@/env'
import axios from 'axios'

export const googleTranslateApi = axios.create({
  baseURL: 'https://translation.googleapis.com/language/translate/v2',
  timeout: 10000,
  params: {
    key: env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY,
  },
})
