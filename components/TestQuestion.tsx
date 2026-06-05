interface Props {
  index: number
  questionText: string
  contextText?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function TestQuestion({ index, questionText, contextText, value, onChange, disabled }: Props) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-widest uppercase text-sage mb-2">
        Question {index + 1}
      </div>
      {contextText && (
        <div className="bg-warm-bg border-l-2 border-warm-border px-4 py-3 rounded-r-lg mb-3 text-sm text-muted italic leading-relaxed">
          {contextText}
        </div>
      )}
      <div className="text-sm font-medium text-ink mb-3 leading-relaxed">{questionText}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Write your answer here…"
        className="w-full border border-warm-border rounded-xl px-4 py-3 text-sm text-ink bg-warm-card focus:outline-none focus:border-sage min-h-[80px] leading-relaxed disabled:opacity-60"
      />
    </div>
  )
}
