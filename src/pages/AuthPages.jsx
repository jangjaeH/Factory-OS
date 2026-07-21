import { useState } from 'react'
import { api } from '../api.js'

export default function AuthForm({ mode, onSuccess }) {
  const signup = mode === 'signup'
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    if (signup && values.password !== values.passwordConfirm) {
      setBusy(false)
      return setError('비밀번호 확인이 일치하지 않습니다.')
    }

    try {
      const result = await api(`/api/auth/${signup ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(values),
      })
      onSuccess(result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <a href="#/overview">FACTORY<span>OS</span></a>
        <p>See. Decide. Orchestrate.</p>
        <h1>하나의 운영 화면에서<br />공장의 현재와 다음을 연결합니다.</h1>
        <ul><li>실시간 상태 통합</li><li>작업·로봇·설비 흐름 제어</li><li>데이터 기반 운영 개선</li></ul>
      </section>
      <section className="auth-card">
        <p className="eyebrow">FACTORY OPERATIONS PLATFORM</p>
        <h2>{signup ? '계정 만들기' : 'FactoryOS 로그인'}</h2>
        <p>{signup ? '운영 콘솔을 사용할 계정을 생성하세요.' : '운영 콘솔에 접속하려면 로그인하세요.'}</p>
        <form onSubmit={submit}>
          <label>아이디<input name="username" required minLength="3" maxLength="20" pattern="[A-Za-z0-9_-]+" autoComplete="username" placeholder={signup ? '영문, 숫자, _, -' : 'system'} /></label>
          {signup && <label>이름<input name="name" required minLength="2" autoComplete="name" placeholder="홍길동" /></label>}
          {signup && <label>이메일<input name="email" type="email" required autoComplete="email" placeholder="operator@factory.com" /></label>}
          <label>비밀번호<input name="password" type="password" required minLength={signup ? 8 : 4} autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? '8자 이상 입력' : '비밀번호 입력'} /></label>
          {signup && <label>비밀번호 확인<input name="passwordConfirm" type="password" required minLength="8" autoComplete="new-password" placeholder="비밀번호 다시 입력" /></label>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button disabled={busy} type="submit">{busy ? '처리 중...' : signup ? '회원가입' : '로그인'}</button>
        </form>
        {!signup && <p className="demo-account">샘플 계정 <b>system</b> / <b>1234</b></p>}
        <p className="auth-switch">{signup ? '이미 계정이 있나요?' : 'FactoryOS가 처음인가요?'} <a href={signup ? '#/login' : '#/signup'}>{signup ? '로그인' : '회원가입'}</a></p>
      </section>
    </main>
  )
}
