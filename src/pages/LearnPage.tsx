import { Link } from 'react-router-dom';
import { LESSONS, type Lesson } from '../content/lessons';

const levelStyles: Record<Lesson['level'], string> = {
  'Cơ bản': 'bg-emerald-100 text-emerald-700',
  'Trung cấp': 'bg-amber-100 text-amber-700',
  'Nâng cao': 'bg-rose-100 text-rose-700',
};

export default function LearnPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bài học SQL</h1>
        <p className="mt-1 text-slate-500">
          Lộ trình từ cơ bản đến nâng cao. Mỗi bài đều có ví dụ chạy trực tiếp.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {LESSONS.map((lesson, i) => (
          <Link
            key={lesson.slug}
            to={`/learn/${lesson.slug}`}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600">
              {i + 1}
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">
                  {lesson.title}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    levelStyles[lesson.level]
                  }`}
                >
                  {lesson.level}
                </span>
              </div>
              <p className="text-sm text-slate-500">{lesson.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
