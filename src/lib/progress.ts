const KEY = 'sqlmaster.solved';

/** Tập hợp id các bài tập đã giải đúng (lưu ở localStorage). */
export function getSolved(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set<string>();
  }
}

export function markSolved(id: string): void {
  const set = getSolved();
  set.add(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* bỏ qua nếu localStorage không khả dụng */
  }
}

export function isSolved(id: string): boolean {
  return getSolved().has(id);
}
