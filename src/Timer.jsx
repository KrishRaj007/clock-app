import { useState, useRef, useCallback, useEffect } from 'react'

const CIRCUMFERENCE = 2 * Math.PI * 90

export default function Timer() {
  const [inputH, setInputH] = useState('')
  const [inputM, setInputM] = useState('')
  const [inputS, setInputS] = useState('')
  const [totalMs, setTotalMs] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)
  const endRef = useRef(0)

  const isSet = totalMs > 0

  const startTimer = useCallback(() => {
    let ms = totalMs
    if (!isSet) {
      const h = parseInt(inputH) || 0
      const m = parseInt(inputM) || 0
      const s = parseInt(inputS) || 0
      ms = (h * 3600 + m * 60 + s) * 1000
      if (ms <= 0) return
      setTotalMs(ms)
      setRemaining(ms)
    }
    endRef.current = Date.now() + (remaining || ms)
    intervalRef.current = setInterval(() => {
      const left = endRef.current - Date.now()
      if (left <= 0) {
        clearInterval(intervalRef.current)
        setRemaining(0)
        setRunning(false)
        setFinished(true)
        return
      }
      setRemaining(left)
    }, 50)
    setRunning(true)
    setFinished(false)
  }, [inputH, inputM, inputS, totalMs, remaining, isSet])

  const pause = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setFinished(false)
    setTotalMs(0)
    setRemaining(0)
  }, [])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const displayMs = remaining
  const totalSecs = Math.ceil(displayMs / 1000)
  const dH = String(Math.floor(totalSecs / 3600)).padStart(2, '0')
  const dM = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0')
  const dS = String(totalSecs % 60).padStart(2, '0')

  const progress = totalMs > 0 ? remaining / totalMs : 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  const canStart =
    !running &&
    (isSet || parseInt(inputH) || parseInt(inputM) || parseInt(inputS))

  const isWarning = remaining > 0 && remaining <= 10000 && running

  return (
    <div className="panel">
      {!isSet && !finished ? (
        <>
          <div className="timer-inputs">
            <div className="time-input-group">
              <label>Hours</label>
              <input
                className="time-input"
                type="number"
                min="0"
                max="99"
                placeholder="00"
                value={inputH}
                onChange={(e) => setInputH(e.target.value.slice(0, 2))}
              />
            </div>
            <span className="time-separator">:</span>
            <div className="time-input-group">
              <label>Min</label>
              <input
                className="time-input"
                type="number"
                min="0"
                max="59"
                placeholder="00"
                value={inputM}
                onChange={(e) => setInputM(e.target.value.slice(0, 2))}
              />
            </div>
            <span className="time-separator">:</span>
            <div className="time-input-group">
              <label>Sec</label>
              <input
                className="time-input"
                type="number"
                min="0"
                max="59"
                placeholder="00"
                value={inputS}
                onChange={(e) => setInputS(e.target.value.slice(0, 2))}
              />
            </div>
          </div>

          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={startTimer}
              disabled={!canStart}
            >
              Start
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="ring-container">
            <svg className="ring-svg" width="200" height="200">
              <circle className="ring-bg" cx="100" cy="100" r="90" strokeWidth="6" />
              <circle
                className="ring-fg"
                cx="100"
                cy="100"
                r="90"
                strokeWidth="6"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ stroke: finished ? 'var(--danger)' : 'var(--primary)' }}
              />
            </svg>
            <div className="ring-content">
              <span className={`timer-display ${isWarning ? 'warning' : ''}`}>
                {finished ? "00:00" : `${dH !== '00' ? dH + ':' : ''}${dM}:${dS}`}
              </span>
            </div>
          </div>

          <div className="btn-row">
            {!finished ? (
              <>
                {running ? (
                  <button className="btn btn-secondary" onClick={pause}>
                    Pause
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={startTimer}>
                    Resume
                  </button>
                )}
                <button className="btn btn-danger" onClick={reset}>
                  Reset
                </button>
              </>
            ) : (
              <button className="btn btn-danger" onClick={reset}>
                Done
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
