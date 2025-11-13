import { MimuLogo } from '@/components/mimu-logo'
import { styled } from 'nativewind'

import type { IconProps } from 'phosphor-react-native'
import * as PhosphorIcons from 'phosphor-react-native'
import { View } from 'react-native'

// --- Helper function to create styled icon components ---
function createStyledIcon(icon: React.ComponentType<IconProps>) {
  const IconComponent = styled(icon, { className: 'style' })

  return (props: IconProps & { className?: string }) => (
    <View pointerEvents="none">
      <IconComponent {...props} />
    </View>
  )
}

// --- General ---
export const MimuIcon = styled(MimuLogo, { className: 'style' })

// --- Phosphor Icons ---
export const ArrowLeftIcon = createStyledIcon(PhosphorIcons.ArrowLeftIcon)
export const PlusIcon = createStyledIcon(PhosphorIcons.PlusIcon)
export const GearSixIcon = createStyledIcon(PhosphorIcons.GearSixIcon)
export const CaretRightIcon = createStyledIcon(PhosphorIcons.CaretRightIcon)
export const CheckIcon = createStyledIcon(PhosphorIcons.CheckIcon)
export const CardsIcon = createStyledIcon(PhosphorIcons.CardsIcon)
export const BooksIcon = createStyledIcon(PhosphorIcons.BooksIcon)
export const SealQuestionIcon = createStyledIcon(PhosphorIcons.SealQuestionIcon)
export const TargetIcon = createStyledIcon(PhosphorIcons.TargetIcon)
export const PuzzlePieceIcon = createStyledIcon(PhosphorIcons.PuzzlePieceIcon)
export const FunnelIcon = createStyledIcon(PhosphorIcons.FunnelIcon)
export const SpeakerHighIcon = createStyledIcon(PhosphorIcons.SpeakerHighIcon)
export const HeartIcon = createStyledIcon(PhosphorIcons.HeartIcon)
export const TrashIcon = createStyledIcon(PhosphorIcons.TrashIcon)
export const PencilIcon = createStyledIcon(PhosphorIcons.PencilIcon)
export const DotsThreeIcon = createStyledIcon(PhosphorIcons.DotsThreeIcon)

// --- Countries ---
export { BrazilIcon } from './countries/brazil'
export { SpainIcon } from './countries/spain'
export { UnitedStatesIcon } from './countries/united-states'
