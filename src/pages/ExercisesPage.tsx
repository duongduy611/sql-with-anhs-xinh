import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EXERCISES, type Difficulty } from '../content/exercises';
import { getSolved } from '../lib/progress';

const diffStyles: Record<Difficulty, string> = {
  Dễ: 'bg-emerald-100 text-emerald-700',
  'Trung bình': 'bg-amber-100 text-amber-700',
  Khó: 'bg-rose-100 text-rose-700',
};

const LEVELS = ['Dễ', 'Trung bình', 'Khó'] as const;
type LevelFilter = 'all' | Difficulty;
type StatusFilter = 'all' | 'done' | 'todo';

const levelCode: Record<Difficulty, string> = {
  Dễ: 'de',
  'Trung bình': 'tb',
  Khó: 'kho',
};

const codeToLevel: Record<string, Difficulty> = {
  de: 'Dễ',
  tb: 'Trung bình',
  kho: 'Khó',
};

const exerciseNumber = new Map(EXERCISES.map((ex, index) => [ex.id, index + 1]));

export const EXERCISE_PAGE_SIZE = 10;

export function exercisesListPath(exerciseIndex: number): string {
  const page =
    exerciseIndex >= 0
      ? Math.floor(exerciseIndex / EXERCISE_PAGE_SIZE) + 1
      : 1;
  return page <= 1 ? '/exercises' : `/exercises?page=${page}`;
}

function parsePage(value: string | null): number {
  if (value == null || value === '') return 1;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

function parseLevel(value: string | null): LevelFilter {
  if (value && codeToLevel[value]) return codeToLevel[value];
  return 'all';
}

function parseStatus(value: string | null): StatusFilter {
  if (value === 'done' || value === 'todo') return value;
  return 'all';
}

function listHref(page: number, level: LevelFilter, status: StatusFilter): string {
  const params = new URLSearchParams();
  if (level !== 'all') params.set('level', levelCode[level]);
  if (status !== 'all') params.set('status', status);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/exercises?${query}` : '/exercises';
}

function Pagination({
  page,
  totalPages,
  shown,
  total,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  shown: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  return (
    <nav
      className="inline-flex flex-nowrap items-center gap-1"
      aria-label="Phân trang bài tập"
    >
      <PageLink
        to={hrefFor(page - 1)}
        disabled={page <= 1}
        label="Trang trước"
        className="w-9 sm:w-[4.5rem]"
      >
        <span className="sm:hidden" aria-hidden="true">
          ‹
        </span>
        <span className="hidden sm:inline">Trước</span>
      </PageLink>
      <span className="inline-flex h-9 min-w-[4.5rem] items-center justify-center px-2 text-sm font-medium tabular-nums text-slate-600">
        {shown}/{total}
      </span>
      <PageLink
        to={hrefFor(page + 1)}
        disabled={page >= totalPages}
        label="Trang sau"
        className="w-9 sm:w-[4.5rem]"
      >
        <span className="sm:hidden" aria-hidden="true">
          ›
        </span>
        <span className="hidden sm:inline">Sau</span>
      </PageLink>
    </nav>
  );
}

function PageLink({
  to,
  children,
  disabled,
  label,
  className: box = 'w-9',
}: {
  to: string;
  children: ReactNode;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const className = `inline-flex h-9 items-center justify-center rounded-lg px-0 text-sm font-medium transition ${box} ${
    disabled
      ? 'cursor-not-allowed text-slate-300'
      : 'text-slate-600 hover:bg-slate-100'
  }`;

  if (disabled) {
    return (
      <span className={className} aria-disabled="true" aria-label={label}>
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      aria-label={label}
      className={className}
    >
      {children}
    </Link>
  );
}

function FilterButton({
  pressed,
  onClick,
  children,
  activeClass,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium transition ${
        pressed
          ? activeClass
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

export default function ExercisesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [solved] = useState<Set<string>>(() => getSolved());

  const level = parseLevel(searchParams.get('level'));
  const status = parseStatus(searchParams.get('status'));

  const filtered = useMemo(
    () =>
      EXERCISES.filter((ex) => {
        if (level !== 'all' && ex.difficulty !== level) return false;
        const done = solved.has(ex.id);
        if (status === 'done' && !done) return false;
        if (status === 'todo' && done) return false;
        return true;
      }),
    [level, status, solved],
  );

  const requested = parsePage(searchParams.get('page'));
  const totalPages = Math.max(1, Math.ceil(filtered.length / EXERCISE_PAGE_SIZE));
  const page = Math.min(requested, totalPages);
  const start = (page - 1) * EXERCISE_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + EXERCISE_PAGE_SIZE);
  const end = start + pageItems.length;

  const levelCounts: Record<LevelFilter, number> = {
    all: 0,
    Dễ: 0,
    'Trung bình': 0,
    Khó: 0,
  };
  let doneCount = 0;
  let statusAll = 0;
  let statusDone = 0;
  let statusTodo = 0;
  for (const ex of EXERCISES) {
    const done = solved.has(ex.id);
    if (done) doneCount += 1;
    const levelOk = level === 'all' || ex.difficulty === level;
    const statusOk =
      status === 'all' || (status === 'done' ? done : !done);
    if (statusOk) {
      levelCounts.all += 1;
      levelCounts[ex.difficulty] += 1;
    }
    if (levelOk) {
      statusAll += 1;
      if (done) statusDone += 1;
      else statusTodo += 1;
    }
  }

  function hrefFor(target: number): string {
    return listHref(target, level, status);
  }

  function applyFilters(nextLevel: LevelFilter, nextStatus: StatusFilter) {
    if (nextLevel === level && nextStatus === status) return;
    const params = new URLSearchParams();
    if (nextLevel !== 'all') params.set('level', levelCode[nextLevel]);
    if (nextStatus !== 'all') params.set('status', nextStatus);
    setSearchParams(params, { replace: true });
  }

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let changed = false;
    const rawLevel = searchParams.get('level');
    if (rawLevel && !codeToLevel[rawLevel]) {
      next.delete('level');
      changed = true;
    }
    const rawStatus = searchParams.get('status');
    if (rawStatus && rawStatus !== 'done' && rawStatus !== 'todo') {
      next.delete('status');
      changed = true;
    }
    const canonical = page <= 1 ? null : String(page);
    const current = next.get('page');
    if (
      (canonical == null && current != null) ||
      (canonical != null && current !== canonical)
    ) {
      if (canonical) next.set('page', canonical);
      else next.delete('page');
      changed = true;
    }
    if (changed) setSearchParams(next, { replace: true });
  }, [page, searchParams, setSearchParams]);

  const listSearch = searchParams.toString();

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bài tập SQL</h1>
          <p className="mt-1 text-slate-500">
            Tự viết truy vấn và bấm “Kiểm tra” để được chấm điểm ngay.
          </p>
        </div>
        <div className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          Đã giải {doneCount}/{EXERCISES.length}
        </div>
      </header>

      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Lọc theo độ khó">
          <span className="w-full text-xs font-semibold uppercase tracking-wide text-slate-400 sm:w-24">
            Độ khó
          </span>
          <FilterButton
            pressed={level === 'all'}
            onClick={() => applyFilters('all', status)}
            activeClass="bg-indigo-600 text-white"
          >
            Tất cả {levelCounts.all}
          </FilterButton>
          {LEVELS.map((item) => (
            <FilterButton
              key={item}
              pressed={level === item}
              onClick={() => applyFilters(item, status)}
              activeClass={
                item === 'Dễ'
                  ? 'bg-emerald-600 text-white'
                  : item === 'Trung bình'
                    ? 'bg-amber-500 text-white'
                    : 'bg-rose-600 text-white'
              }
            >
              {item} {levelCounts[item]}
            </FilterButton>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Lọc theo tiến độ">
          <span className="w-full text-xs font-semibold uppercase tracking-wide text-slate-400 sm:w-24">
            Trạng thái
          </span>
          <FilterButton
            pressed={status === 'all'}
            onClick={() => applyFilters(level, 'all')}
            activeClass="bg-indigo-600 text-white"
          >
            Tất cả {statusAll}
          </FilterButton>
          <FilterButton
            pressed={status === 'done'}
            onClick={() => applyFilters(level, 'done')}
            activeClass="bg-emerald-600 text-white"
          >
            Đã làm {statusDone}
          </FilterButton>
          <FilterButton
            pressed={status === 'todo'}
            onClick={() => applyFilters(level, 'todo')}
            activeClass="bg-slate-700 text-white"
          >
            Chưa làm {statusTodo}
          </FilterButton>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {filtered.length === 0
            ? '0 bài'
            : `${start + 1}–${end} / ${filtered.length} bài`}
        </p>
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            shown={end}
            total={filtered.length}
            hrefFor={hrefFor}
          />
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Không có bài nào khớp bộ lọc.</p>
          <button
            type="button"
            onClick={() => applyFilters('all', 'all')}
            className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {pageItems.map((ex) => {
            const done = solved.has(ex.id);
            const number = exerciseNumber.get(ex.id) ?? 0;
            return (
              <Link
                key={ex.id}
                to={`/exercises/${ex.id}`}
                state={{ listSearch }}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {done ? '✓' : number}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-800 group-hover:text-indigo-700">
                    {ex.title}
                  </h3>
                  <p className="truncate text-sm text-slate-500">{ex.topic}</p>
                </div>
                <span
                  className={`flex-none rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    diffStyles[ex.difficulty]
                  }`}
                >
                  {ex.difficulty}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
