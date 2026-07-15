export type PickedCsvFile = {
  name: string
  content: string
  size: number
}

export type CsvFileErrorCode = 'invalidExtension' | 'fileTooLarge' | 'sharingUnavailable'

export class CsvFileError extends Error {
  constructor(public readonly code: CsvFileErrorCode) {
    super(code)
    this.name = 'CsvFileError'
  }
}
