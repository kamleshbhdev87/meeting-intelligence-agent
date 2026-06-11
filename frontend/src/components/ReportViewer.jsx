import { useState } from 'react'

function Tag({ children, color }) {
  const c = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-violet-50 text-violet-700 border-violet-100',
  }
  return <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${c[color]}`}>{children}</span>
}

function SectionCard({ icon, title, accent, children, count }) {
  const borders = { blue: 'border-t-blue-500', green: 'border-t-emerald-500', red: 'border-t-red-500', purple: 'border-t-violet-500' }
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 border-t-2 ${borders[accent]} p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="text-sm font-bold text-slate-700">{title}</h3>
        </div>
        {count !== undefined && (
          <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{count}</span>
        )}
      </div>
      {children}
    </div>
  )
}

export default function ReportViewer({ data }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(data.email_draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 fade-up">
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-base">{data.meeting_title}</h2>
            <p className="text-blue-200 text-xs mt-1">Analyzed · Saved to memory · ID: {data.meeting_id}</p>
          </div>
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">Complete</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Decisions', value: data.decisions.length, icon: '✅' },
            { label: 'Actions', value: data.action_items.length, icon: '🎯' },
            { label: 'Risks', value: data.risks.length, icon: '⚠️' },
          ].map(s => (
            <div key={s.label} className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-blue-100 mt-0.5">{s.icon} {s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <SectionCard icon="📋" title="Executive Summary" accent="purple">
        <div className="space-y-2">
          {data.executive_summary.split('\n').filter(l => l.trim()).map((line, i) => (
            <p key={i} className="text-sm text-slate-600 leading-relaxed">{line}</p>
          ))}
        </div>
      </SectionCard>

      {data.decisions.length > 0 && (
        <SectionCard icon="✅" title="Decisions Made" accent="blue" count={data.decisions.length}>
          <div className="space-y-3">
            {data.decisions.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm text-slate-700 leading-relaxed">{d.decision}</p>
                  {d.owner && <Tag color="blue">👤 {d.owner}</Tag>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {data.action_items.length > 0 && (
        <SectionCard icon="🎯" title="Action Items" accent="green" count={data.action_items.length}>
          <div className="space-y-3">
            {data.action_items.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-relaxed">{a.task}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {a.owner && <Tag color="green">👤 {a.owner}</Tag>}
                    {a.deadline && <Tag color="amber">📅 {a.deadline}</Tag>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {data.risks.length > 0 && (
        <SectionCard icon="⚠️" title="Risks & Blockers" accent="red" count={data.risks.length}>
          <div className="space-y-3">
            {data.risks.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">!</span>
                <div>
                  <p className="text-sm text-slate-700 leading-relaxed">{r.risk}</p>
                  {r.raised_by && <Tag color="red">Raised by {r.raised_by}</Tag>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard icon="📧" title="Follow-up Email Draft" accent="purple">
        <div className="relative">
          <pre className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-xl p-4 max-h-44 overflow-y-auto border border-slate-200 font-sans">{data.email_draft}</pre>
          <button onClick={copy} className="absolute top-3 right-3 text-xs bg-white hover:bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 shadow-sm">
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
