import { Link } from 'react-router-dom';
import { RunnableQuery } from '../components/RunnableQuery';
import { LESSONS } from '../content/lessons';
import { EXERCISES } from '../content/exercises';

function FeatureCard({
  to,
  title,
  desc,
  cta,
  icon,
}: {
  to: string;
  title: string;
  desc: string;
  cta: string;
  icon: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    >
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mb-4 flex-1 text-sm text-slate-500">{desc}</p>
      <span className="text-sm font-medium text-indigo-600 group-hover:underline">
        {cta} →
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-8 py-14 text-white shadow-lg">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            Chạy SQL thật ngay trên trình duyệt · Dữ liệu nghiệp vụ ngân hàng
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Học &amp; luyện tập SQL ngân hàng
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            Đọc bài học ngắn gọn, thử truy vấn trực tiếp trên cơ sở dữ liệu ngân
            hàng mẫu (khách hàng, tài khoản, giao dịch, thẻ, khoản vay) và tự
            chấm điểm với các bài tập từ dễ đến khó — không cần cài đặt gì.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/learn"
              className="rounded-xl bg-white px-5 py-2.5 font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
            >
              Bắt đầu học
            </Link>
            <Link
              to="/practice"
              className="rounded-xl bg-indigo-500/40 px-5 py-2.5 font-semibold text-white ring-1 ring-inset ring-white/40 transition hover:bg-indigo-500/60"
            >
              Mở sân chơi SQL
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <FeatureCard
          to="/learn"
          icon="📘"
          title="Bài học"
          desc={`${LESSONS.length} bài học từ SELECT cơ bản đến JOIN, GROUP BY và truy vấn con, kèm ví dụ chạy được ngay.`}
          cta="Xem bài học"
        />
        <FeatureCard
          to="/practice"
          icon="⚡"
          title="Sân chơi SQL"
          desc="Trình soạn thảo có gợi ý cú pháp, chạy truy vấn tức thì trên dữ liệu ngân hàng mẫu và xem kết quả dạng bảng."
          cta="Thử ngay"
        />
        <FeatureCard
          to="/exercises"
          icon="🎯"
          title="Bài tập"
          desc={`${EXERCISES.length} bài tập nghiệp vụ ngân hàng, tự chấm điểm, có gợi ý và đáp án mẫu.`}
          cta="Luyện tập"
        />
      </section>

      <section>
        <h2 className="mb-1 text-xl font-semibold text-slate-800">
          Thử ngay một truy vấn
        </h2>
        <p className="mb-2 text-sm text-slate-500">
          Chỉnh sửa câu lệnh bên dưới rồi bấm “Chạy thử”. Dữ liệu là một ngân
          hàng mẫu.
        </p>
        <RunnableQuery
          initialSql={
            'SELECT account_number, balance\nFROM accounts\nWHERE balance > 100000000\nORDER BY balance DESC;'
          }
        />
      </section>
    </div>
  );
}
