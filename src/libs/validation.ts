/**
 * Utilitários de validação para formulários usando Zod
 * Zod oferece validação type-safe e mensagens de erro customizáveis
 */

import { z } from 'zod'

/**
 * Resultado de validação padronizado
 */
export type ValidationResult = {
  isValid: boolean
  message?: string
  errors?: Record<string, string>
}

/**
 * Schema de validação para título de lista
 * - Obrigatório
 * - Mínimo de 3 caracteres
 * - Máximo de 100 caracteres
 * - Trim automático
 */
export const listTitleSchema = z
  .string({
    message: 'O título é obrigatório.',
  })
  .min(1, { message: 'O título é obrigatório.' })
  .trim()
  .min(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
  .max(100, { message: 'O título deve ter no máximo 100 caracteres.' })

/**
 * Schema de validação para um cartão individual
 */
export const cardSchema = z.object({
  front: z
    .string({
      message: 'A frente do cartão é obrigatória.',
    })
    .min(1, { message: 'A frente do cartão é obrigatória.' })
    .trim()
    .min(1, { message: 'A frente do cartão não pode estar vazia.' }),
  back: z
    .string({
      message: 'O verso do cartão é obrigatório.',
    })
    .min(1, { message: 'O verso do cartão é obrigatório.' })
    .trim()
    .min(1, { message: 'O verso do cartão não pode estar vazio.' }),
})

/**
 * Schema de validação para lista de cartões
 * - Array deve ter pelo menos 1 item
 * - Pelo menos 1 cartão válido (com frente e verso preenchidos)
 */
export const cardsArraySchema = z
  .array(
    z.object({
      front: z.string(),
      back: z.string(),
    })
  )
  .min(1, { message: 'É necessário adicionar pelo menos um cartão.' })
  .refine(
    (cards) => {
      const validCards = cards.filter((card) => card.front.trim() && card.back.trim())
      return validCards.length > 0
    },
    {
      message: 'Por favor, preencha pelo menos um cartão com frente e verso.',
    }
  )

/**
 * Schema completo para criação de lista com cartões
 */
export const createListSchema = z.object({
  title: listTitleSchema,
  cards: cardsArraySchema,
})

/**
 * Schema para validação de dados do Card store
 */
export const cardStoreSchema = z.object({
  id: z.string().min(1, { message: 'ID do cartão é obrigatório.' }),
  front: z.string().min(1, { message: 'Frente do cartão é obrigatória.' }).trim(),
  back: z.string().min(1, { message: 'Verso do cartão é obrigatório.' }).trim(),
  listId: z.string().min(1, { message: 'ID da lista é obrigatório.' }),
  createdAt: z.number().positive({ message: 'Data de criação inválida.' }),
  updatedAt: z.number().positive({ message: 'Data de atualização inválida.' }),
})

/**
 * Schema para validação de dados do List store
 */
export const listStoreSchema = z.object({
  id: z.string().min(1, { message: 'ID da lista é obrigatório.' }),
  name: z.string().min(1, { message: 'Nome da lista é obrigatório.' }).trim(),
  createdAt: z.number().positive({ message: 'Data de criação inválida.' }),
  updatedAt: z.number().positive({ message: 'Data de atualização inválida.' }),
})

/**
 * Type inference dos schemas
 */
export type ListTitleInput = z.infer<typeof listTitleSchema>
export type CardInput = z.infer<typeof cardSchema>
export type CardsArrayInput = z.infer<typeof cardsArraySchema>
export type CreateListInput = z.infer<typeof createListSchema>
export type CardStoreData = z.infer<typeof cardStoreSchema>
export type ListStoreData = z.infer<typeof listStoreSchema>

/**
 * Valida um título de lista
 */
export function validateListTitle(title: string): ValidationResult {
  const result = listTitleSchema.safeParse(title)

  if (!result.success) {
    const firstError = result.error.issues[0]
    return {
      isValid: false,
      message: firstError?.message || 'Título inválido.',
    }
  }

  return { isValid: true }
}

/**
 * Valida um cartão individual (frente e verso)
 */
export function validateCard(front: string, back: string): ValidationResult {
  const result = cardSchema.safeParse({ front, back })

  if (!result.success) {
    const firstError = result.error.issues[0]
    return {
      isValid: false,
      message: firstError?.message || 'Cartão inválido.',
    }
  }

  return { isValid: true }
}

/**
 * Valida uma lista de cartões
 */
export function validateCards(cards: Array<{ front: string; back: string }>): ValidationResult {
  const result = cardsArraySchema.safeParse(cards)

  if (!result.success) {
    const firstError = result.error.issues[0]
    return {
      isValid: false,
      message: firstError?.message || 'Lista de cartões inválida.',
    }
  }

  return { isValid: true }
}

/**
 * Valida o formulário completo de criação de lista
 * Retorna todas as mensagens de erro para cada campo
 */
export function validateCreateListForm(data: {
  title: string
  cards: Array<{ front: string; back: string }>
}): ValidationResult {
  const result = createListSchema.safeParse(data)

  if (!result.success) {
    const errors: Record<string, string> = {}

    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.')
      errors[path] = issue.message
    })

    const firstError = result.error.issues[0]
    return {
      isValid: false,
      message: firstError?.message || 'Formulário inválido.',
      errors,
    }
  }

  return { isValid: true }
}
