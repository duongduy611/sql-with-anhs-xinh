// Kiểm tra: thực thi toàn bộ solutionSql của các bài tập trên schema SQLite thật.
import { readFileSync } from 'node:fs';
import { transform } from 'esbuild';
import initSqlJs from 'sql.js';

async function loadTs(path) {
  const src = readFileSync(path, 'utf8');
  const { code } = await transform(src, { loader: 'ts', format: 'esm' });
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
  return import(url);
}

const { SCHEMA_SQL } = await loadTs('src/db/schema.ts');
const { EXERCISES } = await loadTs('src/content/exercises.ts');

const SQL = await initSqlJs({ locateFile: (f) => 'node_modules/sql.js/dist/' + f });

let fails = 0;
let empty = 0;
for (const ex of EXERCISES) {
  const db = new SQL.Database();
  db.run(SCHEMA_SQL);
  try {
    const res = db.exec(ex.solutionSql);
    const rows = res.length ? res[0].values.length : 0;
    if (rows === 0) {
      empty++;
      console.log(`EMPTY  ${ex.id}  ${ex.title}  (0 dòng)`);
    }
  } catch (e) {
    fails++;
    console.log(`FAIL   ${ex.id}  ${ex.title}  ::  ${e.message}`);
  }
  db.close();
}

console.log('--------------------------------------------------');
console.log(`Tổng bài tập: ${EXERCISES.length} | Lỗi: ${fails} | Rỗng: ${empty}`);
process.exit(fails > 0 ? 1 : 0);
