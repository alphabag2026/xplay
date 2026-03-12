interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
  highlightRow?: number;
  compact?: boolean;
}

export default function DataTable({ headers, rows, highlightRow, compact = false }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className={`text-left ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} font-semibold tracking-wide uppercase`}
                style={{
                  color: "#00f5ff",
                  borderBottom: "2px solid rgba(0,245,255,0.3)",
                  background: "rgba(0,245,255,0.04)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const isHighlight = highlightRow === ri;
            return (
              <tr
                key={ri}
                style={{
                  background: isHighlight
                    ? "rgba(0,245,255,0.08)"
                    : ri % 2 === 0
                      ? "rgba(255,255,255,0.02)"
                      : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"}`}
                    style={{
                      color: isHighlight ? "#00f5ff" : "rgba(226,232,240,0.85)",
                      fontWeight: isHighlight ? 700 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
