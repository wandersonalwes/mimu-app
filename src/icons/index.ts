import { MimuLogo } from '@/components/mimu-logo'
import { styled } from 'nativewind'

import {
  ArrowLeftIcon as ArrowLeft,
  CardsIcon as Cards,
  CaretRightIcon as CaretRight,
  FunnelIcon as Funnel,
  GearSixIcon as GearSix,
  HeartIcon as Heart,
  PlusIcon as Plus,
  PuzzlePieceIcon as PuzzlePiece,
  SealQuestionIcon as SealQuestion,
  SpeakerHighIcon as SpeakerHigh,
  TargetIcon as Target,
} from 'phosphor-react-native'

// --- General ---
export const MimuIcon = styled(MimuLogo, { className: 'style' })

// --- Phosphor Icons ---
export const ArrowLeftIcon = styled(ArrowLeft, { className: 'style' })
export const PlusIcon = styled(Plus, { className: 'style' })
export const GearSixIcon = styled(GearSix, { className: 'style' })
export const CaretRightIcon = styled(CaretRight, { className: 'style' })
export const CardsIcon = styled(Cards, { className: 'style' })
export const SealQuestionIcon = styled(SealQuestion, { className: 'style' })
export const TargetIcon = styled(Target, { className: 'style' })
export const PuzzlePieceIcon = styled(PuzzlePiece, { className: 'style' })
export const FunnelIcon = styled(Funnel, { className: 'style' })
export const SpeakerHighIcon = styled(SpeakerHigh, { className: 'style' })
export const HeartIcon = styled(Heart, { className: 'style' })

// --- Countries ---
export { BrazilIcon } from './countries/brazil'
