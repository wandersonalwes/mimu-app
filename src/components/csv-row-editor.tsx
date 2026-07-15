import { Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'

import { WarningCircleIcon, XIcon } from '@/icons'
import { cn } from '@/libs/cn'
import { type CsvCardRow } from '@/libs/card-csv'

type CsvRowEditorProps = {
  row: CsvCardRow
  index: number
  isDuplicate: boolean
  disabled: boolean
  onChange: (field: 'front' | 'back', value: string) => void
  onRemove: () => void
}

export function CsvRowEditor({
  row,
  index,
  isDuplicate,
  disabled,
  onChange,
  onRemove,
}: CsvRowEditorProps) {
  const { t } = useTolgee(['language'])
  const isInvalid = row.issues.length > 0

  return (
    <View
      className={cn(
        'rounded-2xl border bg-card p-4 gap-3',
        isInvalid ? 'border-destructive' : isDuplicate ? 'border-yellow-500' : 'border-border'
      )}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row flex-1 items-center gap-2">
          {(isInvalid || isDuplicate) && (
            <WarningCircleIcon
              size={18}
              className={isInvalid ? 'text-destructive' : 'text-yellow-500'}
            />
          )}
          <Text className="text-xs font-manrope-semibold text-muted-foreground">
            {t('csvImport.cardNumber', { number: index + 1, row: row.sourceRow })}
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel={t('csvImport.removeRow')}
          onPress={onRemove}
          disabled={disabled}
          className="p-1 active:opacity-60 disabled:opacity-40"
        >
          <XIcon size={18} className="text-muted-foreground" />
        </TouchableOpacity>
      </View>

      <TextInput
        value={row.front}
        onChangeText={(value) => onChange('front', value)}
        editable={!disabled}
        multiline
        placeholder={t('cardForm.frontPlaceholder')}
        placeholderTextColorClassName="accent-muted-foreground"
        className="min-h-12 rounded-xl bg-background px-4 py-3 text-sm font-manrope-medium text-foreground focus:border focus:border-primary"
      />
      <TextInput
        value={row.back}
        onChangeText={(value) => onChange('back', value)}
        editable={!disabled}
        multiline
        placeholder={t('cardForm.backPlaceholder')}
        placeholderTextColorClassName="accent-muted-foreground"
        className="min-h-12 rounded-xl bg-background px-4 py-3 text-sm font-manrope-medium text-foreground focus:border focus:border-primary"
      />

      {isInvalid && (
        <Text selectable className="text-xs font-manrope-medium text-destructive">
          {row.issues.map((issue) => t(`csvImport.rowIssue.${issue}`)).join(' · ')}
        </Text>
      )}
      {!isInvalid && isDuplicate && (
        <Text selectable className="text-xs font-manrope-medium text-yellow-600">
          {t('csvImport.duplicateWarning')}
        </Text>
      )}
    </View>
  )
}
