/**
 * Cơ sở dữ liệu mẫu: NGHIỆP VỤ NGÂN HÀNG ("DemoBank").
 * Toàn bộ chạy trong trình duyệt bằng SQLite (sql.js) nên bạn có thể thử
 * tự do — bấm "Khôi phục dữ liệu" bất cứ lúc nào để trở về trạng thái gốc.
 */

export const SCHEMA_SQL = `
-- ============ CẤU TRÚC BẢNG ============
CREATE TABLE branches (
  branch_id   INTEGER PRIMARY KEY,
  branch_code TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  city        TEXT,
  opened_date TEXT
);

CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  full_name   TEXT NOT NULL,
  branch_id   INTEGER REFERENCES branches(branch_id),
  role        TEXT,
  salary      REAL,
  manager_id  INTEGER REFERENCES employees(employee_id),
  hire_date   TEXT
);

CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  full_name   TEXT NOT NULL,
  national_id TEXT,
  email       TEXT,
  phone       TEXT,
  city        TEXT,
  birth_date  TEXT,
  created_at  TEXT
);

CREATE TABLE accounts (
  account_id     INTEGER PRIMARY KEY,
  account_number TEXT NOT NULL UNIQUE,
  customer_id    INTEGER NOT NULL REFERENCES customers(customer_id),
  branch_id      INTEGER NOT NULL REFERENCES branches(branch_id),
  account_type   TEXT NOT NULL,
  currency       TEXT NOT NULL DEFAULT 'VND',
  balance        REAL NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'ACTIVE',
  opened_date    TEXT
);

CREATE TABLE cards (
  card_id     INTEGER PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES accounts(account_id),
  card_number TEXT NOT NULL,
  card_type   TEXT NOT NULL,
  brand       TEXT,
  status      TEXT NOT NULL DEFAULT 'ACTIVE',
  issued_date TEXT,
  expiry_date TEXT
);

CREATE TABLE loans (
  loan_id       INTEGER PRIMARY KEY,
  customer_id   INTEGER NOT NULL REFERENCES customers(customer_id),
  branch_id     INTEGER NOT NULL REFERENCES branches(branch_id),
  loan_type     TEXT,
  principal     REAL NOT NULL,
  interest_rate REAL NOT NULL,
  term_months   INTEGER,
  start_date    TEXT,
  status        TEXT NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE transactions (
  txn_id      INTEGER PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES accounts(account_id),
  txn_date    TEXT NOT NULL,
  txn_type    TEXT NOT NULL,
  channel     TEXT,
  amount      REAL NOT NULL,
  description TEXT
);

-- ============ DỮ LIỆU MẪU ============
INSERT INTO branches (branch_id, branch_code, branch_name, city, opened_date) VALUES
  (1, 'HN001', 'Chi nhánh Hà Nội',      'Hà Nội',      '2015-03-01'),
  (2, 'HCM01', 'Chi nhánh Hồ Chí Minh', 'Hồ Chí Minh', '2015-06-15'),
  (3, 'DN001', 'Chi nhánh Đà Nẵng',     'Đà Nẵng',     '2017-01-20'),
  (4, 'HP001', 'Chi nhánh Hải Phòng',   'Hải Phòng',   '2018-09-05'),
  (5, 'CT001', 'Chi nhánh Cần Thơ',     'Cần Thơ',     '2019-11-11');

INSERT INTO employees (employee_id, full_name, branch_id, role, salary, manager_id, hire_date) VALUES
  (1, 'Trần Quốc Toản', 1, 'Branch Manager', 45000000, NULL, '2015-03-01'),
  (2, 'Nguyễn Thị Mai', 1, 'Teller',         18000000, 1,    '2016-04-10'),
  (3, 'Lê Văn Hùng',    2, 'Branch Manager', 46000000, NULL, '2015-06-15'),
  (4, 'Phạm Thu Hà',    2, 'Loan Officer',   22000000, 3,    '2017-08-01'),
  (5, 'Đỗ Minh Tuấn',   3, 'Branch Manager', 42000000, NULL, '2017-01-20'),
  (6, 'Vũ Thị Lan',     4, 'Teller',         17000000, NULL, '2018-09-05');

INSERT INTO customers (customer_id, full_name, national_id, email, phone, city, birth_date, created_at) VALUES
  (1,  'Nguyễn Văn An', '001199012345', 'an.nguyen@email.com',  '0901000001', 'Hà Nội',      '1990-02-15', '2020-01-10'),
  (2,  'Trần Thị Bình', '001288023456', 'binh.tran@email.com',  '0901000002', 'Hồ Chí Minh', '1988-07-20', '2020-03-22'),
  (3,  'Lê Văn Cường',  '001192034567', 'cuong.le@email.com',   '0901000003', 'Đà Nẵng',     '1992-11-05', '2020-05-18'),
  (4,  'Phạm Thị Dung', '001295045678', 'dung.pham@email.com',  '0901000004', 'Hà Nội',      '1995-03-30', '2021-02-14'),
  (5,  'Hoàng Văn Em',  '001285056789', NULL,                   '0901000005', 'Hải Phòng',   '1985-09-12', '2021-06-01'),
  (6,  'Vũ Thị Hoa',    '001293067890', 'hoa.vu@email.com',     '0901000006', 'Hồ Chí Minh', '1993-12-25', '2021-09-09'),
  (7,  'Đặng Văn Khôi', '001290078901', 'khoi.dang@email.com',  '0901000007', 'Cần Thơ',     '1990-06-18', '2022-01-20'),
  (8,  'Bùi Thị Lan',   '001297089012', 'lan.bui@email.com',    '0901000008', 'Hà Nội',      '1997-04-08', '2022-04-15'),
  (9,  'Đỗ Văn Minh',   '001289090123', 'minh.do@email.com',    '0901000009', 'Đà Nẵng',     '1989-10-02', '2022-08-30'),
  (10, 'Ngô Thị Nga',   '001296101234', 'nga.ngo@email.com',    '0901000010', 'Hồ Chí Minh', '1996-01-17', '2023-02-11'),
  (11, 'Phan Văn Phú',  '001291112345', 'phu.phan@email.com',   '0901000011', 'Hà Nội',      '1991-05-23', '2023-05-05'),
  (12, 'Lý Thị Quỳnh',  '001294123456', NULL,                   '0901000012', 'Hải Phòng',   '1994-08-14', '2023-07-19');

INSERT INTO accounts (account_id, account_number, customer_id, branch_id, account_type, currency, balance, status, opened_date) VALUES
  (1,  'ACC0001', 1,  1, 'SAVINGS',  'VND', 150000000,  'ACTIVE',  '2020-01-15'),
  (2,  'ACC0002', 1,  1, 'CHECKING', 'VND', 25000000,   'ACTIVE',  '2020-02-01'),
  (3,  'ACC0003', 2,  2, 'SAVINGS',  'VND', 320000000,  'ACTIVE',  '2020-04-01'),
  (4,  'ACC0004', 3,  3, 'CHECKING', 'VND', 12000000,   'ACTIVE',  '2020-06-10'),
  (5,  'ACC0005', 3,  3, 'SAVINGS',  'USD', 5000,       'ACTIVE',  '2020-07-01'),
  (6,  'ACC0006', 4,  1, 'SAVINGS',  'VND', 85000000,   'ACTIVE',  '2021-03-01'),
  (7,  'ACC0007', 5,  4, 'CHECKING', 'VND', 4300000,    'DORMANT', '2021-06-15'),
  (8,  'ACC0008', 6,  2, 'SAVINGS',  'VND', 210000000,  'ACTIVE',  '2021-10-01'),
  (9,  'ACC0009', 7,  5, 'CHECKING', 'VND', 9800000,    'ACTIVE',  '2022-02-05'),
  (10, 'ACC0010', 8,  1, 'SAVINGS',  'VND', 46000000,   'ACTIVE',  '2022-05-01'),
  (11, 'ACC0011', 9,  3, 'CREDIT',   'VND', -15000000,  'ACTIVE',  '2022-09-10'),
  (12, 'ACC0012', 10, 2, 'SAVINGS',  'VND', 178000000,  'ACTIVE',  '2023-03-01'),
  (13, 'ACC0013', 2,  2, 'CHECKING', 'USD', 12000,      'ACTIVE',  '2021-01-11'),
  (14, 'ACC0014', 11, 1, 'SAVINGS',  'VND', 5000000,    'CLOSED',  '2023-05-10');

INSERT INTO cards (card_id, account_id, card_number, card_type, brand, status, issued_date, expiry_date) VALUES
  (1, 2,  '9704-xxxx-0002', 'DEBIT',  'NAPAS',      'ACTIVE',  '2020-02-05', '2025-02-28'),
  (2, 4,  '9704-xxxx-0004', 'DEBIT',  'NAPAS',      'ACTIVE',  '2020-06-15', '2025-06-30'),
  (3, 7,  '4111-xxxx-0007', 'DEBIT',  'VISA',       'BLOCKED', '2021-06-20', '2026-06-30'),
  (4, 9,  '5500-xxxx-0009', 'DEBIT',  'MASTERCARD', 'ACTIVE',  '2022-02-10', '2027-02-28'),
  (5, 11, '4111-xxxx-0011', 'CREDIT', 'VISA',       'ACTIVE',  '2022-09-15', '2027-09-30'),
  (6, 2,  '4111-xxxx-0022', 'CREDIT', 'VISA',       'ACTIVE',  '2021-01-01', '2026-01-31'),
  (7, 3,  '9704-xxxx-0003', 'DEBIT',  'NAPAS',      'ACTIVE',  '2020-04-05', '2025-04-30'),
  (8, 8,  '5500-xxxx-0008', 'DEBIT',  'MASTERCARD', 'EXPIRED', '2019-10-01', '2024-10-31');

INSERT INTO loans (loan_id, customer_id, branch_id, loan_type, principal, interest_rate, term_months, start_date, status) VALUES
  (1, 1, 1, 'HOME',     1200000000, 8.5,   240, '2021-05-01', 'ACTIVE'),
  (2, 2, 2, 'AUTO',     600000000,  9.0,   60,  '2022-03-15', 'ACTIVE'),
  (3, 3, 3, 'PERSONAL', 80000000,   14.5,  24,  '2023-01-10', 'ACTIVE'),
  (4, 6, 2, 'BUSINESS', 2500000000, 10.25, 120, '2021-11-20', 'ACTIVE'),
  (5, 8, 1, 'PERSONAL', 50000000,   15.0,  12,  '2022-06-01', 'PAID'),
  (6, 9, 3, 'AUTO',     450000000,  9.5,   48,  '2023-04-01', 'DEFAULT');

INSERT INTO transactions (txn_id, account_id, txn_date, txn_type, channel, amount, description) VALUES
  (1,  1,  '2024-01-05', 'DEPOSIT',    'BRANCH', 50000000,  'Gửi tiết kiệm'),
  (2,  1,  '2024-01-20', 'INTEREST',   'ONLINE', 520000,    'Lãi tháng 1'),
  (3,  2,  '2024-01-22', 'WITHDRAWAL', 'ATM',    2000000,   'Rút ATM'),
  (4,  2,  '2024-02-01', 'PAYMENT',    'POS',    1500000,   'Thanh toán POS'),
  (5,  3,  '2024-02-03', 'DEPOSIT',    'BRANCH', 100000000, 'Nộp tiền mặt'),
  (6,  3,  '2024-02-10', 'TRANSFER',   'ONLINE', 30000000,  'Chuyển khoản'),
  (7,  4,  '2024-02-12', 'WITHDRAWAL', 'ATM',    3000000,   'Rút ATM'),
  (8,  5,  '2024-02-15', 'DEPOSIT',    'BRANCH', 2000,      'Nộp USD'),
  (9,  6,  '2024-02-18', 'DEPOSIT',    'ONLINE', 20000000,  'Nhận lương'),
  (10, 8,  '2024-02-20', 'INTEREST',   'ONLINE', 700000,    'Lãi tháng 2'),
  (11, 2,  '2024-03-01', 'FEE',        'ONLINE', 11000,     'Phí dịch vụ'),
  (12, 9,  '2024-03-05', 'WITHDRAWAL', 'ATM',    1500000,   'Rút ATM'),
  (13, 10, '2024-03-08', 'DEPOSIT',    'BRANCH', 40000000,  'Gửi tiết kiệm'),
  (14, 11, '2024-03-10', 'PAYMENT',    'POS',    5000000,   'Quẹt thẻ tín dụng'),
  (15, 3,  '2024-03-12', 'WITHDRAWAL', 'ATM',    5000000,   'Rút ATM'),
  (16, 12, '2024-03-15', 'DEPOSIT',    'ONLINE', 80000000,  'Chuyển khoản đến'),
  (17, 1,  '2024-03-20', 'TRANSFER',   'ONLINE', 10000000,  'Chuyển cho người thân'),
  (18, 8,  '2024-03-25', 'WITHDRAWAL', 'BRANCH', 15000000,  'Rút tại quầy'),
  (19, 6,  '2024-04-01', 'FEE',        'ONLINE', 22000,     'Phí thường niên'),
  (20, 9,  '2024-04-03', 'DEPOSIT',    'ONLINE', 12000000,  'Nhận lương'),
  (21, 12, '2024-04-10', 'WITHDRAWAL', 'ATM',    3000000,   'Rút ATM'),
  (22, 3,  '2024-04-15', 'INTEREST',   'ONLINE', 1200000,   'Lãi quý 1'),
  (23, 13, '2024-04-18', 'DEPOSIT',    'BRANCH', 5000,      'Nộp USD'),
  (24, 2,  '2024-04-20', 'PAYMENT',    'POS',    800000,    'Thanh toán online');
`;

export interface ColumnInfo {
  name: string;
  type: string;
  note?: string;
}

export interface TableInfo {
  name: string;
  description: string;
  columns: ColumnInfo[];
}

/** Mô tả lược đồ để hiển thị ở thanh tham chiếu bên cạnh trình soạn thảo. */
export const SCHEMA_TABLES: TableInfo[] = [
  {
    name: 'branches',
    description: 'Chi nhánh',
    columns: [
      { name: 'branch_id', type: 'INTEGER', note: 'khóa chính' },
      { name: 'branch_code', type: 'TEXT' },
      { name: 'branch_name', type: 'TEXT' },
      { name: 'city', type: 'TEXT' },
      { name: 'opened_date', type: 'TEXT' },
    ],
  },
  {
    name: 'employees',
    description: 'Nhân viên',
    columns: [
      { name: 'employee_id', type: 'INTEGER', note: 'khóa chính' },
      { name: 'full_name', type: 'TEXT' },
      { name: 'branch_id', type: 'INTEGER', note: '→ branches' },
      { name: 'role', type: 'TEXT' },
      { name: 'salary', type: 'REAL' },
      { name: 'manager_id', type: 'INTEGER', note: '→ employees' },
      { name: 'hire_date', type: 'TEXT' },
    ],
  },
  {
    name: 'customers',
    description: 'Khách hàng',
    columns: [
      { name: 'customer_id', type: 'INTEGER', note: 'khóa chính' },
      { name: 'full_name', type: 'TEXT' },
      { name: 'national_id', type: 'TEXT', note: 'CCCD' },
      { name: 'email', type: 'TEXT', note: 'có thể NULL' },
      { name: 'phone', type: 'TEXT' },
      { name: 'city', type: 'TEXT' },
      { name: 'birth_date', type: 'TEXT' },
      { name: 'created_at', type: 'TEXT' },
    ],
  },
  {
    name: 'accounts',
    description: 'Tài khoản',
    columns: [
      { name: 'account_id', type: 'INTEGER', note: 'khóa chính' },
      { name: 'account_number', type: 'TEXT' },
      { name: 'customer_id', type: 'INTEGER', note: '→ customers' },
      { name: 'branch_id', type: 'INTEGER', note: '→ branches' },
      { name: 'account_type', type: 'TEXT', note: 'SAVINGS/CHECKING/CREDIT' },
      { name: 'currency', type: 'TEXT', note: 'VND/USD' },
      { name: 'balance', type: 'REAL', note: 'số dư' },
      { name: 'status', type: 'TEXT', note: 'ACTIVE/DORMANT/CLOSED' },
      { name: 'opened_date', type: 'TEXT' },
    ],
  },
  {
    name: 'cards',
    description: 'Thẻ',
    columns: [
      { name: 'card_id', type: 'INTEGER', note: 'khóa chính' },
      { name: 'account_id', type: 'INTEGER', note: '→ accounts' },
      { name: 'card_number', type: 'TEXT' },
      { name: 'card_type', type: 'TEXT', note: 'DEBIT/CREDIT' },
      { name: 'brand', type: 'TEXT', note: 'NAPAS/VISA/MASTERCARD' },
      { name: 'status', type: 'TEXT', note: 'ACTIVE/BLOCKED/EXPIRED' },
      { name: 'issued_date', type: 'TEXT' },
      { name: 'expiry_date', type: 'TEXT' },
    ],
  },
  {
    name: 'loans',
    description: 'Khoản vay',
    columns: [
      { name: 'loan_id', type: 'INTEGER', note: 'khóa chính' },
      { name: 'customer_id', type: 'INTEGER', note: '→ customers' },
      { name: 'branch_id', type: 'INTEGER', note: '→ branches' },
      { name: 'loan_type', type: 'TEXT', note: 'HOME/AUTO/PERSONAL/BUSINESS' },
      { name: 'principal', type: 'REAL', note: 'số tiền vay' },
      { name: 'interest_rate', type: 'REAL', note: 'lãi suất %' },
      { name: 'term_months', type: 'INTEGER' },
      { name: 'start_date', type: 'TEXT' },
      { name: 'status', type: 'TEXT', note: 'ACTIVE/PAID/DEFAULT' },
    ],
  },
  {
    name: 'transactions',
    description: 'Giao dịch',
    columns: [
      { name: 'txn_id', type: 'INTEGER', note: 'khóa chính' },
      { name: 'account_id', type: 'INTEGER', note: '→ accounts' },
      { name: 'txn_date', type: 'TEXT' },
      { name: 'txn_type', type: 'TEXT', note: 'DEPOSIT/WITHDRAWAL/TRANSFER/FEE/INTEREST/PAYMENT' },
      { name: 'channel', type: 'TEXT', note: 'ATM/ONLINE/BRANCH/POS' },
      { name: 'amount', type: 'REAL' },
      { name: 'description', type: 'TEXT' },
    ],
  },
];

export interface SampleQuery {
  label: string;
  sql: string;
}

/** Vài truy vấn mẫu để bấm nhanh trong trang Luyện tập. */
export const SAMPLE_QUERIES: SampleQuery[] = [
  {
    label: 'Tất cả tài khoản',
    sql: 'SELECT * FROM accounts;',
  },
  {
    label: 'Số dư theo chi nhánh',
    sql: `SELECT b.branch_name,
       SUM(a.balance) AS tong_so_du
FROM accounts a
JOIN branches b ON b.branch_id = a.branch_id
GROUP BY b.branch_name
ORDER BY tong_so_du DESC;`,
  },
  {
    label: 'Top khách hàng theo số dư',
    sql: `SELECT c.full_name,
       SUM(a.balance) AS tong_so_du
FROM customers c
JOIN accounts a ON a.customer_id = c.customer_id
GROUP BY c.full_name
ORDER BY tong_so_du DESC
LIMIT 5;`,
  },
  {
    label: 'Giao dịch theo tháng',
    sql: `SELECT strftime('%Y-%m', txn_date) AS thang,
       COUNT(*) AS so_giao_dich,
       SUM(amount) AS tong_tien
FROM transactions
GROUP BY strftime('%Y-%m', txn_date)
ORDER BY thang;`,
  },
];
