import { useEffect, useState } from 'react'
import { api } from '../api.js'
import DataGrid from '../components/DataGrid.jsx'
import { sampleTasks } from '../data.js'

const columns = [
  { key: 'id', label: '작업 ID', width: 115 },
  { key: 'priority', label: '우선순위', width: 90, render: (value) => <b className={`priority p${value}`}>P{value}</b> },
  { key: 'type', label: '작업 유형' },
  { key: 'source', label: '출발지' },
  { key: 'destination', label: '도착지' },
  { key: 'robot', label: '할당 로봇', width: 90 },
  { key: 'status', label: '상태', width: 105, render: (value) => <b className={`status status-${value.toLowerCase()}`}>{value}</b> },
  { key: 'createdAt', label: '생성 시각', width: 90 },
]

export default function OperationsPage({ token }) {
  const [rows, setRows] = useState(sampleTasks)
  useEffect(() => {
    const controller = new AbortController()
    api('/api/operations', { token, signal: controller.signal }).then((data) => setRows(data.rows)).catch(() => {})
    return () => controller.abort()
  }, [token])

  return <div className="operations-page"><div className="page-heading"><div><p>OPERATIONS / WORK ORDERS</p><h2>작업 운영</h2><span>작업지시와 로봇 할당 상태를 한 화면에서 관리합니다.</span></div><button type="button">+ 작업 생성</button></div><DataGrid columns={columns} rows={rows} searchKeys={['id', 'type', 'source', 'destination', 'robot']} filter={{ key: 'status', label: '상태', options: ['READY', 'RUNNING', 'BLOCKED', 'PAUSED', 'DONE', 'FAILED'] }} /></div>
}
