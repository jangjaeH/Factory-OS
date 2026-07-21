import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

// ponytail: process-memory storage, replace with PostgreSQL when accounts must survive restarts.
const users = new Map()
const tokens = new Map()
const hashPassword = (password, salt = randomBytes(16).toString('hex')) => `${salt}:${scryptSync(password, salt, 64).toString('hex')}`

users.set('system', {
  id: 'system', username: 'system', name: '시스템 관리자', email: 'system@factory.local',
  password: hashPassword('1234', 'factoryos-demo'),
})

const safeSession = (user) => {
  const { password: _, ...safeUser } = user
  const token = randomBytes(24).toString('hex')
  tokens.set(token, safeUser)
  return { user: safeUser, token }
}

export const authenticate = (request) => tokens.get(request.headers.authorization?.replace('Bearer ', ''))

export const login = ({ username = '', password = '' }) => {
  const user = users.get(String(username).trim().toLowerCase())
  if (!user) return null
  const [salt, hash] = user.password.split(':')
  return timingSafeEqual(Buffer.from(hash, 'hex'), scryptSync(String(password), salt, 64)) ? safeSession(user) : null
}

export const register = ({ username = '', name = '', email = '', password = '' }) => {
  const id = String(username).trim().toLowerCase()
  const normalizedEmail = String(email).trim().toLowerCase()
  if (!/^[a-z0-9_-]{3,20}$/.test(id) || String(name).trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || String(password).length < 8) {
    return { status: 400, body: { error: '아이디, 이름, 이메일, 8자 이상 비밀번호를 확인해주세요.' } }
  }
  if (users.has(id) || [...users.values()].some((user) => user.email === normalizedEmail)) {
    return { status: 409, body: { error: '이미 가입된 아이디 또는 이메일입니다.' } }
  }
  const user = { id: randomBytes(8).toString('hex'), username: id, name: String(name).trim(), email: normalizedEmail, password: hashPassword(String(password)) }
  users.set(id, user)
  return { status: 201, body: safeSession(user) }
}
