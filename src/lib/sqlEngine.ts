import initSqlJs from 'sql.js';
import type { Database, SqlJsStatic } from 'sql.js';
// Vite sẽ xử lý file WASM và trả về URL cuối cùng (đã hash khi build).
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { SCHEMA_SQL } from '../db/schema';

let sqlPromise: Promise<SqlJsStatic> | null = null;

/** Khởi tạo (một lần) engine SQLite biên dịch sang WebAssembly. */
export function getSqlEngine(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({ locateFile: () => wasmUrl });
  }
  return sqlPromise;
}

/** Tạo một database mới trong bộ nhớ và nạp sẵn dữ liệu ngân hàng mẫu. */
export async function createDatabase(): Promise<Database> {
  const SQL = await getSqlEngine();
  const db = new SQL.Database();
  db.run(SCHEMA_SQL);
  return db;
}

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
}

export interface RunOutcome {
  results: QueryResult[];
  error: string | null;
  elapsedMs: number;
  rowsAffected: number;
}

/** Chạy một (hoặc nhiều) câu lệnh SQL và trả về kết quả hoặc lỗi. */
export function runSql(db: Database, sql: string): RunOutcome {
  const start = performance.now();
  try {
    const res = db.exec(sql);
    const results: QueryResult[] = res.map((r) => ({
      columns: r.columns,
      rows: r.values as unknown[][],
    }));
    return {
      results,
      error: null,
      elapsedMs: performance.now() - start,
      rowsAffected: db.getRowsModified(),
    };
  } catch (e) {
    return {
      results: [],
      error: e instanceof Error ? e.message : String(e),
      elapsedMs: performance.now() - start,
      rowsAffected: 0,
    };
  }
}
