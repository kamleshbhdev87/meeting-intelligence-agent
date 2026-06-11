import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function HistorySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)
      setResults(data.results)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const suggestions = [
    'What was decided about the budget?',
    'Who owns the migration task?',
    'What risks were flagged?',
    'Action items for the DevOps team',
  ]

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center text-white text-sm">🔍</div>
          <p className="text-sm font-bold text-violet-800">RAG-Powered Memory Search</p>
        </div>
        <p className="text-xs text-violet-600 leading-relaxed">Ask anything about past meetings in plain English. Results are ranked by semantic similarity using ChromaDB vector search.</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="e.g. What did we decide about Q3 budget?"
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
        />
        <button
          onClick={search}
          disabled={!query.trim() || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" /> : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          )}
          Search
        </button>
      </div>

      {!results && !loading && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Try asking</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setQuery(s)}
                className="text-xs bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-200 transition-all shadow-sm font-medium">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>}

      {results !== null && (
        <div className="space-y-3 fade-up">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">
              {results.length > 0 ? `${results.length} result${results.length > 1 ? 's' : ''} found` : 'No matching meetings found'}
            </p>
            <button onClick={() => { setResults(null); setQuery('') }} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Clear</button>
          </div>

          {results.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-3xl mb-3">🗃️</p>
              <p className="text-sm font-medium text-slate-500">No matching meetings found</p>
              <p className="text-xs text-slate-400 mt-1">Analyze some meetings first to build up memory</p>
            </div>
          )}

          {results.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-bold text-slate-800">{r.meeting_title}</p>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  {r.distance !== null && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
                      {Math.round((1 - r.distance) * 100)}% match
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{r.date}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{r.relevant_excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
