import { createClient } from '@/lib/supabase/client';
import type { DoctorProfile, Specialty, Clinic } from '@/types/database.types';

export interface DoctorFilterParams {
  searchKeyword?: string;
  specialtySlug?: string;
  clinicSlug?: string;
  priceRange?: 'ALL' | 'UNDER_300' | '300_500' | 'ABOVE_500';
  sortBy?: 'RATING_DESC' | 'PRICE_ASC' | 'PRICE_DESC' | 'EXPERIENCE_DESC';
}

export interface DoctorWithDetails extends DoctorProfile {
  available_slots?: string[];
  reviews_list?: {
    id: string;
    patient_name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export const MOCK_DOCTORS: DoctorWithDetails[] = [
  {
    id: 'doc-1',
    user_id: 'usr-1',
    specialty_id: 'spec-1',
    clinic_id: 'clinic-1',
    full_name: 'PGS.TS.BS Nguyễn Văn Liệu',
    degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
    experience_years: 28,
    consultation_fee: 350000,
    bio: 'Nguyên Phó Trưởng khoa Thần kinh - Bệnh viện Bạch Mai. Trưởng khoa Khám bệnh - Bệnh viện Đại học Y Dược. Chuyên gia đầu ngành về Cơ xương khớp, Thoái hóa cột sống và Bệnh lý Thần kinh trung ương với hơn 28 năm kinh nghiệm thực hành lâm sàng.',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    average_rating: 4.9,
    total_reviews: 148,
    specialty: {
      id: 'spec-1',
      name: 'Cơ Xương Khớp',
      slug: 'co-xuong-khop',
      description: 'Chuyên khoa xương khớp',
      image_url: null,
      created_at: new Date().toISOString(),
    },
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
    available_slots: ['08:00', '08:30', '09:00', '10:00', '10:30', '14:00', '14:30', '15:30'],
    reviews_list: [
      {
        id: 'rev-1',
        patient_name: 'Trần Văn Mạnh',
        rating: 5,
        comment: 'Bác sĩ Liệu khám rất tận tình, giải thích chi tiết nguyên nhân đau thắt lưng của tôi và kê đơn thuốc rất hiệu quả.',
        date: '15/09/2026',
      },
      {
        id: 'rev-2',
        patient_name: 'Lê Thị Thu',
        rating: 5,
        comment: 'Khám đúng giờ đã hẹn qua BookingCare, không phải xếp hàng lấy số ở viện. Bác sĩ chuyên môn rất sâu.',
        date: '10/09/2026',
      },
    ],
  },
  {
    id: 'doc-2',
    user_id: 'usr-2',
    specialty_id: 'spec-4',
    clinic_id: 'clinic-2',
    full_name: 'ThS.BSCKII Trần Thị Mai Hương',
    degree: 'Thạc sĩ, Bác sĩ Chuyên khoa II',
    experience_years: 19,
    consultation_fee: 300000,
    bio: 'Bác sĩ điều trị cao cấp tại Khoa Tim mạch Can thiệp - Bệnh viện Chợ Rẫy. Từng tu nghiệp chuyên môn chuyên sâu về siêu âm tim và can thiệp mạch vành tại Đại học Quốc gia Singapore (NUS).',
    avatar_url: 'https://images.unsplash.com/photo-1594824813581-2292f7e025ff?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    average_rating: 4.8,
    total_reviews: 112,
    specialty: {
      id: 'spec-4',
      name: 'Tim Mạch & Mạch Máu',
      slug: 'tim-mach',
      description: 'Chuyên khoa tim mạch',
      image_url: null,
      created_at: new Date().toISOString(),
    },
    clinic: {
      id: 'clinic-2',
      name: 'Bệnh viện Chợ Rẫy',
      slug: 'benh-vien-cho-ray',
      address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh',
      phone: '028 3855 4137',
      description: 'Bệnh viện đa khoa đặc biệt hạng đặc biệt',
      image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    available_slots: ['09:00', '09:30', '10:30', '13:30', '14:30', '15:00'],
    reviews_list: [
      {
        id: 'rev-3',
        patient_name: 'Hoàng Anh Tuấn',
        rating: 5,
        comment: 'Bác sĩ tư vấn rất kỹ về tình trạng tăng huyết áp và hướng dẫn chế độ ăn uống kiêng muối rất chi tiết.',
        date: '12/09/2026',
      },
    ],
  },
  {
    id: 'doc-3',
    user_id: 'usr-3',
    specialty_id: 'spec-3',
    clinic_id: 'clinic-3',
    full_name: 'TS.BS Lê Hoàng Nam',
    degree: 'Tiến sĩ, Giảng viên Y khoa',
    experience_years: 16,
    consultation_fee: 280000,
    bio: 'Trưởng khoa Tiêu hóa & Nội soi can thiệp - Phòng khám Quốc tế CarePlus. Thành viên Hội Khoa học Tiêu hóa Việt Nam. Chuyên nội soi không đau và tầm soát ung thư sớm đường tiêu hóa.',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    average_rating: 4.9,
    total_reviews: 86,
    specialty: {
      id: 'spec-3',
      name: 'Tiêu Hóa - Gan Mật',
      slug: 'tieu-hoa-gan-mat',
      description: 'Chuyên khoa tiêu hóa',
      image_url: null,
      created_at: new Date().toISOString(),
    },
    clinic: {
      id: 'clinic-3',
      name: 'Phòng khám Đa khoa Quốc tế CarePlus',
      slug: 'phong-kham-careplus',
      address: '66-68 Nam Kỳ Khởi Nghĩa, Phường Nguyễn Thái Bình, Quận 1, TP. Hồ Chí Minh',
      phone: '1800 6116',
      description: 'Phòng khám chuẩn quốc tế Singapore',
      image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    available_slots: ['08:30', '09:00', '11:00', '13:30', '14:00', '16:00'],
    reviews_list: [
      {
        id: 'rev-4',
        patient_name: 'Nguyễn Thị Hoa',
        rating: 5,
        comment: 'Nội soi dạ dày ở đây êm ái, bác sĩ Nam nhẹ nhàng và dặn dò rất kỹ.',
        date: '08/09/2026',
      },
    ],
  },
  {
    id: 'doc-4',
    user_id: 'usr-4',
    specialty_id: 'spec-5',
    clinic_id: 'clinic-4',
    full_name: 'BSCKI Đỗ Thanh Tùng',
    degree: 'Bác sĩ Chuyên khoa I',
    experience_years: 12,
    consultation_fee: 250000,
    bio: 'Bác sĩ chuyên khoa Tai Mũi Họng - Bệnh viện Đa khoa Hồng Ngọc. Chuyên điều trị viêm xoang mãn tính, viêm amidan, ngủ ngáy và phẫu thuật nội soi mũi xoang chức năng.',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    average_rating: 4.7,
    total_reviews: 64,
    specialty: {
      id: 'spec-5',
      name: 'Tai Mũi Họng',
      slug: 'tai-mui-hong',
      description: 'Chuyên khoa tai mũi họng',
      image_url: null,
      created_at: new Date().toISOString(),
    },
    clinic: {
      id: 'clinic-4',
      name: 'Bệnh viện Đa khoa Hồng Ngọc',
      slug: 'benh-vien-hong-ngoc',
      address: '55 Yên Ninh, Trúc Bạch, Ba Đình, Hà Nội',
      phone: '024 3927 5568',
      description: 'Bệnh viện khách sạn chất lượng cao tại Hà Nội',
      image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    available_slots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:30'],
    reviews_list: [
      {
        id: 'rev-5',
        patient_name: 'Vũ Đức Thành',
        rating: 5,
        comment: 'Bác sĩ soi tai mũi họng rất nhẹ nhàng, bé nhà mình không hề sợ hãi.',
        date: '02/09/2026',
      },
    ],
  },
  {
    id: 'doc-5',
    user_id: 'usr-5',
    specialty_id: 'spec-6',
    clinic_id: 'clinic-1',
    full_name: 'TS.BS Phạm Quỳnh Giang',
    degree: 'Tiến sĩ, Bác sĩ Da liễu',
    experience_years: 15,
    consultation_fee: 320000,
    bio: 'Giảng viên Bộ môn Da liễu - Đại học Y Dược TP.HCM. Chuyên gia điều trị viêm da cơ địa, vảy nến, mụn trứng cá kháng trị và thẩm mỹ nội khoa.',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    average_rating: 4.9,
    total_reviews: 95,
    specialty: {
      id: 'spec-6',
      name: 'Da Liễu & Thẩm Mỹ',
      slug: 'da-lieu',
      description: 'Chuyên khoa da liễu',
      image_url: null,
      created_at: new Date().toISOString(),
    },
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
    available_slots: ['08:30', '10:00', '11:00', '13:30', '15:30'],
    reviews_list: [
      {
        id: 'rev-6',
        patient_name: 'Ngô Thanh Hà',
        rating: 5,
        comment: 'Da mình đỡ mụn viêm hẳn chỉ sau 2 tuần theo phác đồ của bác sĩ Giang.',
        date: '05/09/2026',
      },
    ],
  },
  {
    id: 'doc-6',
    user_id: 'usr-6',
    specialty_id: 'spec-2',
    clinic_id: 'clinic-2',
    full_name: 'GS.TS.BS Hoàng Minh Châu',
    degree: 'Giáo sư, Tiến sĩ, Bác sĩ',
    experience_years: 32,
    consultation_fee: 500000,
    bio: 'Chuyên gia cao cấp về Phẫu thuật Thần kinh & Cột sống. Hơn 30 năm kinh nghiệm phẫu thuật sọ não, u tủy sống và thoát vị đĩa đệm vi phẫu thuật.',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    average_rating: 5.0,
    total_reviews: 180,
    specialty: {
      id: 'spec-2',
      name: 'Thần Kinh & Đột Quỵ',
      slug: 'than-kinh',
      description: 'Chuyên khoa thần kinh',
      image_url: null,
      created_at: new Date().toISOString(),
    },
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
    available_slots: ['09:00', '10:00', '14:00', '15:00'],
    reviews_list: [
      {
        id: 'rev-7',
        patient_name: 'Bùi Đình Cương',
        rating: 5,
        comment: 'Giáo sư Châu khám rất cẩn thận, chẩn đoán chính xác tình trạng chèn ép rễ thần kinh của bố tôi.',
        date: '18/09/2026',
      },
    ],
  },
];

export async function searchDoctors(filters: DoctorFilterParams = {}): Promise<DoctorWithDetails[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('doctor_profiles')
      .select('*, clinic:clinics(*), specialty:specialties(*)');

    if (filters.searchKeyword && filters.searchKeyword.trim()) {
      query = query.ilike('full_name', `%${filters.searchKeyword.trim()}%`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return applyLocalDoctorFilters(MOCK_DOCTORS, filters);
    }

    // Attach mock ratings and slots if missing in DB
    const enrichedData: DoctorWithDetails[] = data.map((doc: any) => ({
      ...doc,
      average_rating: doc.average_rating || 4.9,
      total_reviews: doc.total_reviews || 95,
      available_slots: ['08:30', '09:30', '10:30', '14:00', '15:30'],
    }));

    return applyLocalDoctorFilters(enrichedData, filters);
  } catch (err) {
    console.warn('Using local mock doctors fallback:', err);
    return applyLocalDoctorFilters(MOCK_DOCTORS, filters);
  }
}

export async function getDoctorById(id: string): Promise<DoctorWithDetails | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('doctor_profiles')
      .select('*, clinic:clinics(*), specialty:specialties(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return MOCK_DOCTORS.find((d) => d.id === id) || MOCK_DOCTORS[0];
    }

    return {
      ...data,
      average_rating: data.average_rating || 4.9,
      total_reviews: data.total_reviews || 120,
      available_slots: ['08:00', '08:30', '09:00', '10:00', '10:30', '14:00', '14:30', '15:30'],
      reviews_list: [
        {
          id: 'rev-auto-1',
          patient_name: 'Nguyễn Thanh Tùng',
          rating: 5,
          comment: 'Bác sĩ rất thân thiện và giải đáp cặn kẽ mọi thắc mắc của người bệnh.',
          date: 'Hôm qua',
        },
        {
          id: 'rev-auto-2',
          patient_name: 'Đặng Ngọc Mai',
          rating: 5,
          comment: 'Đặt lịch hẹn trước qua ứng dụng rất tiện lợi, không phải chờ đợi lâu.',
          date: '3 ngày trước',
        },
      ],
    };
  } catch (err) {
    return MOCK_DOCTORS.find((d) => d.id === id) || MOCK_DOCTORS[0];
  }
}

function applyLocalDoctorFilters(
  list: DoctorWithDetails[],
  filters: DoctorFilterParams
): DoctorWithDetails[] {
  let result = [...list];

  // 1. Filter Keyword
  if (filters.searchKeyword && filters.searchKeyword.trim()) {
    const kw = filters.searchKeyword.trim().toLowerCase();
    result = result.filter(
      (d) =>
        d.full_name.toLowerCase().includes(kw) ||
        (d.specialty && d.specialty.name.toLowerCase().includes(kw)) ||
        (d.clinic && d.clinic.name.toLowerCase().includes(kw))
    );
  }

  // 2. Filter Specialty
  if (filters.specialtySlug && filters.specialtySlug !== 'ALL') {
    result = result.filter(
      (d) => d.specialty && d.specialty.slug === filters.specialtySlug
    );
  }

  // 3. Filter Clinic
  if (filters.clinicSlug && filters.clinicSlug !== 'ALL') {
    result = result.filter(
      (d) => d.clinic && d.clinic.slug === filters.clinicSlug
    );
  }

  // 4. Filter Price Range
  if (filters.priceRange && filters.priceRange !== 'ALL') {
    if (filters.priceRange === 'UNDER_300') {
      result = result.filter((d) => d.consultation_fee < 300000);
    } else if (filters.priceRange === '300_500') {
      result = result.filter(
        (d) => d.consultation_fee >= 300000 && d.consultation_fee <= 500000
      );
    } else if (filters.priceRange === 'ABOVE_500') {
      result = result.filter((d) => d.consultation_fee > 500000);
    }
  }

  // 5. Sorting
  if (filters.sortBy) {
    if (filters.sortBy === 'PRICE_ASC') {
      result.sort((a, b) => a.consultation_fee - b.consultation_fee);
    } else if (filters.sortBy === 'PRICE_DESC') {
      result.sort((a, b) => b.consultation_fee - a.consultation_fee);
    } else if (filters.sortBy === 'EXPERIENCE_DESC') {
      result.sort((a, b) => b.experience_years - a.experience_years);
    } else {
      // Default: RATING_DESC
      result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    }
  }

  return result;
}
