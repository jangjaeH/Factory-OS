export default function OverviewPage({ data }) {
  const { activity, alarms, metrics } = data

  return (
    <>
      <section className="metrics" aria-label="주요 지표">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span><strong>{metric.value}</strong>
            <small className={metric.tone}>{metric.trend}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel factory-map">
          <header><h2>실시간 공장 레이아웃</h2><span className="live">LIVE</span></header>
          <div className="map" aria-label="공장 설비 및 로봇 상태 맵">
            <div className="station press">Press 01 <small>STOPPED</small></div>
            <div className="station assembly">Assembly <small>RUNNING</small></div>
            <div className="station inspection">Inspection <small>IDLE</small></div>
            <div className="station rack-a">Rack A <small>READY</small></div>
            <div className="station rack-b">Rack B <small>READY</small></div>
            <span className="robot r1" title="R-01 정상">R-01</span>
            <span className="robot r2" title="R-02 정상">R-02</span>
            <span className="robot r3" title="R-03 배터리 부족">R-03</span>
          </div>
        </article>

        <article className="panel alarms">
          <header><h2>알람 Top 3</h2><button type="button">전체 보기</button></header>
          <ul>{alarms.map((alarm) => (
            <li key={alarm.message}><b className={alarm.level.toLowerCase()}>{alarm.level}</b><span>{alarm.message}</span><time>{alarm.time}</time></li>
          ))}</ul>
        </article>

        <article className="panel activity">
          <header><h2>운영 타임라인</h2><span>최근 15분</span></header>
          <ul>{activity.map(([time, subject, text, tone]) => (
            <li key={time}><i className={tone} /><time>{time}</time><b>{subject}</b><span>{text}</span></li>
          ))}</ul>
        </article>

        <article className="panel copilot">
          <header><h2>AI Copilot</h2><span>근거 기반 제안</span></header>
          <p>“R-03이 왜 멈췄어?”</p>
          <button type="button">원인과 영향 확인 <span>→</span></button>
        </article>
      </section>
    </>
  )
}
