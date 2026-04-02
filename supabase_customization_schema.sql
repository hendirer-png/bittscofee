CREATE TABLE customization_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT false,
    min_selection INTEGER DEFAULT 0,
    max_selection INTEGER DEFAULT 1,
    options JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customization_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on customization_templates" ON customization_templates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on customization_templates" ON customization_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on customization_templates" ON customization_templates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on customization_templates" ON customization_templates FOR DELETE USING (true);
