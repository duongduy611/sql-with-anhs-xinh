import { useMemo, type KeyboardEvent } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { sql, SQLite } from '@codemirror/lang-sql';
import { SCHEMA_TABLES } from '../db/schema';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  height?: string;
  minHeight?: string;
  readOnly?: boolean;
  placeholder?: string;
}

// Bản đồ bảng → cột, dùng cho gợi ý (autocomplete).
const schemaMap: Record<string, string[]> = Object.fromEntries(
  SCHEMA_TABLES.map((t) => [t.name, t.columns.map((c) => c.name)]),
);

export function SqlEditor({
  value,
  onChange,
  onRun,
  height,
  minHeight = '72px',
  readOnly = false,
  placeholder,
}: Props) {
  const extensions = useMemo(
    () => [
      sql({ dialect: SQLite, schema: schemaMap, upperCaseKeywords: true }),
      EditorView.lineWrapping,
    ],
    [],
  );

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
    }
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"
    >
      <CodeMirror
        value={value}
        height={height}
        minHeight={minHeight}
        extensions={extensions}
        onChange={onChange}
        editable={!readOnly}
        readOnly={readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          autocompletion: true,
          highlightActiveLineGutter: !readOnly,
        }}
      />
    </div>
  );
}
