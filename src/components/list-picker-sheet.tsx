import { Text, TouchableOpacity } from 'react-native'

import { BaseBottomSheet } from '@/components/base-bottom-sheet'
import { type BaseBottomSheetRef } from '@/components/base-bottom-sheet.shared'
import { CheckIcon } from '@/icons'
import { type List } from '@/state/list'

type ListPickerSheetProps = {
  ref: React.RefObject<BaseBottomSheetRef | null>
  lists: List[]
  selectedListId: string | null
  onSelect: (listId: string) => void
}

export function ListPickerSheet({ ref, lists, selectedListId, onSelect }: ListPickerSheetProps) {
  function handleSelect(listId: string) {
    onSelect(listId)
    ref.current?.close()
  }

  return (
    <BaseBottomSheet ref={ref}>
      {lists.map((list) => (
        <TouchableOpacity
          key={list.id}
          onPress={() => handleSelect(list.id)}
          className="flex-row items-center gap-4 py-4 active:opacity-70"
        >
          <Text className="flex-1 text-base font-manrope-medium text-foreground">
            {list.name}
          </Text>
          {selectedListId === list.id && (
            <CheckIcon size={24} className="text-primary" weight="bold" />
          )}
        </TouchableOpacity>
      ))}
    </BaseBottomSheet>
  )
}
