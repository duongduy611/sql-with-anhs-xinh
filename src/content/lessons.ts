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
      'Đọc một bảng: chọn cột, đặt tên hiển thị, tính biểu thức và loại giá trị trùng.',
    blocks: [
      {
        kind: 'text',
        text: 'SQL là cách bạn đặt câu hỏi cho cơ sở dữ liệu. Trong ngân hàng mẫu, mỗi bảng là một danh sách: `customers` là khách hàng, `accounts` là tài khoản, `transactions` là giao dịch. Một dòng là một khách, một tài khoản hoặc một giao dịch. Một cột là một thuộc tính, ví dụ `balance` là số dư.',
      },
      {
        kind: 'text',
        text: 'Lệnh `SELECT` không sửa dữ liệu. Nó chỉ trả về một bảng kết quả. Câu lệnh luôn có hai phần: `SELECT` liệt kê những gì muốn xem, `FROM` chỉ bảng lấy dữ liệu.',
      },
      { kind: 'heading', text: 'Lấy mọi cột khi đang khám phá' },
      {
        kind: 'text',
        text: 'Dấu `*` nghĩa là mọi cột, theo đúng thứ tự trong bảng. Dùng khi bạn chưa nhớ tên cột và muốn nhìn toàn cảnh:',
      },
      {
        kind: 'code',
        sql: 'SELECT * FROM branches;',
        caption: 'Mọi cột của bảng chi nhánh',
      },
      {
        kind: 'text',
        text: 'Trong báo cáo thật không nên dùng `*`. Bảng có thể thêm cột sau này, câu lệnh của bạn sẽ đổi kết quả mà không ai sửa. Hãy gọi đúng tên cột cần dùng. Thứ tự bạn viết chính là thứ tự cột trong kết quả.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, account_type, balance\nFROM accounts;',
        caption: 'Chỉ ba cột cần cho danh sách tài khoản',
      },
      { kind: 'heading', text: 'Đặt tên cột bằng AS' },
      {
        kind: 'text',
        text: '`AS` chỉ đổi tên hiển thị, không đổi tên cột trong bảng. Bí danh giúp người đọc kết quả hiểu “so_du” thay vì “balance”. Từ khóa `AS` có thể bỏ, nhưng viết ra cho rõ.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number AS so_tk,\n       balance        AS so_du\nFROM accounts;',
      },
      { kind: 'heading', text: 'Tính ngay trong SELECT' },
      {
        kind: 'text',
        text: 'Cột trong `SELECT` không bắt buộc là một cột có sẵn. Bạn được phép tính. Số dư đang lưu theo đồng; chia `1000000` để ra triệu đồng. Kết quả là một cột mới, dữ liệu gốc không bị sửa.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number,\n       balance / 1000000 AS so_du_trieu\nFROM accounts;',
      },
      { kind: 'heading', text: 'Loại giá trị trùng với DISTINCT' },
      {
        kind: 'text',
        text: '`SELECT city FROM customers` lặp lại Hà Nội mỗi lần có một khách ở Hà Nội. `DISTINCT` gom các giá trị giống hệt nhau thành một dòng. Nó xét cả dòng kết quả: nếu bạn chọn hai cột, hai dòng chỉ bị gộp khi cả hai cột đều trùng.',
      },
      {
        kind: 'code',
        sql: 'SELECT DISTINCT city\nFROM customers;',
        caption: 'Mỗi thành phố xuất hiện đúng một lần',
      },
      {
        kind: 'code',
        sql: 'SELECT DISTINCT account_type\nFROM accounts;',
        caption: 'Các loại tài khoản đang có trong hệ thống',
      },
      {
        kind: 'tip',
        text: 'Kết thúc câu bằng `;`. `SELECT`, `FROM`, `AS` không phân biệt hoa thường, nhưng viết hoa từ khóa và thường tên cột sẽ dễ đọc hơn khi câu lệnh dài.',
      },
    ],
  },
  {
    slug: 'where',
    title: 'Lọc dữ liệu với WHERE',
    level: 'Cơ bản',
    summary:
      'Giữ lại đúng những dòng cần xem: so sánh, AND/OR, IN, BETWEEN, LIKE, NULL và ngày.',
    blocks: [
      {
        kind: 'text',
        text: '`WHERE` đứng sau `FROM` và quyết định dòng nào được giữ. Điều kiện đúng thì dòng còn lại, sai thì bị loại. Nó lọc từng dòng, trước khi sắp xếp hay gom nhóm.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nWHERE balance > 100000000;',
        caption: 'Số dư lớn hơn 100 triệu',
      },
      {
        kind: 'text',
        text: 'Số viết trần. Chuỗi và ngày phải nằm trong nháy đơn, không phải nháy kép. So sánh được bằng `=`, khác bằng `<>` (hoặc `!=`). Còn `>`, `<`, `>=`, `<=`.',
      },
      {
        kind: 'code',
        sql: "SELECT account_number, status\nFROM accounts\nWHERE status <> 'ACTIVE';",
        caption: 'Mọi trạng thái không phải đang hoạt động',
      },
      { kind: 'heading', text: 'AND, OR và dấu ngoặc' },
      {
        kind: 'text',
        text: '`AND` đòi hỏi cả hai vế đúng. `OR` chỉ cần một vế đúng. `AND` được xét trước `OR`, giống như nhân trước cộng. Khi ý bạn là “một trong hai, nhưng phải đang hoạt động”, hãy khoanh nhóm bằng ngoặc. Không có ngoặc, câu dưới đây giữ mọi tài khoản USD kể cả tài khoản đã đóng.',
      },
      {
        kind: 'code',
        sql: "SELECT account_number, status, currency, balance\nFROM accounts\nWHERE status = 'ACTIVE'\n  AND (balance > 100000000 OR currency = 'USD');",
        caption: 'Đang hoạt động, và (số dư lớn hoặc là ngoại tệ USD)',
      },
      { kind: 'heading', text: 'IN, BETWEEN và LIKE' },
      {
        kind: 'text',
        text: '`IN` là cách viết gọn của nhiều phép `OR` bằng nhau. `BETWEEN a AND b` gồm cả hai đầu mút, tức là `>= a` và `<= b`. `LIKE` so khớp mẫu: `%` là một chuỗi bất kỳ kể cả rỗng, `_` là đúng một ký tự.',
      },
      {
        kind: 'code',
        sql: "SELECT full_name, city\nFROM customers\nWHERE city IN ('Hà Nội', 'Hải Phòng');",
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nWHERE balance BETWEEN 10000000 AND 100000000;',
      },
      {
        kind: 'code',
        sql: "SELECT full_name\nFROM customers\nWHERE full_name LIKE 'Nguyễn%';",
        caption: 'Họ tên bắt đầu bằng Nguyễn',
      },
      { kind: 'heading', text: 'NULL không phải là giá trị rỗng' },
      {
        kind: 'text',
        text: '`NULL` nghĩa là “không có thông tin”, không phải chuỗi rỗng và cũng không phải số 0. Phép `= NULL` không bao giờ đúng, vì không thể so một giá trị chưa biết với một giá trị chưa biết. Phải dùng `IS NULL` hoặc `IS NOT NULL`.',
      },
      {
        kind: 'code',
        sql: 'SELECT full_name, email\nFROM customers\nWHERE email IS NULL;',
        caption: 'Khách chưa khai email',
      },
      {
        kind: 'code',
        sql: 'SELECT full_name, email\nFROM customers\nWHERE email IS NOT NULL;',
      },
      { kind: 'heading', text: 'So sánh ngày' },
      {
        kind: 'text',
        text: "Ngày trong cơ sở này lưu dạng chữ `'YYYY-MM-DD'`, năm đứng trước. Nhờ thứ tự đó, so sánh chuỗi cũng chính là so sánh thời gian. `'2022-01-01'` đứng sau mọi ngày của năm 2021.",
      },
      {
        kind: 'code',
        sql: "SELECT account_number, opened_date\nFROM accounts\nWHERE opened_date >= '2022-01-01';",
        caption: 'Tài khoản mở từ đầu năm 2022',
      },
      {
        kind: 'tip',
        text: '`WHERE` chỉ lọc khi đọc. Muốn sửa dữ liệu phải dùng `UPDATE` hoặc `DELETE`, và các bài tập ở đây không yêu cầu những lệnh đó.',
      },
    ],
  },
  {
    slug: 'order-limit',
    title: 'Sắp xếp và giới hạn kết quả',
    level: 'Cơ bản',
    summary:
      'ORDER BY quyết định thứ tự dòng. LIMIT lấy top N. Không có ORDER BY thì “cao nhất” không có nghĩa.',
    blocks: [
      {
        kind: 'text',
        text: 'Nếu không có `ORDER BY`, cơ sở dữ liệu được phép trả dòng theo bất kỳ thứ tự nào. Lần này có thể đúng ý bạn, lần sau thì không. Mọi bài yêu cầu “cao nhất”, “giảm dần” hoặc chấm cả thứ tự dòng đều cần `ORDER BY`.',
      },
      {
        kind: 'text',
        text: 'Mặc định là tăng dần, `ASC`. Viết `DESC` để giảm dần. Có thể sắp theo một cột không xuất hiện trong `SELECT`, nhưng nên đưa cột đó ra kết quả để người đọc kiểm tra được.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nORDER BY balance DESC;',
      },
      { kind: 'heading', text: 'Hòa thì xét cột tiếp theo' },
      {
        kind: 'text',
        text: 'Khi hai dòng bằng nhau ở cột đầu, cột thứ hai trong `ORDER BY` quyết định ai đứng trước. Dấu phẩy ngăn các tiêu chí. Ví dụ lương bằng nhau thì xếp theo tên A → Z.',
      },
      {
        kind: 'code',
        sql: 'SELECT full_name, salary\nFROM employees\nORDER BY salary DESC, full_name ASC;',
      },
      { kind: 'heading', text: 'LIMIT là “lấy bao nhiêu dòng”, không phải “lấy dòng lớn nhất”' },
      {
        kind: 'text',
        text: '`LIMIT 5` chỉ cắt kết quả còn 5 dòng đầu sau khi đã sắp. Nếu quên `ORDER BY`, đó là 5 dòng ngẫu nhiên, không phải top 5. `ORDER BY` viết trước `LIMIT`.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nORDER BY balance DESC\nLIMIT 5;',
        caption: 'Năm tài khoản số dư cao nhất',
      },
      {
        kind: 'text',
        text: '`OFFSET` bỏ qua một số dòng đã sắp, rồi `LIMIT` mới lấy. Trang 1 là `LIMIT 5`, trang 2 là `LIMIT 5 OFFSET 5`. Vẫn phải có `ORDER BY`, nếu không mỗi lần mở trang lại thấy một tập dòng khác.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nORDER BY balance DESC\nLIMIT 5 OFFSET 5;',
        caption: 'Hạng 6 đến hạng 10',
      },
      {
        kind: 'tip',
        text: 'Thứ tự các mệnh đề: `SELECT` → `FROM` → `WHERE` → `ORDER BY` → `LIMIT`. `WHERE` lọc trước, `ORDER BY` sắp những dòng còn lại, `LIMIT` cắt sau cùng.',
      },
    ],
  },
  {
    slug: 'aggregate-group',
    title: 'Hàm tổng hợp và GROUP BY',
    level: 'Trung cấp',
    summary:
      'COUNT, SUM, AVG, MIN, MAX biến nhiều dòng thành một con số, rồi GROUP BY tách con số đó theo từng nhóm.',
    blocks: [
      {
        kind: 'text',
        text: 'Hàm tổng hợp đọc nhiều dòng rồi trả về một giá trị. `COUNT` đếm, `SUM` cộng, `AVG` lấy trung bình, `MIN` và `MAX` lấy nhỏ nhất và lớn nhất. Không có `GROUP BY`, cả bảng là một nhóm và kết quả chỉ có một dòng.',
      },
      {
        kind: 'code',
        sql: 'SELECT COUNT(*)        AS so_tk,\n       SUM(balance)     AS tong,\n       AVG(balance)     AS tb,\n       MAX(balance)     AS cao_nhat,\n       MIN(balance)     AS thap_nhat\nFROM accounts;',
        caption: 'Một dòng tóm tắt toàn bộ tài khoản',
      },
      { kind: 'heading', text: 'COUNT(*) khác COUNT(cột) và COUNT(DISTINCT)' },
      {
        kind: 'text',
        text: '`COUNT(*)` đếm dòng, kể cả dòng có ô trống. `COUNT(email)` đếm những dòng mà `email` không phải `NULL`, nên khách chưa có email không được tính. `COUNT(DISTINCT city)` đếm số giá trị khác nhau, không đếm số khách.',
      },
      {
        kind: 'code',
        sql: 'SELECT COUNT(*)            AS so_khach,\n       COUNT(email)        AS co_email,\n       COUNT(DISTINCT city) AS so_thanh_pho\nFROM customers;',
      },
      {
        kind: 'text',
        text: '`SUM`, `AVG`, `MIN`, `MAX` bỏ qua `NULL`. `AVG` chia cho số giá trị không rỗng, không chia cho số dòng nếu có ô trống. `SUM` của một cột toàn `NULL` ra `NULL`, không ra 0.',
      },
      { kind: 'heading', text: 'Mỗi nhóm một dòng' },
      {
        kind: 'text',
        text: '`GROUP BY account_type` chia bảng thành từng chồng theo loại tài khoản, rồi tính hàm tổng hợp trên từng chồng. Kết quả có một dòng cho `SAVINGS`, một dòng cho `CHECKING`, một dòng cho `CREDIT`.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_type,\n       COUNT(*)     AS so_luong,\n       SUM(balance) AS tong_so_du\nFROM accounts\nGROUP BY account_type;',
      },
      {
        kind: 'text',
        text: 'Quy tắc: cột nào hiện trong `SELECT` mà không nằm trong hàm tổng hợp thì phải có trong `GROUP BY`. `account_type` ở ví dụ trên là cột đó. Nếu bạn viết thêm `balance` mà không gom và cũng không bọc trong `SUM`/`MAX`, SQLite không biết phải lấy số dư của dòng nào trong nhóm.',
      },
      {
        kind: 'text',
        text: '`WHERE` chạy trước khi chia nhóm. Nó bỏ từng giao dịch không thỏa, rồi `GROUP BY` mới đếm những gì còn lại. Muốn “chỉ giao dịch ATM, đếm theo loại” thì lọc kênh trước:',
      },
      {
        kind: 'code',
        sql: "SELECT txn_type, COUNT(*) AS so_gd, SUM(amount) AS tong\nFROM transactions\nWHERE channel = 'ATM'\nGROUP BY txn_type;",
      },
      {
        kind: 'tip',
        text: 'Trong SQLite, `ORDER BY` và `GROUP BY` được phép dùng bí danh đã đặt trong `SELECT`. Vẫn nên nhóm theo đúng biểu thức đã hiện ở `SELECT` khi biểu thức đó dài, để khỏi lệch giữa cột hiển thị và cách gom.',
      },
    ],
  },
  {
    slug: 'having',
    title: 'Lọc nhóm với HAVING',
    level: 'Trung cấp',
    summary:
      'WHERE lọc từng dòng. HAVING lọc sau khi đã đếm hoặc cộng xong — dùng khi điều kiện là một con số tổng hợp.',
    blocks: [
      {
        kind: 'text',
        text: 'Câu “khách nào có nhiều hơn một tài khoản?” không lọc được bằng `WHERE`. Lúc đang xét từng dòng tài khoản, số lượng tài khoản của khách đó chưa tồn tại. Phải đếm xong, rồi mới bỏ những nhóm có `COUNT(*)` không đạt.',
      },
      {
        kind: 'text',
        text: 'Thứ tự máy làm việc: `FROM` lấy bảng, `WHERE` bỏ dòng, `GROUP BY` chia nhóm, hàm tổng hợp tính trên từng nhóm, `HAVING` bỏ nhóm, rồi mới tới `SELECT`, `ORDER BY` và `LIMIT`.',
      },
      {
        kind: 'code',
        sql: 'SELECT customer_id, COUNT(*) AS so_tk\nFROM accounts\nGROUP BY customer_id\nHAVING COUNT(*) > 1;',
        caption: 'Chỉ những khách có từ 2 tài khoản',
      },
      { kind: 'heading', text: 'WHERE và HAVING trong cùng một câu' },
      {
        kind: 'text',
        text: 'Lọc dòng bằng `WHERE`, lọc nhóm bằng `HAVING`. Ví dụ: bỏ tài khoản không hoạt động trước, cộng số dư từng chi nhánh, rồi chỉ giữ chi nhánh có tổng trên 100 triệu.',
      },
      {
        kind: 'code',
        sql: "SELECT branch_id, SUM(balance) AS tong_so_du\nFROM accounts\nWHERE status = 'ACTIVE'\nGROUP BY branch_id\nHAVING SUM(balance) > 100000000;",
      },
      {
        kind: 'text',
        text: '`HAVING` cũng dùng `AND` / `OR` khi một nhóm phải thỏa nhiều điều kiện tổng hợp cùng lúc: vừa đông tài khoản, vừa có tổng số dư lớn.',
      },
      {
        kind: 'code',
        sql: 'SELECT customer_id,\n       COUNT(*)     AS so_tk,\n       SUM(balance) AS tong\nFROM accounts\nGROUP BY customer_id\nHAVING COUNT(*) > 1\n   AND SUM(balance) > 100000000;',
      },
      {
        kind: 'text',
        text: 'Viết `WHERE COUNT(*) > 1` là sai thứ tự: điều kiện đó chưa tính được ở bước lọc dòng. Đưa mọi điều kiện trên từng dòng (`status`, `city`, `balance` của chính dòng đó) xuống `WHERE`. Đưa điều kiện trên `COUNT`, `SUM`, `AVG` xuống `HAVING`.',
      },
      {
        kind: 'tip',
        text: 'Có thể lặp lại hàm trong `HAVING` (`HAVING COUNT(*) > 1`) hoặc, với SQLite, dùng bí danh (`HAVING so_tk > 1`). Trong bài tập, viết lại hàm cho chắc vì đáp án chấm theo kết quả, còn thói quen này chạy được trên nhiều hệ cơ sở dữ liệu hơn.',
      },
    ],
  },
  {
    slug: 'join',
    title: 'Kết nhiều bảng với JOIN',
    level: 'Trung cấp',
    summary:
      'Ghép khóa giữa các bảng, phân biệt INNER JOIN với LEFT JOIN, nối ba bảng và tự nối employees.',
    blocks: [
      {
        kind: 'text',
        text: 'Tên khách nằm ở `customers`, số dư nằm ở `accounts`. Không bảng nào chứa đủ cả hai. `JOIN` ghép chúng theo khóa: `accounts.customer_id` trỏ tới `customers.customer_id`. Mỗi tài khoản tìm đúng một khách có cùng mã.',
      },
      {
        kind: 'text',
        text: 'Bí danh ngắn (`a`, `c`) bắt buộc khi hai bảng có cột trùng tên, và nên dùng ngay cả khi không trùng để biết cột thuộc bảng nào. `ON` là điều kiện ghép, không phải bộ lọc nghiệp vụ.',
      },
      {
        kind: 'code',
        sql: 'SELECT a.account_number, c.full_name, a.balance\nFROM accounts a\nJOIN customers c ON c.customer_id = a.customer_id;',
        caption: 'Mỗi tài khoản kèm tên chủ',
      },
      { kind: 'heading', text: 'INNER JOIN bỏ phía không có cặp' },
      {
        kind: 'text',
        text: '`JOIN` viết tắt của `INNER JOIN`: chỉ giữ dòng tìm được cặp ở cả hai bảng. Khách chưa mở tài khoản không có dòng trong `accounts`, nên biến mất khỏi kết quả trên. Muốn thấy cả những khách đó, dùng `LEFT JOIN`: giữ mọi dòng của bảng bên trái, và điền `NULL` ở các cột bên phải nếu không có cặp.',
      },
      {
        kind: 'code',
        sql: 'SELECT c.full_name, a.account_number\nFROM customers c\nLEFT JOIN accounts a ON a.customer_id = c.customer_id;',
        caption: 'Khách chưa có tài khoản vẫn còn, account_number là NULL',
      },
      {
        kind: 'text',
        text: 'Để chỉ lấy khách chưa có tài khoản, giữ `LEFT JOIN` rồi lọc `a.account_id IS NULL`. Nếu lọc `a.account_id IS NULL` sau `INNER JOIN` thì không còn dòng nào, vì các dòng không khớp đã bị INNER JOIN loại từ trước.',
      },
      { kind: 'heading', text: 'Đếm kể cả nhóm bằng 0' },
      {
        kind: 'text',
        text: 'Sau `LEFT JOIN`, khách không có tài khoản vẫn chiếm một dòng, nhưng mọi cột của `accounts` đều `NULL`. `COUNT(*)` đếm dòng đó thành 1 — sai, vì họ có 0 tài khoản. `COUNT(a.account_id)` bỏ qua `NULL`, nên ra 0. Đây là lý do bài “kể cả khách chưa có tài khoản” không được dùng `COUNT(*)`.',
      },
      {
        kind: 'code',
        sql: 'SELECT c.full_name,\n       COUNT(a.account_id) AS so_tk\nFROM customers c\nLEFT JOIN accounts a ON a.customer_id = c.customer_id\nGROUP BY c.full_name\nORDER BY so_tk, c.full_name;',
      },
      { kind: 'heading', text: 'Nối tiếp ba bảng' },
      {
        kind: 'text',
        text: 'Giao dịch không có mã chi nhánh. Đường đi là `transactions.account_id` → `accounts`, rồi `accounts.branch_id` → `branches`. Mỗi `JOIN` nối thêm một bảng. `GROUP BY` đặt sau khi các bảng đã ghép xong.',
      },
      {
        kind: 'code',
        sql: 'SELECT b.branch_name,\n       SUM(t.amount) AS tong_gia_tri\nFROM transactions t\nJOIN accounts a ON a.account_id = t.account_id\nJOIN branches b ON b.branch_id = a.branch_id\nGROUP BY b.branch_name\nORDER BY tong_gia_tri DESC;',
      },
      { kind: 'heading', text: 'Một bảng nối với chính nó' },
      {
        kind: 'text',
        text: '`employees.manager_id` cũng là một `employee_id`. Để hiện tên nhân viên cạnh tên quản lý, hãy coi `employees` như hai bảng: `e` là nhân viên, `m` là quản lý. `INNER JOIN` chỉ giữ người có quản lý. `LEFT JOIN` giữ cả quản lý cấp cao, lúc đó cột tên quản lý là `NULL`.',
      },
      {
        kind: 'code',
        sql: 'SELECT e.full_name AS nhan_vien,\n       m.full_name AS quan_ly\nFROM employees e\nLEFT JOIN employees m ON m.employee_id = e.manager_id;',
      },
      {
        kind: 'tip',
        text: 'Điều kiện khóa luôn nằm ở `ON`. Điều kiện nghiệp vụ như “chỉ tài khoản ACTIVE” hoặc “chỉ giao dịch ATM” nên để ở `WHERE`, trừ khi bạn cố tình lọc bảng bên phải của `LEFT JOIN` — lúc đó đặt ở `ON` nếu không muốn biến `LEFT JOIN` thành `INNER JOIN`.',
      },
    ],
  },
  {
    slug: 'case',
    title: 'Rẽ nhánh với CASE',
    level: 'Trung cấp',
    summary:
      'Gắn nhãn từng dòng bằng CASE, và đếm theo điều kiện bằng SUM(CASE ...).',
    blocks: [
      {
        kind: 'text',
        text: '`CASE` là câu lệnh if của SQL, dùng được trong `SELECT`. Nó không lọc bớt dòng. Mỗi dòng vẫn còn, nhưng thêm một cột chữ do bạn đặt. Máy xét `WHEN` từ trên xuống và dừng ở điều kiện đầu tiên đúng.',
      },
      {
        kind: 'text',
        text: 'Vì dừng ở nhánh đầu đúng, thứ tự `WHEN` quyết định kết quả. “Số dư từ 100 triệu” phải đứng trước “từ 10 triệu”. Nếu đảo ngược, một tài khoản 150 triệu dính nhánh 10 triệu và bị gọi là trung bình.',
      },
      {
        kind: 'code',
        sql: "SELECT account_number,\n       balance,\n       CASE\n         WHEN balance >= 100000000 THEN 'Cao'\n         WHEN balance >= 10000000  THEN 'Trung bình'\n         ELSE 'Thấp'\n       END AS phan_loai\nFROM accounts\nORDER BY balance DESC;",
        caption: 'ELSE bắt mọi dòng không khớp các WHEN phía trên',
      },
      { kind: 'heading', text: 'Đếm có điều kiện' },
      {
        kind: 'text',
        text: 'Muốn trên một dòng vừa có tổng số tài khoản, vừa có số tài khoản đang hoạt động, không thể `WHERE status = \'ACTIVE\'` vì lọc đó làm mất các tài khoản khác khỏi `COUNT(*)`. Thay vào đó, mỗi dòng đóng góp 1 hoặc 0 vào một tổng:',
      },
      {
        kind: 'code',
        sql: "SELECT\n  COUNT(*) AS tong_tk,\n  SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS dang_hoat_dong,\n  SUM(CASE WHEN status <> 'ACTIVE' THEN 1 ELSE 0 END) AS khac\nFROM accounts;",
      },
      {
        kind: 'text',
        text: 'Cùng mẫu đó gắn với `JOIN` và `GROUP BY` khi cần một dòng cho mỗi chi nhánh. `COUNT(*)` đếm mọi tài khoản của chi nhánh. `SUM(CASE ...)` chỉ cộng 1 với tài khoản ACTIVE.',
      },
      {
        kind: 'code',
        sql: "SELECT b.branch_name,\n       COUNT(*) AS tong_tk,\n       SUM(CASE WHEN a.status = 'ACTIVE' THEN 1 ELSE 0 END) AS tk_hoat_dong\nFROM accounts a\nJOIN branches b ON b.branch_id = a.branch_id\nGROUP BY b.branch_name\nORDER BY b.branch_name;",
      },
      {
        kind: 'tip',
        text: '`CASE` đổi giá trị của cột, không quyết định dòng nào được in. Muốn bỏ dòng, dùng `WHERE`. Muốn bỏ cả nhóm, dùng `HAVING`.',
      },
    ],
  },
  {
    slug: 'ham-sqlite',
    title: 'Hàm thường dùng trong SQLite',
    level: 'Nâng cao',
    summary:
      'Thay NULL bằng IFNULL, nối chuỗi bằng ||, và gom giao dịch theo tháng với strftime.',
    blocks: [
      {
        kind: 'text',
        text: 'SQLite có sẵn các hàm xử lý giá trị thiếu và ngày tháng. Chúng dùng trong `SELECT`, `WHERE` hoặc `GROUP BY` như một biểu thức bình thường.',
      },
      { kind: 'heading', text: 'IFNULL và COALESCE' },
      {
        kind: 'text',
        text: '`IFNULL(email, \'chưa có\')` trả về email nếu có, và trả về chữ thay thế nếu email là `NULL`. `COALESCE(a, b, c)` làm cùng việc nhưng nhận nhiều phương án, lấy giá trị không `NULL` đầu tiên. Cả hai không sửa bảng, chỉ đổi giá trị trên kết quả.',
      },
      {
        kind: 'code',
        sql: "SELECT full_name,\n       IFNULL(email, 'chưa có') AS email\nFROM customers;",
      },
      { kind: 'heading', text: 'Nối chuỗi' },
      {
        kind: 'text',
        text: 'Toán tử `||` ghép chuỗi. Nếu một vế là `NULL`, cả biểu thức thành `NULL` — khách chưa có email sẽ làm mất luôn họ tên nếu bạn nối thẳng với email. Bọc `IFNULL` quanh phần có thể trống.',
      },
      {
        kind: 'code',
        sql: "SELECT full_name || ' - ' || city AS thong_tin\nFROM customers;",
      },
      {
        kind: 'code',
        sql: "SELECT full_name || ' <' || IFNULL(email, 'không có email') || '>' AS lien_he\nFROM customers;",
      },
      { kind: 'heading', text: 'Ngày và strftime' },
      {
        kind: 'text',
        text: "Cột ngày là chữ `'YYYY-MM-DD'`, nên `WHERE txn_date >= '2024-01-01'` hoạt động. `strftime` cắt chuỗi ngày thành đúng phần bạn cần. `'%Y-%m'` là năm-tháng (`2024-03`). `'%Y'` là năm, `'%m'` là tháng, `'%d'` là ngày.",
      },
      {
        kind: 'text',
        text: 'Khi đếm theo tháng, biểu thức trong `GROUP BY` phải cùng nghĩa với cột đã hiện. Cách chắc nhất là lặp lại `strftime(...)`. SQLite cũng cho nhóm theo bí danh `thang`, nhưng đừng nhóm theo `txn_date` gốc — như vậy mỗi ngày một nhóm, không phải mỗi tháng.',
      },
      {
        kind: 'code',
        sql: "SELECT strftime('%Y-%m', txn_date) AS thang,\n       COUNT(*)    AS so_gd,\n       SUM(amount) AS tong_tien\nFROM transactions\nGROUP BY strftime('%Y-%m', txn_date)\nORDER BY thang;",
        caption: 'Một dòng cho mỗi tháng',
      },
      {
        kind: 'text',
        text: 'Lọc loại giao dịch bằng `WHERE` trước khi gom. `strftime` vẫn ở cả `SELECT` lẫn `GROUP BY`.',
      },
      {
        kind: 'code',
        sql: "SELECT strftime('%Y-%m', txn_date) AS thang,\n       SUM(amount) AS tong_nap\nFROM transactions\nWHERE txn_type = 'DEPOSIT'\nGROUP BY strftime('%Y-%m', txn_date)\nORDER BY thang;",
        caption: 'Chỉ tiền gửi, theo tháng',
      },
      {
        kind: 'tip',
        text: "`date('now')` là ngày hôm nay trên máy đang chạy SQL. `julianday(a) - julianday(b)` là số ngày giữa hai mốc. Tuổi tính kiểu này chỉ là ước lượng, vì năm nhuận không đều.",
      },
    ],
  },
  {
    slug: 'subquery',
    title: 'Truy vấn con',
    level: 'Nâng cao',
    summary:
      'Truy vấn lồng trong truy vấn: so với trung bình, IN / NOT IN, NOT EXISTS, và truy vấn tương quan.',
    blocks: [
      {
        kind: 'text',
        text: 'Truy vấn con là một `SELECT` đặt trong ngoặc, bên trong câu khác. Câu trong ngoặc chạy ra một giá trị hoặc một tập dòng. Câu bên ngoài dùng kết quả đó để lọc. Đọc từ trong ra ngoài.',
      },
      { kind: 'heading', text: 'Truy vấn vô hướng: một giá trị' },
      {
        kind: 'text',
        text: 'Khi chỗ cần một con số, truy vấn con phải trả về đúng một cột và đúng một dòng. `AVG`, `MAX`, `MIN`, `SUM`, `COUNT` đều hợp lệ. Câu dưới so từng số dư với một ngưỡng được tính từ chính bảng `accounts`.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number, balance\nFROM accounts\nWHERE balance > (SELECT AVG(balance) FROM accounts)\nORDER BY balance DESC;',
        caption: 'Cao hơn số dư trung bình toàn hệ thống',
      },
      {
        kind: 'text',
        text: 'Cùng kiểu đó để tìm đúng tài khoản cao nhất: so sánh với `MAX`, không cần `ORDER BY` nếu bạn muốn mọi tài khoản hòa mức cao nhất. Cũng có thể đặt truy vấn vô hướng ngay trong `SELECT` để dựng một dòng báo cáo gồm nhiều chỉ số độc lập.',
      },
      {
        kind: 'code',
        sql: 'SELECT\n  (SELECT COUNT(*) FROM customers) AS so_kh,\n  (SELECT COUNT(*) FROM accounts)   AS so_tk,\n  (SELECT SUM(balance) FROM accounts) AS tong_so_du;',
        caption: 'Ba câu hỏi, một dòng kết quả',
      },
      { kind: 'heading', text: 'IN và NOT IN' },
      {
        kind: 'text',
        text: '`IN (SELECT ...)` đúng khi giá trị bên ngoài có mặt trong tập bên trong. `NOT IN` đúng khi không có mặt. Tập đó phải là một cột. Ví dụ khách chưa từng vay là khách có `customer_id` không nằm trong cột `customer_id` của `loans`.',
      },
      {
        kind: 'code',
        sql: 'SELECT full_name\nFROM customers\nWHERE customer_id NOT IN (SELECT customer_id FROM loans);',
      },
      {
        kind: 'text',
        text: 'Có một bẫy: nếu tập con chứa dù chỉ một `NULL`, `NOT IN` không còn dòng nào đúng, vì so sánh với `NULL` là không xác định. `customer_id` trong dữ liệu này không `NULL` nên câu trên an toàn. Khi cột có thể trống, dùng `NOT EXISTS` thay cho `NOT IN`.',
      },
      { kind: 'heading', text: 'EXISTS và NOT EXISTS' },
      {
        kind: 'text',
        text: '`EXISTS` không quan tâm truy vấn con trả về cột gì. Nó chỉ hỏi “có ít nhất một dòng không?”. Quy ước viết `SELECT 1`. Câu con được phép dùng cột của câu ngoài: đó là truy vấn tương quan, chạy lại cho từng dòng bên ngoài.',
      },
      {
        kind: 'code',
        sql: 'SELECT a.account_number\nFROM accounts a\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM cards c\n  WHERE c.account_id = a.account_id\n);',
        caption: 'Tài khoản chưa có thẻ nào',
      },
      {
        kind: 'text',
        text: 'Cùng ý “chưa từng” nhưng đường đi dài hơn: một khách chưa từng rút tiền nghĩa là không tồn tại giao dịch `WITHDRAWAL` trên bất kỳ tài khoản nào của họ. Truy vấn con phải tự nối `accounts` với `transactions`, rồi buộc `a.customer_id` bằng khách đang xét.',
      },
      {
        kind: 'code',
        sql: "SELECT c.full_name\nFROM customers c\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM accounts a\n  JOIN transactions t ON t.account_id = a.account_id\n  WHERE a.customer_id = c.customer_id\n    AND t.txn_type = 'WITHDRAWAL'\n);",
      },
      { kind: 'heading', text: 'So với trung bình của chính nhóm đó' },
      {
        kind: 'text',
        text: '“Cao hơn trung bình toàn hệ thống” chỉ cần một số. “Cao hơn trung bình của cùng loại tài khoản” thì mỗi dòng ngoài có một ngưỡng khác nhau. Truy vấn con nhận `account_type` của dòng đang xét. Bí danh `a` là dòng ngoài, `a2` là bản sao dùng để tính trung bình, tránh nhập hai bảng cùng tên.',
      },
      {
        kind: 'code',
        sql: 'SELECT a.account_number, a.account_type, a.balance\nFROM accounts a\nWHERE a.balance > (\n  SELECT AVG(a2.balance)\n  FROM accounts a2\n  WHERE a2.account_type = a.account_type\n);',
      },
      {
        kind: 'tip',
        text: 'Truy vấn con trong `FROM` được đặt bí danh và dùng như một bảng. Khi câu đã có tên riêng và được dùng nhiều lần, viết thành CTE ở bài sau sẽ dễ đọc hơn là lồng thêm một tầng ngoặc.',
      },
    ],
  },
  {
    slug: 'cte-union',
    title: 'CTE và UNION',
    level: 'Nâng cao',
    summary:
      'WITH đặt tên cho một kết quả để dùng lại. UNION chồng hai kết quả thành một danh sách.',
    blocks: [
      {
        kind: 'text',
        text: 'CTE (Common Table Expression) bắt đầu bằng `WITH tên AS (SELECT ...)`. Phần trong ngoặc không chạy một mình để in ra. Nó tạo một bảng tạm, chỉ sống trong câu lệnh đó, và câu `SELECT` phía sau đọc bảng tạm như đọc bảng thật. Dùng CTE khi cùng một kết quả phải xuất hiện hai lần, hoặc khi câu lồng quá sâu để đọc.',
      },
      {
        kind: 'text',
        text: 'Bài toán điển hình: tổng số dư từng chi nhánh, rồi chỉ giữ chi nhánh có tổng cao hơn trung bình của các tổng đó. Trung bình phải tính trên kết quả đã gom, không phải trên từng tài khoản. Đặt kết quả gom vào `bt`, rồi vừa đọc `bt` vừa lấy `AVG(tong)` của chính `bt`.',
      },
      {
        kind: 'code',
        sql: 'WITH bt AS (\n  SELECT b.branch_name AS branch_name,\n         SUM(a.balance) AS tong\n  FROM accounts a\n  JOIN branches b ON b.branch_id = a.branch_id\n  GROUP BY b.branch_name\n)\nSELECT branch_name, tong\nFROM bt\nWHERE tong > (SELECT AVG(tong) FROM bt)\nORDER BY tong DESC;',
        caption: 'Chi nhánh có tổng số dư trên mức trung bình các chi nhánh',
      },
      {
        kind: 'text',
        text: 'Có thể khai báo nhiều CTE, ngăn bằng dấu phẩy: `WITH a AS (...), b AS (...) SELECT ...`. CTE sau được phép đọc CTE trước. Không có dấu phẩy giữa CTE và câu `SELECT` chính.',
      },
      { kind: 'heading', text: 'UNION chồng hai tập' },
      {
        kind: 'text',
        text: '`UNION` ghép các dòng của hai câu `SELECT` thành một danh sách, rồi xóa dòng trùng. Hai câu phải có cùng số cột, và các cột tương ứng nên cùng kiểu. Tên cột của kết quả lấy theo câu thứ nhất.',
      },
      {
        kind: 'text',
        text: 'Thành phố của khách và thành phố của chi nhánh nằm ở hai bảng. `UNION` cho một danh sách nơi ngân hàng có mặt hoặc có khách, mỗi thành phố một lần. `UNION ALL` giữ nguyên dòng trùng và nhanh hơn khi bạn chắc không cần loại trùng, hoặc khi bạn cố tình đếm cả hai phía.',
      },
      {
        kind: 'code',
        sql: 'SELECT city FROM customers\nUNION\nSELECT city FROM branches\nORDER BY city;',
        caption: 'Mỗi thành phố một dòng, dù xuất hiện ở cả hai bảng',
      },
      {
        kind: 'tip',
        text: '`ORDER BY` của `UNION` đặt ở cuối cùng và áp cho cả danh sách đã ghép, không đặt `ORDER BY` riêng trong từng vế trừ khi vế đó có `LIMIT`.',
      },
    ],
  },
  {
    slug: 'window',
    title: 'Hàm cửa sổ',
    level: 'Nâng cao',
    summary:
      'ROW_NUMBER, RANK và SUM lũy kế: tính trên từng dòng mà không gom mất các dòng như GROUP BY.',
    blocks: [
      {
        kind: 'text',
        text: '`GROUP BY` làm nhiều dòng thành một dòng. Hàm cửa sổ tính trên một “cửa sổ” các dòng nhưng vẫn giữ nguyên từng dòng gốc, chỉ thêm cột. Cú pháp là hàm, rồi `OVER (...)`. Bên trong `OVER`: `PARTITION BY` chia cửa sổ, `ORDER BY` xếp thứ tự trong cửa sổ.',
      },
      { kind: 'heading', text: 'ROW_NUMBER đánh số thứ tự' },
      {
        kind: 'text',
        text: '`ROW_NUMBER()` gán 1, 2, 3… theo thứ tự trong `OVER`. Không có `ORDER BY` trong `OVER` thì thứ tự không có nghĩa. Số dư cao nhất được hạng 1 khi sắp `balance DESC`.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number,\n       balance,\n       ROW_NUMBER() OVER (ORDER BY balance DESC) AS hang\nFROM accounts;',
        caption: 'Hạng trên toàn bộ tài khoản',
      },
      {
        kind: 'text',
        text: '`RANK()` cũng xếp hạng, nhưng hai dòng bằng nhau được cùng hạng, và hạng kế tiếp bị nhảy số. `ROW_NUMBER()` không bao giờ hòa: dòng nào cũng một số riêng, kể cả khi số dư bằng nhau. Bài tập trong khóa này dùng `ROW_NUMBER` khi cần hạng duy nhất và `RANK` khi xếp trong từng nhóm.',
      },
      { kind: 'heading', text: 'PARTITION BY là GROUP BY không làm mất dòng' },
      {
        kind: 'text',
        text: '`PARTITION BY account_type` xếp hạng lại từ đầu trong từng loại tài khoản. Tài khoản tiết kiệm có hạng 1 của tiết kiệm, tài khoản thanh toán có hạng 1 của thanh toán. Các dòng tài khoản vẫn còn đủ, không bị cụm thành một dòng mỗi loại.',
      },
      {
        kind: 'code',
        sql: 'SELECT account_number,\n       account_type,\n       balance,\n       RANK() OVER (\n         PARTITION BY account_type\n         ORDER BY balance DESC\n       ) AS hang\nFROM accounts\nORDER BY account_type, hang;',
      },
      { kind: 'heading', text: 'Tổng lũy kế' },
      {
        kind: 'text',
        text: '`SUM(amount) OVER (ORDER BY ...)` không phải tổng một lần của cả nhóm. Với mỗi dòng, nó cộng `amount` của dòng đó với mọi dòng đứng trước theo thứ tự đã khai báo. Thêm `txn_id` vào `ORDER BY` để hai giao dịch cùng ngày luôn có một thứ tự cố định.',
      },
      {
        kind: 'text',
        text: '`WHERE` lọc trước khi cửa sổ nhìn thấy dòng. Muốn sổ lũy kế của riêng tài khoản số 1 thì lọc `account_id` trước. Không viết điều kiện trên cột `luy_ke` trong cùng một `WHERE`, vì cột cửa sổ được tính sau `WHERE`. Muốn lọc theo hạng, hãy bọc câu này trong CTE rồi `WHERE hang = 1` ở ngoài.',
      },
      {
        kind: 'code',
        sql: 'SELECT txn_id,\n       txn_date,\n       amount,\n       SUM(amount) OVER (ORDER BY txn_date, txn_id) AS luy_ke\nFROM transactions\nWHERE account_id = 1;',
        caption: 'Số dư chạy của các giao dịch thuộc tài khoản 1',
      },
      {
        kind: 'tip',
        text: 'Nhìn `OVER` là biết đang dùng hàm cửa sổ. Không có `OVER`, `SUM` và `COUNT` là hàm tổng hợp và sẽ gom dòng. Các bài tập hạng, top trong từng nhóm và số lũy kế đều cần `OVER`.',
      },
    ],
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
