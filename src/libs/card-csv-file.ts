import * as DocumentPicker from 'expo-document-picker'
import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'

import { MAX_CSV_FILE_SIZE } from '@/libs/card-csv'
import { CsvFileError, type PickedCsvFile } from '@/libs/card-csv-file.shared'

export { CsvFileError } from '@/libs/card-csv-file.shared'
export type { CsvFileErrorCode, PickedCsvFile } from '@/libs/card-csv-file.shared'

export async function pickCsvFile(): Promise<PickedCsvFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
    multiple: false,
  })

  if (result.canceled) return null

  const asset = result.assets[0]
  if (!asset.name.toLowerCase().endsWith('.csv')) {
    throw new CsvFileError('invalidExtension')
  }

  const file = new File(asset.uri)
  const size = asset.size ?? file.size
  if (size > MAX_CSV_FILE_SIZE) {
    throw new CsvFileError('fileTooLarge')
  }

  return {
    name: asset.name,
    content: await file.text(),
    size,
  }
}

export async function exportCsvFile(filename: string, content: string) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new CsvFileError('sharingUnavailable')
  }

  const file = new File(Paths.cache, filename)
  file.create({ overwrite: true })
  file.write(content)

  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    dialogTitle: filename,
    UTI: 'public.comma-separated-values-text',
  })
}
