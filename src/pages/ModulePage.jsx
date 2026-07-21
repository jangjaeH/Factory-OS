import { useEffect, useState } from 'react'
import { api } from '../api.js'

const modules = {
  operations: ['작업 운영', '작업지시부터 미션 완료까지 실행 흐름을 관리합니다.', ['작업지시', 'Task / Mission', '대기열']],
  robots: ['로봇 관리', '로봇 상태, 배터리, 위치와 현재 미션을 확인합니다.', ['Fleet 현황', '미션', '충전 정책']],
  equipment: ['설비 관리', '설비 상태와 Tag, Trend, Handshake 신호를 확인합니다.', ['설비 현황', 'Tag Browser', 'Trend']],
  alarms: ['알람 및 Incident', '알람을 확인하고 담당 지정부터 해결까지 추적합니다.', ['Active', 'Incident', 'History']],
  analytics: ['운영 분석', 'OEE, 손실 구조와 로봇 운영 지표를 비교합니다.', ['OEE', 'Loss', 'Robot KPI']],
  integrations: ['연동 관리', 'Connector 상태, Mapping과 연동 로그를 관리합니다.', ['Connectors', 'Mapping', 'Health']],
  admin: ['관리자', '사용자, 역할, 정책과 감사로그를 관리합니다.', ['사용자', '권한', '감사로그']],
}

export default function ModulePage({ id, token }) {
  const [fallbackTitle, description, fallbackSections] = modules[id]
  const [data, setData] = useState({ title: fallbackTitle, sections: fallbackSections })

  useEffect(() => {
    const controller = new AbortController()
    api(`/api/${id}`, { signal: controller.signal, token })
      .then(setData)
      .catch((error) => error.name !== 'AbortError' && setData({ title: fallbackTitle, sections: fallbackSections }))
    return () => controller.abort()
  }, [id, token, fallbackTitle, fallbackSections])

  const { title, sections } = data
  return (
    <section className="module-page">
      <div className="module-intro"><span>{id.slice(0, 1).toUpperCase()}</span><div><p>FACTORYOS MODULE</p><h2>{title}</h2><strong>{description}</strong></div></div>
      <div className="module-cards">
        {sections.map((section, index) => <article className="panel" key={section}><small>0{index + 1}</small><h3>{section}</h3><p>API와 실제 운영 데이터를 연결할 준비가 된 페이지 영역입니다.</p></article>)}
      </div>
    </section>
  )
}
