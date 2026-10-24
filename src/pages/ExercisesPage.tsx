import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EXERCISES, type Difficulty } from '../content/exercises';
import { getSolved } from '../lib/progress';

const diffStyles: Record<Difficulty, string> = {
  Dễ: 'bg-emerald-100 text-emerald-700',
  'Trung bình': 'bg-amber-100 text-amber-700',
  Khó: 'bg-rose-100 text-rose-700',
};

export default function ExercisesPage() {
  const [solved] = useState<Set<string>>(() => getSolved());

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
          Đã giải {solved.size}/{EXERCISES.length}
        </div>
      </header>

      <div className="grid gap-3">
        {EXERCISES.map((ex, i) => {
          const done = solved.has(ex.id);
          return (
            <Link
              key={ex.id}
              to={`/exercises/${ex.id}`}
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <div
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {done ? '✓' : i + 1}
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
    </div>
  );
}
