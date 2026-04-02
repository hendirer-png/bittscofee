CREATE TABLE finance_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default finance categories
INSERT INTO finance_categories (name, type) VALUES 
('Penjualan', 'INCOME'), 
('Pembelian Bahan', 'EXPENSE'), 
('Operasional', 'EXPENSE'), 
('Lainnya', 'INCOME'), 
('Lainnya', 'EXPENSE');

-- Insert default units
INSERT INTO units (name) VALUES 
('Gram (g)'), 
('Kilogram (kg)'), 
('Mililiter (ml)'), 
('Liter (L)'), 
('Buah (pcs)'), 
('Pack');

-- Enable RLS
ALTER TABLE finance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Create policies for finance_categories
CREATE POLICY "Allow public read access on finance_categories" ON finance_categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on finance_categories" ON finance_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on finance_categories" ON finance_categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on finance_categories" ON finance_categories FOR DELETE USING (true);

-- Create policies for units
CREATE POLICY "Allow public read access on units" ON units FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on units" ON units FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on units" ON units FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on units" ON units FOR DELETE USING (true);

-- Make sure categories table has update and delete policies
CREATE POLICY "Allow public update access on categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on categories" ON categories FOR DELETE USING (true);
