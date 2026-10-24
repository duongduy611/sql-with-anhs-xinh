import { Fragment, type ReactNode } from 'react';

/**
 * Hiển thị văn bản có hỗ trợ `inline code` (đặt giữa dấu backtick).
 */
export function InlineText({ text }: { text: string }): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('`') && p.endsWith('`') && p.length > 1) {
          return (
            <code
              key={i}
              className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-indigo-700"
            >
              {p.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
