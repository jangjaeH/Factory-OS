export function prepareRows(rows, { query = '', searchKeys = [], filterKey, filterValue = '', sortKey, sortDirection = 'asc' }) {
  const keyword = query.trim().toLowerCase()
  const result = rows.filter((row) => {
    const matchesQuery = !keyword || searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(keyword))
    const matchesFilter = !filterKey || !filterValue || row[filterKey] === filterValue
    return matchesQuery && matchesFilter
  })

  if (!sortKey) return result
  return result.slice().sort((a, b) => {
    const left = a[sortKey]
    const right = b[sortKey]
    const order = typeof left === 'number' && typeof right === 'number'
      ? left - right
      : String(left ?? '').localeCompare(String(right ?? ''), 'ko', { numeric: true })
    return sortDirection === 'asc' ? order : -order
  })
}

export function validateDraft(row, columns) {
  for (const column of columns) {
    const value = row[column.key]
    if (column.required && (value === '' || value == null)) return `${column.label}은(는) 필수입니다.`
    const error = column.validate?.(value, row)
    if (error) return error
  }
  return ''
}

export const addRow = (rows, row) => [row, ...rows]
export const updateRow = (rows, row, previous, rowKey = 'id') => rows.map((item) => item[rowKey] === previous[rowKey] ? row : item)
export const deleteRows = (rows, deleted, rowKey = 'id') => rows.filter((item) => !deleted.some((row) => row[rowKey] === item[rowKey]))
