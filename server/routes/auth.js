import { login, register } from '../auth-store.js'
import { readJson } from '../http.js'

export default [
  { method: 'GET', path: '/api/auth/me', protected: true, handle: (_, user) => ({ user }) },
  { method: 'POST', path: '/api/auth/register', handle: async (request) => register(await readJson(request)) },
  { method: 'POST', path: '/api/auth/login', handle: async (request) => {
    const session = login(await readJson(request))
    return session ? session : { status: 401, body: { error: '아이디 또는 비밀번호가 올바르지 않습니다.' } }
  } },
]
