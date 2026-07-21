import test from 'node:test'
import assert from 'node:assert/strict'
import { addRow, deleteRows, prepareRows, updateRow, validateDraft } from './dataGridUtils.js'

test('data grid filters and sorts rows', () => {
  const rows = [{ id: 'T-2', status: 'RUNNING', priority: 2 }, { id: 'T-1', status: 'READY', priority: 1 }]
  assert.deepEqual(prepareRows(rows, { query: 't-', searchKeys: ['id'], filterKey: 'status', filterValue: 'READY', sortKey: 'priority' }).map(({ id }) => id), ['T-1'])
})

test('data grid validates required and custom column rules', () => {
  const columns = [
    { key: 'name', label: '이름', required: true },
    { key: 'count', label: '수량', validate: (value) => value < 0 && '수량은 0 이상이어야 합니다.' },
  ]
  assert.equal(validateDraft({ name: '', count: 1 }, columns), '이름은(는) 필수입니다.')
  assert.equal(validateDraft({ name: 'A', count: -1 }, columns), '수량은 0 이상이어야 합니다.')
  assert.equal(validateDraft({ name: 'A', count: 1 }, columns), '')
})

test('data grid CRUD callbacks can add, update, and delete rows', () => {
  const first = { id: 1, name: 'A' }
  const second = { id: 2, name: 'B' }
  const added = addRow([first], second)
  assert.deepEqual(added, [second, first])

  const renamed = { id: 2, name: '수정됨' }
  assert.deepEqual(updateRow(added, renamed, second), [renamed, first])
  assert.deepEqual(deleteRows([renamed, first], [renamed]), [first])
})
