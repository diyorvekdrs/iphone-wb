/** Static ER diagram for store data model (users, products, orders, order_items). */
export default function AdminErDiagram() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white p-6">
      <p className="mb-4 text-[14px] text-[#6e6e73]">
        Relationships between registered customers, catalog products, purchases (orders), and line
        items. Foreign keys are enforced in MySQL.
      </p>
      <svg
        viewBox="0 0 720 280"
        className="mx-auto h-auto w-full max-w-[720px] text-[#1d1d1f]"
        aria-label="Entity relationship diagram"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#86868b" />
          </marker>
        </defs>

        <rect x="20" y="40" width="140" height="90" rx="10" fill="#f5f5f7" stroke="#1d1d1f" strokeWidth="1.5" />
        <text x="90" y="68" textAnchor="middle" className="fill-[#1d1d1f] text-[13px] font-semibold">
          users
        </text>
        <text x="90" y="88" textAnchor="middle" className="fill-[#6e6e73] text-[11px]">
          id, email, names…
        </text>
        <text x="90" y="108" textAnchor="middle" className="fill-[#6e6e73] text-[11px]">
          (customers)
        </text>

        <rect x="260" y="20" width="160" height="100" rx="10" fill="#f5f5f7" stroke="#1d1d1f" strokeWidth="1.5" />
        <text x="340" y="50" textAnchor="middle" className="fill-[#1d1d1f] text-[13px] font-semibold">
          orders
        </text>
        <text x="340" y="72" textAnchor="middle" className="fill-[#6e6e73] text-[11px]">
          user_id → users
        </text>
        <text x="340" y="90" textAnchor="middle" className="fill-[#6e6e73] text-[11px]">
          total, status, address
        </text>

        <rect x="500" y="40" width="160" height="90" rx="10" fill="#f5f5f7" stroke="#1d1d1f" strokeWidth="1.5" />
        <text x="580" y="68" textAnchor="middle" className="fill-[#1d1d1f] text-[13px] font-semibold">
          products
        </text>
        <text x="580" y="90" textAnchor="middle" className="fill-[#6e6e73] text-[11px]">
          sku, price, stock…
        </text>

        <rect x="260" y="170" width="200" height="90" rx="10" fill="#e8f4ff" stroke="#0071e3" strokeWidth="1.5" />
        <text x="360" y="200" textAnchor="middle" className="fill-[#1d1d1f] text-[13px] font-semibold">
          order_items
        </text>
        <text x="360" y="222" textAnchor="middle" className="fill-[#6e6e73] text-[11px]">
          order_id → orders
        </text>
        <text x="360" y="240" textAnchor="middle" className="fill-[#6e6e73] text-[11px]">
          product_id → products
        </text>

        <line
          x1="160"
          y1="85"
          x2="260"
          y2="70"
          stroke="#86868b"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <text x="200" y="62" className="fill-[#86868b] text-[10px]">
          1:N
        </text>

        <line
          x1="420"
          y1="120"
          x2="360"
          y2="170"
          stroke="#86868b"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <text x="400" y="152" className="fill-[#86868b] text-[10px]">
          1:N
        </text>

        <line
          x1="500"
          y1="100"
          x2="460"
          y2="200"
          stroke="#86868b"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <text x="470" y="155" className="fill-[#86868b] text-[10px]">
          N:1
        </text>
      </svg>
    </div>
  )
}
