import { sampleTasks } from '../../src/data.js'

export default {
  method: 'GET', path: '/api/operations', protected: true,
  handle: () => ({ id: 'operations', title: '작업 운영', sections: ['작업지시', 'Task / Mission', '대기열'], rows: sampleTasks }),
}
