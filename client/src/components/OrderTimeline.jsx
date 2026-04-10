import { ORDER_FLOW_STEPS, statusIndex } from '../utils/orderFlow.js'

/**
 * Apple-style vertical progress for order status.
 * @param {{ status: string, compact?: boolean }} props
 */
export default function OrderTimeline({ status, compact }) {
  const currentIdx = statusIndex(status)

  return (
    <ol className="relative space-y-0" aria-label="Order status">
      {ORDER_FLOW_STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        return (
          <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
            {i < ORDER_FLOW_STEPS.length - 1 ? (
              <span
                className={[
                  'absolute left-[15px] top-8 h-[calc(100%-8px)] w-px',
                  done ? 'bg-[#34c759]' : 'bg-black/[0.08]',
                ].join(' ')}
                aria-hidden
              />
            ) : null}
            <span
              className={[
                'relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold',
                done
                  ? 'bg-[#34c759] text-white'
                  : active
                    ? 'bg-[#0071e3] text-white shadow-[0_0_0_4px_rgba(0,113,227,0.2)]'
                    : 'border border-black/[0.12] bg-[#f5f5f7] text-[#6e6e73]',
              ].join(' ')}
              aria-current={active ? 'step' : undefined}
            >
              {done ? '✓' : i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={[
                  'text-[15px] font-semibold leading-tight',
                  active || done ? 'text-[#1d1d1f]' : 'text-[#6e6e73]',
                ].join(' ')}
              >
                {step.label}
              </p>
              {!compact ? (
                <p className="mt-0.5 text-[13px] leading-snug text-[#6e6e73]">
                  {step.description}
                </p>
              ) : null}
              {i > currentIdx ? (
                <p className="mt-0.5 text-[11px] text-[#86868b]">Upcoming</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
