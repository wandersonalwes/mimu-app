import * as DocumentPicker from 'expo-document-picker'

import { MAX_CSV_FILE_SIZE } from '@/libs/card-csv'
import { CsvFileError, type PickedCsvFile } from '@/libs/card-csv-file.shared'

export { CsvFileError } from '@/libs/card-csv-file.shared'
export type { CsvFileErrorCode, PickedCsvFile } from '@/libs/card-csv-file.shared'

export async function pickCsvFile(): Promise<PickedCsvFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    multiple: false,
  })

  if (result.canceled) return null

  const asset = result.assets[0]
  if (!asset.name.toLowerCase().endsWith('.csv')) {
    throw new CsvFileError('invalidExtension')
  }

  const size = asset.size ?? asset.file?.size ?? 0
  if (size > MAX_CSV_FILE_SIZE) {
    throw new CsvFileError('fileTooLarge')
  }

  const content = asset.file ? await asset.file.text() : await (await fetch(asset.uri)).text()
  if (new Blob([content]).size > MAX_CSV_FILE_SIZE) {
    throw new CsvFileError('fileTooLarge')
  }

  return { name: asset.name, content, size }
}

export async function exportCsvFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
