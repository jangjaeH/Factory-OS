import test from 'node:test'
import assert from 'node:assert/strict'
import { activity, alarms, isDashboard, metrics, navigation } from './data.js'

test('navigation ids stay unique and overview remains the entry page', () => {
  assert.equal(navigation[0][1], 'overview')
  assert.equal(new Set(navigation.map(([, id]) => id)).size, navigation.length)
  assert.equal(isDashboard({ metrics, alarms, activity }), true)
  assert.equal(isDashboard({ metrics: null, alarms, activity }), false)
})
