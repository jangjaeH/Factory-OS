export async function api(path, { token, headers, ...options } = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { ...(options.body && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }), ...headers },
  })
  const text = await response.text()
  let body
  try { body = text ? JSON.parse(text) : null }
  catch { throw new Error('API 응답 형식이 올바르지 않습니다.') }
  if (!response.ok) throw new Error(body?.error || `API 서버 오류 (${response.status})`)
  if (!body) throw new Error('API 서버가 빈 응답을 반환했습니다. API 실행 상태를 확인하세요.')
  return body
}
