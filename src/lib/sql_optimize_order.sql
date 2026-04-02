
-- Fungsi untuk memproses pesanan secara cepat dan aman (Atomic & Fast)
CREATE OR REPLACE FUNCTION process_order(
  p_items JSONB,
  p_total NUMERIC,
  p_payment_method TEXT,
  p_table_number TEXT,
  p_customer_name TEXT
) RETURNS JSONB AS $$
DECLARE
  v_order_id INT;
  v_items_summary TEXT;
  v_result JSONB;
BEGIN
  -- 1. Buat ringkasan item
  SELECT string_agg(name || ' (x' || quantity || ')', ', ') INTO v_items_summary
  FROM jsonb_to_recordset(p_items) AS x(name TEXT, quantity INT);

  -- 2. Masukkan ke tabel orders
  INSERT INTO orders (total_amount, items_summary, payment_method, table_number, customer_name, status)
  VALUES (p_total, v_items_summary, p_payment_method, p_table_number, p_customer_name, 'Menunggu')
  RETURNING id INTO v_order_id;

  -- 3. Masukkan ke tabel order_items
  INSERT INTO order_items (order_id, product_id, name, quantity, price, customizations, notes)
  SELECT 
    v_order_id, 
    (item->>'id')::INT, 
    item->>'name', 
    (item->>'quantity')::INT, 
    (item->>'price')::NUMERIC, 
    COALESCE(item->'customizations', '[]'::JSONB), 
    item->>'notes'
  FROM jsonb_array_elements(p_items) AS item;

  -- 4. Catat Transaksi Keuangan
  INSERT INTO financial_transactions (type, category, amount, payment_method, description, reference_id)
  VALUES ('INCOME', 'Penjualan', p_total, p_payment_method, 'Order #' || v_order_id, v_order_id::TEXT);

  -- 5. Update Stok Bahan Baku Secara Massal (Banyak bahan sekaligus)
  UPDATE ingredients i
  SET stock = i.stock - sub.total_used
  FROM (
    SELECT r.ingredient_id, SUM(r.qty * (item->>'quantity')::INT) as total_used
    FROM jsonb_array_elements(p_items) AS item
    JOIN product_ingredients r ON r.product_id = (item->>'id')::INT
    GROUP BY r.ingredient_id
  ) AS sub
  WHERE i.id = sub.ingredient_id;

  -- 6. Masukkan ke Stock Movements Secara Massal
  INSERT INTO stock_movements (ingredient_id, ingredient_name, type, quantity, reason, reference)
  SELECT 
    r.ingredient_id, 
    ing.name, 
    'OUT', 
    r.qty * (item->>'quantity')::INT, 
    'Penjualan: ' || (item->>'name'), 
    'Order #' || v_order_id
  FROM jsonb_array_elements(p_items) AS item
  JOIN product_ingredients r ON r.product_id = (item->>'id')::INT
  JOIN ingredients ing ON ing.id = r.ingredient_id;

  -- Susun hasil untuk dikembalikan
  SELECT jsonb_build_object(
    'id', v_order_id,
    'total_amount', p_total,
    'items_summary', v_items_summary,
    'payment_method', p_payment_method,
    'table_number', p_table_number,
    'customer_name', p_customer_name,
    'status', 'Menunggu',
    'created_at', now()
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
