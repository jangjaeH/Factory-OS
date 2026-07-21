import { useEffect, useState } from 'react'
import { activity, alarms, isDashboard, metrics, navigation } from './data.js'
import { api } from './api.js'
import AdminPage from './pages/AdminPage.jsx'
import AlarmsPage from './pages/AlarmsPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import EquipmentPage from './pages/EquipmentPage.jsx'
import IntegrationsPage from './pages/IntegrationsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import OperationsPage from './pages/OperationsPage.jsx'
import RobotsPage from './pages/RobotsPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

const routes = new Set(['/overview', ...navigation.slice(1).map(([, id]) => `/${id}`), '/login', '/signup'])
const currentRoute = () => routes.has(location.hash.slice(1)) ? location.hash.slice(1) : '/login'
const pageNames = Object.fromEntries(navigation.map(([label, id]) => [id, label]))
const menuPages = {
  operations: OperationsPage, robots: RobotsPage, equipment: EquipmentPage,
  alarms: AlarmsPage, analytics: AnalyticsPage, integrations: IntegrationsPage, admin: AdminPage,
}
const storedSession = () => {
  try { return JSON.parse(sessionStorage.getItem('factoryos-session') || 'null') }
  catch { return null }
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)
  const [session, setSession] = useState(storedSession)
  const [authReady, setAuthReady] = useState(false)
  const [dashboard, setDashboard] = useState({ activity, alarms, metrics })
  const [apiOnline, setApiOnline] = useState(false)

  useEffect(() => {
    const changeRoute = () => setRoute(currentRoute())
    addEventListener('hashchange', changeRoute)
    return () => removeEventListener('hashchange', changeRoute)
  }, [])

  useEffect(() => {
    if (!session?.token) {
      setAuthReady(true)
      return
    }
    const controller = new AbortController()
    api('/api/auth/me', { signal: controller.signal, token: session.token })
      .then(({ user }) => {
        const verified = { token: session.token, user }
        sessionStorage.setItem('factoryos-session', JSON.stringify(verified))
        setSession(verified)
        setAuthReady(true)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          sessionStorage.removeItem('factoryos-session')
          setSession(null)
          setAuthReady(true)
          location.hash = '/login'
        }
      })
    return () => controller.abort()
  }, [session?.token])

  useEffect(() => {
    if (!authReady) return
    if (!session && route !== '/login' && route !== '/signup') location.hash = '/login'
    if (session && (route === '/login' || route === '/signup')) location.hash = '/overview'
  }, [authReady, route, session])

  useEffect(() => {
    if (!authReady || !session?.token) return
    const controller = new AbortController()
    api('/api/overview', { signal: controller.signal, token: session.token })
      .then((data) => {
        if (!isDashboard(data)) throw new Error('Invalid dashboard response')
        setDashboard(data)
        setApiOnline(true)
      })
      .catch((error) => error.name !== 'AbortError' && setApiOnline(false))
    return () => controller.abort()
  }, [authReady, session?.token])

  const completeAuth = (result) => {
    sessionStorage.setItem('factoryos-session', JSON.stringify(result))
    setSession(result)
    setAuthReady(true)
    location.hash = '/overview'
  }

  if (!authReady) return <main className="auth-loading">FactoryOS 인증 확인 중...</main>
  if (!session || route === '/login') return <LoginPage onSuccess={completeAuth} />
  if (route === '/signup') return <SignupPage onSuccess={completeAuth} />

  const active = route.slice(1)
  const Page = menuPages[active]
  return (
    <div className="app-shell">
      <aside>
        <a className="brand" href="#/overview">FACTORY<span>OS</span><small>CONTROL TOWER</small></a>
        <nav aria-label="주 메뉴">
          {navigation.map(([label, id]) => <a className={active === id ? 'active' : ''} href={`#/${id}`} key={id}><span aria-hidden="true">{label[0]}</span>{label}</a>)}
        </nav>
        <div className={`connection ${apiOnline ? '' : 'offline'}`}><i /> {apiOnline ? 'API Connected' : 'Demo Data'}<small>{apiOnline ? 'Overview synced' : 'Start: pnpm api'}</small></div>
      </aside>

      <main id="content">
        <header className="topbar">
          <div><p>PLANT A / SEOUL</p><h1>{pageNames[active]}</h1></div>
          <div className="top-actions">
            <span>{session.user.name}</span>
            <button className="avatar" type="button" onClick={() => { sessionStorage.removeItem('factoryos-session'); setSession(null); location.hash = '/login' }} title="로그아웃">{session.user.name.slice(0, 2)}</button>
          </div>
        </header>
        {active === 'overview' ? <OverviewPage data={dashboard} /> : <Page token={session.token} />}
      </main>
    </div>
  )
}
