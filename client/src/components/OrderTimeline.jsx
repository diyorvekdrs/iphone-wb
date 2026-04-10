import { ORDER_FLOW_STEPS, statusIndex } from '../utils/orderFlow.js'

/**
 * Apple-style vertical progress for order status.
<<<<<<< HEAD
 * - Completed steps: green checkmark
 * - Active step: blue highlight with glow
 * - Future steps: muted gray, labeled "Upcoming"
 *
=======
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
 * @param {{ status: string, compact?: boolean }} props
 */
export default function OrderTimeline({ status, compact }) {
  const currentIdx = statusIndex(status)

  return (
    <ol className="relative space-y-0" aria-label="Order status">
      {ORDER_FLOW_STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
<<<<<<< HEAD
        const upcoming = i > currentIdx

        /* Connector line between steps */
        const connector =
          i < ORDER_FLOW_STEPS.length - 1 ? (
            <span
              className={[
                'absolute left-[15px] top-8 h-[calc(100%-8px)] w-px transition-colors duration-300',
                done ? 'bg-[#34c759]' : 'bg-black/[0.08]',
              ].join(' ')}
              aria-hidden
            />
          ) : null

        /* Circle indicator */
        const circleClasses = [
          'relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold transition-all duration-300',
          done
            ? 'bg-[#34c759] text-white'
            : active
              ? 'bg-[#0071e3] text-white shadow-[0_0_0_4px_rgba(0,113,227,0.18)]'
              : 'border border-black/[0.12] bg-[#f5f5f7] text-[#86868b]',
        ].join(' ')

        /* Label color */
        const labelClasses = [
          'text-[15px] font-semibold leading-tight transition-colors duration-200',
          done
            ? 'text-[#34c759]'
            : active
              ? 'text-[#1d1d1f]'
              : 'text-[#86868b]',
        ].join(' ')

        return (
          <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
            {connector}

            <span
              className={circleClasses}
              aria-current={active ? 'step' : undefined}
            >
              {done ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </span>

            <div className="min-w-0 pt-0.5">
              <p className={labelClasses}>{step.label}</p>
=======
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
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
              {!compact ? (
                <p className="mt-0.5 text-[13px] leading-snug text-[#6e6e73]">
                  {step.description}
                </p>
              ) : null}
<<<<<<< HEAD
              {upcoming ? (
=======
              {i > currentIdx ? (
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
                <p className="mt-0.5 text-[11px] text-[#86868b]">Upcoming</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
