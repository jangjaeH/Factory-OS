import { useEffect, useState } from 'react'
import { api } from '../api.js'
import DataGrid from '../components/DataGrid.jsx'
import { addRow, deleteRows, updateRow } from '../components/dataGridUtils.js'
import { sampleTasks } from '../data.js'

const columns = [
  { key: 'id', label: '작업 ID', width: 115, required: true },
  { key: 'priority', label: '우선순위', width: 90, type: 'number', required: true, validate: (value) => (value < 1 || value > 3) && '우선순위는 1~3이어야 합니다.', render: (value) => <b className={`priority p${value}`}>P{value}</b> },
  { key: 'type', label: '작업 유형', required: true },
  { key: 'source', label: '출발지', required: true },
  { key: 'destination', label: '도착지', required: true },
  { key: 'robot', label: '할당 로봇', width: 90 },
  { key: 'status', label: '상태', width: 105, required: true, options: ['READY', 'RUNNING', 'BLOCKED', 'PAUSED', 'DONE', 'FAILED'], render: (value) => <b className={`status status-${value.toLowerCase()}`}>{value}</b> },
  { key: 'createdAt', label: '생성 시각', width: 90, type: 'time', required: true },
]

export default function OperationsPage({ token }) {
  const [rows, setRows] = useState(sampleTasks)
  useEffect(() => {
    const controller = new AbortController()
    api('/api/operations', { token, signal: controller.signal }).then((data) => setRows(data.rows)).catch(() => {})
    return () => controller.abort()
  }, [token])

  return <div className="operations-page"><div className="page-heading"><div><p>OPERATIONS / WORK ORDERS</p><h2>작업 운영</h2><span>작업지시와 로봇 할당 상태를 한 화면에서 관리합니다.</span></div></div><DataGrid
    title="작업지시"
    columns={columns}
    rows={rows}
    searchKeys={['id', 'type', 'source', 'destination', 'robot']}
    filter={{ key: 'status', label: '상태', options: ['READY', 'RUNNING', 'BLOCKED', 'PAUSED', 'DONE', 'FAILED'] }}
    createRow={() => ({ id: `WO-${Date.now().toString().slice(-6)}`, priority: 2, type: '', source: '', destination: '', robot: '-', status: 'READY', createdAt: new Date().toTimeString().slice(0, 5) })}
    onCreate={(row) => setRows((current) => addRow(current, row))}
    onUpdate={(row, previous) => setRows((current) => updateRow(current, row, previous))}
    onDelete={(deleted) => setRows((current) => deleteRows(current, deleted))}
  /></div>
}
