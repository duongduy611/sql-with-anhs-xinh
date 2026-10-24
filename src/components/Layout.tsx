import { NavLink, Outlet, Link } from 'react-router-dom';
import { useDatabase } from '../db/DatabaseProvider';

function Logo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-indigo-600"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  );
}

const linkBase =
  'px-3 py-2 rounded-lg text-sm font-medium transition-colors';

function navClass({ isActive }: { isActive: boolean }) {
  return `${linkBase} ${
    isActive
      ? 'bg-indigo-600 text-white'
      : 'text-slate-600 hover:bg-slate-100'
  }`;
}

function DatabaseStatus() {
  const { ready, error } = useDatabase();
  if (error) {
    return (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
        Không khởi tạo được cơ sở dữ liệu: {error}
      </div>
    );
  }
  if (!ready) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        Đang khởi tạo cơ sở dữ liệu SQLite trong trình duyệt…
      </div>
    );
  }
  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-slate-800"
          >
            <Logo />
            Học SQL cùng Ánh Xinh
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Trang chủ
            </NavLink>
            <NavLink to="/learn" className={navClass}>
              Học
            </NavLink>
            <NavLink to="/practice" className={navClass}>
              Luyện tập
            </NavLink>
            <NavLink to="/exercises" className={navClass}>
              Bài tập
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <DatabaseStatus />
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        SQL cùng Ánh Xinh · Học &amp; luyện SQL ngay trên trình duyệt với SQLite
        (sql.js)
      </footer>
    </div>
  );
}
