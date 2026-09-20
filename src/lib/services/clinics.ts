import { createClient } from '@/lib/supabase/client';
import type { Clinic, DoctorProfile } from '@/types/database.types';

export interface ClinicWithStats extends Clinic {
  doctor_count: number;
  specialty_count: number;
}

export const MOCK_CLINICS: ClinicWithStats[] = [
  {
    id: 'clinic-1',
    name: 'Bệnh viện Đại học Y Dược TP.HCM',
    slug: 'benh-vien-dai-hoc-y-duoc',
    address: '215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh',
    phone: '028 3855 4269',
    description: 'Bệnh viện tuyến trung ương đa khoa hàng đầu miền Nam với đội ngũ chuyên gia, giáo sư đầu ngành. Trang bị hệ thống chụp cộng hưởng từ MRI 3.0 Tesla, CT đa lát cắt và phòng mổ vô khuẩn tiêu chuẩn quốc tế.',
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 120,
    specialty_count: 24,
  },
  {
    id: 'clinic-2',
    name: 'Bệnh viện Chợ Rẫy',
    slug: 'benh-vien-cho-ray',
    address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh',
    phone: '028 3855 4137',
    description: 'Bệnh viện đa khoa đặc biệt lớn nhất khu vực phía Nam. Nổi tiếng về can thiệp tim mạch, ghép tạng, phẫu thuật ngoại khoa và điều trị hồi sức cấp cứu chuyên sâu.',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 150,
    specialty_count: 32,
  },
  {
    id: 'clinic-3',
    name: 'Phòng khám Đa khoa Quốc tế CarePlus',
    slug: 'phong-kham-careplus',
    address: '66-68 Nam Kỳ Khởi Nghĩa, Phường Nguyễn Thái Bình, Quận 1, TP. Hồ Chí Minh',
    phone: '1800 6116',
    description: 'Hệ thống phòng khám chuẩn quốc tế Singapore với dịch vụ y tế thân thiện, quy trình tiếp đón nhanh chóng, không gian hiện đại và không lo xếp hàng chờ đợi.',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 45,
    specialty_count: 14,
  },
  {
    id: 'clinic-4',
    name: 'Bệnh viện Đa khoa Hồng Ngọc',
    slug: 'benh-vien-hong-ngoc',
    address: '55 Yên Ninh, Trúc Bạch, Ba Đình, Hà Nội',
    phone: '024 3927 5568',
    description: 'Bệnh viện mô hình khách sạn chất lượng cao hàng đầu tại Thủ đô Hà Nội. Cung cấp dịch vụ thăm khám toàn diện, kiểm tra sức khỏe tổng quát và thai sản trọn gói.',
    image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 85,
    specialty_count: 18,
  },
];

export async function getAllClinics(): Promise<ClinicWithStats[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clinics')
      .select('*, doctor_profiles(count)');

    if (error || !data || data.length === 0) {
      return MOCK_CLINICS;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      address: item.address,
      phone: item.phone,
      description: item.description,
      image_url: item.image_url,
      created_at: item.created_at,
      doctor_count: item.doctor_profiles?.[0]?.count || 15,
      specialty_count: 8,
    }));
  } catch (err) {
    console.warn('Using mock clinics fallback:', err);
    return MOCK_CLINICS;
  }
}

export async function getClinicBySlug(slug: string): Promise<{
  clinic: ClinicWithStats | null;
  doctors: DoctorProfile[];
}> {
  try {
    const supabase = createClient();
    const { data: clinicData, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !clinicData) {
      const mock = MOCK_CLINICS.find((c) => c.slug === slug) || null;
      return {
        clinic: mock,
        doctors: mock ? getMockDoctorsForClinic(mock.id, mock.name) : [],
      };
    }

    const { data: doctorsData } = await supabase
      .from('doctor_profiles')
      .select('*, clinic:clinics(*), specialty:specialties(*)')
      .eq('clinic_id', clinicData.id);

    return {
      clinic: {
        ...clinicData,
        doctor_count: doctorsData?.length || 20,
        specialty_count: 12,
      },
      doctors: (doctorsData as DoctorProfile[]) || getMockDoctorsForClinic(clinicData.id, clinicData.name),
    };
  } catch (err) {
    const mock = MOCK_CLINICS.find((c) => c.slug === slug) || null;
    return {
      clinic: mock,
      doctors: mock ? getMockDoctorsForClinic(mock.id, mock.name) : [],
    };
  }
}

function getMockDoctorsForClinic(clinicId: string, clinicName: string): DoctorProfile[] {
  return [
    {
      id: 'doc-1',
      user_id: 'usr-1',
      specialty_id: 'spec-1',
      clinic_id: clinicId,
      full_name: 'PGS.TS.BS Nguyễn Văn Liệu',
      degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
      experience_years: 25,
      consultation_fee: 350000,
      bio: `Bác sĩ chuyên khoa đầu ngành công tác tại ${clinicName}. Chuyên gia về các bệnh lý Cơ xương khớp và Cột sống.`,
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      specialty: {
        id: 'spec-1',
        name: 'Cơ Xương Khớp',
        slug: 'co-xuong-khop',
        description: 'Chuyên khoa xương khớp',
        image_url: null,
        created_at: new Date().toISOString(),
      },
      average_rating: 4.9,
      total_reviews: 142,
    },
    {
      id: 'doc-3',
      user_id: 'usr-3',
      specialty_id: 'spec-3',
      clinic_id: clinicId,
      full_name: 'TS.BS Lê Hoàng Nam',
      degree: 'Tiến sĩ, Giảng viên Y khoa',
      experience_years: 15,
      consultation_fee: 280000,
      bio: `Trưởng khoa Nội soi tiêu hóa can thiệp tại ${clinicName}. Hơn 15 năm kinh nghiệm thực hành lâm sàng.`,
      avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      specialty: {
        id: 'spec-3',
        name: 'Tiêu Hóa - Gan Mật',
        slug: 'tieu-hoa-gan-mat',
        description: 'Chuyên khoa tiêu hóa',
        image_url: null,
        created_at: new Date().toISOString(),
      },
      average_rating: 4.9,
      total_reviews: 76,
    },
  ];
}
