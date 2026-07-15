import { useMemo, useRef, useState } from 'react'
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { Stack, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { type BaseBottomSheetRef } from '@/components/base-bottom-sheet.shared'
import { CsvRowEditor } from '@/components/csv-row-editor'
import { LanguagePickerSheet } from '@/components/language-picker-sheet'
import { LanguageSelector } from '@/components/language-selector'
import { ListPickerSheet } from '@/components/list-picker-sheet'
import { CaretRightIcon, FileArrowUpIcon } from '@/icons'
import {
  CsvImportError,
  findDuplicateRowNumbers,
  getCsvRowIssues,
  parseCardsCsv,
  type CsvCardRow,
} from '@/libs/card-csv'
import { CsvFileError, pickCsvFile } from '@/libs/card-csv-file'
import { generateId } from '@/libs/generate-id'
import { toast } from '@/libs/toast'
import { validateListTitle } from '@/libs/validation'
import { cardActions } from '@/state/card'
import { listActions, listStore$ } from '@/state/list'
import { useLanguageStore } from '@/stores/language'
import { useValue } from '@legendapp/state/react'

type Destination = 'new' | 'existing'
type LanguageCode = 'pt-BR' | 'en-US' | 'es-ES'

export default function ImportCardsScreen() {
  const router = useRouter()
  const { t } = useTolgee(['language'])
  const { bottom } = useSafeAreaInsets()
  const { language } = useLanguageStore()
  const lists = useValue(listStore$.lists)
  const listPickerRef = useRef<BaseBottomSheetRef>(null)
  const termLanguageRef = useRef<BaseBottomSheetRef>(null)
  const definitionLanguageRef = useRef<BaseBottomSheetRef>(null)

  const [filename, setFilename] = useState<string | null>(null)
  const [rows, setRows] = useState<CsvCardRow[]>([])
  const [destination, setDestination] = useState<Destination>('new')
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [termLanguage, setTermLanguage] = useState<LanguageCode>(language)
  const [definitionLanguage, setDefinitionLanguage] = useState<LanguageCode>(language)
  const [isPicking, setIsPicking] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const existingCards = useMemo(
    () =>
      destination === 'existing' && selectedListId
        ? cardActions.getCardsByListId(selectedListId)
        : [],
    [destination, selectedListId]
  )
  const duplicateRows = useMemo(
    () => findDuplicateRowNumbers(rows, existingCards),
    [rows, existingCards]
  )
  const invalidCount = rows.filter((row) => row.issues.length > 0).length
  const selectedList = lists.find((list) => list.id === selectedListId)
  const titleIsValid = validateListTitle(title).isValid
  const canImport =
    rows.length > 0 &&
    invalidCount === 0 &&
    (destination === 'existing'
      ? Boolean(selectedList)
      : titleIsValid)

  function errorKey(error: unknown) {
    if (error instanceof CsvFileError) return `csvImport.error.${error.code}`
    if (error instanceof CsvImportError) return `csvImport.error.${error.code}`
    return 'csvImport.error.read'
  }

  async function handlePickFile() {
    setIsPicking(true)
    try {
      const file = await pickCsvFile()
      if (!file) return

      const result = parseCardsCsv(file.content)
      setFilename(file.name)
      setRows(result.rows)
      setTitle(
        file.name
          .replace(/\.csv$/i, '')
          .replace(/[-_]+/g, ' ')
          .trim()
      )
    } catch (error) {
      toast.error({ title: t(errorKey(error)) })
    } finally {
      setIsPicking(false)
    }
  }

  function updateRow(sourceRow: number, field: 'front' | 'back', value: string) {
    setRows((current) =>
      current.map((row) => {
        if (row.sourceRow !== sourceRow) return row
        const updated = { ...row, [field]: value }
        return { ...updated, issues: getCsvRowIssues(updated.front, updated.back) }
      })
    )
  }

  function removeRow(sourceRow: number) {
    setRows((current) => current.filter((row) => row.sourceRow !== sourceRow))
  }

  function selectDestination(value: Destination) {
    setDestination(value)
    if (value === 'existing' && !selectedListId && lists[0]) {
      setSelectedListId(lists[0].id)
    }
  }

  function handleImport() {
    if (!canImport) return
    setIsImporting(true)

    try {
      const listId = destination === 'existing' ? selectedListId! : generateId()

      if (destination === 'new') {
        listActions.addList({
          id: listId,
          name: title.trim(),
          termLanguage,
          definitionLanguage,
        })
      }

      cardActions.addCards(
        rows.map((row) => ({
          id: generateId(),
          front: row.front.trim(),
          back: row.back.trim(),
          listId,
        }))
      )

      toast.success({
        title: t('csvImport.success', { count: rows.length }),
      })
      router.back()
    } catch (error) {
      console.error('CSV import error:', error)
      toast.error({ title: t('csvImport.error.save') })
      setIsImporting(false)
    }
  }

  const header = (
    <View className="gap-6 pb-6">
      <TouchableOpacity
        onPress={handlePickFile}
        disabled={isPicking || isImporting}
        className="items-center gap-3 rounded-2xl border border-dashed border-primary bg-primary/5 p-6 active:opacity-70 disabled:opacity-50"
      >
        <FileArrowUpIcon size={32} className="text-primary" />
        <Text className="text-center text-sm font-manrope-semibold text-primary">
          {isPicking ? t('csvImport.reading') : t('csvImport.selectFile')}
        </Text>
        {filename && (
          <Text selectable className="text-center text-xs font-manrope-medium text-muted-foreground">
            {filename}
          </Text>
        )}
      </TouchableOpacity>

      {rows.length > 0 && (
        <>
          <View className="gap-3">
            <Text className="text-sm font-manrope-semibold text-foreground">
              {t('csvImport.destination.title')}
            </Text>
            <View className="flex-row rounded-xl bg-card p-1">
              <TouchableOpacity
                onPress={() => selectDestination('new')}
                className={
                  destination === 'new'
                    ? 'flex-1 rounded-lg bg-primary px-3 py-3'
                    : 'flex-1 rounded-lg px-3 py-3'
                }
              >
                <Text
                  className={
                    destination === 'new'
                      ? 'text-center text-sm font-manrope-semibold text-white'
                      : 'text-center text-sm font-manrope-semibold text-muted-foreground'
                  }
                >
                  {t('csvImport.destination.new')}
                </Text>
              </TouchableOpacity>
              {lists.length > 0 && (
                <TouchableOpacity
                  onPress={() => selectDestination('existing')}
                  className={
                    destination === 'existing'
                      ? 'flex-1 rounded-lg bg-primary px-3 py-3'
                      : 'flex-1 rounded-lg px-3 py-3'
                  }
                >
                  <Text
                    className={
                      destination === 'existing'
                        ? 'text-center text-sm font-manrope-semibold text-white'
                        : 'text-center text-sm font-manrope-semibold text-muted-foreground'
                    }
                  >
                    {t('csvImport.destination.existing')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {destination === 'new' ? (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-manrope-semibold text-foreground">
                  {t('common.title')}
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  editable={!isImporting}
                  maxLength={100}
                  placeholder={t('cardForm.titlePlaceholder')}
                  placeholderTextColorClassName="accent-muted-foreground"
                  className="rounded-xl bg-card px-4 py-4 text-sm font-manrope-semibold text-foreground focus:border focus:border-primary"
                />
                {!titleIsValid && (
                  <Text selectable className="text-xs font-manrope-medium text-destructive">
                    {t('csvImport.error.invalidTitle')}
                  </Text>
                )}
              </View>
              <LanguageSelector
                label={t('cardForm.termLanguage')}
                value={termLanguage}
                onPress={() => termLanguageRef.current?.expand()}
                disabled={isImporting}
              />
              <LanguageSelector
                label={t('cardForm.definitionLanguage')}
                value={definitionLanguage}
                onPress={() => definitionLanguageRef.current?.expand()}
                disabled={isImporting}
              />
            </View>
          ) : (
            <View className="gap-2">
              <Text className="text-sm font-manrope-semibold text-foreground">
                {t('csvImport.destination.selectList')}
              </Text>
              <TouchableOpacity
                onPress={() => listPickerRef.current?.expand()}
                className="flex-row items-center justify-between rounded-xl bg-card px-4 py-4 active:opacity-70"
              >
                <Text className="text-sm font-manrope-semibold text-foreground">
                  {selectedList?.name ?? t('csvImport.destination.selectList')}
                </Text>
                <CaretRightIcon size={20} className="text-muted-foreground" />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row items-center justify-between">
            <Text className="text-base font-manrope-bold text-foreground">
              {t('csvImport.review')} ({rows.length})
            </Text>
            {(invalidCount > 0 || duplicateRows.size > 0) && (
              <Text selectable className="text-xs font-manrope-medium text-muted-foreground">
                {t('csvImport.summary', {
                  invalid: invalidCount,
                  duplicates: duplicateRows.size,
                })}
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  )

  return (
    <>
      <Stack.Screen options={{ title: t('csvImport.title') }} />
      <View className="flex-1 bg-background">
        <FlatList
          data={rows}
          keyExtractor={(row) => String(row.sourceRow)}
          renderItem={({ item, index }) => (
            <CsvRowEditor
              row={item}
              index={index}
              isDuplicate={duplicateRows.has(item.sourceRow)}
              disabled={isImporting}
              onChange={(field, value) => updateRow(item.sourceRow, field, value)}
              onRemove={() => removeRow(item.sourceRow)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListHeaderComponent={header}
          className="flex-1"
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustKeyboardInsets
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="p-5 pb-12"
          showsVerticalScrollIndicator={false}
        />

        {rows.length > 0 && (
          <View
            className="border-t border-border bg-background px-5 pt-3"
            style={{ paddingBottom: Math.max(bottom, 12) }}
          >
            <TouchableOpacity
              onPress={handleImport}
              disabled={!canImport || isImporting}
              className="rounded-xl bg-primary px-6 py-4 active:opacity-80 disabled:opacity-40"
            >
              <Text className="text-center text-base font-manrope-semibold text-white">
                {isImporting
                  ? t('csvImport.importing')
                  : t('csvImport.confirm', { count: rows.length })}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ListPickerSheet
        ref={listPickerRef}
        lists={lists}
        selectedListId={selectedListId}
        onSelect={setSelectedListId}
      />
      <LanguagePickerSheet
        ref={termLanguageRef}
        selectedLanguage={termLanguage}
        onSelectLanguage={(code) => setTermLanguage(code as LanguageCode)}
      />
      <LanguagePickerSheet
        ref={definitionLanguageRef}
        selectedLanguage={definitionLanguage}
        onSelectLanguage={(code) => setDefinitionLanguage(code as LanguageCode)}
      />
    </>
  )
}
