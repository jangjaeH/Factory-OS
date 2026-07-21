export function prepareRows(rows, { query = '', searchKeys = [], filterKey, filterValue = '', sortKey, sortDirection = 'asc' }) {
  const keyword = query.trim().toLowerCase()
  const result = rows.filter((row) => {
    const matchesQuery = !keyword || searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(keyword))
    const matchesFilter = !filterKey || !filterValue || row[filterKey] === filterValue
    return matchesQuery && matchesFilter
  })

  if (!sortKey) return result
  return result.toSorted((a, b) => {
    const left = a[sortKey]
    const right = b[sortKey]
    const order = typeof left === 'number' && typeof right === 'number'
      ? left - right
      : String(left ?? '').localeCompare(String(right ?? ''), 'ko', { numeric: true })
    return sortDirection === 'asc' ? order : -order
  })
}
