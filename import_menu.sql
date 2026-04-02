-- SQL Script to import menu items
-- First, ensure categories exist
INSERT INTO categories (name) VALUES 
('Coffee Milk Based'),
('Black Coffee'),
('Non Coffee'),
('Manual Brew'),
('Mocktail'),
('Snack'),
('Main Course'),
('Pastry Dan Dessert')
ON CONFLICT (name) DO NOTHING;

-- Insert Products
-- Coffee Milk Based
INSERT INTO products (name, description, price, category_id, image_url, is_available, customization_groups) VALUES
('Caramel Machiato', 'Freshmilk, Espresso, Sirup Caramel, Saus Caramel, Dan Toping Cream Cheese', 28000, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&q=80', true, '[]'),
('Kopi Susu Bitts', 'Susu Segar, Espresso, Dan Gula Aren', 22000, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80', true, '[]'),
('Cafe Latte', 'Freshmilk, Espresso.', 22000, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1570968015849-0497e0a84d20?w=500&q=80', true, '[]'),
('Cappuccino', 'Fresh Milk, Espresso, Taburan Bubuk Coklat.', 22000, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80', true, '[]'),
('Moccacchino', 'Freshmilk, saus coklat, espresso.', 22000, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&q=80', true, '[]'),
('Coconut Latte', 'Kopi Susu Yang Dipadukan Dengan Manis Susu Kelapa Dan Gula Aren', 25000, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80', true, '[]'),
('Es Kopi 2 Tak', 'Es kopi arabika creamy', 30000, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80', true, '[]'),
('Affogato', 'Vanilla Ice Cream Di Tambah Espresso', 20500, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500&q=80', true, '[]'),
('Creamy Butterscotch Latte', 'Varian Kopi Susu Yang Creamy Dipadukan Dengan Sirup Butterscotch', 25000, (SELECT id FROM categories WHERE name = 'Coffee Milk Based'), 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=500&q=80', true, '[]'),

-- Black Coffee
('Black Coffee', 'Espresso Black Coffee Shot', 18000, (SELECT id FROM categories WHERE name = 'Black Coffee'), 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80', true, '[]'),
('Americano', 'Shot Espresso Dan Air', 18000, (SELECT id FROM categories WHERE name = 'Black Coffee'), 'https://images.unsplash.com/photo-1551030173-122ad3d81ca7?w=500&q=80', true, '[]'),
('Tubruk', 'Varian kopi hitam dengan cara seduh manual', 19000, (SELECT id FROM categories WHERE name = 'Black Coffee'), 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=500&q=80', true, '[]'),

-- Non Coffee
('Chocolate Milk', 'Klasik Dark Coklat Dipadukan Dengan Susu Segar', 20500, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1541658016709-8273558a9bc9?w=500&q=80', true, '[]'),
('Wonka Chocolate Cheese', 'Premium Dark Coklat Dicampur Susu Segar', 24000, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1544787210-228394c3d3e2?w=500&q=80', true, '[]'),
('Charcoal Latte', 'Minuman yang berbahan dasar arang hitam dengan rasa yang manis dan creamy', 23000, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&q=80', true, '[]'),
('Red Velvet', 'Minuman Susu Dengan Rasa Coklat Merah', 23000, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1616508049352-76d74b12771f?w=500&q=80', true, '[]'),
('Thai Tea', 'Teh Hitam Thailand Di Campur Susu Dan Krimer', 20500, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500&q=80', true, '[]'),
('Green Tea', 'Teh Hijau Dicampur Susu Dan Krimer', 20500, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&q=80', true, '[]'),
('Earl Grey Milk Tea', 'Teh Hitam Yang Dipadukan Dengan Susu Yang Creamy Dan Beraroma Bergamot', 21500, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500&q=80', true, '[]'),
('Cookies N Cream', 'Minuman creamy dengan rasa cookies di tambah topping creamcheese dan oreo', 25000, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80', true, '[]'),
('Matcha', 'Minuman Susu Dengan Campuran Powder Teh Hijau Yang Mamis Dan Creamy', 23000, (SELECT id FROM categories WHERE name = 'Non Coffee'), 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&q=80', true, '[]'),

-- Manual Brew
('V60', 'Secialty coffee arabika yang di seduh dengan metode pour over', 27500, (SELECT id FROM categories WHERE name = 'Manual Brew'), 'https://images.unsplash.com/photo-1544787210-228394c3d3e2?w=500&q=80', true, '[]'),
('Japanese Iced Coffee', 'Specialty Coffee Arabika Dengan Metode Seduh Pour Over Ala Jepang', 27500, (SELECT id FROM categories WHERE name = 'Manual Brew'), 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80', true, '[]'),
('Vietnamese', 'Kopi Seduh Manual Menggunakan Alat Vietnam Drip Dengan Campuran Susu Kental Manis', 21500, (SELECT id FROM categories WHERE name = 'Manual Brew'), 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=500&q=80', true, '[]'),

-- Mocktail
('Red Nikaya', 'Minuman Soda Dengan Tambahan Sirup Rasa Delima Dan Peach Ditambah Toping Selasih', 22000, (SELECT id FROM categories WHERE name = 'Mocktail'), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', true, '[]'),
('Talocan', 'Minuman dengan citarasa campuran nanas dan kelapa', 25000, (SELECT id FROM categories WHERE name = 'Mocktail'), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', true, '[]'),
('Bubble Gum Freeze', 'Minuman Bersoda Dengan Rasa Permen Karet Yang Unik', 23000, (SELECT id FROM categories WHERE name = 'Mocktail'), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', true, '[]'),
('Tropical Haze', 'Minuman soda rasa blueberry dipadukan dengan sirup kiwi dan sirup pisang, dengan toping potongan nanas dam selasih.', 22000, (SELECT id FROM categories WHERE name = 'Mocktail'), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', true, '[]'),
('Red Dragon', 'Minuman Bersoda Dari Buah Naga Dan Sedikit Rasa Asam Yang Segar', 23000, (SELECT id FROM categories WHERE name = 'Mocktail'), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', true, '[]'),
('Coco Melon', 'Minuman Dengan Rasa Kelapa Dan Melon Dengan Topping Butiran Cookies Rasa Melon', 23000, (SELECT id FROM categories WHERE name = 'Mocktail'), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80', true, '[]'),

-- Snack
('Keju Aroma', 'Keju Cheddar Dibalut Kulit Lumpia Renyah Dengan Toping Saus Karamel', 18000, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&q=80', true, '[]'),
('Kentang Goreng', 'Kentang Goreng Dengan Saus Sambal Dengan Taburan Oregano', 24000, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', true, '[]'),
('Nachos N Cheese', 'Tortilla Chips Dengan Taburan Bubuk Keju Dan Saus Keju Khas Bitts', 18000, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&q=80', true, '[]'),
('Rissole Chicken Cream', 'Risol Dengan Isian Cream Daging, Makaroni Dan Telur.', 20500, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&q=80', true, '[]'),
('Animal Fries', 'Kentang, Chicke Pop Corn, Katsuboshi', 26500, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', true, '[]'),
('Mix Platter', 'Kentang, Sosis Dan Tortilla Chips', 28000, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', true, '[]'),
('Churos', 'Kue Kering Khas Spanyol Dengan Cocolan Saus Karamel Khas Bitts', 18000, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&q=80', true, '[]'),
('Chicken Wings', 'Sayap Ayam Dibalut Tepung Dicampur Dengan Sambal Spicy Khan Bitts', 29000, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80', true, '[]'),
('Baso Tahu', 'Tahu Dengan Isian Bakso Daging', 21500, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&q=80', true, '[]'),
('Dimsum Goreng', 'Kulit Pangsit Dengan Isian Daging', 23000, (SELECT id FROM categories WHERE name = 'Snack'), 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&q=80', true, '[]'),

-- Main Course
('Chicke Garage', 'Potongan ayam dadu di balut tepung, dengan tambahan saus khas bitts + nasi', 28000, (SELECT id FROM categories WHERE name = 'Main Course'), 'https://images.unsplash.com/photo-1562607394-58873a7d5d63?w=500&q=80', true, '[]'),
('Spicy Chicken Cheese', 'Potongan Ayam Dada Tanpa Tulang Dengan Saus Spicy Khas Bitts + Nasi', 28000, (SELECT id FROM categories WHERE name = 'Main Course'), 'https://images.unsplash.com/photo-1562607394-58873a7d5d63?w=500&q=80', true, '[]'),
('Chicken Katsu', 'Potongan Ayam Dada Tanpa Tulang Dengan Tambahan Salad Dan Saus Mayonaise + Nasi', 28000, (SELECT id FROM categories WHERE name = 'Main Course'), 'https://images.unsplash.com/photo-1562607394-58873a7d5d63?w=500&q=80', true, '[]'),
('Ayam Serundeng Sambal Ijo', 'Ayam Goreng Dengan Taburan Serundeng + Nasi', 31000, (SELECT id FROM categories WHERE name = 'Main Course'), 'https://images.unsplash.com/photo-1562607394-58873a7d5d63?w=500&q=80', true, '[]'),

-- Pastry Dan Dessert
('Milk Purin', 'Puding susu manis dan silky khas bitts', 19000, (SELECT id FROM categories WHERE name = 'Pastry Dan Dessert'), 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80', true, '[]'),
('Croissant Choco Cream', '', 20500, (SELECT id FROM categories WHERE name = 'Pastry Dan Dessert'), 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', true, '[]'),
('Croissant Cheese', '', 20500, (SELECT id FROM categories WHERE name = 'Pastry Dan Dessert'), 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', true, '[]'),
('Croffle', '', 20500, (SELECT id FROM categories WHERE name = 'Pastry Dan Dessert'), 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', true, '[]'),
('Croissant Cream Almond', '', 20500, (SELECT id FROM categories WHERE name = 'Pastry Dan Dessert'), 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', true, '[]'),
('Souffle Cheesecake', 'Cake Rasa Keju Dengan Tekstur Yang Lembut', 19000, (SELECT id FROM categories WHERE name = 'Pastry Dan Dessert'), 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80', true, '[]');
