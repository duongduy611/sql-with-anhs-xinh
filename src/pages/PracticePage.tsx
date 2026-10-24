import { useState } from 'react';
import { SqlEditor } from '../components/SqlEditor';
import { ResultsTable } from '../components/ResultsTable';
import { SchemaReference } from '../components/SchemaReference';
import { useDatabase } from '../db/DatabaseProvider';
import { SAMPLE_QUERIES } from '../db/schema';
import type { RunOutcome } from '../lib/sqlEngine';

const DEFAULT_SQL = 'SELECT *\nFROM accounts\nLIMIT 10;';

export default function PracticePage() {
  const { run, reset, ready, resetting } = useDatabase();
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);

  function handleRun() {
    setOutcome(run(sql));
  }

  function insert(text: string) {
    setSql((prev) => {
      const needsSpace = prev.length > 0 && !/\s$/.test(prev);
      return prev + (needsSpace ? ' ' : '') + text;
    });
  }

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Sân chơi SQL</h1>
        <p className="mt-1 text-slate-500">
          Viết truy vấn bất kỳ và chạy trực tiếp trên cơ sở dữ liệu ngân hàng
          mẫu (SQLite trong trình duyệt). Bạn có thể dùng cả INSERT/UPDATE/DELETE
          — bấm “Khôi phục dữ liệu” để trở về ban đầu.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_QUERIES.map((q) => (
              <button
                key={q.label}
                onClick={() => setSql(q.sql)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                {q.label}
              </button>
            ))}
          </div>

          <SqlEditor
            value={sql}
            onChange={setSql}
            onRun={handleRun}
            height="240px"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRun}
              disabled={!ready}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ▶ Chạy truy vấn
            </button>
            <button
              onClick={() => reset()}
              disabled={resetting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {resetting ? 'Đang khôi phục…' : '↺ Khôi phục dữ liệu'}
            </button>
            <span className="text-xs text-slate-400">Ctrl/⌘ + Enter để chạy</span>
          </div>

          <div>
            {outcome ? (
              <ResultsTable outcome={outcome} />
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-400">
                Kết quả truy vấn sẽ hiện ở đây.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <SchemaReference onInsert={insert} />
        </div>
      </div>
    </div>
  );
}
