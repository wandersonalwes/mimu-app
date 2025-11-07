import { Theme } from '@react-navigation/native'

export const theme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(76, 201, 240)',
    background: 'rgb(244, 244, 245)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(0, 0, 0)',
    border: 'rgb(229, 231, 235)',
    notification: 'rgb(239, 68, 68)',
  },
  fonts: {
    regular: {
      fontFamily: 'Manrope-Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Manrope-Medium',
      fontWeight: '500',
    },
    heavy: {
      fontFamily: 'Manrope-Bold',
      fontWeight: '600',
    },
    bold: {
      fontFamily: 'Manrope-Bold',
      fontWeight: '700',
    },
  },
}
