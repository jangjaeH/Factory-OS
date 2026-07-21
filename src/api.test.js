import test from 'node:test'
import assert from 'node:assert/strict'
import { api } from './api.js'

test('api reports an empty response without a JSON parsing error', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response('', { status: 502 })
  await assert.rejects(api('/api/test'), /API 서버 오류/)
  globalThis.fetch = originalFetch
})
