import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareRows } from './dataGridUtils.js'

test('data grid filters and sorts rows', () => {
  const rows = [{ id: 'T-2', status: 'RUNNING', priority: 2 }, { id: 'T-1', status: 'READY', priority: 1 }]
  assert.deepEqual(prepareRows(rows, { query: 't-', searchKeys: ['id'], filterKey: 'status', filterValue: 'READY', sortKey: 'priority' }).map(({ id }) => id), ['T-1'])
})
