-- Buat tabel Jabatan Karyawan (Employee Roles)
CREATE TABLE employee_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel Karyawan (Employees)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES employee_roles(id) ON DELETE SET NULL,
    phone VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) DEFAULT 'staff123',
    status VARCHAR(50) DEFAULT 'Aktif',
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel Riwayat Penggajian (Payrolls)
CREATE TABLE payrolls (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    period VARCHAR(100) NOT NULL,
    notes TEXT,
    reference_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tambahkan RLS (Row Level Security) - Public untuk development
ALTER TABLE employee_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Access for employee_roles" ON employee_roles FOR ALL USING (true);
CREATE POLICY "Public Access for employees" ON employees FOR ALL USING (true);
CREATE POLICY "Public Access for payrolls" ON payrolls FOR ALL USING (true);

-- Insert Data Awal (Opsional)
INSERT INTO employee_roles (name, base_salary) VALUES 
('Admin', 6000000),
('Manager', 5000000),
('Barista', 3500000),
('Kasir', 3000000),
('Waiter', 2500000);

INSERT INTO employees (name, role_id, phone, email, status, joined_date) VALUES 
('Budi Santoso', 1, '081234567890', 'budi@example.com', 'Aktif', '2023-01-15'),
('Siti Aminah', 2, '089876543210', 'siti@example.com', 'Aktif', '2023-03-10'),
('Agus Pratama', 3, '085612349876', 'agus@example.com', 'Aktif', '2023-05-20');
