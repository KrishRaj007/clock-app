import { useState } from 'react'
import './App.css'
import Clock from './Clock'
import Stopwatch from './Stopwatch'
import Timer from './Timer'

const TABS = ['Clock', 'Stopwatch', 'Timer']

export default function App() {
  const [tab, setTab] = useState('Clock')

  return (
    <div className="app">
      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Clock' && <Clock />}
      {tab === 'Stopwatch' && <Stopwatch />}
      {tab === 'Timer' && <Timer />}
    </div>
  )
}
