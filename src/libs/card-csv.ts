import Papa from 'papaparse'

export const MAX_CSV_FILE_SIZE = 5 * 1024 * 1024
export const MAX_CSV_CARDS = 10_000

export type CsvDelimiter = ',' | ';'

export type CsvRowIssue =
  | 'missingFront'
  | 'missingBack'
  | 'columnCount'
  | 'parseError'

export type CsvCardRow = {
  sourceRow: number
  front: string
  back: string
  issues: CsvRowIssue[]
}

export type CsvImportResult = {
  delimiter: CsvDelimiter
  rows: CsvCardRow[]
}

export type CsvImportErrorCode =
  | 'emptyFile'
  | 'invalidDelimiter'
  | 'invalidHeader'
  | 'tooManyCards'

export class CsvImportError extends Error {
  constructor(public readonly code: CsvImportErrorCode) {
    super(code)
    this.name = 'CsvImportError'
  }
}

function isSupportedDelimiter(delimiter: string): delimiter is CsvDelimiter {
  return delimiter === ',' || delimiter === ';'
}

function uniqueIssues(issues: CsvRowIssue[]) {
  return [...new Set(issues)]
}

export function parseCardsCsv(content: string): CsvImportResult {
  if (!content.trim()) {
    throw new CsvImportError('emptyFile')
  }

  const result = Papa.parse<string[]>(content, {
    delimiter: '',
    delimitersToGuess: [',', ';'],
    skipEmptyLines: 'greedy',
  })

  if (!isSupportedDelimiter(result.meta.delimiter)) {
    throw new CsvImportError('invalidDelimiter')
  }

  const [header, ...dataRows] = result.data
  const normalizedHeader = header?.map((value, index) =>
    (index === 0 ? value.replace(/^\uFEFF/, '') : value).trim()
  )

  if (
    normalizedHeader?.length !== 2 ||
    normalizedHeader[0] !== 'front' ||
    normalizedHeader[1] !== 'back'
  ) {
    throw new CsvImportError('invalidHeader')
  }

  if (dataRows.length > MAX_CSV_CARDS) {
    throw new CsvImportError('tooManyCards')
  }

  const errorsByDataIndex = new Map<number, Papa.ParseError[]>()
  result.errors.forEach((error) => {
    if (typeof error.row !== 'number' || error.row === 0) return
    const dataIndex = error.row - 1
    errorsByDataIndex.set(dataIndex, [...(errorsByDataIndex.get(dataIndex) ?? []), error])
  })

  const rows = dataRows.map((values, index): CsvCardRow => {
    const front = values[0]?.trim() ?? ''
    const back = values[1]?.trim() ?? ''
    const issues: CsvRowIssue[] = []

    if (values.length !== 2) issues.push('columnCount')
    if (!front) issues.push('missingFront')
    if (!back) issues.push('missingBack')
    if (errorsByDataIndex.has(index)) issues.push('parseError')

    return {
      sourceRow: index + 2,
      front,
      back,
      issues: uniqueIssues(issues),
    }
  })

  if (rows.length === 0) {
    throw new CsvImportError('emptyFile')
  }

  return { delimiter: result.meta.delimiter, rows }
}

export function getCsvRowIssues(front: string, back: string): CsvRowIssue[] {
  const issues: CsvRowIssue[] = []
  if (!front.trim()) issues.push('missingFront')
  if (!back.trim()) issues.push('missingBack')
  return issues
}

function cardKey(front: string, back: string) {
  return JSON.stringify([front.trim(), back.trim()])
}

export function findDuplicateRowNumbers(
  rows: Array<Pick<CsvCardRow, 'sourceRow' | 'front' | 'back'>>,
  existingCards: Array<{ front: string; back: string }> = []
): Set<number> {
  const existingKeys = new Set(existingCards.map((card) => cardKey(card.front, card.back)))
  const rowKeys = rows.map((row) => cardKey(row.front, row.back))
  const counts = new Map<string, number>()

  rowKeys.forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1))

  return new Set(
    rows
      .filter((row, index) => {
        if (!row.front.trim() || !row.back.trim()) return false
        const key = rowKeys[index]
        return existingKeys.has(key) || (counts.get(key) ?? 0) > 1
      })
      .map((row) => row.sourceRow)
  )
}

export function serializeCardsCsv(
  cards: Array<{ front: string; back: string }>,
  delimiter: CsvDelimiter
) {
  const csv = Papa.unparse(
    {
      fields: ['front', 'back'],
      data: cards.map((card) => [card.front, card.back]),
    },
    {
      delimiter,
      newline: '\r\n',
    }
  )

  return `\uFEFF${csv}`
}

export function sanitizeCsvFilename(value: string) {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return `${normalized || 'cards'}.csv`
}
