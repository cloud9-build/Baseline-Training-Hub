interface Props {
  label: string
}

export default function ScreenshotPlaceholder({ label }: Props) {
  return (
    <div className="w-full bg-warm-border rounded-card p-8 flex items-center justify-center text-center my-6">
      <div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-muted mb-1">
          Screenshot
        </div>
        <div className="text-sm text-muted">{label}</div>
      </div>
    </div>
  )
}
