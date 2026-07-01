import { Text } from '@/components/text'
import { withUniwind } from 'uniwind'
import { Pressable } from 'react-native'
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message'

const BaseToastThemed = withUniwind(BaseToast)
const ErrorToastThemed = withUniwind(ErrorToast)

type ToastProps = {
  title: string
  description?: string
}

function success({ title, description }: ToastProps) {
  return Toast.show({
    type: 'success',
    text1: title,
    text2: description,
  })
}

function error({ title, description }: ToastProps) {
  return Toast.show({
    type: 'error',
    text1: title,
    text2: description,
  })
}

function warning({ title, description }: ToastProps) {
  return Toast.show({
    type: 'warning',
    text1: title,
    text2: description,
  })
}

function info({ title, description }: ToastProps) {
  return Toast.show({
    type: 'info',
    text1: title,
    text2: description,
  })
}

export const toast = {
  success,
  error,
  warning,
  info,
}

const baseConfig = {
  contentContainerStyle: {
    paddingHorizontal: 16,
  },
  text1NumberOfLines: 2,
  text2NumberOfLines: 2,
}

const renderTrailingIcon = () => (
  <Pressable onPress={() => Toast.hide()} className="justify-center w-10">
    <Text className="text-white">OK</Text>
  </Pressable>
)

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToastThemed
      {...props}
      {...baseConfig}
      renderLeadingIcon={() => null}
      renderTrailingIcon={renderTrailingIcon}
      text1ClassName="text-white font-manrope-bold"
      text2ClassName="text-white font-manrope-regular"
      className="bg-green-500 border-l-0 shadow-none"
    />
  ),

  error: (props) => (
    <ErrorToastThemed
      {...props}
      {...baseConfig}
      renderLeadingIcon={() => null}
      renderTrailingIcon={renderTrailingIcon}
      text1ClassName="text-white font-manrope-bold"
      text2ClassName="text-white font-manrope-regular"
      className="bg-destructive border-l-0 shadow-none"
    />
  ),

  warning: (props) => (
    <BaseToastThemed
      {...props}
      {...baseConfig}
      renderLeadingIcon={() => null}
      renderTrailingIcon={renderTrailingIcon}
      text1ClassName="text-white font-manrope-bold"
      text2ClassName="text-white font-manrope-regular"
      className="bg-yellow-500 border-l-0 shadow-none"
    />
  ),

  info: (props) => (
    <BaseToastThemed
      {...props}
      {...baseConfig}
      renderLeadingIcon={() => null}
      renderTrailingIcon={renderTrailingIcon}
      // @ts-ignore
      titleClassName="text-secondary-foreground"
      descriptionClassName="text-secondary-foreground"
      className="bg-secondary border-l-0 shadow-none"
    />
  ),
}
