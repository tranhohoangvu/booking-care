import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Specialty, DoctorProfile } from '@/types/database.types';

export interface SpecialtyWithCount extends Specialty {
  doctor_count: number;
}

export const MOCK_SPECIALTIES: SpecialtyWithCount[] = [
  {
    id: 'spec-1',
    name: 'Cơ Xương Khớp',
    slug: 'co-xuong-khop',
    description: 'Chuyên khám và điều trị các bệnh lý thoái hóa khớp, cột sống, đau thần kinh tọa, loãng xương và chấn thương thể thao.',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 45,
  },
  {
    id: 'spec-2',
    name: 'Thần Kinh & Đột Quỵ',
    slug: 'than-kinh',
    description: 'Khám chữa các bệnh đau đầu, rối loạn giấc ngủ, tai biến mạch máu não, động kinh và bệnh lý thần kinh ngoại biên.',
    image_url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 28,
  },
  {
    id: 'spec-3',
    name: 'Tiêu Hóa - Gan Mật',
    slug: 'tieu-hoa-gan-mat',
    description: 'Điều trị các bệnh dạ dày, đại tràng, trĩ, viêm gan B-C, sỏi mật, nội soi tiêu hóa không đau với công nghệ phóng đại.',
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 39,
  },
  {
    id: 'spec-4',
    name: 'Tim Mạch & Mạch Máu',
    slug: 'tim-mach',
    description: 'Khám điều trị tăng huyết áp, suy tim, bệnh mạch vành, rối loạn nhịp tim và can thiệp mạch máu chuyên sâu.',
    image_url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 32,
  },
  {
    id: 'spec-5',
    name: 'Tai Mũi Họng',
    slug: 'tai-mui-hong',
    description: 'Điều trị viêm xoang, viêm amidan, ù tai, phẫu thuật nội soi vi phẫu thanh quản và tầm soát ung thư vòm họng sớm.',
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 30,
  },
  {
    id: 'spec-6',
    name: 'Da Liễu & Thẩm Mỹ',
    slug: 'da-lieu',
    description: 'Điều trị mụn trứng cá, viêm da cơ địa, nám, tàn nhang, nấm da, sẹo lồi và phục hồi cấu trúc da liễu.',
    image_url: 'https://images.unsplash.com/photo-1512290900672-1f5be62e92c2?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 25,
  },
  {
    id: 'spec-7',
    name: 'Nhi Khoa',
    slug: 'nhi-khoa',
    description: 'Khám tổng quát, tư vấn dinh dưỡng, tiêm chủng và điều trị các bệnh lý hô hấp, tiêu hóa thường gặp ở trẻ nhỏ.',
    image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 22,
  },
  {
    id: 'spec-8',
    name: 'Mắt - Nhãn Khoa',
    slug: 'mat-nhan-khoa',
    description: 'Khám khúc xạ cận - viễn - loạn, phẫu thuật Phaco đục thủy tinh thể, điều trị bệnh lý võng mạc và glôcôm.',
    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 18,
  },
];

export async function getAllSpecialties(): Promise<SpecialtyWithCount[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_SPECIALTIES;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('specialties')
      .select('*, doctor_profiles(count)');

    if (error || !data || data.length === 0) {
      return MOCK_SPECIALTIES;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      image_url: item.image_url,
      created_at: item.created_at,
      doctor_count: item.doctor_profiles?.[0]?.count || 12,
    }));
  } catch (err) {
    console.warn('Using mock specialties fallback:', err);
    return MOCK_SPECIALTIES;
  }
}

export async function getSpecialtyBySlug(slug: string): Promise<{
  specialty: SpecialtyWithCount | null;
  doctors: DoctorProfile[];
}> {
  if (!isSupabaseConfigured()) {
    const mock = MOCK_SPECIALTIES.find((s) => s.slug === slug) || null;
    return {
      specialty: mock,
      doctors: mock ? getMockDoctorsForSpecialty(mock.name) : [],
    };
  }

  try {
    const supabase = createClient();
    const { data: specialtyData, error } = await supabase
      .from('specialties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !specialtyData) {
      const mock = MOCK_SPECIALTIES.find((s) => s.slug === slug) || null;
      return {
        specialty: mock,
        doctors: mock ? getMockDoctorsForSpecialty(mock.name) : [],
      };
    }

    const { data: doctorsData } = await supabase
      .from('doctor_profiles')
      .select('*, clinic:clinics(*), specialty:specialties(*)')
      .eq('specialty_id', specialtyData.id);

    return {
      specialty: {
        ...specialtyData,
        doctor_count: doctorsData?.length || 10,
      },
      doctors: (doctorsData as DoctorProfile[]) || getMockDoctorsForSpecialty(specialtyData.name),
    };
  } catch (err) {
    const mock = MOCK_SPECIALTIES.find((s) => s.slug === slug) || null;
    return {
      specialty: mock,
      doctors: mock ? getMockDoctorsForSpecialty(mock.name) : [],
    };
  }
}

function getMockDoctorsForSpecialty(specialtyName: string): DoctorProfile[] {
  return [
    {
      id: 'doc-1',
      user_id: 'usr-1',
      specialty_id: 'spec-1',
      clinic_id: 'clinic-1',
      full_name: 'PGS.TS.BS Nguyễn Văn Liệu',
      degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
      experience_years: 25,
      consultation_fee: 350000,
      bio: 'Nguyên Trưởng khoa Khám bệnh - Bệnh viện Đại học Y Dược. Hơn 25 năm kinh nghiệm điều trị các bệnh lý chuyên sâu.',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      clinic: {
        id: 'clinic-1',
        name: 'Bệnh viện Đại học Y Dược TP.HCM',
        slug: 'benh-vien-dai-hoc-y-duoc',
        address: '215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh',
        phone: '028 3855 4269',
        description: 'Bệnh viện đa khoa đầu ngành miền Nam',
        image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
      },
      average_rating: 4.9,
      total_reviews: 142,
    },
    {
      id: 'doc-2',
      user_id: 'usr-2',
      specialty_id: 'spec-1',
      clinic_id: 'clinic-2',
      full_name: 'ThS.BSCKII Trần Thị Mai Hương',
      degree: 'Thạc sĩ, Bác sĩ Chuyên khoa II',
      experience_years: 18,
      consultation_fee: 300000,
      bio: 'Bác sĩ điều trị cao cấp tại Bệnh viện Chợ Rẫy. Từng tu nghiệp chuyên môn chuyên sâu tại Nhật Bản và Singapore.',
      avatar_url: 'https://images.unsplash.com/photo-1594824813581-2292f7e025ff?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      clinic: {
        id: 'clinic-2',
        name: 'Bệnh viện Chợ Rẫy',
        slug: 'benh-vien-cho-ray',
        address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh',
        phone: '028 3855 4137',
        description: 'Bệnh viện đa khoa hạng đặc biệt',
        image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
      },
      average_rating: 4.8,
      total_reviews: 98,
    },
  ];
}
