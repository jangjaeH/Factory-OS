import { useMemo, useState } from 'react'
import { prepareRows } from './dataGridUtils.js'

export default function DataGrid({ columns, rows, rowKey = 'id', searchKeys, filter, onSelectionChange }) {
  const [query, setQuery] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sort, setSort] = useState({ key: '', direction: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [selected, setSelected] = useState(new Set())

  const prepared = useMemo(() => prepareRows(rows, {
    query, searchKeys, filterKey: filter?.key, filterValue,
    sortKey: sort.key, sortDirection: sort.direction,
  }), [rows, query, searchKeys, filter, filterValue, sort])
  const pageCount = Math.max(1, Math.ceil(prepared.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleRows = prepared.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const pageIds = visibleRows.map((row) => row[rowKey])
  const allVisibleSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))

  const updateSelection = (next) => {
    setSelected(next)
    onSelectionChange?.([...next])
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

  return (
    <section className="data-grid panel">
      <header className="grid-toolbar">
        <div><h2>작업지시</h2><span>{prepared.length}건 · {selected.size}건 선택</span></div>
        <div className="grid-controls">
          <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="작업, 출발지, 도착지 검색" aria-label="작업지시 검색" />
          {filter && <select value={filterValue} onChange={(event) => { setFilterValue(event.target.value); setPage(1) }} aria-label={`${filter.label} 필터`}>
            <option value="">{filter.label} 전체</option>
            {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>}
        </div>
      </header>

      <div className="grid-scroll">
        <table>
          <thead><tr>
            <th className="select-cell"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} aria-label="현재 페이지 전체 선택" /></th>
            {columns.map((column) => <th key={column.key} style={{ width: column.width }}>
              {column.sortable === false ? column.label : <button type="button" onClick={() => changeSort(column.key)}>{column.label}<span>{sort.key === column.key ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}</span></button>}
            </th>)}
          </tr></thead>
          <tbody>
            {visibleRows.map((row) => <tr className={selected.has(row[rowKey]) ? 'selected' : ''} key={row[rowKey]}>
              <td className="select-cell"><input type="checkbox" checked={selected.has(row[rowKey])} onChange={() => toggleRow(row[rowKey])} aria-label={`${row[rowKey]} 선택`} /></td>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row[column.key], row) : row[column.key]}</td>)}
            </tr>)}
            {!visibleRows.length && <tr><td className="grid-empty" colSpan={columns.length + 1}>조건에 맞는 작업이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>

      <footer className="grid-footer">
        <label>페이지당 <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }}><option>5</option><option>10</option><option>20</option></select></label>
        <div><span>{currentPage} / {pageCount}</span><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>이전</button><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>다음</button></div>
      </footer>
    </section>
  )
}
