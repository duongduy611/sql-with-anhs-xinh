export type LessonBlock =
  | { kind: 'text'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'tip'; text: string }
  | { kind: 'code'; sql: string; caption?: string };

export interface Lesson {
  slug: string;
  title: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  summary: string;
  blocks: LessonBlock[];
}

export const LESSONS: Lesson[] = [
  {
    slug: 'select-co-ban',
    title: 'Bắt đầu với SELECT',
    level: 'Cơ bản',
    summary:
      'Truy vấn dữ liệu tài khoản ngân hàng và chọn đúng cột bạn cần.',
    blocks: [
      {
        kind: 'text',
        text: 'Trong hệ thống ngân hàng, dữ liệu nằm ở các bảng như `accounts` (tài khoản), `customers` (khách hàng), `transactions` (giao dịch)... Lệnh `SELECT` dùng để đọc dữ liệu. Dấu `*` nghĩa là lấy tất cả các cột:',
      },
      { kind: 'code', sql: 'SELECT * FROM accounts;', caption: 'Toàn bộ tài khoản' },
      {
        kind: 'text',
        text: 'Thực tế nên chọn đúng cột cần dùng cho gọn và nhanh:',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, account_type, balance\nFROM accounts;',
      },
      { kind: 'heading', text: 'Đặt bí danh với AS' },
      {
        kind: 'text',
        text: 'Dùng `AS` để đổi tên cột hiển thị cho dễ đọc:',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number AS so_tai_khoan,\n       balance        AS so_du\nFROM accounts;',
      },
      {
        kind: 'text',
        text: 'Trong SQLite bạn còn có thể tính biểu thức mà không cần bảng:',
      },
      { kind: 'code', sql: 'SELECT 2 + 3 AS ket_qua;' },
      {
        kind: 'tip',
        text: 'Mỗi câu lệnh nên kết thúc bằng dấu chấm phẩy `;`. Từ khóa (SELECT, FROM…) không phân biệt hoa thường, nhưng viết hoa giúp dễ đọc.',
      },
    ],
  },
  {
    slug: 'where',
    title: 'Lọc dữ liệu với WHERE',
    level: 'Cơ bản',
    summary:
      'Lọc tài khoản/khách hàng theo điều kiện, dùng AND/OR, IN, BETWEEN, LIKE và xử lý NULL.',
    blocks: [
      {
        kind: 'text',
        text: 'Mệnh đề `WHERE` lọc ra những dòng thỏa điều kiện. Ví dụ, các tài khoản có số dư trên 100 triệu:',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nWHERE balance > 100000000;',
      },
      {
        kind: 'text',
        text: 'Kết hợp nhiều điều kiện với `AND` / `OR`. Toán tử so sánh: `=`, `<>`, `>`, `<`, `>=`, `<=`.',
      },
      {
        kind: 'code',
        sql: "SELECT account_number, status, balance\nFROM accounts\nWHERE status = 'ACTIVE' AND balance > 50000000;",
      },
      { kind: 'heading', text: 'IN, BETWEEN, LIKE' },
      {
        kind: 'code',
        sql: "SELECT full_name, city\nFROM customers\nWHERE city IN ('Hà Nội', 'Đà Nẵng');",
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nWHERE balance BETWEEN 10000000 AND 100000000;',
      },
      {
        kind: 'code',
        sql: "SELECT full_name, email\nFROM customers\nWHERE email LIKE '%@email.com';",
        caption: 'LIKE: % là chuỗi bất kỳ, _ là một ký tự',
      },
      { kind: 'heading', text: 'Giá trị NULL' },
      {
        kind: 'text',
        text: 'Một số khách hàng chưa có email. Kiểm tra NULL phải dùng `IS NULL` / `IS NOT NULL` (không dùng `= NULL`):',
      },
      {
        kind: 'code',
        sql: 'SELECT full_name\nFROM customers\nWHERE email IS NULL;',
      },
    ],
  },
  {
    slug: 'order-limit',
    title: 'Sắp xếp và giới hạn kết quả',
    level: 'Cơ bản',
    summary: 'Dùng ORDER BY để sắp xếp và LIMIT/OFFSET để lấy số dòng mong muốn.',
    blocks: [
      {
        kind: 'text',
        text: '`ORDER BY` sắp xếp kết quả. Mặc định tăng dần (`ASC`), thêm `DESC` để giảm dần:',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nORDER BY balance DESC;',
      },
      {
        kind: 'text',
        text: '`LIMIT` giới hạn số dòng trả về — rất hợp để lấy "top N":',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nORDER BY balance DESC\nLIMIT 5;',
        caption: '5 tài khoản số dư cao nhất',
      },
      {
        kind: 'text',
        text: 'Kết hợp `OFFSET` để bỏ qua một số dòng đầu (phân trang):',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nORDER BY balance DESC\nLIMIT 5 OFFSET 5;',
        caption: 'Từ hạng 6 đến hạng 10',
      },
      {
        kind: 'tip',
        text: 'Có thể sắp xếp theo nhiều cột: `ORDER BY branch_id ASC, balance DESC`.',
      },
    ],
  },
  {
    slug: 'aggregate-group',
    title: 'Hàm tổng hợp & GROUP BY',
    level: 'Trung cấp',
    summary:
      'Đếm, cộng, trung bình số dư và gom nhóm theo loại tài khoản, chi nhánh, kênh giao dịch.',
    blocks: [
      {
        kind: 'text',
        text: 'Các hàm tổng hợp: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`. Ví dụ tổng quan toàn bộ tài khoản:',
      },
      {
        kind: 'code',
        sql: 'SELECT COUNT(*)    AS so_tai_khoan,\n       SUM(balance) AS tong_so_du,\n       AVG(balance) AS so_du_tb\nFROM accounts;',
      },
      { kind: 'heading', text: 'Gom nhóm với GROUP BY' },
      {
        kind: 'text',
        text: 'Đếm số tài khoản và tổng số dư theo từng loại tài khoản:',
      },
      {
        kind: 'code',
        sql: 'SELECT account_type,\n       COUNT(*)     AS so_luong,\n       SUM(balance) AS tong_so_du\nFROM accounts\nGROUP BY account_type;',
      },
      {
        kind: 'code',
        sql: 'SELECT channel, COUNT(*) AS so_giao_dich\nFROM transactions\nGROUP BY channel;',
        caption: 'Số giao dịch theo kênh',
      },
      {
        kind: 'tip',
        text: 'Mọi cột trong SELECT mà không nằm trong hàm tổng hợp thì nên có mặt trong GROUP BY.',
      },
    ],
  },
  {
    slug: 'having',
    title: 'Lọc nhóm với HAVING',
    level: 'Trung cấp',
    summary: 'HAVING lọc sau khi gom nhóm — khác với WHERE lọc trên từng dòng.',
    blocks: [
      {
        kind: 'text',
        text: '`WHERE` lọc *trước* khi gom nhóm, còn `HAVING` lọc *sau* khi đã gom và tính tổng hợp. Ví dụ: khách hàng sở hữu nhiều hơn 1 tài khoản:',
      },
      {
        kind: 'code',
        sql: 'SELECT customer_id, COUNT(*) AS so_tai_khoan\nFROM accounts\nGROUP BY customer_id\nHAVING COUNT(*) > 1;',
      },
      {
        kind: 'text',
        text: 'Kết hợp cả WHERE và HAVING: chỉ xét tài khoản ACTIVE, rồi lọc nhóm:',
      },
      {
        kind: 'code',
        sql: "SELECT branch_id, SUM(balance) AS tong_so_du\nFROM accounts\nWHERE status = 'ACTIVE'\nGROUP BY branch_id\nHAVING SUM(balance) > 100000000;",
      },
      {
        kind: 'tip',
        text: 'Thứ tự thực thi: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.',
      },
    ],
  },
  {
    slug: 'join',
    title: 'Kết nhiều bảng với JOIN',
    level: 'Trung cấp',
    summary:
      'Ghép khách hàng – tài khoản – giao dịch – chi nhánh bằng INNER JOIN và LEFT JOIN.',
    blocks: [
      {
        kind: 'text',
        text: '`JOIN` ghép các bảng theo khóa liên kết. Ví dụ hiển thị mỗi tài khoản kèm tên chủ tài khoản:',
      },
      {
        kind: 'code',
        sql: 'SELECT a.account_number, c.full_name\nFROM accounts a\nJOIN customers c ON c.customer_id = a.customer_id;',
      },
      {
        kind: 'text',
        text: '`INNER JOIN` (tức `JOIN`) chỉ giữ dòng khớp ở cả hai bên. `LEFT JOIN` giữ tất cả dòng bảng bên trái — hữu ích để tìm khách hàng CHƯA có tài khoản:',
      },
      {
        kind: 'code',
        sql: 'SELECT c.full_name,\n       COUNT(a.account_id) AS so_tai_khoan\nFROM customers c\nLEFT JOIN accounts a ON a.customer_id = c.customer_id\nGROUP BY c.full_name\nORDER BY so_tai_khoan;',
      },
      { kind: 'heading', text: 'Ghép nhiều bảng' },
      {
        kind: 'text',
        text: 'Tổng giá trị giao dịch theo chi nhánh cần 3 bảng: `transactions` → `accounts` → `branches`.',
      },
      {
        kind: 'code',
        sql: 'SELECT b.branch_name,\n       SUM(t.amount) AS tong_gia_tri\nFROM transactions t\nJOIN accounts a ON a.account_id = t.account_id\nJOIN branches b ON b.branch_id = a.branch_id\nGROUP BY b.branch_name\nORDER BY tong_gia_tri DESC;',
      },
      {
        kind: 'tip',
        text: 'Đặt bí danh ngắn cho bảng (`a`, `c`, `t`, `b`) giúp truy vấn gọn và rõ ràng.',
      },
    ],
  },
  {
    slug: 'ham-sqlite',
    title: 'Hàm thường dùng trong SQLite',
    level: 'Nâng cao',
    summary:
      'IFNULL/COALESCE xử lý NULL, nối chuỗi ||, và các hàm ngày tháng strftime, date.',
    blocks: [
      {
        kind: 'text',
        text: '`IFNULL(x, y)` (hoặc `COALESCE`) trả về `y` nếu `x` là NULL — hữu ích khi dữ liệu thiếu, ví dụ khách hàng chưa có email:',
      },
      {
        kind: 'code',
        sql: "SELECT full_name,\n       IFNULL(email, '(chưa có email)') AS email\nFROM customers;",
      },
      {
        kind: 'text',
        text: 'Nối chuỗi bằng toán tử `||`:',
      },
      {
        kind: 'code',
        sql: "SELECT full_name || ' - ' || city AS thong_tin\nFROM customers;",
      },
      { kind: 'heading', text: 'Làm việc với ngày tháng' },
      {
        kind: 'text',
        text: '`strftime` định dạng ngày thành chuỗi — thường dùng để gom theo tháng:',
      },
      {
        kind: 'code',
        sql: "SELECT strftime('%Y-%m', txn_date) AS thang,\n       COUNT(*)    AS so_gd,\n       SUM(amount) AS tong_tien\nFROM transactions\nGROUP BY strftime('%Y-%m', txn_date)\nORDER BY thang;",
      },
      {
        kind: 'text',
        text: '`date(\'now\')` là ngày hiện tại; dùng `julianday` để tính khoảng cách ngày. Ví dụ tính tuổi khách hàng:',
      },
      {
        kind: 'code',
        sql: "SELECT full_name,\n       CAST((julianday('now') - julianday(birth_date)) / 365.25 AS INT) AS tuoi\nFROM customers;",
      },
      {
        kind: 'tip',
        text: "Ngày được lưu dạng chuỗi 'YYYY-MM-DD' nên so sánh trực tiếp được: `WHERE txn_date >= '2024-03-01'`.",
      },
    ],
  },
  {
    slug: 'subquery',
    title: 'Truy vấn con (Subquery)',
    level: 'Nâng cao',
    summary:
      'Dùng truy vấn lồng để so sánh với giá trị tổng hợp, lọc theo tập hợp (NOT IN / NOT EXISTS) và làm bảng tạm.',
    blocks: [
      {
        kind: 'text',
        text: 'Tìm các tài khoản có số dư cao hơn mức trung bình toàn hệ thống:',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nWHERE balance > (SELECT AVG(balance) FROM accounts)\nORDER BY balance DESC;',
      },
      {
        kind: 'text',
        text: 'Dùng `NOT IN` để tìm khách hàng chưa mở tài khoản nào:',
      },
      {
        kind: 'code',
        sql: 'SELECT full_name\nFROM customers\nWHERE customer_id NOT IN (SELECT customer_id FROM accounts);',
      },
      {
        kind: 'text',
        text: '`NOT EXISTS` thường dùng cho "anti-join" — ví dụ các tài khoản chưa phát hành thẻ:',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number\nFROM accounts a\nWHERE NOT EXISTS (\n  SELECT 1 FROM cards c WHERE c.account_id = a.account_id\n);',
      },
      {
        kind: 'text',
        text: 'Truy vấn con cũng có thể làm "bảng tạm" trong FROM (inline view):',
      },
      {
        kind: 'code',
        sql: 'SELECT AVG(tong) AS gia_tri_tb_moi_tk\nFROM (\n  SELECT account_id, SUM(amount) AS tong\n  FROM transactions\n  GROUP BY account_id\n);',
      },
      {
        kind: 'tip',
        text: 'Khi dữ liệu lớn, nhiều subquery có thể viết lại thành JOIN để chạy nhanh hơn. Hãy thử cả hai cách!',
      },
    ],
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
