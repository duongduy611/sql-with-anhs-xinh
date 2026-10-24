import type { QueryResult, RunOutcome } from '../lib/sqlEngine';

export function ResultGrid({
  result,
  maxHeight = '360px',
}: {
  result: QueryResult;
  maxHeight?: string;
}) {
  return (
    <div
      className="overflow-auto rounded-lg border border-slate-200"
      style={{ maxHeight }}
    >
      <table className="min-w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-slate-100 text-left">
          <tr>
            {result.columns.map((c, i) => (
              <th
                key={i}
                className="whitespace-nowrap border-b border-slate-200 px-3 py-2 font-semibold text-slate-700"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, ri) => (
            <tr key={ri} className="odd:bg-white even:bg-slate-50">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="whitespace-nowrap border-b border-slate-100 px-3 py-1.5 font-mono text-slate-700"
                >
                  {cell === null || cell === undefined ? (
                    <span className="italic text-slate-400">NULL</span>
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
          {result.rows.length === 0 && (
            <tr>
              <td
                colSpan={Math.max(result.columns.length, 1)}
                className="px-3 py-6 text-center text-slate-400"
              >
                Truy vấn hợp lệ nhưng không có dòng nào khớp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ResultsTable({ outcome }: { outcome: RunOutcome | null }) {
  if (!outcome) return null;

  if (outcome.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="font-semibold">Lỗi: </span>
        {outcome.error}
      </div>
    );
  }

  const result = outcome.results[outcome.results.length - 1];

  if (!result) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Thực thi thành công
        {outcome.rowsAffected
          ? ` · ${outcome.rowsAffected} dòng bị thay đổi`
          : ''}{' '}
        · {outcome.elapsedMs.toFixed(1)} ms
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 text-xs text-slate-500">
        {result.rows.length} dòng · {outcome.elapsedMs.toFixed(1)} ms
      </div>
      <ResultGrid result={result} />
    </div>
  );
}
