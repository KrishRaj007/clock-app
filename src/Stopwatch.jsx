import { useState, useRef, useCallback } from 'react'

function formatTime(ms) {
  const totalSecs = Math.floor(ms / 1000)
  const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0')
  const s = String(totalSecs % 60).padStart(2, '0')
  const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, '0')
  return { h, m, s, cs }
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const intervalRef = useRef(null)
  const startRef = useRef(0)

  const start = useCallback(() => {
    startRef.current = Date.now() - elapsed
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startRef.current)
    }, 10)
    setRunning(true)
  }, [elapsed])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setElapsed(0)
    setRunning(false)
    setLaps([])
  }, [])

  const lap = useCallback(() => {
    setLaps((prev) => [elapsed, ...prev])
  }, [elapsed])

  const { h, m, s, cs } = formatTime(elapsed)
  const showHours = h !== '00'

  return (
    <div className="panel">
      <div className="sw-display">
        {showHours && <>{h}:</>}
        {m}:{s}<span className="sw-ms">.{cs}</span>
      </div>

      <div className="btn-row">
        {!running ? (
          <button className="btn btn-primary" onClick={start}>
            {elapsed === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={stop}>
            Pause
          </button>
        )}

        {running && (
          <button className="btn btn-secondary" onClick={lap}>
            Lap
          </button>
        )}

        {!running && elapsed > 0 && (
          <button className="btn btn-danger" onClick={reset}>
            Reset
          </button>
        )}
      </div>

      {laps.length > 0 && (
        <div className="laps">
          {laps.map((lapMs, i) => {
            const l = formatTime(lapMs)
            return (
              <div className="lap-item" key={i}>
                <span>Lap {laps.length - i}</span>
                <span>
                  {l.h !== '00' && `${l.h}:`}
                  {l.m}:{l.s}.{l.cs}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
