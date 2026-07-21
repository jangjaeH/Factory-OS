import { activity, alarms, metrics } from '../../src/data.js'

export default {
  method: 'GET', path: '/api/overview', protected: true,
  handle: () => ({ metrics, alarms, activity }),
}
