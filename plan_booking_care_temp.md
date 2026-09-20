# WEBSITE ĐẶT LỊCH KHÁM BỆNH (BOOKINGCARE CLONE)

## 1. Tổng quan dự án

### Mục tiêu

Xây dựng một nền tảng đặt lịch khám bệnh trực tuyến cho phép:

* Bệnh nhân tìm kiếm bác sĩ
* Xem lịch khám còn trống
* Đặt lịch trực tuyến
* Quản lý lịch hẹn
* Bác sĩ quản lý lịch làm việc
* Admin quản lý toàn bộ hệ thống

### Phạm vi

Tập trung vào nghiệp vụ cốt lõi:

```text
Tìm bác sĩ
↓
Xem lịch khám
↓
Đặt lịch
↓
Xác nhận lịch hẹn
↓
Khám bệnh
↓
Đánh giá
```

Không bao gồm:

* AI Chatbot
* Telemedicine (Video Call)
* Hồ sơ bệnh án điện tử (EHR)
* Microservices

---

# 2. Công nghệ sử dụng

## Frontend

* Next.js 15
* TypeScript
* TailwindCSS
* Shadcn/UI
* TanStack Query
* React Hook Form
* Zod

---

## Backend

### Supabase

Sử dụng toàn bộ hệ sinh thái:

* Authentication
* PostgreSQL
* Storage
* Realtime
* Row Level Security

---

## Deploy

Frontend:

* [Vercel](https://vercel.com?utm_source=chatgpt.com)

Backend:

* [Supabase](https://supabase.com?utm_source=chatgpt.com)

---

# 3. User Roles

## Patient

Bệnh nhân

---

## Doctor

Bác sĩ

---

## Admin

Quản trị viên

---

# 4. Chức năng hệ thống

---

# Module 1: Authentication

## Đăng ký

Thông tin:

```text
Email
Password
Confirm Password
```

---

## Đăng nhập

```text
Email
Password
```

---

## Quên mật khẩu

Flow:

```text
Email
↓
Gửi mail reset
↓
Đặt mật khẩu mới
```

---

## Phân quyền

```text
PATIENT
DOCTOR
ADMIN
```

---

# Module 2: Hồ sơ người dùng

## Patient Profile

Thông tin:

```text
Họ tên
Ngày sinh
Giới tính
Số điện thoại
Địa chỉ
```

---

## Doctor Profile

Thông tin:

```text
Ảnh đại diện
Họ tên
Học vị
Chuyên khoa
Kinh nghiệm
Mô tả
Giá khám
```

---

# Module 3: Chuyên khoa

Admin quản lý:

```text
Tim mạch
Da liễu
Nhi khoa
Tai Mũi Họng
Nội tổng quát
```

Chức năng:

* Thêm
* Sửa
* Xóa

---

# Module 4: Cơ sở y tế

Thông tin:

```text
Tên cơ sở
Địa chỉ
Số điện thoại
Mô tả
```

Quan hệ:

```text
Clinic
  └── Doctors
```

---

# Module 5: Tìm kiếm bác sĩ

## Danh sách bác sĩ

Hiển thị:

```text
Ảnh
Tên
Chuyên khoa
Giá khám
Đánh giá
```

---

## Bộ lọc

Theo:

```text
Chuyên khoa
Cơ sở y tế
Giá khám
Ngày khám
```

---

## Tìm kiếm

Theo:

```text
Tên bác sĩ
Tên chuyên khoa
```

---

# Module 6: Lịch làm việc

Bác sĩ quản lý lịch khám

Ví dụ:

```text
2026-06-20

08:00
08:30
09:00
09:30
10:00
```

---

Trạng thái slot:

```text
AVAILABLE
BOOKED
BLOCKED
```

---

# Module 7: Đặt lịch khám

## Luồng nghiệp vụ

```text
Chọn bác sĩ
↓
Chọn ngày khám
↓
Chọn khung giờ
↓
Nhập lý do khám
↓
Xác nhận
↓
Tạo lịch hẹn
```

---

## Kiểm tra

Không cho:

```text
Đặt trùng slot

Đặt slot đã khóa

Đặt slot đã được người khác đặt
```

---

# Module 8: Quản lý lịch hẹn

## Patient

Có thể:

* Xem lịch hẹn
* Hủy lịch

---

## Doctor

Có thể:

* Xác nhận lịch
* Đánh dấu hoàn thành
* Hủy lịch

---

## Trạng thái

```text
PENDING

CONFIRMED

COMPLETED

CANCELLED
```

---

# Module 9: Đánh giá bác sĩ

Sau khi khám xong:

```text
1-5 sao

Nội dung đánh giá
```

---

Quy tắc:

```text
Chỉ được đánh giá
sau khi lịch hẹn COMPLETED
```

---

# Module 10: Dashboard Doctor

## Quản lý lịch

* Tạo lịch
* Khóa lịch
* Mở lịch

---

## Quản lý bệnh nhân

Xem:

```text
Danh sách lịch hẹn

Thông tin bệnh nhân

Lý do khám
```

---

## Thống kê

```text
Số lịch hẹn

Số lượt khám

Đánh giá trung bình
```

---

# Module 11: Dashboard Admin

## User Management

* Xem danh sách người dùng
* Khóa tài khoản

---

## Doctor Management

* Thêm bác sĩ
* Chỉnh sửa bác sĩ
* Xóa bác sĩ

---

## Specialty Management

* CRUD chuyên khoa

---

## Clinic Management

* CRUD cơ sở y tế

---

## Appointment Management

Theo dõi:

```text
Tổng lịch hẹn

Lịch đang chờ

Lịch hoàn thành
```

---

# 5. Database Design

## users

```sql
id uuid PK

email

role

created_at
```

---

## patient_profiles

```sql
id uuid PK

user_id FK

full_name

phone

dob

gender

address
```

---

## doctor_profiles

```sql
id uuid PK

user_id FK

specialty_id FK

clinic_id FK

full_name

degree

experience_years

consultation_fee

bio

avatar_url
```

---

## specialties

```sql
id uuid PK

name

description
```

---

## clinics

```sql
id uuid PK

name

address

phone

description
```

---

## schedules

```sql
id uuid PK

doctor_id FK

date

start_time

end_time

status
```

---

## appointments

```sql
id uuid PK

patient_id FK

doctor_id FK

schedule_id FK

reason

status

created_at
```

---

## reviews

```sql
id uuid PK

doctor_id FK

patient_id FK

appointment_id FK

rating

comment

created_at
```

---

# 6. Storage

Supabase Storage

Bucket:

```text
avatars

doctor-images

clinic-images
```

---

# 7. Realtime

Sử dụng Supabase Realtime

## Khi có lịch hẹn mới

Doctor nhận được cập nhật ngay.

---

## Khi bác sĩ xác nhận lịch

Patient nhận được cập nhật ngay.

---

# 8. Bảo mật

## Authentication

Supabase Auth

---

## Authorization

Role-based access:

```text
PATIENT

DOCTOR

ADMIN
```

---

## RLS

Ví dụ:

Patient chỉ xem lịch của mình.

Doctor chỉ xem lịch liên quan tới mình.

Admin xem tất cả.

---

# 9. Roadmap triển khai

## Sprint 1

* Setup project
* Supabase
* Auth
* Database Schema

---

## Sprint 2

* Patient Profile
* Doctor Profile
* Specialty
* Clinic

---

## Sprint 3

* Doctor Listing
* Search
* Filter

---

## Sprint 4

* Schedule Management

---

## Sprint 5

* Appointment Booking

---

## Sprint 6

* Dashboard Doctor

---

## Sprint 7

* Dashboard Admin

---

## Sprint 8

* Reviews
* Realtime
* UI polishing
* Deploy

---

# Kết quả cuối cùng

Một sản phẩm hoàn chỉnh gồm:

```text
✓ Authentication
✓ RBAC
✓ Doctor Management
✓ Specialty Management
✓ Clinic Management
✓ Search & Filter
✓ Schedule Management
✓ Appointment Booking
✓ Review System
✓ Doctor Dashboard
✓ Admin Dashboard
✓ Supabase Realtime
✓ Production Deployment
```

Đây là phạm vi đủ lớn để thể hiện kỹ năng Fullstack (Next.js + Supabase), có nghiệp vụ thực tế, kiến trúc rõ ràng và hoàn toàn có thể triển khai thành sản phẩm thật.
