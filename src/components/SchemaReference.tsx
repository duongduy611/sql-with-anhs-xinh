import { SCHEMA_TABLES } from '../db/schema';

interface Props {
  onInsert?: (text: string) => void;
}

/** Thanh tham chiếu lược đồ (tên bảng + cột) hiển thị cạnh trình soạn thảo. */
export function SchemaReference({ onInsert }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-1 text-sm font-semibold text-slate-700">
        Lược đồ cơ sở dữ liệu
      </h3>
      <p className="mb-3 text-xs text-slate-400">
        Ngân hàng mẫu (DemoBank). Bấm vào tên cột để chèn nhanh.
      </p>
      <div className="space-y-3">
        {SCHEMA_TABLES.map((table) => (
          <div
            key={table.name}
            className="rounded-lg border border-slate-200 bg-slate-50/60"
          >
            <button
              type="button"
              onClick={() => onInsert?.(table.name)}
              className="flex w-full items-center justify-between rounded-t-lg px-3 py-2 text-left hover:bg-slate-100"
            >
              <span className="font-mono text-sm font-semibold text-indigo-700">
                {table.name}
              </span>
              <span className="text-xs text-slate-400">{table.description}</span>
            </button>
            <ul className="divide-y divide-slate-100 px-3 pb-2">
              {table.columns.map((col) => (
                <li
                  key={col.name}
                  className="flex items-center justify-between py-1"
                >
                  <button
                    type="button"
                    onClick={() => onInsert?.(col.name)}
                    className="font-mono text-xs text-slate-700 hover:text-indigo-600 hover:underline"
                  >
                    {col.name}
                  </button>
                  <span className="text-[11px] text-slate-400">
                    {col.type}
                    {col.note ? ` · ${col.note}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
