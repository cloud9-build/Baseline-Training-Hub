const steps = [
  {
    label: 'Guest sends an inquiry',
    sub: '30–35% of bookings start here',
    branches: ['CS responds → Guest books', 'Guest books directly (60–65% of bookings)'],
  },
  { label: 'Reservation confirmed', sub: null, branches: [] },
  { label: 'Automated verification sent', sub: 'Lighthouse — identity check + deposit', branches: [] },
  { label: 'CS pre-arrival checks', sub: 'Guesty statuses, Breezeway, parking, ECI, special requests', branches: [] },
  { label: 'Check-in', sub: 'Access code sent, unit ready, building access confirmed', branches: [] },
  { label: 'During stay', sub: 'Maintenance, requests, complaints — CS responds', branches: [] },
  { label: 'Checkout', sub: 'Guest leaves, keys/parking pass left, cleaning assigned in Breezeway', branches: [] },
  { label: 'Post-stay', sub: 'Review monitoring, claims if applicable', branches: [] },
]

export default function GuestJourneyFlowchart() {
  return (
    <div className="my-6 border border-warm-border rounded-card p-6 bg-warm-card">
      <div className="text-[10px] font-bold tracking-widest uppercase text-faint mb-5">
        Guest Journey
      </div>
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* connector */}
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-ink mt-0.5 shrink-0" />
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-warm-border mt-1 mb-1" />
              )}
            </div>
            {/* content */}
            <div className="pb-4">
              <div className="text-sm font-semibold text-ink leading-tight">{step.label}</div>
              {step.sub && <div className="text-[12px] text-muted mt-0.5">{step.sub}</div>}
              {step.branches.map((b, j) => (
                <div key={j} className="text-[12px] text-muted mt-1 pl-3 border-l-2 border-warm-border">
                  {b}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
