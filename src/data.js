export const navigation = [
  ['Overview', 'overview'],
  ['Operations', 'operations'],
  ['Robots', 'robots'],
  ['Equipment', 'equipment'],
  ['Alarms', 'alarms'],
  ['Analytics', 'analytics'],
  ['Integrations', 'integrations'],
  ['Admin', 'admin'],
]

export const metrics = [
  { label: '생산 달성률', value: '94.2%', trend: '+3.1%', tone: 'good' },
  { label: '로봇 가동률', value: '87.8%', trend: '+1.4%', tone: 'good' },
  { label: 'OEE', value: '81.6%', trend: '-0.8%', tone: 'warn' },
  { label: '미처리 알람', value: '3', trend: '1 Critical', tone: 'danger' },
]

export const alarms = [
  { level: 'CRITICAL', message: 'Press 01 E-Stop', time: '10:42' },
  { level: 'WARNING', message: 'R-03 배터리 18%', time: '10:38' },
  { level: 'INFO', message: 'Rack B 재고 임계', time: '10:30' },
]

export const activity = [
  ['10:42:16', 'Press 01', '비상 정지 신호 감지', 'danger'],
  ['10:41:58', 'Mission M-1042', 'Assembly 진입 대기', 'warn'],
  ['10:40:24', 'Robot R-02', '미션 M-1041 완료', 'good'],
]

export const sampleTasks = [
  { id: 'WO-1048', priority: 1, type: '자재 이송', source: 'Rack A', destination: 'Assembly', robot: 'R-02', status: 'RUNNING', createdAt: '10:42' },
  { id: 'WO-1047', priority: 2, type: '완제품 회수', source: 'Inspection', destination: 'Rack B', robot: 'R-01', status: 'READY', createdAt: '10:38' },
  { id: 'WO-1046', priority: 1, type: '긴급 공급', source: 'Rack A', destination: 'Press 01', robot: '-', status: 'BLOCKED', createdAt: '10:31' },
  { id: 'WO-1045', priority: 3, type: '공박스 회수', source: 'Assembly', destination: 'Rack A', robot: 'R-03', status: 'PAUSED', createdAt: '10:22' },
  { id: 'WO-1044', priority: 2, type: '자재 이송', source: 'Rack B', destination: 'Inspection', robot: 'R-01', status: 'DONE', createdAt: '10:18' },
  { id: 'WO-1043', priority: 3, type: '자재 이송', source: 'Rack A', destination: 'Assembly', robot: 'R-02', status: 'DONE', createdAt: '10:12' },
  { id: 'WO-1042', priority: 1, type: '긴급 공급', source: 'Rack B', destination: 'Press 01', robot: 'R-03', status: 'FAILED', createdAt: '10:04' },
  { id: 'WO-1041', priority: 2, type: '완제품 회수', source: 'Inspection', destination: 'Rack B', robot: 'R-02', status: 'DONE', createdAt: '09:55' },
  { id: 'WO-1040', priority: 3, type: '공박스 회수', source: 'Assembly', destination: 'Rack A', robot: 'R-01', status: 'DONE', createdAt: '09:48' },
  { id: 'WO-1039', priority: 2, type: '자재 이송', source: 'Rack A', destination: 'Inspection', robot: 'R-03', status: 'DONE', createdAt: '09:41' },
  { id: 'WO-1038', priority: 2, type: '자재 이송', source: 'Rack B', destination: 'Assembly', robot: 'R-02', status: 'DONE', createdAt: '09:32' },
  { id: 'WO-1037', priority: 3, type: '공박스 회수', source: 'Press 01', destination: 'Rack A', robot: 'R-01', status: 'DONE', createdAt: '09:20' },
]

export const isDashboard = (value) =>
  value && [value.metrics, value.alarms, value.activity].every(Array.isArray)
