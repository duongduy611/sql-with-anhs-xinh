import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { SqlEditor } from '../components/SqlEditor';
import { ResultsTable, ResultGrid } from '../components/ResultsTable';
import { SchemaReference } from '../components/SchemaReference';
import { EXERCISES, getExercise, type Difficulty } from '../content/exercises';
import { exercisesListPath } from './ExercisesPage';
import { useDatabase } from '../db/DatabaseProvider';
import type { RunOutcome } from '../lib/sqlEngine';
import { checkAnswer, type CheckResult } from '../lib/check';
import { markSolved } from '../lib/progress';

const diffStyles: Record<Difficulty, string> = {
  Dễ: 'bg-emerald-100 text-emerald-700',
  'Trung bình': 'bg-amber-100 text-amber-700',
  Khó: 'bg-rose-100 text-rose-700',
};

function readListSearch(state: unknown): string {
  if (!state || typeof state !== 'object' || !('listSearch' in state)) return '';
  const value = (state as { listSearch: unknown }).listSearch;
  return typeof value === 'string' ? value : '';
}

export default function ExercisePage() {
  const { id } = useParams();
  const exercise = id ? getExercise(id) : undefined;
  const { run, ready } = useDatabase();

  const [sql, setSql] = useState('');
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [checking, setChecking] = useState(false);
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const index = useMemo(() => EXERCISES.findIndex((e) => e.id === id), [id]);
  const location = useLocation();
  const listSearch = readListSearch(location.state);
  const backToList =
    listSearch.length > 0 ? `/exercises?${listSearch}` : exercisesListPath(index);

  useEffect(() => {
    setSql('');
    setOutcome(null);
    setCheck(null);
    setShowHint(false);
    setShowFrame(false);
    setShowSolution(false);
  }, [id]);

  if (!exercise) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Không tìm thấy bài tập này.</p>
        <Link
          to={backToList}
          className="mt-3 inline-block text-indigo-600 hover:underline"
        >
          ← Về danh sách bài tập
        </Link>
      </div>
    );
  }

  function handleRun() {
    setCheck(null);
    setOutcome(run(sql));
  }

  async function handleCheck() {
    if (!exercise) return;
    setChecking(true);
    setOutcome(null);
    try {
      const result = await checkAnswer(
        sql,
        exercise.solutionSql,
        exercise.orderMatters,
      );
      setCheck(result);
      if (result.correct) markSolved(exercise.id);
    } finally {
      setChecking(false);
    }
  }

  function insert(text: string) {
    setSql((prev) => {
      const needsSpace = prev.length > 0 && !/\s$/.test(prev);
      return prev + (needsSpace ? ' ' : '') + text;
    });
  }

  const prev = index > 0 ? EXERCISES[index - 1] : null;
  const next = index < EXERCISES.length - 1 ? EXERCISES[index + 1] : null;

  return (
    <div>
      <Link
        to={backToList}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Danh sách bài tập
      </Link>

      <div className="mt-3 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <header>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">
                {exercise.title}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  diffStyles[exercise.difficulty]
                }`}
              >
                {exercise.difficulty}
              </span>
            </div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {exercise.topic}
            </p>
          </header>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
            {exercise.prompt}
          </div>

          <SqlEditor
            value={sql}
            onChange={setSql}
            onRun={handleRun}
            height="200px"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCheck}
              disabled={!ready || checking}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checking ? 'Đang chấm…' : '✓ Kiểm tra'}
            </button>
            <button
              onClick={handleRun}
              disabled={!ready}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ▶ Chạy thử
            </button>
            <button
              onClick={() =>
                setShowHint((open) => {
                  if (open) setShowFrame(false);
                  return !open;
                })
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              💡 Gợi ý
            </button>
            <button
              onClick={() => setShowSolution((v) => !v)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {showSolution ? 'Ẩn đáp án' : 'Xem đáp án'}
            </button>
          </div>

          {showHint && (
            <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <p className="min-w-0 flex-1">
                  <span className="font-semibold text-amber-700">Gợi ý: </span>
                  {exercise.hint}
                </p>
                <button
                  type="button"
                  onClick={() => setShowFrame((open) => !open)}
                  aria-expanded={showFrame}
                  aria-label={showFrame ? 'Ẩn khung câu lệnh' : 'Hiện khung câu lệnh'}
                  className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-amber-700 transition hover:bg-amber-100"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={`h-4 w-4 fill-current transition ${showFrame ? 'rotate-90' : ''}`}
                  >
                    <path d="M7.2 4.2a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L11.5 10 7.2 5.6a1 1 0 0 1 0-1.4Z" />
                  </svg>
                </button>
              </div>
              {showFrame && (
                <div className="mt-2">
                  <p className="mb-1 text-xs font-medium text-amber-700">
                    Khung câu lệnh — chỗ ... là phần bạn tự viết
                  </p>
                  <pre className="overflow-auto whitespace-pre-wrap rounded-md bg-white px-3 py-2 font-mono text-[13px] leading-5 text-slate-800">
                    {exercise.starterSql}
                  </pre>
                </div>
              )}
            </div>
          )}

          {showSolution && (
            <div className="rounded-lg border border-slate-200 bg-slate-900 px-4 py-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Đáp án mẫu
              </p>
              <pre className="overflow-auto whitespace-pre-wrap font-mono text-sm text-emerald-300">
                {exercise.solutionSql}
              </pre>
            </div>
          )}

          {check && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                check.correct
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              <span className="font-semibold">
                {check.correct ? '✓ ' : '✗ '}
              </span>
              {check.message}
            </div>
          )}

          {check && !check.correct && check.userResult && (
            <div>
              <p className="mb-1 text-sm font-medium text-slate-600">
                Kết quả của bạn
              </p>
              <ResultGrid result={check.userResult} maxHeight="240px" />
            </div>
          )}

          {check && !check.correct && check.expectedResult && (
            <div>
              <p className="mb-1 text-sm font-medium text-slate-600">
                Kết quả mong đợi
              </p>
              <ResultGrid result={check.expectedResult} maxHeight="240px" />
            </div>
          )}

          {outcome && (
            <div>
              <p className="mb-1 text-sm font-medium text-slate-600">
                Kết quả chạy thử
              </p>
              <ResultsTable outcome={outcome} />
            </div>
          )}

          <nav className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
            {prev ? (
              <Link
                to={`/exercises/${prev.id}`}
                state={{ listSearch }}
                className="text-sm text-slate-600 hover:text-indigo-600"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={`/exercises/${next.id}`}
                state={{ listSearch }}
                className="text-sm text-slate-600 hover:text-indigo-600"
              >
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        <div className="lg:col-span-1">
          <SchemaReference onInsert={insert} />
        </div>
      </div>
    </div>
  );
}
