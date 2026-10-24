import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Database } from 'sql.js';
import { createDatabase, runSql, type RunOutcome } from '../lib/sqlEngine';

interface DbContextValue {
  db: Database | null;
  ready: boolean;
  error: string | null;
  resetting: boolean;
  run: (sql: string) => RunOutcome;
  reset: () => Promise<void>;
}

const DatabaseContext = createContext<DbContextValue | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    let active = true;
    createDatabase()
      .then((d) => {
        if (active) {
          setDb(d);
          setReady(true);
        }
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      active = false;
    };
  }, []);

  const run = useCallback(
    (sql: string): RunOutcome => {
      if (!db) {
        return {
          results: [],
          error: 'Cơ sở dữ liệu chưa sẵn sàng, vui lòng đợi một chút…',
          elapsedMs: 0,
          rowsAffected: 0,
        };
      }
      return runSql(db, sql);
    },
    [db],
  );

  const reset = useCallback(async () => {
    setResetting(true);
    try {
      const fresh = await createDatabase();
      setDb((prev) => {
        prev?.close();
        return fresh;
      });
    } finally {
      setResetting(false);
    }
  }, []);

  return (
    <DatabaseContext.Provider
      value={{ db, ready, error, resetting, run, reset }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDatabase() {
  const ctx = useContext(DatabaseContext);
  if (!ctx) {
    throw new Error('useDatabase phải được dùng bên trong <DatabaseProvider>');
  }
  return ctx;
}
