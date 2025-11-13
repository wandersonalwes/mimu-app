import { MimuLogo } from '@/components/mimu-logo'
import { styled } from 'nativewind'

import {
  ArrowLeftIcon as ArrowLeft,
  BooksIcon as Books,
  CardsIcon as Cards,
  CaretRightIcon as CaretRight,
  CheckIcon as Check,
  DotsThreeIcon as DotsThree,
  FunnelIcon as Funnel,
  GearSixIcon as GearSix,
  HeartIcon as Heart,
  IconProps,
  PencilIcon as Pencil,
  PlusIcon as Plus,
  PuzzlePieceIcon as PuzzlePiece,
  SealQuestionIcon as SealQuestion,
  SpeakerHighIcon as SpeakerHigh,
  TargetIcon as Target,
  TrashIcon as Trash,
} from 'phosphor-react-native'
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
export const ArrowLeftIcon = createStyledIcon(ArrowLeft)
export const PlusIcon = createStyledIcon(Plus)
export const GearSixIcon = createStyledIcon(GearSix)
export const CaretRightIcon = createStyledIcon(CaretRight)
export const CheckIcon = createStyledIcon(Check)
export const CardsIcon = createStyledIcon(Cards)
export const BooksIcon = createStyledIcon(Books)
export const SealQuestionIcon = createStyledIcon(SealQuestion)
export const TargetIcon = createStyledIcon(Target)
export const PuzzlePieceIcon = createStyledIcon(PuzzlePiece)
export const FunnelIcon = createStyledIcon(Funnel)
export const SpeakerHighIcon = createStyledIcon(SpeakerHigh)
export const HeartIcon = createStyledIcon(Heart)
export const TrashIcon = createStyledIcon(Trash)
export const PencilIcon = createStyledIcon(Pencil)
export const DotsThreeIcon = createStyledIcon(DotsThree)

// --- Countries ---
export { BrazilIcon } from './countries/brazil'
export { SpainIcon } from './countries/spain'
export { UnitedStatesIcon } from './countries/united-states'
