import { listActions, listStore$, type List } from '@/state/list'
import { useSelector } from '@legendapp/state/react'

/**
 * Hook para acessar e manipular listas de forma otimizada
 * Usa useSelector do Legend State para evitar re-renders desnecessários
 */
export function useLists() {
  // Observa todas as mudanças no array de listas
  const lists = useSelector(listStore$.lists)

  return {
    lists,
    ...listActions,
  }
}

/**
 * Hook para obter uma lista específica por ID
 * Só re-renderiza quando essa lista específica muda
 */
export function useList(listId: string): List | undefined {
  return useSelector(() => {
    return listStore$.lists.get().find((list) => list.id === listId)
  })
}

/**
 * Hook para obter a contagem total de listas
 * Útil para exibir estatísticas sem re-renderizar com mudanças individuais
 */
export function useListCount(): number {
  return useSelector(() => listStore$.lists.get().length)
}

/**
 * Hook para buscar listas por nome
 * Útil para funcionalidades de pesquisa
 */
export function useSearchLists(searchTerm: string): List[] {
  return useSelector(() => {
    if (!searchTerm.trim()) {
      return listStore$.lists.get()
    }

    const term = searchTerm.toLowerCase()
    return listStore$.lists.get().filter((list) => list.name.toLowerCase().includes(term))
  })
}

/**
 * Hook para obter listas ordenadas por data de criação
 */
export function useListsSortedByDate(order: 'asc' | 'desc' = 'desc'): List[] {
  return useSelector(() => {
    const lists = [...listStore$.lists.get()]
    return lists.sort((a, b) => {
      return order === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    })
  })
}
