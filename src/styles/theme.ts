import { Theme } from '@react-navigation/native'

const fonts = {
  regular: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'ManropeMedium',
    fontWeight: '500',
  },
  heavy: {
    fontFamily: 'ManropeBold',
    fontWeight: '600',
  },
  bold: {
    fontFamily: 'ManropeBold',
    fontWeight: '700',
  },
} as const

const light: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(76, 201, 240)',
    background: 'rgb(244, 244, 245)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(0, 0, 0)',
    border: 'rgb(229, 231, 235)',
    notification: 'rgb(239, 68, 68)',
  },
  fonts,
}

const dark: Theme = {
  dark: true,
  colors: {
    primary: 'rgb(72, 12, 168)',
    background: 'rgb(255, 255, 255)',
    card: 'rgb(24, 24, 27)',
    text: 'rgb(244, 244, 245)',
    border: 'rgb(229, 231, 235)',
    notification: 'rgb(239, 68, 68)',
  },
  fonts,
}

export const themes = { light, dark }
