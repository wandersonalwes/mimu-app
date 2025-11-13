import { ComponentRef } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { useTolgee } from '@tolgee/react'

import { BaseBottomSheet } from '@/components/base-bottom-sheet'
import { CheckIcon } from '@/icons'

export type SortOption = 'createdAtAsc' | 'createdAtDesc' | 'alphabeticalAsc' | 'alphabeticalDesc'

type SortOptionsSheetProps = {
  ref: React.RefObject<ComponentRef<typeof BottomSheet> | null>
  currentSort: SortOption
  onSelectSort: (sort: SortOption) => void
}

export function SortOptionsSheet({ ref, currentSort, onSelectSort }: SortOptionsSheetProps) {
  const { t } = useTolgee(['language'])

  const options: { value: SortOption; label: string }[] = [
    { value: 'createdAtAsc', label: t('cardDetail.sort.createdAtAsc') },
    { value: 'createdAtDesc', label: t('cardDetail.sort.createdAtDesc') },
    { value: 'alphabeticalAsc', label: t('cardDetail.sort.alphabeticalAsc') },
    { value: 'alphabeticalDesc', label: t('cardDetail.sort.alphabeticalDesc') },
  ]

  const handleSelectSort = (sort: SortOption) => {
    onSelectSort(sort)
    ref.current?.close()
  }

  return (
    <BaseBottomSheet ref={ref}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelectSort(option.value)}
          className="flex-row items-center justify-between py-4"
          activeOpacity={0.7}
        >
          <Text
            className={`text-base font-manrope-medium ${
              currentSort === option.value
                ? 'text-primary dark:text-primary-dark'
                : 'text-foreground dark:text-foreground-dark'
            }`}
          >
            {option.label}
          </Text>
          {currentSort === option.value && (
            <CheckIcon size={24} className="text-primary dark:text-primary-dark" weight="bold" />
          )}
        </TouchableOpacity>
      ))}
    </BaseBottomSheet>
  )
}
