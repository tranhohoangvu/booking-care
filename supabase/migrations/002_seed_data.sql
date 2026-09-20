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
