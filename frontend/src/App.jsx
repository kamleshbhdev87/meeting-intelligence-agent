import { useState, useEffect } from 'react'
import TranscriptUploader from './components/TranscriptUploader'
import ReportViewer from './components/ReportViewer'
import HistorySearch from './components/HistorySearch'

import { API_URL } from './config.js'

const STEPS = [
  { id: 1, label: 'Extractor Agent', desc: 'Parsing decisions, actions & risks', icon: '🔍' },
  { id: 2, label: 'Reporter Agent', desc: 'Generating summary & email draft', icon: '📝' },
  { id: 3, label: 'RAG Agent', desc: 'Storing in ChromaDB memory', icon: '🧠' },
]

function AgentProgress({ step }) {
  return (
    <div className="py-6 fade-up">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">AI Pipeline Running</p>
      <div className="space-y-3">
        {STEPS.map(s => {
          const done = step > s.id
          const active = step === s.id
          return (
            <div key={s.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
              active ? 'bg-blue-50 border-blue-200 shadow-sm' :
              done ? 'bg-emerald-50 border-emerald-200' :
              'bg-slate-50 border-slate-200 opacity-40'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                active ? 'bg-blue-100' : done ? 'bg-emerald-100' : 'bg-white'
              }`}>{done ? '✓' : s.icon}</div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${active ? 'text-blue-700' : done ? 'text-emerald-700' : 'text-slate-400'}`}>{s.label}</p>
                <p className={`text-xs mt-0.5 ${active ? 'text-blue-500' : done ? 'text-emerald-500' : 'text-slate-300'}`}>{s.desc}</p>
              </div>
              {active && <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full spin shrink-0" />}
              {done && <span className="text-emerald-500 font-bold text-lg shrink-0">✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 50%, #F5F3FF 100%)' }}>
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">M</div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-none">MeetingMind</p>
            <p className="text-xs text-slate-400 mt-0.5">AI Meeting Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/kamleshbhdev87/meeting-intelligence-agent" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <button onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md">
            Launch App →
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-8 border border-blue-200">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full pulse-dot"></span>
          Claude API · ChromaDB RAG · 3-Agent Pipeline
        </div>

        <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight max-w-2xl tracking-tight">
          Transform meeting chaos into<br />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">structured intelligence</span>
        </h1>

        <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
          Paste any meeting transcript. Three specialized AI agents extract every decision, action item, and risk — then draft the follow-up email for you.
        </p>

        <div className="flex items-center gap-4">
          <button onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            Analyze a Meeting →
          </button>
          <button onClick={onStart}
            className="bg-white hover:bg-slate-50 text-slate-600 font-semibold px-8 py-4 rounded-2xl text-base transition-all border border-slate-200 shadow-sm">
            Try Sample Transcript
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 max-w-3xl w-full">
          {[
            { icon: '🔍', title: 'Extractor Agent', desc: 'Identifies every decision, action item, owner and deadline from raw conversation', color: 'from-blue-500 to-blue-600' },
            { icon: '📝', title: 'Reporter Agent', desc: 'Writes executive summary and a professional follow-up email draft instantly', color: 'from-violet-500 to-violet-600' },
            { icon: '🧠', title: 'RAG Memory', desc: 'Stores all meetings in ChromaDB so you can search past decisions semantically', color: 'from-emerald-500 to-emerald-600' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-200 text-left shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className={`w-10 h-10 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-xl mb-4 shadow-sm`}>{f.icon}</div>
              <p className="font-bold text-slate-800 text-sm mb-2">{f.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('analyze')
  const [loading, setLoading] = useState(false)
  const [agentStep, setAgentStep] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [pastMeetings, setPastMeetings] = useState([])

  useEffect(() => { if (view === 'app') fetchMeetings() }, [view])

  const fetchMeetings = async () => {
    try {
      const res = await fetch(`${API_URL}/meetings`)
      const data = await res.json()
      if (data.meetings) setPastMeetings(data.meetings)
    } catch {}
  }

  const handleAnalyze = async (payload) => {
    setLoading(true); setError(null); setResult(null); setAgentStep(1)
    try {
      setTimeout(() => setAgentStep(2), 2800)
      setTimeout(() => setAgentStep(3), 5500)
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Analysis failed')
      setAgentStep(4)
      await new Promise(r => setTimeout(r, 500))
      setResult(data)
      fetchMeetings()
    } catch (e) { setError(e.message) }
    finally { setLoading(false); setAgentStep(0) }
  }

  if (view === 'landing') return <LandingPage onStart={() => setView('app')} />

  return (
    <div className="min-h-screen flex" style={{ background: '#F0F2F8' }}>
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <button onClick={() => setView('landing')} className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">M</div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm leading-none">MeetingMind</p>
              <p className="text-xs text-slate-400 mt-0.5">AI Intelligence</p>
            </div>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'analyze', icon: '⚡', label: 'Analyze Meeting' },
            { id: 'search', icon: '🔍', label: 'Search Memory' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </nav>

        {pastMeetings.length > 0 && (
          <div className="px-4 pb-4 flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Recent Meetings</p>
            <div className="space-y-1">
              {pastMeetings.slice(0, 6).map(m => (
                <div key={m.meeting_id} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 truncate">{m.meeting_title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{m.date}</span>
                    <span className="text-xs text-blue-500 font-medium">{m.decisions_count}D · {m.actions_count}A</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot"></span>
              3-Agent Pipeline
            </p>
            {[
              { name: 'Extractor', color: 'bg-blue-400' },
              { name: 'Reporter', color: 'bg-violet-400' },
              { name: 'RAG Memory', color: 'bg-emerald-400' },
            ].map(a => (
              <div key={a.name} className="flex items-center gap-2 py-1">
                <div className={`w-1.5 h-1.5 rounded-full ${a.color} shrink-0`} />
                <p className="text-xs text-slate-500 font-medium">{a.name}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-800">
              {activeTab === 'analyze' ? 'Analyze Meeting Transcript' : 'Search Past Meetings'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === 'analyze' ? 'Upload or paste a transcript to extract decisions, actions and risks' : 'Search past meetings using semantic similarity (ChromaDB RAG)'}
            </p>
          </div>
          {pastMeetings.length > 0 && (
            <span className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-full border border-blue-100">
              {pastMeetings.length} meeting{pastMeetings.length > 1 ? 's' : ''} in memory
            </span>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'analyze' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">1</div>
                    <h2 className="text-sm font-bold text-slate-700">Upload Transcript</h2>
                  </div>
                  <TranscriptUploader onAnalyze={handleAnalyze} loading={loading} />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-96">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">2</div>
                    <h2 className="text-sm font-bold text-slate-700">AI Analysis</h2>
                  </div>

                  {!result && !loading && !error && (
                    <div className="flex flex-col items-center justify-center h-56 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-slate-200">📋</div>
                      <p className="text-sm font-semibold text-slate-500">Results will appear here</p>
                      <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">After analysis, you'll see decisions, action items, risks, and a follow-up email draft</p>
                    </div>
                  )}

                  {loading && <AgentProgress step={agentStep} />}

                  {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 fade-up">
                      <p className="text-sm font-bold text-red-700 mb-1">Analysis failed</p>
                      <p className="text-xs text-red-500">{error}</p>
                    </div>
                  )}

                  {result && !loading && <ReportViewer data={result} />}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <HistorySearch />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
