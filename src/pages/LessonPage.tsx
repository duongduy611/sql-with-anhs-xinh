import { useParams, Link } from 'react-router-dom';
import { LESSONS, getLesson } from '../content/lessons';
import { RunnableQuery } from '../components/RunnableQuery';
import { InlineText } from '../lib/format';

export default function LessonPage() {
  const { slug } = useParams();
  const lesson = slug ? getLesson(slug) : undefined;

  if (!lesson) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Không tìm thấy bài học này.</p>
        <Link to="/learn" className="mt-3 inline-block text-indigo-600 hover:underline">
          ← Về danh sách bài học
        </Link>
      </div>
    );
  }

  const index = LESSONS.findIndex((l) => l.slug === lesson.slug);
  const prev = index > 0 ? LESSONS[index - 1] : null;
  const next = index < LESSONS.length - 1 ? LESSONS[index + 1] : null;

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        to="/learn"
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Danh sách bài học
      </Link>

      <h1 className="mt-3 text-3xl font-bold text-slate-800">{lesson.title}</h1>
      <p className="mt-2 text-lg text-slate-500">{lesson.summary}</p>

      <div className="mt-8 space-y-1">
        {lesson.blocks.map((block, i) => {
          const key = `${lesson.slug}-${i}`;
          switch (block.kind) {
            case 'heading':
              return (
                <h2
                  key={key}
                  className="!mt-8 mb-2 text-xl font-semibold text-slate-800"
                >
                  {block.text}
                </h2>
              );
            case 'text':
              return (
                <p key={key} className="my-3 leading-relaxed text-slate-700">
                  <InlineText text={block.text} />
                </p>
              );
            case 'tip':
              return (
                <div
                  key={key}
                  className="my-4 rounded-lg border-l-4 border-indigo-400 bg-indigo-50 px-4 py-3 text-sm text-slate-700"
                >
                  <span className="font-semibold text-indigo-700">Mẹo: </span>
                  <InlineText text={block.text} />
                </div>
              );
            case 'code':
              return (
                <RunnableQuery
                  key={key}
                  initialSql={block.sql}
                  caption={block.caption}
                />
              );
            default:
              return null;
          }
        })}
      </div>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
        {prev ? (
          <Link
            to={`/learn/${prev.slug}`}
            className="flex-1 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm"
          >
            <div className="text-xs text-slate-400">← Bài trước</div>
            <div className="font-medium text-slate-700">{prev.title}</div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            to={`/learn/${next.slug}`}
            className="flex-1 rounded-xl border border-slate-200 bg-white p-4 text-right transition hover:border-indigo-300 hover:shadow-sm"
          >
            <div className="text-xs text-slate-400">Bài tiếp theo →</div>
            <div className="font-medium text-slate-700">{next.title}</div>
          </Link>
        ) : (
          <Link
            to="/exercises"
            className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-right transition hover:shadow-sm"
          >
            <div className="text-xs text-indigo-400">Sẵn sàng luyện tập?</div>
            <div className="font-medium text-indigo-700">Làm bài tập →</div>
          </Link>
        )}
      </nav>
    </article>
  );
}
