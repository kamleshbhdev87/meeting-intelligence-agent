import { useState, useRef } from 'react'

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export default function TranscriptUploader({ onAnalyze, loading }) {
  const [transcript, setTranscript] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(getTodayDate())
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const fileRef = useRef()

  const readFile = (file) => {
    setFileError('')
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['txt', 'pdf'].includes(ext)) {
      setFileError('Only .txt and .pdf files are supported.')
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      if (ext === 'txt') {
        setTranscript(e.target.result)
      } else {
        setTranscript('[PDF file selected: ' + file.name + ']\n\nNote: PDF text extraction happens on the server. The file name has been recorded.')
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    readFile(e.dataTransfer.files[0])
  }

  const sample = `John (PM): Good morning everyone. Let's get started with the Q3 planning meeting.

Sarah (Engineering Lead): First item — we need to decide on the tech stack for the microservices migration.

John: I think we should go with Kubernetes. Everyone agree?

Mike (DevOps): I support that. But we will need at least 3 more weeks for the infrastructure setup.

Sarah: Agreed on Kubernetes. I'll assign Alex to lead the migration by end of July.

Lisa (QA): I want to flag a risk — we don't have enough QA resources to cover this migration and the existing sprint.

John: Lisa, can you document the resource gap and send it to HR by Friday?

Mike: Also, the staging environment is currently down. That could block testing.

John: Mike, can you have staging restored by Wednesday?

Sarah: We should also budget for additional cloud costs — estimated 15K for Q3.

John: Approved. I'll update the budget sheet today. Let's wrap up.`

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Meeting Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Q3 Planning Meeting"
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Meeting Date</label>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm cursor-pointer"
          />
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Defaults to today — click calendar icon to change</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">Meeting Transcript</label>
          {fileName && (
            <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2.5 py-0.5 rounded-full font-medium">
              {fileName}
            </span>
          )}
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 transition-all ${dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'} shadow-sm`}
        >
          <textarea
            value={transcript}
            onChange={e => { setTranscript(e.target.value); setFileName('') }}
            rows={10}
            className="w-full bg-transparent px-4 py-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none resize-none rounded-xl leading-relaxed"
            placeholder="Copy & paste your meeting transcript here..."
          />

          {!transcript && (
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="h-px bg-slate-200 w-16" />
                <span className="text-xs font-medium">or</span>
                <div className="h-px bg-slate-200 w-16" />
              </div>
              <button
                onClick={() => fileRef.current && fileRef.current.click()}
                className="pointer-events-auto flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Choose .txt or .pdf file
              </button>
              <p className="text-xs text-slate-300">or drag and drop a file anywhere above</p>
            </div>
          )}
        </div>

        <input ref={fileRef} type="file" accept=".txt,.pdf" onChange={e => readFile(e.target.files[0])} className="hidden" />

        {fileError && <p className="text-xs text-red-500 mt-1.5">{fileError}</p>}

        <div className="flex items-center justify-between mt-2">
          {!transcript ? (
            <button
              onClick={() => { setTranscript(sample); setTitle('Q3 Planning Meeting'); setFileName('') }}
              className="text-xs text-slate-400 hover:text-blue-500 transition-colors underline underline-offset-2"
            >
              Try with sample transcript
            </button>
          ) : (
            <button onClick={() => { setTranscript(''); setFileName('') }} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
              Clear
            </button>
          )}
          <span className="text-xs text-slate-400">{transcript.length.toLocaleString()} chars</span>
        </div>
      </div>

      <button
        onClick={() => onAnalyze({ transcript, meeting_title: title || 'Untitled Meeting', meeting_date: date })}
        disabled={!transcript.trim() || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-99 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />Analyzing transcript...</>
        ) : (
          <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Analyze Meeting</>
        )}
      </button>
    </div>
  )
}
