import { createDatabase, runSql, type QueryResult } from './sqlEngine';

export interface CheckResult {
  correct: boolean;
  message: string;
  userResult: QueryResult | null;
  expectedResult: QueryResult | null;
}

function normalizeRows(rows: unknown[][]): string[] {
  return rows.map((row) =>
    JSON.stringify(
      row.map((c) => (c === null || c === undefined ? null : String(c))),
    ),
  );
}

function last<T>(arr: T[]): T | undefined {
  return arr.length ? arr[arr.length - 1] : undefined;
}

function compare(
  user: QueryResult | undefined,
  expected: QueryResult | undefined,
  orderMatters: boolean,
): { ok: boolean; reason?: string } {
  if (!expected) return { ok: false, reason: 'Không tính được kết quả mẫu.' };
  if (!user)
    return {
      ok: false,
      reason: 'Truy vấn của bạn chưa trả về bảng kết quả nào (hãy dùng SELECT).',
    };
  if (user.columns.length !== expected.columns.length) {
    return {
      ok: false,
      reason: `Số cột chưa đúng — cần ${expected.columns.length} cột, truy vấn của bạn trả về ${user.columns.length} cột.`,
    };
  }
  if (user.rows.length !== expected.rows.length) {
    return {
      ok: false,
      reason: `Số dòng chưa đúng — cần ${expected.rows.length} dòng, truy vấn của bạn trả về ${user.rows.length} dòng.`,
    };
  }
  let u = normalizeRows(user.rows);
  let e = normalizeRows(expected.rows);
  if (!orderMatters) {
    u = [...u].sort();
    e = [...e].sort();
  }
  for (let i = 0; i < e.length; i++) {
    if (u[i] !== e[i]) {
      return {
        ok: false,
        reason: orderMatters
          ? 'Nội dung hoặc thứ tự các dòng chưa đúng (bài này có yêu cầu thứ tự).'
          : 'Nội dung các dòng chưa khớp với kết quả mong đợi.',
      };
    }
  }
  return { ok: true };
}

/**
 * Chấm bài: chạy câu trả lời của người dùng và câu mẫu trên hai database "sạch"
 * riêng biệt rồi so sánh kết quả.
 */
export async function checkAnswer(
  userSql: string,
  solutionSql: string,
  orderMatters: boolean,
): Promise<CheckResult> {
  const dbExpected = await createDatabase();
  const expectedRun = runSql(dbExpected, solutionSql);
  dbExpected.close();

  if (expectedRun.error) {
    return {
      correct: false,
      message: 'Lỗi nội bộ ở câu mẫu. Vui lòng báo lại cho quản trị viên.',
      userResult: null,
      expectedResult: null,
    };
  }

  const dbUser = await createDatabase();
  const userRun = runSql(dbUser, userSql);
  dbUser.close();

  if (userRun.error) {
    return {
      correct: false,
      message: `Truy vấn bị lỗi: ${userRun.error}`,
      userResult: null,
      expectedResult: last(expectedRun.results) ?? null,
    };
  }

  const cmp = compare(
    last(userRun.results),
    last(expectedRun.results),
    orderMatters,
  );

  return {
    correct: cmp.ok,
    message: cmp.ok ? 'Chính xác! Làm tốt lắm 🎉' : cmp.reason ?? 'Chưa đúng.',
    userResult: last(userRun.results) ?? null,
    expectedResult: last(expectedRun.results) ?? null,
  };
}
