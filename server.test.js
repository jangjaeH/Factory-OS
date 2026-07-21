import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { requestHandler } from './server.js'

test('FactoryOS requires a token and accepts the sample account', async () => {
  const server = createServer(requestHandler).listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const base = `http://127.0.0.1:${server.address().port}`

  const denied = await fetch(`${base}/api/overview`)
  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'system', password: '1234' }),
  })
  const session = await login.json()
  const headers = { Authorization: `Bearer ${session.token}` }
  const me = await fetch(`${base}/api/auth/me`, { headers }).then((response) => response.json())
  const overview = await fetch(`${base}/api/overview`, { headers }).then((response) => response.json())
  const robots = await fetch(`${base}/api/robots`, { headers }).then((response) => response.json())

  assert.equal(denied.status, 401)
  assert.equal(login.status, 200)
  assert.equal(me.user.username, 'system')
  assert.ok(overview.metrics.length && overview.alarms.length && overview.activity.length)
  assert.deepEqual(robots.sections, ['Fleet 현황', '미션', '충전 정책'])
  await new Promise((resolve) => server.close(resolve))
})
