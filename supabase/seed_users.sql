-- SCRIPT TẠO DỮ LIỆU MẪU: NGƯỜI DÙNG (USERS)
-- Dành cho hệ thống Supabase Auth
-- Lưu ý quan trọng: Script này cần extension 'pgcrypto' (Supabase đã bật sẵn) để mã hóa mật khẩu.
-- Mật khẩu mặc định cho tất cả 5 user là: 123456

DO $$
DECLARE
    -- Tạo sẵn 5 UUIDs cho 5 user để dễ kiểm soát
    u1 UUID := gen_random_uuid();
    u2 UUID := gen_random_uuid();
    u3 UUID := gen_random_uuid();
    u4 UUID := gen_random_uuid();
    u5 UUID := gen_random_uuid();
BEGIN
    -- Bật extension pgcrypto nếu chưa có (chỉ để đảm bảo)
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    -- ==========================================
    -- 1. INSERT VÀO BẢNG AUTH.USERS (BẢNG HỆ THỐNG CỦA SUPABASE)
    -- ==========================================
    -- Supabase quản lý user trong schema 'auth', bảng 'users'. 
    -- Chúng ta bắt buộc phải cung cấp đầy đủ các trường thiết yếu để hệ thống coi đây là user hợp lệ.
    
    INSERT INTO auth.users (
        id, 
        instance_id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at, 
        raw_app_meta_data, 
        raw_user_meta_data, 
        created_at, 
        updated_at
    ) VALUES
    (u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student1@university.edu', crypt('123456', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Sinh viên 1"}', now(), now()),
    (u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student2@university.edu', crypt('123456', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Sinh viên 2"}', now(), now()),
    (u3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'designer@studio.com', crypt('123456', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Nhà thiết kế"}', now(), now()),
    (u4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'architect@studio.com', crypt('123456', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Kiến trúc sư"}', now(), now()),
    (u5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo.user@example.com', crypt('123456', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Tài khoản Demo"}', now(), now());

    -- ==========================================
    -- 2. INSERT VÀO BẢNG PUBLIC.USERS (NẾU CÓ TRIGGER HOẶC CẦN PROFILE)
    -- ==========================================
    -- Nếu dự án của bạn có bảng 'public.users' lưu thông tin cá nhân (Profile),
    -- thường sẽ có Trigger tự động tạo khi insert vào auth.users.
    -- Nếu bạn dùng bảng riêng mà KHÔNG dùng trigger tự động, hãy mở comment đoạn dưới đây:
    
    /*
    INSERT INTO public.users (id, full_name, avatar_url) VALUES
    (u1, 'Sinh viên 1', null),
    (u2, 'Sinh viên 2', null),
    (u3, 'Nhà thiết kế 3D', null),
    (u4, 'Kiến trúc sư', null),
    (u5, 'Demo User', null);
    */

END $$;
