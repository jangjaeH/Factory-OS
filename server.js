import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'
import { authenticate } from './server/auth-store.js'
import { send } from './server/http.js'
import adminRoute from './server/routes/admin.js'
import alarmsRoute from './server/routes/alarms.js'
import analyticsRoute from './server/routes/analytics.js'
import authRoutes from './server/routes/auth.js'
import equipmentRoute from './server/routes/equipment.js'
import integrationsRoute from './server/routes/integrations.js'
import operationsRoute from './server/routes/operations.js'
import overviewRoute from './server/routes/overview.js'
import robotsRoute from './server/routes/robots.js'

const routes = [
  ...authRoutes, overviewRoute, operationsRoute, robotsRoute, equipmentRoute,
  alarmsRoute, analyticsRoute, integrationsRoute, adminRoute,
]

export async function requestHandler(request, response) {
  try {
    if (request.method === 'GET' && request.url === '/api/health') {
      return send(response, 200, { status: 'ok', timestamp: new Date().toISOString() })
    }

    const route = routes.find(({ method, path }) => method === request.method && path === request.url)
    if (!route) return send(response, 404, { error: 'Not found' })

    const user = route.protected ? authenticate(request) : null
    if (route.protected && !user) return send(response, 401, { error: '로그인이 필요합니다.' })

    const result = await route.handle(request, user)
    return send(response, result.status || 200, result.body ?? result)
  } catch (error) {
    return send(response, 400, { error: error instanceof SyntaxError ? 'JSON 형식이 올바르지 않습니다.' : error.message })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createServer(requestHandler).listen(process.env.PORT || 3001, '127.0.0.1', () => {
    console.log(`FactoryOS API: http://127.0.0.1:${process.env.PORT || 3001}`)
  })
}
