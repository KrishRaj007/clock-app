import { useState, useEffect } from 'react'

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours12 = now.getHours() % 12 || 12
  const mins = String(now.getMinutes()).padStart(2, '0')
  const secs = String(now.getSeconds()).padStart(2, '0')
  const period = now.getHours() >= 12 ? 'PM' : 'AM'

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="panel">
      <div className="clock-date">{dateStr}</div>
      <div>
        <span className="clock-time">{hours12}:{mins}</span>
        <span className="clock-seconds">:{secs}</span>
        <span className="clock-period">{period}</span>
      </div>
    </div>
  )
}
