import { useMemo, useState } from 'react'
import { prepareRows, validateDraft } from './dataGridUtils.js'

const defaultNewRow = (rowKey) => ({ [rowKey]: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}` })

export default function DataGrid({
  columns, rows, rowKey = 'id', title = '데이터', searchKeys = columns.map(({ key }) => key),
  filter, pageSizes = [5, 10, 20], createRow, onCreate, onUpdate, onDelete,
  onSelectionChange, emptyMessage = '조건에 맞는 데이터가 없습니다.', loading = false,
}) {
  const [query, setQuery] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sort, setSort] = useState({ key: '', direction: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizes[0])
  const [selected, setSelected] = useState(new Set())
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const prepared = useMemo(() => prepareRows(rows, {
    query, searchKeys, filterKey: filter?.key, filterValue,
    sortKey: sort.key, sortDirection: sort.direction,
  }), [rows, query, searchKeys, filter, filterValue, sort])
  const pageCount = Math.max(1, Math.ceil(prepared.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleRows = prepared.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const pageIds = visibleRows.map((row) => row[rowKey])
  const selectedRows = rows.filter((row) => selected.has(row[rowKey]))
  const allVisibleSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const hasActions = Boolean(onCreate || onUpdate || onDelete)

  const updateSelection = (next) => {
    setSelected(next)
    onSelectionChange?.(rows.filter((row) => next.has(row[rowKey])))
  }
  const toggleAll = () => {
    const next = new Set(selected)
    pageIds.forEach((id) => allVisibleSelected ? next.delete(id) : next.add(id))
    updateSelection(next)
  }
  const toggleRow = (id) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    updateSelection(next)
  }
  const changeSort = (key) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))
  }
  const startCreate = () => {
    setEditing('new')
    setDraft(createRow?.() ?? defaultNewRow(rowKey))
    setError('')
    setPage(1)
  }
  const startEdit = (row) => {
    setEditing(row[rowKey])
    setDraft({ ...row })
    setError('')
  }
  const cancelEdit = () => {
    setEditing(null)
    setDraft(null)
    setError('')
  }
  const save = async () => {
    const validationError = validateDraft(draft, columns)
    if (validationError) return setError(validationError)
    setBusy(true)
    setError('')
    try {
      if (editing === 'new') await onCreate(draft)
      else await onUpdate(draft, rows.find((row) => row[rowKey] === editing))
      cancelEdit()
    } catch (reason) {
      setError(reason?.message || '저장하지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }
  const remove = async (targets) => {
    if (!targets.length || !window.confirm(`${targets.length}개 항목을 삭제할까요?`)) return
    setBusy(true)
    setError('')
    try {
      await onDelete(targets)
      const deleted = new Set(targets.map((row) => row[rowKey]))
      updateSelection(new Set([...selected].filter((id) => !deleted.has(id))))
    } catch (reason) {
      setError(reason?.message || '삭제하지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }
  const editCell = (column, value) => setDraft((current) => ({
    ...current,
    [column.key]: column.type === 'number' && value !== '' ? Number(value) : value,
  }))
  const editor = (column) => column.options
    ? <select value={draft[column.key] ?? ''} onChange={(event) => editCell(column, event.target.value)} autoFocus={column === columns[0]}>
        <option value="">선택</option>{column.options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}
      </select>
    : column.type === 'boolean'
      ? <input type="checkbox" checked={Boolean(draft[column.key])} onChange={(event) => editCell(column, event.target.checked)} />
      : <input type={column.type || 'text'} value={draft[column.key] ?? ''} onChange={(event) => editCell(column, event.target.value)} required={column.required} />

  const editRow = draft && <tr key={editing} className="grid-edit-row" onKeyDown={(event) => {
    if (event.key === 'Escape') cancelEdit()
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') save()
  }}>
    <td className="select-cell">{editing === 'new' ? '+' : '✎'}</td>
    {columns.map((column) => <td key={column.key}>{column.editable === false ? (column.render?.(draft[column.key], draft) ?? draft[column.key]) : editor(column)}</td>)}
    {hasActions && <td className="grid-actions"><button type="button" className="primary" onClick={save} disabled={busy}>저장</button><button type="button" onClick={cancelEdit} disabled={busy}>취소</button></td>}
  </tr>

  return (
    <section className="data-grid panel" aria-busy={loading || busy}>
      <header className="grid-toolbar">
        <div><h2>{title}</h2><span>{prepared.length}건 · {selectedRows.length}건 선택</span></div>
        <div className="grid-controls">
          {selectedRows.length > 0 && onDelete && <button type="button" className="danger-button" onClick={() => remove(selectedRows)} disabled={busy}>선택 삭제</button>}
          {onCreate && <button type="button" className="primary" onClick={startCreate} disabled={busy || editing === 'new'}>+ 추가</button>}
          <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="검색" aria-label={`${title} 검색`} />
          {filter && <select value={filterValue} onChange={(event) => { setFilterValue(event.target.value); setPage(1) }} aria-label={`${filter.label} 필터`}>
            <option value="">{filter.label} 전체</option>
            {filter.options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}
          </select>}
        </div>
      </header>

      {error && <p className="grid-error" role="alert">{error}</p>}
      <div className="grid-scroll">
        <table>
          <thead><tr>
            <th className="select-cell"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} aria-label="현재 페이지 전체 선택" /></th>
            {columns.map((column) => <th key={column.key} style={{ width: column.width }}>
              {column.sortable === false ? column.label : <button type="button" onClick={() => changeSort(column.key)}>{column.label}<span>{sort.key === column.key ? (sort.direction === 'asc' ? ' ▲' : ' ▼') : ''}</span></button>}
            </th>)}
            {hasActions && <th className="grid-actions">작업</th>}
          </tr></thead>
          <tbody>
            {editing === 'new' && editRow}
            {visibleRows.map((row) => editing === row[rowKey] ? editRow : <tr className={selected.has(row[rowKey]) ? 'selected' : ''} key={row[rowKey]}>
              <td className="select-cell"><input type="checkbox" checked={selected.has(row[rowKey])} onChange={() => toggleRow(row[rowKey])} aria-label={`${row[rowKey]} 선택`} /></td>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}</td>)}
              {hasActions && <td className="grid-actions">{onUpdate && <button type="button" onClick={() => startEdit(row)} disabled={busy}>수정</button>}{onDelete && <button type="button" className="danger-button" onClick={() => remove([row])} disabled={busy}>삭제</button>}</td>}
            </tr>)}
            {!loading && !visibleRows.length && editing !== 'new' && <tr><td className="grid-empty" colSpan={columns.length + 1 + Number(Boolean(hasActions))}>{emptyMessage}</td></tr>}
            {loading && <tr><td className="grid-empty" colSpan={columns.length + 1 + Number(Boolean(hasActions))}>불러오는 중…</td></tr>}
          </tbody>
        </table>
      </div>

      <footer className="grid-footer">
        <label>페이지당 <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }}>{pageSizes.map((size) => <option key={size}>{size}</option>)}</select></label>
        <div><span>{currentPage} / {pageCount}</span><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>이전</button><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>다음</button></div>
      </footer>
    </section>
  )
}
