import { useState } from 'react';
import { SqlEditor } from './SqlEditor';
import { ResultsTable } from './ResultsTable';
import { useDatabase } from '../db/DatabaseProvider';
import type { RunOutcome } from '../lib/sqlEngine';

interface Props {
  initialSql: string;
  caption?: string;
}

/** Khối SQL có thể chỉnh sửa và chạy trực tiếp ngay trong bài học. */
export function RunnableQuery({ initialSql, caption }: Props) {
  const { run, ready } = useDatabase();
  const [value, setValue] = useState(initialSql.trim());
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);

  function handleRun() {
    setOutcome(run(value));
  }

  return (
    <div className="my-5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      {caption && (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          {caption}
        </p>
      )}
      <SqlEditor value={value} onChange={setValue} onRun={handleRun} />
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={handleRun}
          disabled={!ready}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ▶ Chạy thử
        </button>
        <span className="text-xs text-slate-400">
          hoặc nhấn Ctrl/⌘ + Enter
        </span>
      </div>
      {outcome && (
        <div className="mt-3">
          <ResultsTable outcome={outcome} />
        </div>
      )}
    </div>
  );
}
