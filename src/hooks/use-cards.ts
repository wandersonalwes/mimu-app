import { cardActions, cardStore$, type Card } from '@/state/card'
import { useSelector } from '@legendapp/state/react'

/**
 * Hook para acessar e manipular cards de forma otimizada
 * Usa useSelector do Legend State para evitar re-renders desnecessários
 */
export function useCards() {
  // Observa todas as mudanças no array de cards
  const cards = useSelector(cardStore$.cards)

  return {
    cards,
    ...cardActions,
  }
}

/**
 * Hook otimizado para obter cards de uma lista específica
 * Só re-renderiza quando os cards dessa lista mudam
 */
export function useCardsByListId(listId: string): Card[] {
  return useSelector(() => {
    return cardStore$.cards.get().filter((card) => card.listId === listId)
  })
}

/**
 * Hook para obter um card específico por ID
 * Só re-renderiza quando esse card específico muda
 */
export function useCard(cardId: string): Card | undefined {
  return useSelector(() => {
    return cardStore$.cards.get().find((card) => card.id === cardId)
  })
}

/**
 * Hook para obter a contagem total de cards
 * Útil para exibir estatísticas sem re-renderizar com mudanças individuais
 */
export function useCardCount(): number {
  return useSelector(() => cardStore$.cards.get().length)
}

/**
 * Hook para obter a contagem de cards em uma lista específica
 */
export function useCardCountByListId(listId: string): number {
  return useSelector(() => {
    return cardStore$.cards.get().filter((card) => card.listId === listId).length
  })
}
