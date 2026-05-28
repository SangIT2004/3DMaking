-- SCRIPT TẠO DỮ LIỆU MẪU CHO ĐỒ ÁN 3D ROOM STUDIO
-- Yêu cầu: 4 phòng (Kí túc xá, Phòng net, Phòng cá nhân, Phòng kho)
-- Script tự động lấy User ID đầu tiên trong hệ thống để gán dự án.

DO $$
DECLARE
    v_user_id UUID;
    
    -- UUIDs cho các Project
    v_p1 UUID := gen_random_uuid(); 
    v_p2 UUID := gen_random_uuid(); 
    v_p3 UUID := gen_random_uuid(); 
    v_p4 UUID := gen_random_uuid(); 
    
    -- UUIDs cho các Room tương ứng
    v_r1 UUID := gen_random_uuid();
    v_r2 UUID := gen_random_uuid();
    v_r3 UUID := gen_random_uuid();
    v_r4 UUID := gen_random_uuid();
BEGIN
    -- Lấy User đầu tiên trong hệ thống
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Chưa có User nào trong hệ thống. Vui lòng đăng ký ít nhất 1 tài khoản trên giao diện web trước khi chạy script này.';
    END IF;

    -- ==========================================
    -- 1. TẠO PROJECTS (DỰ ÁN)
    -- ==========================================
    INSERT INTO public.projects (id, user_id, name, description, is_favorite) VALUES
    (v_p1, v_user_id, 'Phòng Kí Túc Xá', 'Mẫu 6 giường cho sinh viên', true),
    (v_p2, v_user_id, 'Cyber Gaming', 'Phòng net 10 máy tính', false),
    (v_p3, v_user_id, 'Phòng Sinh Hoạt Cá Nhân', 'Phòng ngủ + làm việc tiện nghi', true),
    (v_p4, v_user_id, 'Phòng Kho', 'Lưu trữ đồ đạc và hàng hóa', false);

    -- ==========================================
    -- 2. TẠO ROOMS (PHÒNG)
    -- ==========================================
    INSERT INTO public.rooms (id, project_id, name, environment_settings) VALUES
    (v_r1, v_p1, 'Main Room', '{"backgroundColor": "#0F1117", "lightIntensity": 2.0}'::jsonb),
    (v_r2, v_p2, 'Main Room', '{"backgroundColor": "#1A0B2E", "lightIntensity": 1.2}'::jsonb),
    (v_r3, v_p3, 'Main Room', '{"backgroundColor": "#171520", "lightIntensity": 1.8}'::jsonb),
    (v_r4, v_p4, 'Main Room', '{"backgroundColor": "#0F1117", "lightIntensity": 1.0}'::jsonb);

    -- ==========================================
    -- 3. TẠO ENTITIES (ĐỒ VẬT 3D)
    -- ==========================================
    
    -- ---------------------------------------------------------
    -- MẪU 1: KÍ TÚC XÁ (6 giường, bàn ghế, cây, đèn, tường sàn)
    -- ---------------------------------------------------------
    INSERT INTO public.entities (room_id, type, position, rotation, scale, color, metadata) VALUES
    -- Cấu trúc phòng
    (v_r1, 'floor', '[0,0,0]', '[0,0,0]', '[1,1,1]', '#232838', '{"name": "Sàn KTX", "width": 8, "depth": 8, "thickness": 0.1}'::jsonb),
    (v_r1, 'wall', '[0,0,-4]', '[0,0,0]', '[1,1,1]', '#394353', '{"name": "Tường Sau", "width": 8, "height": 3, "depth": 0.12}'::jsonb),
    (v_r1, 'wall', '[-4,0,0]', '[0,1.5708,0]', '[1,1,1]', '#394353', '{"name": "Tường Trái", "width": 8, "height": 3, "depth": 0.12}'::jsonb),
    (v_r1, 'wall', '[4,0,0]', '[0,-1.5708,0]', '[1,1,1]', '#394353', '{"name": "Tường Phải", "width": 8, "height": 3, "depth": 0.12}'::jsonb),
    (v_r1, 'door', '[0,0,4]', '[0,0,0]', '[1,1,1]', '#9A6B43', '{"name": "Cửa Chính", "width": 1.5, "height": 2.2, "depth": 0.1}'::jsonb),
    -- Giường (Dãy trái - màu xanh)
    (v_r1, 'bed', '[-2,0,-2]', '[0,0,0]', '[1,1,1]', '#3b82f6', '{"name": "Giường 1"}'::jsonb),
    (v_r1, 'bed', '[-2,0,0]', '[0,0,0]', '[1,1,1]', '#3b82f6', '{"name": "Giường 2"}'::jsonb),
    (v_r1, 'bed', '[-2,0,2]', '[0,0,0]', '[1,1,1]', '#3b82f6', '{"name": "Giường 3"}'::jsonb),
    -- Giường (Dãy phải - màu cam, xoay ngược lại)
    (v_r1, 'bed', '[2,0,-2]', '[0,3.1416,0]', '[1,1,1]', '#f97316', '{"name": "Giường 4"}'::jsonb),
    (v_r1, 'bed', '[2,0,0]', '[0,3.1416,0]', '[1,1,1]', '#f97316', '{"name": "Giường 5"}'::jsonb),
    (v_r1, 'bed', '[2,0,2]', '[0,3.1416,0]', '[1,1,1]', '#f97316', '{"name": "Giường 6"}'::jsonb),
    -- Bàn ghế học chung ở giữa
    (v_r1, 'table', '[0,0,-1]', '[0,1.5708,0]', '[1,1,1]', '#d1d5db', '{"name": "Bàn Chung"}'::jsonb),
    (v_r1, 'chair', '[-0.8,0,-1]', '[0,1.5708,0]', '[1,1,1]', '#4b5563', '{"name": "Ghế 1"}'::jsonb),
    (v_r1, 'chair', '[0.8,0,-1]', '[0,-1.5708,0]', '[1,1,1]', '#4b5563', '{"name": "Ghế 2"}'::jsonb),
    -- Trang trí
    (v_r1, 'plant', '[-3,0,-3.5]', '[0,0,0]', '[1,1,1]', '#ffffff', '{"name": "Chậu Cây 1"}'::jsonb),
    (v_r1, 'plant', '[3,0,-3.5]', '[0,0,0]', '[1,1,1]', '#ffffff', '{"name": "Chậu Cây 2"}'::jsonb),
    (v_r1, 'lamp', '[0,3,0]', '[0,0,0]', '[1,1,1]', '#fde047', '{"name": "Đèn Trần"}'::jsonb);

    -- ---------------------------------------------------------
    -- MẪU 2: PHÒNG NET (10 máy tính, bàn ghế, cây, đèn)
    -- ---------------------------------------------------------
    INSERT INTO public.entities (room_id, type, position, rotation, scale, color, metadata) VALUES
    (v_r2, 'floor', '[0,0,0]', '[0,0,0]', '[1,1,1]', '#1a1a2e', '{"name": "Sàn Cyber", "width": 8, "depth": 8}'::jsonb),
    -- Dãy 1 (5 máy tính)
    (v_r2, 'computer_desk', '[-1.5,0,-3]', '[0,1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 1"}'::jsonb),
    (v_r2, 'computer_desk', '[-1.5,0,-1.5]', '[0,1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 2"}'::jsonb),
    (v_r2, 'computer_desk', '[-1.5,0,0]', '[0,1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 3"}'::jsonb),
    (v_r2, 'computer_desk', '[-1.5,0,1.5]', '[0,1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 4"}'::jsonb),
    (v_r2, 'computer_desk', '[-1.5,0,3]', '[0,1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 5"}'::jsonb),
    -- Ghế Dãy 1
    (v_r2, 'chair', '[-0.6,0,-3]', '[0,-1.5708,0]', '[1.2,1.2,1.2]', '#ef4444', '{"name": "Ghế PC 1"}'::jsonb),
    (v_r2, 'chair', '[-0.6,0,-1.5]', '[0,-1.5708,0]', '[1.2,1.2,1.2]', '#ef4444', '{"name": "Ghế PC 2"}'::jsonb),
    (v_r2, 'chair', '[-0.6,0,0]', '[0,-1.5708,0]', '[1.2,1.2,1.2]', '#ef4444', '{"name": "Ghế PC 3"}'::jsonb),
    (v_r2, 'chair', '[-0.6,0,1.5]', '[0,-1.5708,0]', '[1.2,1.2,1.2]', '#ef4444', '{"name": "Ghế PC 4"}'::jsonb),
    (v_r2, 'chair', '[-0.6,0,3]', '[0,-1.5708,0]', '[1.2,1.2,1.2]', '#ef4444', '{"name": "Ghế PC 5"}'::jsonb),
    -- Dãy 2 (5 máy tính đối diện)
    (v_r2, 'computer_desk', '[1.5,0,-3]', '[0,-1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 6"}'::jsonb),
    (v_r2, 'computer_desk', '[1.5,0,-1.5]', '[0,-1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 7"}'::jsonb),
    (v_r2, 'computer_desk', '[1.5,0,0]', '[0,-1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 8"}'::jsonb),
    (v_r2, 'computer_desk', '[1.5,0,1.5]', '[0,-1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 9"}'::jsonb),
    (v_r2, 'computer_desk', '[1.5,0,3]', '[0,-1.5708,0]', '[1,1,1]', '#000000', '{"name": "PC 10"}'::jsonb),
    -- Ghế Dãy 2
    (v_r2, 'chair', '[0.6,0,-3]', '[0,1.5708,0]', '[1.2,1.2,1.2]', '#3b82f6', '{"name": "Ghế PC 6"}'::jsonb),
    (v_r2, 'chair', '[0.6,0,-1.5]', '[0,1.5708,0]', '[1.2,1.2,1.2]', '#3b82f6', '{"name": "Ghế PC 7"}'::jsonb),
    (v_r2, 'chair', '[0.6,0,0]', '[0,1.5708,0]', '[1.2,1.2,1.2]', '#3b82f6', '{"name": "Ghế PC 8"}'::jsonb),
    (v_r2, 'chair', '[0.6,0,1.5]', '[0,1.5708,0]', '[1.2,1.2,1.2]', '#3b82f6', '{"name": "Ghế PC 9"}'::jsonb),
    (v_r2, 'chair', '[0.6,0,3]', '[0,1.5708,0]', '[1.2,1.2,1.2]', '#3b82f6', '{"name": "Ghế PC 10"}'::jsonb),
    -- Decor Cyber
    (v_r2, 'plant', '[-3,0,3]', '[0,0,0]', '[1.5,1.5,1.5]', '#1f2937', '{"name": "Cây Góc"}'::jsonb),
    (v_r2, 'lamp', '[-2,3,0]', '[0,0,0]', '[1,1,1]', '#ef4444', '{"name": "Neon Đỏ"}'::jsonb),
    (v_r2, 'lamp', '[2,3,0]', '[0,0,0]', '[1,1,1]', '#3b82f6', '{"name": "Neon Xanh"}'::jsonb);

    -- ---------------------------------------------------------
    -- MẪU 3: PHÒNG CÁ NHÂN (1 Giường, 1 PC, Tủ, Cây, Tường)
    -- ---------------------------------------------------------
    INSERT INTO public.entities (room_id, type, position, rotation, scale, color, metadata) VALUES
    (v_r3, 'floor', '[0,0,0]', '[0,0,0]', '[1,1,1]', '#78350f', '{"name": "Sàn Gỗ", "width": 6, "depth": 5}'::jsonb),
    (v_r3, 'wall', '[0,0,-2.5]', '[0,0,0]', '[1,1,1]', '#e5e7eb', '{"name": "Tường Chính", "width": 6, "height": 3}'::jsonb),
    (v_r3, 'bed', '[-1.5,0,-1.5]', '[0,0,0]', '[1,1,1]', '#8b5cf6', '{"name": "Giường"}'::jsonb),
    (v_r3, 'computer_desk', '[1.5,0,-1.8]', '[0,0,0]', '[1,1,1]', '#f3f4f6', '{"name": "Bàn Làm Việc"}'::jsonb),
    (v_r3, 'chair', '[1.5,0,-0.8]', '[0,3.14,0]', '[1,1,1]', '#1f2937', '{"name": "Ghế Xoay"}'::jsonb),
    (v_r3, 'shelf', '[-2.5,0,1]', '[0,1.57,0]', '[1,1,1]', '#d1d5db', '{"name": "Tủ Đồ"}'::jsonb),
    (v_r3, 'plant', '[2,0,1.5]', '[0,0,0]', '[1.2,1.2,1.2]', '#ffffff', '{"name": "Cây Xanh"}'::jsonb),
    (v_r3, 'lamp', '[-2.5,0,-1.5]', '[0,0,0]', '[0.8,0.8,0.8]', '#fcd34d', '{"name": "Đèn Ngủ"}'::jsonb);

    -- ---------------------------------------------------------
    -- MẪU 4: PHÒNG KHO (Tủ kệ, nhiều hộp chồng lên nhau)
    -- ---------------------------------------------------------
    INSERT INTO public.entities (room_id, type, position, rotation, scale, color, metadata) VALUES
    (v_r4, 'floor', '[0,0,0]', '[0,0,0]', '[1,1,1]', '#374151', '{"name": "Sàn Bê Tông", "width": 6, "depth": 6}'::jsonb),
    -- Kệ để đồ
    (v_r4, 'shelf', '[-2,0,-2]', '[0,0,0]', '[1,1,1]', '#4b5563', '{"name": "Kệ Trái"}'::jsonb),
    (v_r4, 'shelf', '[0,0,-2]', '[0,0,0]', '[1,1,1]', '#4b5563', '{"name": "Kệ Giữa"}'::jsonb),
    (v_r4, 'shelf', '[2,0,-2]', '[0,0,0]', '[1,1,1]', '#4b5563', '{"name": "Kệ Phải"}'::jsonb),
    -- Hộp dưới đất (7 hộp)
    (v_r4, 'box', '[-1,0.5,1]', '[0,0.2,0]', '[1,1,1]', '#b45309', '{"name": "Hộp 1"}'::jsonb),
    (v_r4, 'box', '[-1,1.5,1]', '[0,-0.1,0]', '[1,1,1]', '#b45309', '{"name": "Hộp 2"}'::jsonb),
    (v_r4, 'box', '[0,0.5,1.5]', '[0,0.5,0]', '[1,1,1]', '#b45309', '{"name": "Hộp 3"}'::jsonb),
    (v_r4, 'box', '[1,0.5,1]', '[0,0,0]', '[1,1,1]', '#b45309', '{"name": "Hộp 4"}'::jsonb),
    (v_r4, 'box', '[2,0.5,1.5]', '[0,0.8,0]', '[1,1,1]', '#b45309', '{"name": "Hộp 5"}'::jsonb),
    (v_r4, 'box', '[2,1.5,1.5]', '[0,0.1,0]', '[1,1,1]', '#b45309', '{"name": "Hộp 6"}'::jsonb),
    (v_r4, 'box', '[2,2.5,1.5]', '[0,0.3,0]', '[1,1,1]', '#b45309', '{"name": "Hộp 7"}'::jsonb),
    -- Hộp cất trên kệ (Chiều cao ngăn kệ thường là 0.5, 1.0, 1.5)
    (v_r4, 'box', '[-2,0.7,-2]', '[0,0,0]', '[0.8,0.8,0.8]', '#b45309', '{"name": "Hộp Kệ 1"}'::jsonb),
    (v_r4, 'box', '[-2,1.2,-2]', '[0,0,0]', '[0.8,0.8,0.8]', '#b45309', '{"name": "Hộp Kệ 2"}'::jsonb),
    (v_r4, 'box', '[0,1.2,-2]', '[0,0,0]', '[0.8,0.8,0.8]', '#b45309', '{"name": "Hộp Kệ 3"}'::jsonb),
    (v_r4, 'box', '[2,0.7,-2]', '[0,0,0]', '[0.8,0.8,0.8]', '#b45309', '{"name": "Hộp Kệ 4"}'::jsonb);

END $$;
