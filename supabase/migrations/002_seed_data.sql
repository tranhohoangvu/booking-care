-- ==============================================================================
-- BOOKING CARE SEED DATA
-- Migration: 002_seed_data.sql
-- ==============================================================================

-- 1. Insert Specialties (Chuyên khoa phổ biến)
INSERT INTO public.specialties (name, slug, description, image_url) VALUES
('Cơ Xương Khớp', 'co-xuong-khop', 'Chuyên khám và điều trị các bệnh lý thoái hóa khớp, cột sống, chấn thương thể thao', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'),
('Thần Kinh', 'than-kinh', 'Khám chữa các bệnh đau đầu, rối loạn giấc ngủ, tai biến mạch máu não, động kinh', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80'),
('Tiêu Hóa - Gan Mật', 'tieu-hoa-gan-mat', 'Điều trị các bệnh dạ dày, đại tràng, trĩ, gan mật, nội soi tiêu hóa không đau', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80'),
('Tim Mạch', 'tim-mach', 'Khám điều trị tăng huyết áp, suy tim, bệnh mạch vành, rối loạn nhịp tim', 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&auto=format&fit=crop&q=80'),
('Tai Mũi Họng', 'tai-mui-hong', 'Điều trị viêm xoang, viêm amidan, ù tai, nội soi thanh quản ống mềm', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80'),
('Da Liễu', 'da-lieu', 'Điều trị mụn trứng cá, viêm da cơ địa, nám, tàn nhang, nấm da, thẩm mỹ da', 'https://images.unsplash.com/photo-1512290900672-1f5be62e92c2?w=800&auto=format&fit=crop&q=80'),
('Nhi Khoa', 'nhi-khoa', 'Khám tổng quát và dinh dưỡng cho trẻ nhỏ từ sơ sinh đến 15 tuổi', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'),
('Mắt - Nhãn Khoa', 'mat-nhan-khoa', 'Khám khúc xạ cận - viễn - loạn, phẫu thuật Phaco, điều trị bệnh lý đáy mắt', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Clinics (Cơ sở y tế & Bệnh viện hàng đầu)
INSERT INTO public.clinics (name, slug, address, phone, description, image_url) VALUES
('Bệnh viện Đại học Y Dược TP.HCM', 'benh-vien-dai-hoc-y-duoc', '215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh', '028 3855 4269', 'Bệnh viện tuyến trung ương đa khoa hàng đầu miền Nam với đội ngũ chuyên gia, giáo sư đầu ngành.', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80'),
('Bệnh viện Chợ Rẫy', 'benh-vien-cho-ray', '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh', '028 3855 4137', 'Bệnh viện đa khoa đặc biệt lớn nhất khu vực phía Nam với trang thiết bị y tế hiện đại.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'),
('Phòng khám Đa khoa Quốc tế CarePlus', 'phong-kham-careplus', '66-68 Nam Kỳ Khởi Nghĩa, Phường Nguyễn Thái Bình, Quận 1, TP. Hồ Chí Minh', '1800 6116', 'Hệ thống phòng khám tiêu chuẩn Singapore với dịch vụ chăm sóc sức khỏe chất lượng cao.', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'),
('Bệnh viện Đa khoa Hồng Ngọc', 'benh-vien-hong-ngoc', '55 Yên Ninh, Trúc Bạch, Ba Đình, Hà Nội', '024 3927 5568', 'Bệnh viện khách sạn chất lượng cao hàng đầu tại Thủ đô Hà Nội.', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Demo Doctor Users (Hỗ trợ cả môi trường Supabase Cloud & Local)
DO $$
DECLARE
    uid_doc1 UUID := 'd0000001-0000-0000-0000-000000000001'::UUID;
    uid_doc2 UUID := 'd0000002-0000-0000-0000-000000000002'::UUID;
    uid_doc3 UUID := 'd0000003-0000-0000-0000-000000000003'::UUID;
    uid_doc4 UUID := 'd0000004-0000-0000-0000-000000000004'::UUID;
    uid_doc5 UUID := 'd0000005-0000-0000-0000-000000000005'::UUID;
    uid_doc6 UUID := 'd0000006-0000-0000-0000-000000000006'::UUID;

    sid_coxuongkhop UUID;
    sid_tim_mach UUID;
    sid_tieu_hoa UUID;
    sid_tai_mui_hong UUID;
    sid_da_lieu UUID;
    sid_than_kinh UUID;

    cid_dhyd UUID;
    cid_choray UUID;
    cid_careplus UUID;
    cid_hongngoc UUID;

    doc1_profile_id UUID;
    doc2_profile_id UUID;
    doc3_profile_id UUID;
    doc4_profile_id UUID;
    doc5_profile_id UUID;
    doc6_profile_id UUID;
BEGIN
    -- Lấy ID chuyên khoa
    SELECT id INTO sid_coxuongkhop FROM public.specialties WHERE slug = 'co-xuong-khop' LIMIT 1;
    SELECT id INTO sid_tim_mach FROM public.specialties WHERE slug = 'tim-mach' LIMIT 1;
    SELECT id INTO sid_tieu_hoa FROM public.specialties WHERE slug = 'tieu-hoa-gan-mat' LIMIT 1;
    SELECT id INTO sid_tai_mui_hong FROM public.specialties WHERE slug = 'tai-mui-hong' LIMIT 1;
    SELECT id INTO sid_da_lieu FROM public.specialties WHERE slug = 'da-lieu' LIMIT 1;
    SELECT id INTO sid_than_kinh FROM public.specialties WHERE slug = 'than-kinh' LIMIT 1;

    -- Lấy ID bệnh viện / phòng khám
    SELECT id INTO cid_dhyd FROM public.clinics WHERE slug = 'benh-vien-dai-hoc-y-duoc' LIMIT 1;
    SELECT id INTO cid_choray FROM public.clinics WHERE slug = 'benh-vien-cho-ray' LIMIT 1;
    SELECT id INTO cid_careplus FROM public.clinics WHERE slug = 'phong-kham-careplus' LIMIT 1;
    SELECT id INTO cid_hongngoc FROM public.clinics WHERE slug = 'benh-vien-hong-ngoc' LIMIT 1;

    -- Tạo người dùng auth (nếu bảng auth.users tồn tại)
    BEGIN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud)
        VALUES
        (uid_doc1, '00000000-0000-0000-0000-000000000000', 'bacsi.lieu@bookingcare.vn', crypt('Doctor@123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"DOCTOR","full_name":"PGS.TS.BS Nguyễn Văn Liệu"}', 'authenticated', 'authenticated'),
        (uid_doc2, '00000000-0000-0000-0000-000000000000', 'bacsi.huong@bookingcare.vn', crypt('Doctor@123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"DOCTOR","full_name":"ThS.BSCKII Trần Thị Mai Hương"}', 'authenticated', 'authenticated'),
        (uid_doc3, '00000000-0000-0000-0000-000000000000', 'bacsi.nam@bookingcare.vn', crypt('Doctor@123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"DOCTOR","full_name":"TS.BS Lê Hoàng Nam"}', 'authenticated', 'authenticated'),
        (uid_doc4, '00000000-0000-0000-0000-000000000000', 'bacsi.trang@bookingcare.vn', crypt('Doctor@123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"DOCTOR","full_name":"ThS.BS Đỗ Thị Thu Trang"}', 'authenticated', 'authenticated'),
        (uid_doc5, '00000000-0000-0000-0000-000000000000', 'bacsi.giang@bookingcare.vn', crypt('Doctor@123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"DOCTOR","full_name":"TS.BS Phạm Quỳnh Giang"}', 'authenticated', 'authenticated'),
        (uid_doc6, '00000000-0000-0000-0000-000000000000', 'bacsi.chau@bookingcare.vn', crypt('Doctor@123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"DOCTOR","full_name":"PGS.TS.BS Trần Ngọc Châu"}', 'authenticated', 'authenticated')
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Bỏ qua nếu môi trường dev không có quyền trực tiếp vào schema auth
        null;
    END;

    -- Đồng bộ vào bảng public.users
    INSERT INTO public.users (id, email, role) VALUES
    (uid_doc1, 'bacsi.lieu@bookingcare.vn', 'DOCTOR'),
    (uid_doc2, 'bacsi.huong@bookingcare.vn', 'DOCTOR'),
    (uid_doc3, 'bacsi.nam@bookingcare.vn', 'DOCTOR'),
    (uid_doc4, 'bacsi.trang@bookingcare.vn', 'DOCTOR'),
    (uid_doc5, 'bacsi.giang@bookingcare.vn', 'DOCTOR'),
    (uid_doc6, 'bacsi.chau@bookingcare.vn', 'DOCTOR')
    ON CONFLICT (id) DO UPDATE SET role = 'DOCTOR';

    -- 4. Tạo Hồ sơ Bác sĩ (public.doctor_profiles)
    INSERT INTO public.doctor_profiles (user_id, specialty_id, clinic_id, full_name, degree, experience_years, consultation_fee, bio, avatar_url)
    VALUES
    (
        uid_doc1, sid_coxuongkhop, cid_dhyd,
        'PGS.TS.BS Nguyễn Văn Liệu', 'Phó Giáo sư, Tiến sĩ, Bác sĩ', 28, 350000,
        'Phó Giáo sư, Tiến sĩ chuyên ngành Thần kinh và Cơ Xương Khớp. Nguyên Trưởng khoa Thần kinh Bệnh viện Bạch Mai, hiện công tác và cố vấn chuyên môn tại BV Đại học Y Dược TP.HCM.',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'
    ),
    (
        uid_doc2, sid_tim_mach, cid_choray,
        'ThS.BSCKII Trần Thị Mai Hương', 'Thạc sĩ, Bác sĩ Chuyên khoa II', 22, 300000,
        'Chuyên gia Tim mạch can thiệp hàng đầu tại Bệnh viện Chợ Rẫy. Hơn 20 năm điều trị bệnh lý mạch vành, suy tim và tăng huyết áp kháng trị.',
        'https://images.unsplash.com/photo-1594824813581-2292f7e025ff?w=600&auto=format&fit=crop&q=80'
    ),
    (
        uid_doc3, sid_tieu_hoa, cid_careplus,
        'TS.BS Lê Hoàng Nam', 'Tiến sĩ, Giảng viên Y khoa', 18, 280000,
        'Giảng viên Bộ môn Tiêu hóa Đại học Y Dược TP.HCM. Chuyên gia nội soi tiêu hóa phóng đại NBI tầm soát sớm ung thư dạ dày - đại tràng không đau.',
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80'
    ),
    (
        uid_doc4, sid_tai_mui_hong, cid_hongngoc,
        'ThS.BS Đỗ Thị Thu Trang', 'Thạc sĩ, Bác sĩ Nội trú', 14, 250000,
        'Tốt nghiệp Thạc sĩ Bác sĩ Nội trú Đại học Y Hà Nội. Chuyên sâu nội soi vi phẫu thanh quản, điều trị viêm xoang mũi dị ứng và tầm soát ung thư vòm họng.',
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80'
    ),
    (
        uid_doc5, sid_da_lieu, cid_dhyd,
        'TS.BS Phạm Quỳnh Giang', 'Tiến sĩ, Bác sĩ Da liễu', 15, 320000,
        'Giảng viên Bộ môn Da liễu - Đại học Y Dược TP.HCM. Chuyên gia điều trị viêm da cơ địa, vảy nến, mụn trứng cá kháng trị và thẩm mỹ nội khoa phục hồi da.',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'
    ),
    (
        uid_doc6, sid_than_kinh, cid_choray,
        'PGS.TS.BS Trần Ngọc Châu', 'Phó Giáo sư, Tiến sĩ, Thầy thuốc Ưu tú', 30, 450000,
        'Nguyên Viện trưởng Viện Tim mạch & Thần kinh. Chuyên gia đầu ngành về bệnh lý mạch máu não, phục hồi sau đột quỵ và rối loạn giấc ngủ kéo dài.',
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        degree = EXCLUDED.degree,
        consultation_fee = EXCLUDED.consultation_fee;

    -- 5. Tạo Khung giờ Lịch khám (public.schedules) cho các bác sĩ trong 3 ngày tới
    SELECT id INTO doc1_profile_id FROM public.doctor_profiles WHERE user_id = uid_doc1;
    SELECT id INTO doc2_profile_id FROM public.doctor_profiles WHERE user_id = uid_doc2;
    SELECT id INTO doc3_profile_id FROM public.doctor_profiles WHERE user_id = uid_doc3;

    IF doc1_profile_id IS NOT NULL THEN
        -- Bác sĩ 1: Lịch hôm nay và ngày mai
        INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status) VALUES
        (doc1_profile_id, CURRENT_DATE, '08:00:00', '08:30:00', 'AVAILABLE'),
        (doc1_profile_id, CURRENT_DATE, '08:30:00', '09:00:00', 'AVAILABLE'),
        (doc1_profile_id, CURRENT_DATE, '09:00:00', '09:30:00', 'AVAILABLE'),
        (doc1_profile_id, CURRENT_DATE, '10:00:00', '10:30:00', 'AVAILABLE'),
        (doc1_profile_id, CURRENT_DATE, '14:00:00', '14:30:00', 'AVAILABLE'),
        (doc1_profile_id, CURRENT_DATE, '15:00:00', '15:30:00', 'AVAILABLE'),
        (doc1_profile_id, CURRENT_DATE + 1, '08:30:00', '09:00:00', 'AVAILABLE'),
        (doc1_profile_id, CURRENT_DATE + 1, '09:30:00', '10:00:00', 'AVAILABLE'),
        (doc1_profile_id, CURRENT_DATE + 1, '14:30:00', '15:00:00', 'AVAILABLE')
        ON CONFLICT (doctor_id, date, start_time) DO NOTHING;
    END IF;

    IF doc2_profile_id IS NOT NULL THEN
        -- Bác sĩ 2
        INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status) VALUES
        (doc2_profile_id, CURRENT_DATE, '08:30:00', '09:00:00', 'AVAILABLE'),
        (doc2_profile_id, CURRENT_DATE, '09:30:00', '10:00:00', 'AVAILABLE'),
        (doc2_profile_id, CURRENT_DATE, '13:30:00', '14:00:00', 'AVAILABLE'),
        (doc2_profile_id, CURRENT_DATE, '14:30:00', '15:00:00', 'AVAILABLE'),
        (doc2_profile_id, CURRENT_DATE + 1, '09:00:00', '09:30:00', 'AVAILABLE'),
        (doc2_profile_id, CURRENT_DATE + 1, '15:00:00', '15:30:00', 'AVAILABLE')
        ON CONFLICT (doctor_id, date, start_time) DO NOTHING;
    END IF;

    IF doc3_profile_id IS NOT NULL THEN
        -- Bác sĩ 3
        INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status) VALUES
        (doc3_profile_id, CURRENT_DATE, '09:00:00', '09:30:00', 'AVAILABLE'),
        (doc3_profile_id, CURRENT_DATE, '10:30:00', '11:00:00', 'AVAILABLE'),
        (doc3_profile_id, CURRENT_DATE, '14:00:00', '14:30:00', 'AVAILABLE'),
        (doc3_profile_id, CURRENT_DATE + 1, '08:30:00', '09:00:00', 'AVAILABLE'),
        (doc3_profile_id, CURRENT_DATE + 1, '10:00:00', '10:30:00', 'AVAILABLE')
        ON CONFLICT (doctor_id, date, start_time) DO NOTHING;
    END IF;

END $$;
