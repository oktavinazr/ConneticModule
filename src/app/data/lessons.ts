// Lesson content data structure
export interface Stage {
  type: 'constructivism' | 'inquiry' | 'questioning' | 'learning-community' | 'modeling' | 'reflection' | 'authentic-assessment';
  title: string;
  description: string;
  objectiveCode?: string;
  objectiveDescription?: string;

  // ── CONSTRUCTIVISM ──────────────────────────────────────────────────
  apersepsi?: string;                              // Experience-based opening scenario
  question?: string;
  options?: Array<{ id: string; text: string }>;   // Multiple-choice options
  correctAnswer?: string;                          // Correct option id
  feedback?: { correct: string; incorrect: string };
  videoUrl?: string;                               // YouTube URL or local path

  // ── INQUIRY ─────────────────────────────────────────────────────
  explorationSections?: Array<{                    // Clickable accordion sections
    id: string;
    title: string;
    content: string;
    example?: string;
  }>;
  groups?: Array<{                                 // Drop-zone categories for grouping
    id: string;
    label: string;
    colorClass: 'blue' | 'green' | 'purple' | 'amber';
  }>;
  groupItems?: Array<{                             // Items to drag into groups
    id: string;
    text: string;
    correctGroup: string;
  }>;

  // ── QUESTIONING ─────────────────────────────────────────────────
  teacherImage?: string;                           // URL or path to teacher avatar
  teacherQuestion?: string;                        // Question from teacher representation
  questionBank?: Array<{                           // Questions student can "ask"
    id: string;
    text: string;
    response: string;                              // Automatic response from media
  }>;
  scenario?: string;                               // Contextual situation for "why" question
  whyQuestion?: string;                            // The "why" question
  hint?: string;                                   // Optional hint text
  reasonOptions?: Array<{                          // Reason-selection options
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;

  // ── LEARNING COMMUNITY ──────────────────────────────────────────
  matchingPairs?: Array<{ left: string; right: string }>;
  caseScenario?: {
    title: string;
    description: string;
    question: string;
    options: Array<{ id: string; text: string; isCorrect: boolean; feedback: string }>;
  };
  peerAnswers?: Array<{ name: string; role: string; answer: string; score?: number }>; // score for sorting
  groupActivity?: { groupNames: string[] };          // Group names for student grouping

  // ── MODELING ────────────────────────────────────────────────────
  modelingSteps?: Array<{                          // Interactive step-by-step
    id: string;
    type: 'example' | 'practice';
    title: string;
    content: string;
    interactiveAction?: string;                    // Instruction for simulation
    simulationState?: any;                         // Target state for practice
  }>;
  steps?: Array<{                                  // Step-by-step navigation
    id: string;
    title: string;
    description: string;
    visual: string;                                // emoji or short icon label
  }>;
  items?: Array<{ id: string; text: string; order: number }>; // Drag-drop ordering

  // ── REFLECTION ──────────────────────────────────────────────────
  essayReflection?: {
    materialSummaryPrompt: string;
    easyPartPrompt: string;
    hardPartPrompt: string;
  };
  reflectionPrompts?: string[];                     // Ordered reflection prompt labels
  initialKnowledgeContext?: string;                // Reference to opening answer
  reflectionQuestion?: string;                     // Single short-answer question
  selfEvaluationCriteria?: Array<{ id: string; label: string }>;

  // ── AUTHENTIC ASSESSMENT ────────────────────────────────────────
  branchingScenario?: {
    context: string;
    initialQuestion: string;
    choices: Array<{
      id: string;
      text: string;
      isOptimal: boolean;
      consequence: string;
      followUpQuestion?: string;
      followUpChoices?: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        explanation: string;
      }>;
    }>;
    finalEvaluation: string;
  };
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  description: string;
  objectives: string[];
  initialCompetencies: string[];
  materials?: string[];
  pretest: {
    questions: TestQuestion[];
  };
  stages: Stage[];
  posttest: {
    questions: TestQuestion[];
  };
}

export type StageType = Stage['type'];

export interface StageLearningObjective {
  code: string;
  description: string;
}

export const stageDisplayTitles: Record<StageType, string> = {
  constructivism: 'Constructivism',
  inquiry: 'Inquiry',
  questioning: 'Questioning',
  'learning-community': 'Learning Community',
  modeling: 'Modeling',
  reflection: 'Reflection',
  'authentic-assessment': 'Authentic Assessment',
};

export function getStageDisplayTitle(stageType: StageType) {
  return stageDisplayTitles[stageType];
}

export const lessonMainObjectives: Record<string, string> = {
  '1': 'Pada pertemuan ini, peserta didik mempelajari konsep dasar TCP, fungsi utama, mekanisme kerja, dan peran lapisan TCP melalui rangkaian aktivitas CTL interaktif agar mampu menjelaskan serta menerapkan penggunaan TCP secara logis, runtut, dan sistematis.',
  '2': 'Pada pertemuan ini, peserta didik mempelajari konsep dasar IP Address, fungsi pengalamatan, komponen utama, serta proses pengiriman data berbasis IP melalui aktivitas CTL interaktif agar mampu memahami dan menerapkan pengalamatan jaringan secara tepat.',
  '3': 'Pada pertemuan ini, peserta didik mempelajari struktur IPv4, pengelompokan kelas alamat, subnet mask, dan dasar subnetting melalui aktivitas CTL interaktif agar mampu menganalisis serta menyusun penggunaan alamat IPv4 secara sistematis.',
  '4': 'Pada pertemuan ini, peserta didik mempelajari struktur IPv6, jenis alamat, fitur unggulan, serta mekanisme transisi dari IPv4 ke IPv6 melalui aktivitas CTL interaktif agar mampu memahami kebutuhan dan penerapan IPv6 secara logis dan menyeluruh.',
};

export const stageLearningObjectivesByLesson: Record<string, Partial<Record<StageType, StageLearningObjective[]>>> = {
  '1': {
    constructivism: [
      {
        code: 'X.TCP.1',
        description: '(A) Peserta didik (B) mampu mendefinisikan TCP dalam jaringan komputer dan telekomunikasi (C) melalui aktivitas constructivism berupa apersepsi berbasis pengalaman penggunaan internet pada media CONNETIC Module (D) dengan tepat.',
      },
      {
        code: 'X.TCP.2',
        description: '(A) Peserta didik (B) mampu menentukan fungsi utama TCP (C) melalui aktivitas constructivism berupa multiple choice interaktif disertai alasan sederhana pada media CONNETIC Module (D) dengan benar.',
      },
    ],
    inquiry: [
      {
        code: 'X.TCP.3',
        description: '(A) Peserta didik (B) mampu menguraikan mekanisme kerja TCP (C) melalui aktivitas inquiry berupa klik eksplorasi bagian proses yang dilengkapi umpan balik pada media CONNETIC Module (D) secara runtut.',
      },
      {
        code: 'X.TCP.4',
        description: '(A) Peserta didik (B) mampu mengkategorikan jenis mekanisme kerja TCP (C) melalui aktivitas inquiry berupa drag and drop pengelompokan tahapan mekanisme kerja TCP pada media CONNETIC Module (D) secara runtut dan tepat.',
      },
    ],
    questioning: [
      {
        code: 'X.TCP.5',
        description: '(A) Peserta didik (B) mampu membedakan jenis mekanisme kerja TCP (C) melalui aktivitas questioning berupa pilih alasan dan respon pertanyaan mengapa serta fitur bantuan pada media CONNETIC Module (D) dengan alasan yang logis.',
      },
    ],
    'learning-community': [
      {
        code: 'X.TCP.6',
        description: '(A) Peserta didik (B) mampu mengidentifikasi lapisan model TCP (C) melalui aktivitas learning community berupa matching sinyal TCP dan fungsi serta melihat jawaban peserta lain secara terbatas pada media CONNETIC Module (D) secara tepat dan logis.',
      },
      {
        code: 'X.TCP.7',
        description: '(A) Peserta didik (B) mampu menerapkan fungsi lapisan TCP (C) melalui aktivitas learning community berupa studi kasus interaktif yang memungkinkan perbandingan jawaban pada media CONNETIC Module (D) secara logis.',
      },
    ],
    modeling: [
      {
        code: 'X.TCP.8',
        description: '(A) Peserta didik (B) mampu mengurutkan proses kerja lapisan TCP (C) melalui aktivitas modeling berupa animasi step-by-step alur kerja TCP yang dilanjutkan dengan latihan penyusunan urutan pada media CONNETIC Module (D) secara sistematis.',
      },
    ],
    reflection: [
      {
        code: 'X.TCP.9',
        description: '(A) Peserta didik (B) mampu menjelaskan alur kerja lapisan TCP (C) melalui aktivitas reflection berupa input jawaban singkat yang dilengkapi perbandingan pemahaman awal dan akhir serta self-evaluation pada media CONNETIC Module (D) secara logis dan mendalam.',
      },
    ],
    'authentic-assessment': [
      {
        code: 'X.TCP.10',
        description: '(A) Peserta didik (B) mampu mengaitkan hubungan antara fungsi, mekanisme, dan lapisan TCP (C) melalui aktivitas authentic assessment berupa studi kasus bercabang pada media CONNETIC Module (D) secara tepat, logis, dan menyeluruh.',
      },
    ],
  },
  '2': {
    constructivism: [
      {
        code: 'X.IP.1',
        description: '(A) Peserta didik (B) mampu mendefinisikan IP Address dalam jaringan komputer (C) melalui aktivitas constructivism berupa apersepsi berbasis pengalaman penggunaan internet pada media CONNETIC Module (D) dengan tepat.',
      },
      {
        code: 'X.IP.2',
        description: '(A) Peserta didik (B) mampu menentukan fungsi utama IP Address (C) melalui aktivitas constructivism berupa multiple choice interaktif disertai alasan sederhana pada media CONNETIC Module (D) dengan benar.',
      },
    ],
    inquiry: [
      {
        code: 'X.IP.3',
        description: '(A) Peserta didik (B) mampu menguraikan mekanisme pengalamatan IP (C) melalui aktivitas inquiry berupa klik eksplorasi bagian Network ID, Host ID, subnet mask, gateway, dan jenis IP pada media CONNETIC Module (D) secara runtut.',
      },
      {
        code: 'X.IP.4',
        description: '(A) Peserta didik (B) mampu mengkategorikan jenis IP Address (C) melalui aktivitas inquiry berupa drag and drop pengelompokan komponen dan konsep IP Address pada media CONNETIC Module (D) secara runtut dan tepat.',
      },
    ],
    questioning: [
      {
        code: 'X.IP.5',
        description: '(A) Peserta didik (B) mampu membedakan jenis IP Address (C) melalui aktivitas questioning berupa pilih alasan tentang komunikasi IP private dan IP public serta fitur bantuan pada media CONNETIC Module (D) dengan alasan yang logis.',
      },
    ],
    'learning-community': [
      {
        code: 'X.IP.6',
        description: '(A) Peserta didik (B) mampu mengidentifikasi komponen IP Address (C) melalui aktivitas learning community berupa matching kelas alamat dan rentangnya serta melihat jawaban peserta lain secara terbatas pada media CONNETIC Module (D) secara tepat dan logis.',
      },
      {
        code: 'X.IP.7',
        description: '(A) Peserta didik (B) mampu menerapkan komponen IP Address (C) melalui aktivitas learning community berupa studi kasus desain jaringan sekolah yang memungkinkan perbandingan jawaban pada media CONNETIC Module (D) secara logis.',
      },
    ],
    modeling: [
      {
        code: 'X.IP.8',
        description: '(A) Peserta didik (B) mampu mengurutkan proses pengalamatan IP (C) melalui aktivitas modeling berupa animasi step-by-step alur pengiriman data berbasis IP yang dilanjutkan dengan latihan penyusunan urutan pada media CONNETIC Module (D) secara sistematis.',
      },
    ],
    reflection: [
      {
        code: 'X.IP.9',
        description: '(A) Peserta didik (B) mampu menjelaskan alur pengiriman data berbasis IP (C) melalui aktivitas reflection berupa input jawaban singkat yang dilengkapi perbandingan pemahaman awal dan akhir serta self-evaluation pada media CONNETIC Module (D) secara logis dan mendalam.',
      },
    ],
    'authentic-assessment': [
      {
        code: 'X.IP.10',
        description: '(A) Peserta didik (B) mampu mengaitkan hubungan antara fungsi, jenis, dan komponen IP Address (C) melalui aktivitas authentic assessment berupa studi kasus bercabang pada media CONNETIC Module (D) secara tepat, logis, dan menyeluruh.',
      },
    ],
  },
  '3': {
    constructivism: [
      {
        code: 'X.IPv4.1',
        description: '(A) Peserta didik (B) mampu mendefinisikan IPv4 dalam jaringan komputer (C) melalui aktivitas constructivism berupa apersepsi berbasis pengalaman penggunaan alamat IP pada media CONNETIC Module (D) dengan tepat.',
      },
      {
        code: 'X.IPv4.2',
        description: '(A) Peserta didik (B) mampu menentukan fungsi utama IPv4 (C) melalui aktivitas constructivism berupa multiple choice interaktif disertai alasan sederhana pada media CONNETIC Module (D) dengan benar.',
      },
    ],
    inquiry: [
      {
        code: 'X.IPv4.3',
        description: '(A) Peserta didik (B) mampu menguraikan struktur IPv4 (C) melalui aktivitas inquiry berupa klik eksplorasi kelas-kelas IPv4 dan subnet mask pada media CONNETIC Module (D) secara runtut.',
      },
      {
        code: 'X.IPv4.4',
        description: '(A) Peserta didik (B) mampu mengkategorikan kelas IPv4 (C) melalui aktivitas inquiry berupa drag and drop pengelompokan alamat berdasarkan karakteristik kelas pada media CONNETIC Module (D) secara runtut dan tepat.',
      },
    ],
    questioning: [
      {
        code: 'X.IPv4.5',
        description: '(A) Peserta didik (B) mampu membedakan kelas IPv4 (C) melalui aktivitas questioning berupa pilih alasan berdasarkan analisis alamat dan subnet serta fitur bantuan pada media CONNETIC Module (D) dengan alasan yang logis.',
      },
    ],
    'learning-community': [
      {
        code: 'X.IPv4.6',
        description: '(A) Peserta didik (B) mampu mengidentifikasi subnet mask IPv4 (C) melalui aktivitas learning community berupa matching kelas IPv4 dan subnet mask serta melihat jawaban peserta lain secara terbatas pada media CONNETIC Module (D) secara tepat dan logis.',
      },
      {
        code: 'X.IPv4.7',
        description: '(A) Peserta didik (B) mampu menerapkan subnetting IPv4 (C) melalui aktivitas learning community berupa studi kasus interaktif pembagian jaringan yang memungkinkan perbandingan jawaban pada media CONNETIC Module (D) secara logis.',
      },
    ],
    modeling: [
      {
        code: 'X.IPv4.8',
        description: '(A) Peserta didik (B) mampu mengurutkan proses perhitungan subnet (C) melalui aktivitas modeling berupa animasi step-by-step perhitungan subnet yang dilanjutkan dengan latihan penyusunan urutan pada media CONNETIC Module (D) secara sistematis.',
      },
    ],
    reflection: [
      {
        code: 'X.IPv4.9',
        description: '(A) Peserta didik (B) mampu menjelaskan alur pembagian jaringan IPv4 (C) melalui aktivitas reflection berupa input jawaban singkat yang dilengkapi perbandingan pemahaman awal dan akhir serta self-evaluation pada media CONNETIC Module (D) secara logis dan mendalam.',
      },
    ],
    'authentic-assessment': [
      {
        code: 'X.IPv4.10',
        description: '(A) Peserta didik (B) mampu mengaitkan hubungan antara struktur, kelas, dan subnetting IPv4 (C) melalui aktivitas authentic assessment berupa studi kasus bercabang pada media CONNETIC Module (D) secara tepat, logis, dan menyeluruh.',
      },
    ],
  },
  '4': {
    constructivism: [
      {
        code: 'X.IPv6.1',
        description: '(A) Peserta didik (B) mampu mendefinisikan IPv6 dalam jaringan komputer (C) melalui aktivitas constructivism berupa apersepsi berbasis pengalaman penggunaan internet modern pada media CONNETIC Module (D) dengan tepat.',
      },
      {
        code: 'X.IPv6.2',
        description: '(A) Peserta didik (B) mampu menentukan fungsi utama IPv6 (C) melalui aktivitas constructivism berupa multiple choice interaktif disertai alasan sederhana pada media CONNETIC Module (D) dengan benar.',
      },
    ],
    inquiry: [
      {
        code: 'X.IPv6.3',
        description: '(A) Peserta didik (B) mampu menguraikan struktur IPv6 (C) melalui aktivitas inquiry berupa klik eksplorasi bagian karakteristik, penulisan, dan ruang alamat IPv6 pada media CONNETIC Module (D) secara runtut.',
      },
      {
        code: 'X.IPv6.4',
        description: '(A) Peserta didik (B) mampu mengkategorikan jenis alamat IPv6 (C) melalui aktivitas inquiry berupa drag and drop pengelompokan jenis alamat dan fitur IPv6 pada media CONNETIC Module (D) secara runtut dan tepat.',
      },
    ],
    questioning: [
      {
        code: 'X.IPv6.5',
        description: '(A) Peserta didik (B) mampu membedakan jenis alamat IPv6 (C) melalui aktivitas questioning berupa pilih alasan berdasarkan analisis penggunaan alamat IPv6 serta fitur bantuan pada media CONNETIC Module (D) dengan alasan yang logis.',
      },
    ],
    'learning-community': [
      {
        code: 'X.IPv6.6',
        description: '(A) Peserta didik (B) mampu mengidentifikasi fitur unggulan IPv6 (C) melalui aktivitas learning community berupa matching fitur IPv6 dan fungsinya serta melihat jawaban peserta lain secara terbatas pada media CONNETIC Module (D) secara tepat dan logis.',
      },
      {
        code: 'X.IPv6.7',
        description: '(A) Peserta didik (B) mampu menerapkan fitur IPv6 (C) melalui aktivitas learning community berupa studi kasus interaktif implementasi jaringan modern yang memungkinkan perbandingan jawaban pada media CONNETIC Module (D) secara logis.',
      },
    ],
    modeling: [
      {
        code: 'X.IPv6.8',
        description: '(A) Peserta didik (B) mampu mengurutkan proses transisi IPv4 ke IPv6 (C) melalui aktivitas modeling berupa animasi step-by-step tahapan transisi yang dilanjutkan dengan latihan penyusunan urutan pada media CONNETIC Module (D) secara sistematis.',
      },
    ],
    reflection: [
      {
        code: 'X.IPv6.9',
        description: '(A) Peserta didik (B) mampu menjelaskan alur kerja IPv6 (C) melalui aktivitas reflection berupa input jawaban singkat yang dilengkapi perbandingan pemahaman awal dan akhir serta self-evaluation pada media CONNETIC Module (D) secara logis dan mendalam.',
      },
    ],
    'authentic-assessment': [
      {
        code: 'X.IPv6.10',
        description: '(A) Peserta didik (B) mampu mengaitkan hubungan antara fungsi, struktur, dan transisi IPv6 (C) melalui aktivitas authentic assessment berupa studi kasus bercabang pada media CONNETIC Module (D) secara tepat, logis, dan menyeluruh.',
      },
    ],
  },
};

// Global pretest (must be completed before accessing any lessons)
export const globalPretest = {
  title: 'Pre-Test Umum',
  description: 'Tes ini mengukur pemahaman awal Anda tentang jaringan komputer',
  questions: [
    {
      question: 'Apa kepanjangan dari TCP/IP?',
      options: [
        'Transmission Control Protocol/Internet Protocol',
        'Transfer Control Protocol/Internet Protocol',
        'Technical Control Protocol/Internet Protocol',
        'Transmission Connection Protocol/Internet Protocol',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Apa fungsi utama IP Address?',
      options: [
        'Mengidentifikasi perangkat dalam jaringan',
        'Mempercepat koneksi internet',
        'Mengenkripsi data',
        'Menyimpan data',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Berapa bit yang digunakan dalam IPv4?',
      options: ['16 bit', '32 bit', '64 bit', '128 bit'],
      correctAnswer: 1,
    },
    {
      question: 'Apa perbedaan utama IPv4 dan IPv6?',
      options: [
        'Jumlah bit dan kapasitas alamat',
        'Kecepatan koneksi',
        'Tingkat keamanan',
        'Tidak ada perbedaan',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Protokol manakah yang connection-oriented?',
      options: ['UDP', 'TCP', 'HTTP', 'FTP'],
      correctAnswer: 1,
    },
    {
      question: 'Apa fungsi subnet mask?',
      options: [
        'Membedakan bagian network dan host',
        'Mempercepat koneksi',
        'Mengenkripsi data',
        'Menyimpan password',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Alamat 192.168.1.1 termasuk IP Address...',
      options: ['Public', 'Private', 'Loopback', 'Broadcast'],
      correctAnswer: 1,
    },
    {
      question: 'Berapa kelompok heksadesimal dalam IPv6?',
      options: ['4 kelompok', '6 kelompok', '8 kelompok', '16 kelompok'],
      correctAnswer: 2,
    },
    {
      question: 'Apa kepanjangan dari UDP?',
      options: [
        'User Datagram Protocol',
        'Universal Data Protocol',
        'Uniform Datagram Protocol',
        'User Data Protocol',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Protokol yang memberikan IP Address secara otomatis adalah...',
      options: ['DNS', 'DHCP', 'HTTP', 'FTP'],
      correctAnswer: 1,
    },
  ] as TestQuestion[],
};

// Global posttest (available after all lessons completed)
export const globalPosttest = {
  title: 'Post-Test Umum',
  description: 'Tes ini mengukur pemahaman akhir Anda setelah menyelesaikan semua pertemuan',
  questions: [
    {
      question: 'Dalam three-way handshake TCP, urutan paket yang benar adalah...',
      options: ['SYN, ACK, SYN-ACK', 'SYN, SYN-ACK, ACK', 'ACK, SYN, SYN-ACK', 'SYN-ACK, SYN, ACK'],
      correctAnswer: 1,
    },
    {
      question: 'IP Address 172.16.50.10 termasuk kelas...',
      options: ['Kelas A', 'Kelas B', 'Kelas C', 'Kelas D'],
      correctAnswer: 1,
    },
    {
      question: 'Subnet mask 255.255.255.192 sama dengan CIDR...',
      options: ['/24', '/25', '/26', '/27'],
      correctAnswer: 2,
    },
    {
      question: 'Alamat loopback IPv6 adalah...',
      options: ['::1', '127.0.0.1', 'fe80::1', 'ff00::1'],
      correctAnswer: 0,
    },
    {
      question: 'Flow control pada TCP berfungsi untuk...',
      options: [
        'Mengatur kecepatan pengiriman data',
        'Mengenkripsi data',
        'Mempercepat koneksi',
        'Memblokir virus',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Range IP kelas C adalah...',
      options: [
        '192.0.0.0 - 223.255.255.255',
        '128.0.0.0 - 191.255.255.255',
        '1.0.0.0 - 126.255.255.255',
        '224.0.0.0 - 239.255.255.255',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Jumlah maksimal alamat yang dapat disediakan IPv6 adalah...',
      options: ['2^32', '2^64', '2^128', '2^256'],
      correctAnswer: 2,
    },
    {
      question: 'NAT digunakan untuk...',
      options: [
        'Menghemat penggunaan IP public',
        'Mempercepat koneksi',
        'Mengenkripsi data',
        'Memblokir malware',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Perbedaan TCP dan UDP yang paling mendasar adalah...',
      options: [
        'TCP reliable dan connection-oriented, UDP unreliable dan connectionless',
        'TCP lebih cepat dari UDP',
        'UDP lebih aman dari TCP',
        'TCP hanya untuk web',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Metode transisi dari IPv4 ke IPv6 adalah...',
      options: [
        'Dual Stack, Tunneling, Translation',
        'Hanya Dual Stack',
        'Langsung replace',
        'Tidak bisa transisi',
      ],
      correctAnswer: 0,
    },
  ] as TestQuestion[],
};

export const lessons: Record<string, Lesson> = {
  '1': {
    id: '1',
    title: 'Pertemuan 1',
    topic: 'Konsep Dasar TCP',
    description: 'Memahami konsep dasar Transmission Control Protocol (TCP) dalam jaringan komputer',
    objectives: [
      'X.TCP.1 : Mampu mendefinisikan TCP dalam jaringan komputer dan telekomunikasi',
      'X.TCP.2 : Mampu menentukan fungsi utama TCP',
      'X.TCP.3 : Mampu menguraikan mekanisme kerja TCP',
      'X.TCP.4 : Mampu mengkategorikan jenis mekanisme kerja TCP',
      'X.TCP.5 : Mampu membedakan jenis mekanisme kerja TCP disertai alasan yang logis',
      'X.TCP.6 : Mampu mengidentifikasi lapisan model TCP',
      'X.TCP.7 : Mampu menerapkan fungsi lapisan TCP dalam konteks kasus',
      'X.TCP.8 : Mampu mengurutkan proses kerja lapisan TCP secara sistematis',
      'X.TCP.9 : Mampu menjelaskan alur kerja lapisan TCP secara logis dan mendalam',
      'X.TCP.10 : Mampu mengaitkan fungsi, mekanisme, dan lapisan TCP secara menyeluruh',
    ],
    initialCompetencies: [
      'Siswa sudah mengenal konsep dasar jaringan komputer',
      'Siswa memahami pengertian protokol komunikasi',
      'Siswa mengetahui perbedaan antara pengirim dan penerima data',
    ],
    materials: [
      'Pengertian TCP (Transmission Control Protocol)',
      'Fungsi utama TCP dalam jaringan komputer',
      'Mekanisme kerja TCP (Three-Way Handshake, Flow Control, Error Control)',
      'Kategori jenis mekanisme kerja TCP',
      'Lapisan TCP pada model TCP/IP',
    ],
    pretest: {
      questions: [
        {
          question: 'Apa kepanjangan dari TCP?',
          options: [
            'Transmission Control Protocol',
            'Transfer Control Protocol',
            'Transport Connection Protocol',
            'Technical Control Protocol',
          ],
          correctAnswer: 0,
        },
        {
          question: 'TCP termasuk protokol yang...',
          options: [
            'Connection-oriented',
            'Connectionless',
            'Broadcast',
            'Multicast',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Berapa langkah dalam three-way handshake?',
          options: ['2 langkah', '3 langkah', '4 langkah', '5 langkah'],
          correctAnswer: 1,
        },
        {
          question: 'Karakteristik TCP adalah...',
          options: [
            'Reliable dan terurut',
            'Cepat tapi tidak reliable',
            'Broadcast saja',
            'Tidak ada error checking',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Perbedaan TCP dan UDP adalah...',
          options: [
            'TCP connection-oriented, UDP connectionless',
            'TCP lebih lambat saja',
            'Tidak ada perbedaan',
            'UDP lebih aman',
          ],
          correctAnswer: 0,
        },
      ],
    },
    stages: [
      // ── 1. CONSTRUCTIVISM ─────────────────────────────────────────
      {
        type: 'constructivism',
        title: 'Constructivism',
        description: 'Membangun pemahaman awal dari pengalaman sehari-hari menggunakan internet',
        objectiveCode: 'X.TCP.1 – X.TCP.2',
        objectiveDescription: 'Mampu mendefinisikan TCP dan menentukan fungsi utamanya',
        apersepsi: 'Bayangkan kamu sedang mengirim file presentasi penting ke temanmu melalui email. Setelah terkirim, temanmu memberi tahu bahwa file-nya lengkap dan bisa dibuka dengan baik. Pernahkah kamu bertanya-tanya — bagaimana sistem jaringan memastikan file tersebut sampai dengan LENGKAP dan TIDAK RUSAK, padahal data dikirim dalam ribuan potongan kecil (paket) melewati berbagai router di seluruh dunia?',
        question: 'Saat kamu mengirim file lewat email atau WhatsApp, apa yang memastikan file tersebut sampai LENGKAP dan TIDAK RUSAK ke penerima?',
        options: [
          { id: 'a', text: 'Ada protokol jaringan yang memeriksa setiap paket data dan menjamin kelengkapannya' },
          { id: 'b', text: 'Jaringan internet yang cepat mencegah paket data rusak atau hilang' },
          { id: 'c', text: 'File dikompresi secara otomatis agar lebih tahan kerusakan saat pengiriman' },
          { id: 'd', text: 'Koneksi WiFi yang stabil secara otomatis menjamin semua data tidak hilang' },
        ],
        correctAnswer: 'a',
        feedback: {
          correct: 'Tepat! TCP (Transmission Control Protocol) adalah protokol yang bertanggung jawab menjamin setiap paket data terkirim lengkap, berurutan, dan bebas error — terlepas dari kecepatan atau stabilitas jaringan.',
          incorrect: 'Belum tepat. Ada protokol khusus di lapisan transport bernama TCP (Transmission Control Protocol) yang bertugas memeriksa setiap paket data dan memastikan semuanya sampai dengan lengkap dan benar.',
        },
      },

      // ── 2. INQUIRY ────────────────────────────────────────────────
      {
        type: 'inquiry',
        title: 'Inquiry',
        description: 'Eksplorasi konsep TCP melalui materi, lalu kelompokkan mekanisme kerjanya',
        objectiveCode: 'X.TCP.3 – X.TCP.4',
        objectiveDescription: 'Mampu menguraikan dan mengkategorikan mekanisme kerja TCP',
        explorationSections: [
          {
            id: 'connection',
            title: 'Connection-Oriented',
            content: 'TCP bersifat connection-oriented: sebelum data dikirim, TCP harus membangun koneksi terlebih dahulu melalui proses three-way handshake (SYN → SYN-ACK → ACK). Koneksi ini memastikan kedua pihak — pengirim dan penerima — siap dan setuju untuk berkomunikasi.',
            example: 'Analogi: Seperti menelepon seseorang — kamu panggil dulu, orang itu angkat dan menyapa, baru percakapan dimulai.',
          },
          {
            id: 'reliable',
            title: 'Reliable & Acknowledged Delivery',
            content: 'TCP menjamin setiap paket data sampai ke tujuan. Penerima mengirim konfirmasi (ACK) untuk setiap paket yang diterima. Jika paket hilang atau tidak mendapat ACK dalam batas waktu tertentu, TCP otomatis mengirim ulang paket tersebut (retransmission).',
            example: 'Analogi: Seperti pengiriman paket ekspres dengan tanda terima — pengirim tahu persis paket mana yang sudah sampai.',
          },
          {
            id: 'ordered',
            title: 'Ordered Delivery',
            content: 'Data yang dikirim dalam banyak paket akan disusun kembali sesuai urutan aslinya oleh TCP di sisi penerima, meskipun paket-paket tersebut tiba dalam urutan berbeda. Setiap paket TCP memiliki sequence number untuk tujuan ini.',
            example: 'Analogi: Seperti buku yang halamannya dikirim terpisah tapi memiliki nomor halaman — bisa disusun ulang dengan benar.',
          },
          {
            id: 'flow',
            title: 'Flow Control',
            content: 'TCP mengatur kecepatan pengiriman data agar tidak membanjiri penerima yang mungkin lebih lambat. Mekanisme ini menggunakan "window size" — batas berapa banyak data yang boleh dikirim sebelum menunggu konfirmasi.',
            example: 'Analogi: Seperti mengisi botol dengan air — kita atur kecepatan aliran agar tidak tumpah karena botol penuh.',
          },
          {
            id: 'error',
            title: 'Error Checking (Checksum)',
            content: 'Setiap segmen TCP memiliki checksum — nilai hash yang dihitung dari isi data. Penerima menghitung ulang checksum dan membandingkannya. Jika tidak cocok, paket dianggap rusak dan diminta untuk dikirim ulang.',
            example: 'Analogi: Seperti memeriksa total belanjaan di kasir — jika hitungan tidak cocok, ada yang salah.',
          },
        ],
        groups: [
          { id: 'connection-phase', label: 'Fase Koneksi', colorClass: 'blue' },
          { id: 'reliability-phase', label: 'Jaminan Keandalan', colorClass: 'green' },
          { id: 'control-phase', label: 'Pengendalian', colorClass: 'purple' },
        ],
        groupItems: [
          { id: 'syn', text: 'Three-way handshake (SYN → SYN-ACK → ACK)', correctGroup: 'connection-phase' },
          { id: 'seqnum', text: 'Sequence number untuk melacak urutan paket', correctGroup: 'connection-phase' },
          { id: 'ack', text: 'ACK (Acknowledgment) konfirmasi penerimaan', correctGroup: 'reliability-phase' },
          { id: 'retrans', text: 'Retransmission — kirim ulang paket yang hilang', correctGroup: 'reliability-phase' },
          { id: 'checksum', text: 'Checksum untuk mendeteksi kerusakan data', correctGroup: 'reliability-phase' },
          { id: 'window', text: 'Window size untuk mengatur laju pengiriman', correctGroup: 'control-phase' },
        ],
        question: 'Kelompokkan mekanisme kerja TCP ke dalam kategori yang tepat',
      },

      // ── 3. QUESTIONING ────────────────────────────────────────────
      {
        type: 'questioning',
        title: 'Questioning',
        description: 'Analisis skenario dan pilih alasan paling logis untuk pertanyaan "mengapa"',
        objectiveCode: 'X.TCP.5',
        objectiveDescription: 'Mampu membedakan mekanisme kerja TCP disertai alasan yang logis',
        scenario: 'Dina sedang mengunduh file PDF laporan berukuran 50 MB melalui browser. Di tengah pengunduhan (sudah mencapai 80%), koneksi internetnya tiba-tiba terputus selama 10 detik. Setelah koneksi kembali, pengunduhan dilanjutkan dari posisi 80% — bukan dari awal — dan file berhasil diunduh dengan sempurna tanpa ada bagian yang rusak.',
        whyQuestion: 'Mengapa pengunduhan bisa dilanjutkan tepat dari posisi 80% dan file tetap sampai dengan sempurna, bukan harus mengulang dari awal?',
        hint: 'Bayangkan bagaimana TCP "mengingat" paket mana yang sudah berhasil diterima dan mana yang belum... Apa mekanisme yang digunakan TCP untuk melacak ini?',
        reasonOptions: [
          {
            id: 'a',
            text: 'Karena file PDF disimpan sementara di cache browser saat pengunduhan berlangsung',
            isCorrect: false,
            feedback: 'Cache browser memang menyimpan data yang sudah diunduh di disk, tapi ini bukan alasan mengapa TCP bisa melanjutkan dari titik tertentu. Cache adalah fitur browser, bukan mekanisme TCP.',
          },
          {
            id: 'b',
            text: 'Karena TCP menggunakan sequence number dan ACK — setiap paket yang diterima dikonfirmasi, sehingga hanya paket yang belum dikonfirmasi yang perlu dikirim ulang',
            isCorrect: true,
            feedback: 'Tepat! TCP melacak setiap paket dengan sequence number. Penerima mengirim ACK untuk setiap paket yang diterima. Ketika koneksi pulih, TCP tahu persis dari sequence number berapa pengiriman harus dilanjutkan — hanya paket yang belum di-ACK yang dikirim ulang.',
          },
          {
            id: 'c',
            text: 'Karena server menyimpan salinan semua data yang sedang dikirim dan mengulang pengiriman dari awal secara otomatis',
            isCorrect: false,
            feedback: 'Server tidak menyimpan state pengunduhan untuk setiap klien di level TCP. Mekanisme TCP ada di kedua sisi (pengirim dan penerima), bukan hanya di server.',
          },
          {
            id: 'd',
            text: 'Karena koneksi internet kembali dengan cepat sehingga data yang sudah terkirim tidak sempat hilang dari memori',
            isCorrect: false,
            feedback: 'Kecepatan kembalinya koneksi tidak menjamin data tidak hilang. Data di buffer memori bisa hilang. Yang menjamin kelanjutan yang tepat adalah mekanisme ACK dan sequence number TCP — bukan kecepatan reconect.',
          },
        ],
      },

      // ── 4. LEARNING COMMUNITY ─────────────────────────────────────
      {
        type: 'learning-community',
        title: 'Learning Community',
        description: 'Pasangkan sinyal TCP dengan fungsinya, lalu analisis studi kasus secara kolaboratif',
        objectiveCode: 'X.TCP.6 – X.TCP.7',
        objectiveDescription: 'Mampu mengidentifikasi dan menerapkan fungsi lapisan TCP',
        matchingPairs: [
          { left: 'SYN', right: 'Permintaan awal untuk memulai koneksi (dari client)' },
          { left: 'SYN-ACK', right: 'Respons server: setuju + balik meminta konfirmasi' },
          { left: 'ACK', right: 'Konfirmasi akhir — koneksi resmi terbentuk' },
          { left: 'FIN', right: 'Sinyal untuk menutup koneksi secara teratur' },
        ],
        caseScenario: {
          title: 'Kasus: Sistem Transfer Rekening Bank',
          description: 'Tim IT sebuah bank sedang membangun sistem transfer uang antar rekening secara online. Sistem ini harus memastikan setiap transaksi tercatat dengan tepat — tidak boleh ada transaksi yang hilang, terduplikasi, atau salah urutan. Kecepatan penting, tapi keakuratan data adalah prioritas utama.',
          question: 'Protokol transport apa yang paling tepat untuk sistem perbankan ini?',
          options: [
            {
              id: 'a',
              text: 'TCP — karena menjamin data sampai lengkap, berurutan, dan terkonfirmasi',
              isCorrect: true,
              feedback: 'Tepat! Sistem perbankan membutuhkan reliable, ordered, acknowledged delivery yang hanya bisa dijamin TCP. Kehilangan atau duplikasi transaksi tidak bisa ditoleransi.',
            },
            {
              id: 'b',
              text: 'UDP — karena lebih cepat sehingga transaksi lebih efisien',
              isCorrect: false,
              feedback: 'UDP lebih cepat tapi tidak menjamin kelengkapan data. Untuk transaksi keuangan, kehilangan atau duplikasi satu paket bisa berakibat fatal (uang hilang atau transaksi tercatat dua kali).',
            },
            {
              id: 'c',
              text: 'TCP untuk transaksi besar, UDP untuk transaksi kecil demi efisiensi',
              isCorrect: false,
              feedback: 'Ukuran transaksi tidak menentukan pilihan protokol. Setiap transaksi keuangan — besar atau kecil — harus dijamin keandalannya.',
            },
            {
              id: 'd',
              text: 'HTTP — karena sistem perbankan online berbasis web',
              isCorrect: false,
              feedback: 'HTTP adalah protokol aplikasi (layer 7), bukan transport. HTTP sendiri berjalan di atas TCP. Jadi pada lapisan transport, yang digunakan tetap TCP.',
            },
          ],
        },
        peerAnswers: [
          { name: 'Budi', role: 'Kelompok A', answer: 'Kami pilih TCP karena transaksi bank tidak boleh ada yang hilang. TCP menjamin setiap data terkirim dan dikonfirmasi.' },
          { name: 'Sari', role: 'Kelompok B', answer: 'TCP jelas lebih tepat. Ada mekanisme ACK dan retransmission yang penting untuk keakuratan transaksi.' },
          { name: 'Andi', role: 'Kelompok C', answer: 'Kita pilih TCP tapi perlu dipikirkan juga bagaimana menghandle ribuan transaksi bersamaan agar tidak bottleneck.' },
        ],
      },

      // ── 5. MODELING ───────────────────────────────────────────────
      {
        type: 'modeling',
        title: 'Modeling',
        description: 'Pelajari alur kerja TCP langkah demi langkah, lalu susun kembali urutannya',
        objectiveCode: 'X.TCP.8',
        objectiveDescription: 'Mampu mengurutkan proses kerja lapisan TCP secara sistematis',
        steps: [
          {
            id: '1',
            title: 'Client Kirim SYN',
            description: 'Client mengirim paket SYN (Synchronize) ke server. Paket ini berisi sequence number awal milik client dan menandakan keinginan untuk membangun koneksi. Server belum tahu apakah client benar-benar siap.',
            visual: '📤',
          },
          {
            id: '2',
            title: 'Server Balas SYN-ACK',
            description: 'Server menerima SYN dan merespons dengan SYN-ACK (Synchronize-Acknowledge). Ini berarti server setuju membuka koneksi (ACK untuk SYN client) sekaligus mengirimkan sequence number awal milik server (SYN baru).',
            visual: '↩️',
          },
          {
            id: '3',
            title: 'Client Kirim ACK — Koneksi Terbentuk',
            description: 'Client mengirim ACK terakhir sebagai konfirmasi. Three-way handshake selesai. Koneksi TCP terbentuk secara penuh. Kini kedua sisi tahu sequence number masing-masing dan siap bertukar data.',
            visual: '✅',
          },
          {
            id: '4',
            title: 'Transfer Data',
            description: 'Data dikirim dalam segmen-segmen TCP yang bernomor (sequence number). Untuk setiap segmen yang diterima, penerima mengirim ACK. Jika ACK tidak datang dalam batas waktu, segmen tersebut dikirim ulang (retransmission).',
            visual: '🔄',
          },
          {
            id: '5',
            title: 'Penutupan Koneksi (FIN)',
            description: 'Setelah semua data terkirim, koneksi ditutup melalui proses four-way handshake: FIN → ACK → FIN → ACK. Ini memastikan kedua pihak telah selesai mengirim semua data sebelum koneksi benar-benar ditutup.',
            visual: '🔒',
          },
        ],
        question: 'Susun kembali langkah-langkah proses kerja TCP dalam urutan yang benar',
        items: [
          { id: '1', text: 'Client mengirim paket SYN ke server untuk memulai koneksi', order: 1 },
          { id: '2', text: 'Server merespons dengan SYN-ACK sebagai konfirmasi dan balik request', order: 2 },
          { id: '3', text: 'Client mengirim ACK — three-way handshake selesai, koneksi terbentuk', order: 3 },
          { id: '4', text: 'Data dikirim dalam segmen bernomor; penerima mengirim ACK tiap segmen', order: 4 },
          { id: '5', text: 'Koneksi ditutup dengan FIN handshake setelah semua data terkirim', order: 5 },
        ],
      },

      // ── 6. REFLECTION ─────────────────────────────────────────────
      {
        type: 'reflection',
        title: 'Reflection',
        description: 'Refleksikan perubahan pemahamanmu dan nilai diri sendiri',
        objectiveCode: 'X.TCP.9',
        objectiveDescription: 'Mampu menjelaskan kembali alur kerja TCP secara logis',
        initialKnowledgeContext: 'Di awal pertemuan, kamu menjawab pertanyaan tentang bagaimana file terjamin sampai dengan lengkap saat dikirim. Setelah mempelajari TCP secara menyeluruh — mulai dari connection-oriented, reliable delivery, three-way handshake, flow control, hingga error checking...',
        reflectionQuestion: 'Dengan kata-katamu sendiri, jelaskan bagaimana TCP memastikan data sampai dengan benar dan lengkap dari pengirim ke penerima! Hubungkan dengan mekanisme yang sudah kamu pelajari.',
        selfEvaluationCriteria: [
          { id: 'define', label: 'Saya dapat mendefinisikan TCP dan menyebutkan minimal 3 karakteristik utamanya' },
          { id: 'mechanism', label: 'Saya dapat menguraikan proses three-way handshake TCP (SYN, SYN-ACK, ACK)' },
          { id: 'differentiate', label: 'Saya dapat membedakan TCP dan UDP beserta contoh penggunaan yang tepat' },
          { id: 'apply', label: 'Saya dapat menganalisis kasus nyata dan menentukan kapan sebaiknya menggunakan TCP' },
        ],
      },

      // ── 7. AUTHENTIC ASSESSMENT ───────────────────────────────────
      {
        type: 'authentic-assessment',
        title: 'Authentic Assessment',
        description: 'Studi kasus bercabang: Ambil keputusan teknis dan analisis konsekuensinya',
        objectiveCode: 'X.TCP.10',
        objectiveDescription: 'Mampu mengaitkan fungsi, mekanisme, dan lapisan TCP secara menyeluruh',
        branchingScenario: {
          context: 'Kamu adalah junior network engineer di sebuah startup teknologi. Tim developer meminta rekomendasimu untuk dua fitur baru yang akan diluncurkan minggu depan. Kedua fitur membutuhkan protokol transport yang berbeda — keputusanmu akan berdampak langsung pada performa dan keandalan aplikasi.',
          initialQuestion: 'FITUR A — Sistem notifikasi push real-time (seperti notif WhatsApp). Harus mengirim pesan ke ribuan pengguna sekaligus dengan latency serendah mungkin. Jika ada notifikasi yang gagal kirim, sistem akan coba ulang dari lapisan aplikasi (bukan dari TCP). Protokol apa yang kamu rekomendasikan untuk Fitur A?',
          choices: [
            {
              id: 'a',
              text: 'TCP — karena menjamin setiap notifikasi pasti terkirim ke semua pengguna',
              isOptimal: false,
              consequence: 'TCP bisa bekerja untuk ini, tapi setiap notifikasi ke satu pengguna membutuhkan koneksi TCP terpisah (three-way handshake). Dengan ribuan pengguna bersamaan, overhead ini sangat signifikan dan bisa menyebabkan bottleneck.',
              followUpQuestion: 'Dengan pilihan TCP untuk ribuan koneksi simultan ini, apa dampak teknis yang paling kritis?',
              followUpChoices: [
                {
                  id: 'a1',
                  text: 'Server harus maintain state untuk setiap koneksi TCP aktif — ini sangat boros resource (RAM, CPU)',
                  isCorrect: true,
                  explanation: 'Benar! Setiap koneksi TCP membutuhkan server untuk menyimpan state (sequence number, window size, dll). Dengan ribuan koneksi simultan, konsumsi memory bisa sangat besar. Ini adalah trade-off penting TCP vs UDP.',
                },
                {
                  id: 'a2',
                  text: 'Notifikasi tidak akan pernah sampai ke pengguna sama sekali',
                  isCorrect: false,
                  explanation: 'Tidak tepat. TCP tetap akan mengirim notifikasi — hanya saja dengan overhead lebih tinggi. Masalahnya adalah efisiensi dan skalabilitas, bukan kegagalan total.',
                },
              ],
            },
            {
              id: 'b',
              text: 'UDP — karena lebih ringan, cepat, dan cocok untuk real-time dengan retry di aplikasi',
              isOptimal: true,
              consequence: 'Pilihan optimal! UDP tidak memerlukan koneksi (connectionless) sehingga tidak ada overhead three-way handshake. Cocok untuk notifikasi real-time karena: (1) latency sangat rendah, (2) server bisa kirim ke banyak klien tanpa maintain state per-koneksi, (3) retry sudah ditangani lapisan aplikasi.',
              followUpQuestion: 'Bagus! Sekarang FITUR B — sistem upload dokumen penting (kontrak, invoice untuk audit). Dokumen harus sampai 100% lengkap dan terverifikasi. Protokol apa yang tepat?',
              followUpChoices: [
                {
                  id: 'b1',
                  text: 'UDP juga — supaya proses upload lebih cepat dan efisien',
                  isCorrect: false,
                  explanation: 'Untuk dokumen penting, kecepatan bukan prioritas utama. UDP tidak menjamin kelengkapan — kehilangan satu paket berarti dokumen rusak/tidak lengkap. Dokumen kontrak yang rusak tidak bisa digunakan untuk audit.',
                },
                {
                  id: 'b2',
                  text: 'TCP — karena dokumen harus sampai 100% lengkap, berurutan, dan terkonfirmasi',
                  isCorrect: true,
                  explanation: 'Tepat! Untuk upload dokumen penting, reliable delivery TCP adalah keharusan. Keandalan jauh lebih penting dari kecepatan. TCP menjamin setiap byte dokumen sampai dengan benar — itulah trade-off yang tepat untuk kasus ini.',
                },
              ],
            },
            {
              id: 'c',
              text: 'Gunakan TCP untuk keduanya demi konsistensi dan kemudahan maintenance',
              isOptimal: false,
              consequence: 'Konsistensi adalah nilai yang baik, tapi pilihan protokol harus mengikuti kebutuhan teknis spesifik setiap fitur. Menggunakan TCP untuk notifikasi real-time ke ribuan pengguna akan mengorbankan performa secara tidak perlu.',
              followUpQuestion: 'Prinsip apa yang paling tepat dalam memilih protokol transport?',
              followUpChoices: [
                {
                  id: 'c1',
                  text: 'Selalu pilih yang paling mudah di-debug dan di-maintain',
                  isCorrect: false,
                  explanation: 'Kemudahan maintenance penting, tapi bukan faktor utama dalam memilih protokol. Pilihan salah bisa menyebabkan masalah performa atau keandalan yang justru lebih sulit di-debug.',
                },
                {
                  id: 'c2',
                  text: 'Pilih berdasarkan kebutuhan data: utamakan keandalan (TCP) atau kecepatan rendah-latency (UDP) sesuai konteks',
                  isCorrect: true,
                  explanation: 'Tepat! Pertanyaan kunci: "Apakah kehilangan data bisa ditoleransi?" Jika ya → UDP lebih efisien. Jika tidak → TCP adalah pilihan yang benar. Ini adalah trade-off fundamental dalam desain jaringan.',
                },
              ],
            },
          ],
          finalEvaluation: 'Selamat! Kamu telah menyelesaikan analisis kasus. Kesimpulan kunci: TCP untuk keandalan tinggi (upload dokumen, transaksi, email); UDP untuk kecepatan & real-time (streaming, notifikasi, gaming). Pilih protokol berdasarkan pertanyaan: "Seberapa penting kelengkapan data vs kecepatan untuk fitur ini?"',
        },
      },
    ],
    posttest: {
      questions: [
        {
          question: 'Apa kepanjangan dari TCP?',
          options: [
            'Transmission Control Protocol',
            'Transfer Control Protocol',
            'Transport Connection Protocol',
            'Technical Control Protocol',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Karakteristik utama TCP adalah...',
          options: [
            'Connection-oriented dan reliable',
            'Connectionless dan unreliable',
            'Cepat tetapi tidak reliable',
            'Hanya untuk transfer file',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Berapa langkah dalam proses three-way handshake?',
          options: ['2 langkah', '3 langkah', '4 langkah', '5 langkah'],
          correctAnswer: 1,
        },
        {
          question: 'Paket apa yang pertama kali dikirim dalam three-way handshake?',
          options: ['ACK', 'SYN', 'SYN-ACK', 'FIN'],
          correctAnswer: 1,
        },
        {
          question: 'Fungsi flow control pada TCP adalah...',
          options: [
            'Mengatur kecepatan pengiriman data',
            'Memeriksa error',
            'Membangun koneksi',
            'Mengenkripsi data',
          ],
          correctAnswer: 0,
        },
        {
          question: 'TCP lebih cocok digunakan untuk aplikasi yang memerlukan...',
          options: [
            'Pengiriman data yang reliable',
            'Kecepatan tinggi tanpa jaminan',
            'Broadcast data',
            'Komunikasi satu arah',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Perbedaan utama TCP dan UDP adalah...',
          options: [
            'TCP connection-oriented, UDP connectionless',
            'TCP lebih lambat',
            'UDP lebih aman',
            'TCP tidak ada error checking',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Error checking pada TCP berfungsi untuk...',
          options: [
            'Memeriksa kesalahan pada data yang diterima',
            'Mempercepat koneksi',
            'Mengenkripsi data',
            'Memblokir virus',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Aplikasi yang menggunakan TCP adalah...',
          options: [
            'HTTP, FTP, Email',
            'Video streaming',
            'Online gaming',
            'DNS query',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Dalam TCP, acknowledgment (ACK) berfungsi untuk...',
          options: [
            'Mengkonfirmasi penerimaan data',
            'Memulai koneksi',
            'Mengakhiri koneksi',
            'Mengirim data',
          ],
          correctAnswer: 0,
        },
      ],
    },
  },
  '2': {
    id: '2',
    title: 'Pertemuan 2',
    topic: 'Konsep Dasar IP Address',
    description: 'Memahami konsep dasar alamat IP dalam jaringan komputer',
    objectives: [
      'X.IP.1 : Mampu mendefinisikan IP Address dalam jaringan komputer',
      'X.IP.2 : Mampu menentukan fungsi utama IP Address',
      'X.IP.3 : Mampu menguraikan mekanisme pengalamatan IP',
      'X.IP.4 : Mampu mengkategorikan jenis IP Address (Public dan Private)',
      'X.IP.5 : Mampu membedakan jenis IP Address disertai alasan yang logis',
      'X.IP.6 : Mampu mengidentifikasi komponen IP Address (Network ID dan Host ID)',
      'X.IP.7 : Mampu menerapkan komponen IP Address dalam konteks kasus',
      'X.IP.8 : Mampu mengurutkan proses pengalamatan IP secara sistematis',
      'X.IP.9 : Mampu menjelaskan alur pengiriman data berbasis IP secara logis',
      'X.IP.10 : Mampu mengaitkan fungsi, jenis, dan komponen IP secara menyeluruh',
    ],
    initialCompetencies: [
      'Siswa telah memahami protokol TCP/IP dari pertemuan sebelumnya',
      'Siswa mengetahui konsep pengiriman data antar perangkat',
      'Siswa memahami istilah "alamat" dalam konteks jaringan komputer',
    ],
    materials: [
      'Pengertian IP Address dan fungsinya dalam jaringan',
      'Mekanisme pengalamatan IP (Network ID dan Host ID)',
      'Jenis IP Address: Public dan Private',
      'Komponen IP Address: Network ID dan Host ID',
      'Proses pengiriman data berbasis IP Address',
    ],
    pretest: {
      questions: [
        {
          question: 'Apa fungsi utama IP Address?',
          options: [
            'Mengidentifikasi perangkat dalam jaringan',
            'Mempercepat koneksi',
            'Mengenkripsi data',
            'Menyimpan data',
          ],
          correctAnswer: 0,
        },
        {
          question: 'IP Address terdiri dari berapa komponen utama?',
          options: [
            'Network ID dan Host ID',
            'Username dan Password',
            'IP dan Port',
            'MAC dan IP',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Contoh IP Address private adalah...',
          options: [
            '192.168.1.1',
            '8.8.8.8',
            '1.1.1.1',
            '203.10.5.1',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Fungsi subnet mask adalah...',
          options: [
            'Membedakan bagian network dan host',
            'Mempercepat koneksi',
            'Mengenkripsi data',
            'Routing saja',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Alamat 10.0.0.1 termasuk IP...',
          options: [
            'Private',
            'Public',
            'Loopback',
            'Broadcast',
          ],
          correctAnswer: 0,
        },
      ],
    },
    stages: [
      // ── 1. CONSTRUCTIVISM ─────────────────────────────────────────
      {
        type: 'constructivism',
        title: 'Constructivism',
        description: 'Membangun pemahaman awal tentang IP Address dari pengalaman sehari-hari',
        objectiveCode: 'X.IP.1 – X.IP.2',
        objectiveDescription: 'Mampu mendefinisikan IP Address dan menentukan fungsi utamanya',
        apersepsi: 'Bayangkan kamu tinggal di sebuah apartemen besar. Untuk bisa menerima kiriman paket, kamu butuh alamat lengkap — nomor blok, nomor lantai, dan nomor kamarmu. Tanpa alamat yang tepat, kurir tidak tahu harus mengantar ke mana. Di dunia jaringan komputer, setiap perangkat juga punya "alamat" tersendiri agar data bisa dikirim ke tempat yang tepat.',
        question: 'Mengapa setiap perangkat yang terhubung ke internet HARUS memiliki alamat IP yang unik?',
        options: [
          { id: 'a', text: 'Agar router tahu ke mana harus mengirimkan data — tanpa alamat unik, data tidak bisa sampai ke perangkat yang benar' },
          { id: 'b', text: 'Agar koneksi internet menjadi lebih cepat dan stabil' },
          { id: 'c', text: 'Agar perangkat lebih aman dari ancaman hacker' },
          { id: 'd', text: 'Agar pemakaian bandwidth jaringan lebih hemat' },
        ],
        correctAnswer: 'a',
        feedback: {
          correct: 'Tepat! IP Address berfungsi sebagai pengidentifikasi unik setiap perangkat. Router menggunakan IP Address tujuan untuk menentukan jalur pengiriman data yang tepat.',
          incorrect: 'Belum tepat. IP Address adalah alamat unik yang digunakan router untuk mengetahui ke mana data harus dikirimkan. Tanpa IP Address yang unik, data tidak akan tahu harus "berhenti" di perangkat mana.',
        },
      },

      // ── 2. INQUIRY ────────────────────────────────────────────────
      {
        type: 'inquiry',
        title: 'Inquiry',
        description: 'Eksplorasi komponen IP Address, lalu kelompokkan berdasarkan fungsinya',
        objectiveCode: 'X.IP.3 – X.IP.4',
        objectiveDescription: 'Mampu menguraikan mekanisme pengalamatan dan mengkategorikan jenis IP',
        explorationSections: [
          {
            id: 'network-id',
            title: 'Network ID',
            content: 'Network ID adalah bagian dari IP Address yang mengidentifikasi jaringan (network) tempat perangkat berada. Semua perangkat dalam jaringan yang sama memiliki Network ID yang identik. Network ID digunakan router untuk menentukan jaringan tujuan paket data.',
            example: 'Contoh: IP 192.168.1.10 dengan subnet mask /24 → Network ID = 192.168.1.0',
          },
          {
            id: 'host-id',
            title: 'Host ID',
            content: 'Host ID adalah bagian dari IP Address yang mengidentifikasi perangkat spesifik (host) di dalam suatu jaringan. Setiap perangkat dalam satu jaringan harus memiliki Host ID yang berbeda-beda. Host ID inilah yang membedakan satu komputer dengan komputer lain di jaringan yang sama.',
            example: 'Contoh: IP 192.168.1.10 dengan subnet mask /24 → Host ID = 10 (perangkat ke-10 di jaringan)',
          },
          {
            id: 'subnet',
            title: 'Subnet Mask',
            content: 'Subnet Mask adalah angka 32-bit yang digunakan untuk membedakan bagian Network ID dan Host ID dari sebuah IP Address. Subnet mask membantu perangkat menentukan apakah tujuan komunikasi berada di jaringan yang sama atau berbeda.',
            example: 'Contoh: 255.255.255.0 (atau /24) = 3 oktet pertama adalah network, 1 oktet terakhir adalah host.',
          },
          {
            id: 'gateway',
            title: 'Default Gateway',
            content: 'Default Gateway adalah router atau perangkat yang menjadi "pintu keluar" dari jaringan lokal ke jaringan lain (termasuk internet). Ketika perangkat ingin berkomunikasi dengan IP di luar jaringannya, paket dikirim ke default gateway terlebih dahulu.',
            example: 'Analogi: Default gateway seperti gerbang keluar komplek perumahan — semua kendaraan yang pergi ke luar harus lewat sini.',
          },
          {
            id: 'types',
            title: 'IP Public vs IP Private',
            content: 'IP Public adalah alamat IP yang dapat diakses langsung dari internet. IP Private hanya berlaku di jaringan lokal (LAN) dan tidak bisa di-route di internet. Organisasi menggunakan NAT (Network Address Translation) untuk menghubungkan IP private ke internet melalui satu IP public.',
            example: 'IP Private: 192.168.x.x, 172.16.x.x, 10.x.x.x | IP Public: 8.8.8.8, 1.1.1.1',
          },
        ],
        groups: [
          { id: 'identification', label: 'Identifikasi Jaringan/Host', colorClass: 'blue' },
          { id: 'routing', label: 'Pengalamatan & Routing', colorClass: 'green' },
          { id: 'classification', label: 'Klasifikasi Alamat', colorClass: 'purple' },
        ],
        groupItems: [
          { id: 'nid', text: 'Network ID — menunjukkan jaringan asal perangkat', correctGroup: 'identification' },
          { id: 'hid', text: 'Host ID — mengidentifikasi perangkat spesifik dalam jaringan', correctGroup: 'identification' },
          { id: 'subnet', text: 'Subnet Mask — membedakan Network ID dari Host ID', correctGroup: 'routing' },
          { id: 'gw', text: 'Default Gateway — pintu keluar ke jaringan lain', correctGroup: 'routing' },
          { id: 'pub', text: 'IP Public — bisa diakses langsung dari internet', correctGroup: 'classification' },
          { id: 'priv', text: 'IP Private — hanya berlaku di jaringan lokal', correctGroup: 'classification' },
        ],
        question: 'Kelompokkan komponen dan konsep IP Address ke dalam kategori yang tepat',
      },

      // ── 3. QUESTIONING ────────────────────────────────────────────
      {
        type: 'questioning',
        title: 'Questioning',
        description: 'Analisis skenario jaringan dan pilih alasan yang paling logis',
        objectiveCode: 'X.IP.5',
        objectiveDescription: 'Mampu membedakan jenis IP Address disertai alasan yang logis',
        scenario: 'Sebuah perusahaan dengan 200 karyawan menggunakan jaringan internal (LAN). Setiap komputer karyawan memiliki IP Address seperti 192.168.10.x. Saat karyawan membuka website eksternal (misal: google.com), data dari komputer mereka bisa sampai ke server Google dan kembali lagi — padahal komputer mereka menggunakan IP Private, bukan IP Public.',
        whyQuestion: 'Mengapa komputer dengan IP Private (192.168.10.x) bisa berkomunikasi dengan server internet yang hanya mengenal IP Public?',
        hint: 'Perhatikan peran router di batas jaringan lokal dan internet. Apa yang dilakukan router terhadap paket yang berasal dari IP Private sebelum dikirim ke internet?',
        reasonOptions: [
          {
            id: 'a',
            text: 'Karena IP Private sebenarnya bisa diakses dari internet, hanya tidak digunakan sebagai server',
            isCorrect: false,
            feedback: 'Tidak tepat. IP Private (192.168.x.x, 172.16.x.x, 10.x.x.x) secara teknis tidak bisa di-route di internet. Router di internet tidak akan meneruskan paket dengan alamat tujuan atau sumber IP Private.',
          },
          {
            id: 'b',
            text: 'Karena router menggunakan NAT (Network Address Translation) — mengganti IP Private dengan IP Public saat keluar, dan sebaliknya saat data masuk',
            isCorrect: true,
            feedback: 'Tepat! NAT dilakukan oleh router di batas LAN-internet. Router mencatat mapping IP Private↔Public, mengganti IP sumber saat keluar, dan mengembalikan ke IP Private yang tepat saat respons masuk.',
          },
          {
            id: 'c',
            text: 'Karena DNS server menerjemahkan IP Private menjadi IP Public sebelum paket dikirim',
            isCorrect: false,
            feedback: 'DNS menerjemahkan nama domain ke IP Address — bukan menerjemahkan IP Private ke IP Public. Peran konversi IP Private↔Public adalah fungsi NAT, bukan DNS.',
          },
          {
            id: 'd',
            text: 'Karena website modern sudah mendukung IP Private langsung tanpa perlu konversi',
            isCorrect: false,
            feedback: 'Tidak ada server internet yang mendukung IP Private. IP Private secara definisi adalah ruang alamat yang tidak di-route di internet publik. Tanpa NAT, komunikasi ini tidak mungkin terjadi.',
          },
        ],
      },

      // ── 4. LEARNING COMMUNITY ─────────────────────────────────────
      {
        type: 'learning-community',
        title: 'Learning Community',
        description: 'Pasangkan kelas IP Address dengan range-nya, lalu analisis skenario jaringan',
        objectiveCode: 'X.IP.6 – X.IP.7',
        objectiveDescription: 'Mampu mengidentifikasi dan menerapkan komponen IP Address',
        matchingPairs: [
          { left: 'Kelas A', right: '1.0.0.0 — 126.255.255.255 (jaringan besar)' },
          { left: 'Kelas B', right: '128.0.0.0 — 191.255.255.255 (jaringan menengah)' },
          { left: 'Kelas C', right: '192.0.0.0 — 223.255.255.255 (jaringan kecil)' },
          { left: 'Loopback', right: '127.0.0.1 (pengujian lokal, tidak keluar jaringan)' },
        ],
        caseScenario: {
          title: 'Kasus: Desain Jaringan Sekolah',
          description: 'Sebuah sekolah memiliki 150 komputer di lab dan ruang guru. Sekolah ingin menghubungkan semua komputer dalam satu jaringan lokal (LAN) dan berbagi satu koneksi internet. Administrator jaringan harus memilih skema IP Address yang tepat.',
          question: 'Skema IP Address mana yang paling tepat untuk jaringan lokal sekolah ini?',
          options: [
            {
              id: 'a',
              text: '192.168.1.0/24 — IP Private kelas C dengan 254 host yang tersedia',
              isCorrect: true,
              feedback: 'Tepat! Untuk 150 komputer, /24 (254 host tersedia) sudah cukup. IP Private 192.168.x.x adalah standar jaringan LAN. Dengan NAT, semua komputer bisa berbagi satu IP Public untuk akses internet.',
            },
            {
              id: 'b',
              text: 'IP Public langsung untuk setiap komputer agar bisa diakses dari mana saja',
              isCorrect: false,
              feedback: 'Menggunakan IP Public untuk 150 komputer tidak praktis (mahal dan terbatas) dan menimbulkan risiko keamanan. Jaringan lokal sebaiknya menggunakan IP Private dengan NAT untuk akses internet.',
            },
            {
              id: 'c',
              text: '10.0.0.0/8 — IP Private kelas A karena kapasitas lebih besar untuk masa depan',
              isCorrect: false,
              feedback: '/8 menyediakan lebih dari 16 juta host — jauh berlebihan untuk 150 komputer. Memilih range yang terlalu besar mempersulit manajemen dan tidak efisien. /24 sudah cukup.',
            },
            {
              id: 'd',
              text: '127.x.x.x — karena ini range yang paling aman untuk jaringan internal',
              isCorrect: false,
              feedback: '127.x.x.x adalah range loopback — digunakan untuk pengujian jaringan di perangkat itu sendiri, bukan untuk komunikasi antar perangkat. Range ini tidak bisa digunakan untuk membangun jaringan LAN.',
            },
          ],
        },
        peerAnswers: [
          { name: 'Rini', role: 'Kelompok A', answer: 'Kami pilih 192.168.1.0/24 karena cukup untuk 150 komputer dan ini standar IP Private untuk LAN.' },
          { name: 'Doni', role: 'Kelompok B', answer: 'IP Private lebih aman dan hemat. 192.168.x.x cocok untuk skala sekolah, /24 sudah lebih dari cukup.' },
          { name: 'Maya', role: 'Kelompok C', answer: 'Kita pertimbangkan /23 untuk antisipasi pertumbuhan jumlah perangkat di masa depan.' },
        ],
      },

      // ── 5. MODELING ───────────────────────────────────────────────
      {
        type: 'modeling',
        title: 'Modeling',
        description: 'Pelajari alur pengiriman data menggunakan IP Address, lalu susun kembali urutannya',
        objectiveCode: 'X.IP.8',
        objectiveDescription: 'Mampu mengurutkan proses pengalamatan IP secara sistematis',
        steps: [
          {
            id: '1',
            title: 'Menentukan IP Tujuan',
            description: 'Perangkat pengirim menentukan IP Address tujuan. Misalnya, kamu ingin mengakses google.com — browser pertama-tama meminta DNS untuk mengubah nama domain menjadi IP Address (misal: 142.250.4.100).',
            visual: '🎯',
          },
          {
            id: '2',
            title: 'Pengemasan Data (IP Packet)',
            description: 'Data dibungkus dalam IP packet dengan header yang berisi: IP Address sumber (milik pengirim) dan IP Address tujuan (milik server). Header ini adalah "label pengiriman" yang akan dibaca oleh setiap router di jalur.',
            visual: '📦',
          },
          {
            id: '3',
            title: 'Keputusan Routing',
            description: 'Sebelum paket dikirim ke luar, perangkat memeriksa: apakah IP tujuan berada di jaringan yang sama? Jika ya → kirim langsung. Jika tidak → kirim ke Default Gateway (router) untuk diteruskan.',
            visual: '🔀',
          },
          {
            id: '4',
            title: 'Router Meneruskan Paket',
            description: 'Router membaca IP tujuan di header paket dan menentukan rute terbaik menggunakan routing table. Paket bisa melewati beberapa router (hops) sebelum sampai ke tujuan.',
            visual: '🌐',
          },
          {
            id: '5',
            title: 'Paket Diterima Tujuan',
            description: 'Ketika paket tiba di perangkat tujuan, IP Address tujuan dicocokkan. Jika cocok, data diekstrak dari packet dan diteruskan ke aplikasi yang meminta (misal: web browser).',
            visual: '✅',
          },
        ],
        question: 'Susun kembali proses pengiriman data menggunakan IP Address dalam urutan yang benar',
        items: [
          { id: '1', text: 'Perangkat pengirim menentukan IP Address tujuan (via DNS jika perlu)', order: 1 },
          { id: '2', text: 'Data dikemas dalam IP packet dengan header sumber dan tujuan', order: 2 },
          { id: '3', text: 'Perangkat menentukan: kirim langsung atau via Default Gateway', order: 3 },
          { id: '4', text: 'Router membaca IP tujuan dan meneruskan paket ke rute terbaik', order: 4 },
          { id: '5', text: 'Paket tiba di perangkat tujuan, data diekstrak dan diproses', order: 5 },
        ],
      },

      // ── 6. REFLECTION ─────────────────────────────────────────────
      {
        type: 'reflection',
        title: 'Reflection',
        description: 'Refleksikan perubahan pemahamanmu tentang IP Address',
        objectiveCode: 'X.IP.9',
        objectiveDescription: 'Mampu menjelaskan kembali alur pengiriman data berbasis IP secara logis',
        initialKnowledgeContext: 'Di awal pertemuan, kamu menjawab tentang mengapa setiap perangkat membutuhkan alamat unik. Setelah mempelajari komponen IP Address, perbedaan IP Public/Private, subnet mask, and proses routing...',
        reflectionQuestion: 'Jelaskan dengan bahasamu sendiri: bagaimana sebuah email yang kamu kirim dari laptop di rumah bisa sampai ke server email penerima di luar negeri? Hubungkan dengan konsep IP Address yang telah kamu pelajari!',
        selfEvaluationCriteria: [
          { id: 'define', label: 'Saya dapat mendefinisikan IP Address dan menjelaskan fungsinya dalam jaringan' },
          { id: 'components', label: 'Saya dapat membedakan Network ID, Host ID, Subnet Mask, dan Default Gateway' },
          { id: 'types', label: 'Saya dapat membedakan IP Public dan IP Private beserta contoh penggunaannya' },
          { id: 'routing', label: 'Saya dapat menjelaskan proses routing data menggunakan IP Address' },
        ],
      },

      // ── 7. AUTHENTIC ASSESSMENT ───────────────────────────────────
      {
        type: 'authentic-assessment',
        title: 'Authentic Assessment',
        description: 'Studi kasus bercabang: Rancang solusi jaringan yang tepat',
        objectiveCode: 'X.IP.10',
        objectiveDescription: 'Mampu mengaitkan fungsi, jenis, dan komponen IP secara menyeluruh',
        branchingScenario: {
          context: 'Kamu adalah IT administrator di sebuah klinik kesehatan yang baru membuka cabang baru. Klinik ini memiliki 50 komputer di berbagai ruangan dan membutuhkan koneksi internet. Kamu harus merancang skema IP Address yang tepat.',
          initialQuestion: 'Langkah pertama: Memilih jenis IP Address untuk jaringan internal klinik. Mana yang akan kamu pilih?',
          choices: [
            {
              id: 'a',
              text: 'IP Public untuk setiap komputer agar mudah diakses dari luar',
              isOptimal: false,
              consequence: 'Menggunakan IP Public untuk 50 komputer klinik menimbulkan dua masalah besar: (1) Biaya sangat tinggi — IP Public harus disewa dan jumlahnya terbatas, (2) Risiko keamanan ekstrem — setiap komputer langsung terekspos ke internet tanpa perlindungan NAT.',
              followUpQuestion: 'Dengan semua komputer terekspos langsung ke internet, risiko keamanan apa yang paling mengkhawatirkan?',
              followUpChoices: [
                {
                  id: 'a1',
                  text: 'Data rekam medis pasien rentan diakses dari internet tanpa firewall yang memadai',
                  isCorrect: true,
                  explanation: 'Tepat! Data medis termasuk data sensitif yang harus dilindungi. Mengekspos semua komputer langsung ke internet tanpa perlindungan jaringan adalah pelanggaran prinsip keamanan dasar dan regulasi privasi data.',
                },
                {
                  id: 'a2',
                  text: 'Komputer akan lebih lambat karena terlalu banyak koneksi masuk',
                  isCorrect: false,
                  explanation: 'Kecepatan bukan risiko utama di sini. Risiko yang jauh lebih serius adalah keamanan data — komputer yang terekspos langsung ke internet bisa diserang dari mana saja.',
                },
              ],
            },
            {
              id: 'b',
              text: 'IP Private (192.168.x.x) dengan NAT untuk berbagi satu koneksi internet',
              isOptimal: true,
              consequence: 'Pilihan optimal! IP Private + NAT adalah standar industri untuk jaringan LAN. Semua 50 komputer mendapat IP Private unik, berbagi satu IP Public milik ISP melalui router, dan terlindungi dari akses langsung internet.',
              followUpQuestion: 'Dengan 50 komputer dan IP Private 192.168.1.0/24, berapa komputer yang masih bisa ditambahkan sebelum perlu mengganti subnet?',
              followUpChoices: [
                {
                  id: 'b1',
                  text: '204 komputer lagi (total maksimal 254 host, sudah terpakai 50)',
                  isCorrect: true,
                  explanation: 'Tepat! Subnet /24 menyediakan 254 alamat host yang dapat digunakan (256 - 2: network address dan broadcast). Dengan 50 komputer sudah terpakai, masih ada 204 slot tersisa. Cukup besar untuk pertumbuhan klinik.',
                },
                {
                  id: 'b2',
                  text: 'Tidak bisa tambah lagi karena subnet sudah penuh dengan 50 komputer',
                  isCorrect: false,
                  explanation: 'Tidak tepat. Subnet /24 menyediakan 254 host — jauh lebih banyak dari 50 komputer. Masih ada banyak ruang untuk pertumbuhan.',
                },
              ],
            },
            {
              id: 'c',
              text: 'Biarkan router yang otomatis mengatur — tidak perlu perencanaan IP Address',
              isOptimal: false,
              consequence: 'Router memang bisa mengatur DHCP otomatis, tapi tanpa perencanaan IP Address yang baik, kamu tidak bisa: (1) Mengidentifikasi perangkat tertentu, (2) Mengatur kebijakan keamanan per subnet, (3) Mengatasi konflik IP yang bisa terjadi.',
              followUpQuestion: 'Masalah apa yang paling sering terjadi jika tidak ada perencanaan IP Address?',
              followUpChoices: [
                {
                  id: 'c1',
                  text: 'IP Address conflict — dua perangkat mendapat IP yang sama, keduanya tidak bisa terhubung ke jaringan',
                  isCorrect: true,
                  explanation: 'Tepat! IP conflict adalah masalah paling umum dari manajemen IP yang buruk. Ketika dua perangkat mendapat IP yang sama, keduanya akan mengalami gangguan koneksi. Ini sangat berbahaya di lingkungan medis yang bergantung pada sistem digital.',
                },
                {
                  id: 'c2',
                  text: 'Koneksi internet akan lebih lambat',
                  isCorrect: false,
                  explanation: 'Perencanaan IP Address tidak secara langsung mempengaruhi kecepatan internet. Masalah yang lebih relevan adalah konflik IP dan kesulitan manajemen jaringan.',
                },
              ],
            },
          ],
          finalEvaluation: 'Kamu telah menyelesaikan perancangan jaringan klinik! Poin kunci: IP Private + NAT adalah solusi standar untuk LAN — hemat, aman, dan skalabel. Subnet /24 cukup untuk 50-254 perangkat. Perencanaan IP Address yang baik mencegah konflik dan memudahkan manajemen jaringan.',
        },
      },
    ],
    posttest: {
      questions: [
        {
          question: 'Apa fungsi utama IP Address?',
          options: [
            'Mengidentifikasi dan mengarahkan data ke perangkat yang tepat',
            'Mengenkripsi data',
            'Mempercepat koneksi',
            'Menyimpan data',
          ],
          correctAnswer: 0,
        },
        {
          question: 'IP Address terdiri dari berapa bit?',
          options: ['16 bit', '32 bit (IPv4)', '64 bit', '128 bit'],
          correctAnswer: 1,
        },
        {
          question: 'Contoh IP Address private adalah...',
          options: [
            '192.168.1.1',
            '8.8.8.8',
            '1.1.1.1',
            '203.10.5.1',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Subnet mask 255.255.255.0 berarti...',
          options: [
            '3 oktet pertama adalah network, 1 oktet terakhir adalah host',
            '2 oktet pertama adalah network',
            'Semua oktet adalah network',
            'Hanya oktet terakhir yang penting',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Fungsi default gateway adalah...',
          options: [
            'Menghubungkan jaringan lokal dengan jaringan lain',
            'Memberikan IP Address',
            'Menyimpan data',
            'Mengenkripsi koneksi',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Range IP Address private kelas C adalah...',
          options: [
            '192.168.0.0 - 192.168.255.255',
            '10.0.0.0 - 10.255.255.255',
            '172.16.0.0 - 172.31.255.255',
            '200.0.0.0 - 200.255.255.255',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Perbedaan IP Static dan Dynamic adalah...',
          options: [
            'Static tetap, Dynamic berubah-ubah',
            'Static lebih cepat',
            'Dynamic lebih aman',
            'Static hanya untuk server',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Komponen yang membedakan network dan host adalah...',
          options: [
            'Subnet Mask',
            'Default Gateway',
            'DNS',
            'MAC Address',
          ],
          correctAnswer: 0,
        },
        {
          question: 'IP Address 0.0.0.0 memiliki arti...',
          options: [
            'Tidak ada alamat/alamat tidak valid',
            'Alamat loopback',
            'Alamat broadcast',
            'Alamat private',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Protokol yang memberikan IP Address secara otomatis adalah...',
          options: [
            'DHCP',
            'DNS',
            'HTTP',
            'FTP',
          ],
          correctAnswer: 0,
        },
      ],
    },
  },
  '3': {
    id: '3',
    title: 'Pertemuan 3',
    topic: 'Pengenalan IPv4',
    description: 'Memahami struktur, kelas, dan penggunaan IPv4 dalam jaringan',
    objectives: [
      'X.IPv4.1 : Mampu mendefinisikan IPv4 dalam jaringan komputer',
      'X.IPv4.2 : Mampu menentukan fungsi utama IPv4',
      'X.IPv4.3 : Mampu menguraikan mekanisme struktur IPv4',
      'X.IPv4.4 : Mampu mengkategorikan kelas IPv4',
      'X.IPv4.5 : Mampu membedakan kelas IPv4 disertai alasan yang logis',
      'X.IPv4.6 : Mampu mengidentifikasi subnet mask IPv4',
      'X.IPv4.7 : Mampu menerapkan subnetting dalam konteks kasus',
      'X.IPv4.8 : Mampu mengurutkan proses perhitungan subnet secara sistematis',
      'X.IPv4.9 : Mampu menjelaskan alur pembagian jaringan secara logis',
      'X.IPv4.10 : Mampu mengaitkan struktur, kelas, dan subnetting IPv4 secara menyeluruh',
    ],
    initialCompetencies: [
      'Siswa telah memahami konsep IP Address dari pertemuan sebelumnya',
      'Siswa mengetahui perbedaan IP public dan private',
      'Siswa mampu membaca alamat IP dalam format desimal',
    ],
    materials: [
      'Pengertian dan struktur alamat IPv4 (32-bit, 4 oktet)',
      'Kelas IPv4: Kelas A, B, C, D, dan E',
      'Subnet Mask dan notasi CIDR',
      'Teknik subnetting pada jaringan IPv4',
      'Perhitungan pembagian subnet dan jumlah host',
    ],
    pretest: {
      questions: [
        {
          question: 'IPv4 menggunakan berapa bit?',
          options: ['16 bit', '32 bit', '64 bit', '128 bit'],
          correctAnswer: 1,
        },
        {
          question: 'Format penulisan IPv4 adalah...',
          options: [
            'Empat oktet dipisahkan titik',
            'Delapan heksadesimal',
            'Enam oktet',
            'Dua oktet',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Kelas IPv4 ditentukan berdasarkan...',
          options: [
            'Oktet pertama',
            'Oktet terakhir',
            'Subnet mask',
            'Gateway',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Subnet mask digunakan untuk...',
          options: [
            'Membagi jaringan',
            'Mempercepat koneksi',
            'Enkripsi data',
            'Routing saja',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Alamat 127.0.0.1 adalah alamat...',
          options: [
            'Loopback',
            'Broadcast',
            'Private',
            'Public',
          ],
          correctAnswer: 0,
        },
      ],
    },
    stages: [
      // ── 1. CONSTRUCTIVISM ─────────────────────────────────────────
      {
        type: 'constructivism',
        title: 'Constructivism',
        description: 'Membangun pemahaman awal tentang IPv4 dari pengalaman menggunakan jaringan',
        objectiveCode: 'X.IPv4.1 – X.IPv4.2',
        objectiveDescription: 'Mampu mendefinisikan IPv4 dan menentukan fungsi utamanya',
        apersepsi: 'Setiap kali kamu membuka pengaturan WiFi di handphone dan melihat angka seperti "192.168.1.5" — itulah alamat IPv4 perangkatmu. Empat kelompok angka, dipisahkan titik. Tapi mengapa formatnya seperti itu? Dan mengapa ada yang bilang "IPv4 hampir habis"?',
        question: 'IPv4 menggunakan format 4 oktet (misalnya 192.168.1.1) karena menggunakan bilangan 32-bit. Implikasi terbesar dari batasan 32-bit ini adalah...',
        options: [
          { id: 'a', text: 'Maksimum hanya ~4,3 miliar alamat unik — tidak cukup untuk semua perangkat di dunia' },
          { id: 'b', text: 'Alamat IPv4 lebih sulit diingat dibanding format lain' },
          { id: 'c', text: 'IPv4 tidak bisa digunakan untuk jaringan wireless' },
          { id: 'd', text: 'Kecepatan transfer data di IPv4 lebih lambat' },
        ],
        correctAnswer: 'a',
        feedback: {
          correct: 'Tepat! 2^32 = sekitar 4,3 miliar alamat. Dengan miliaran perangkat IoT, smartphone, dan komputer di dunia, jumlah ini tidak lagi mencukupi — inilah mengapa IPv6 dikembangkan.',
          incorrect: 'Belum tepat. Batasan 32-bit berarti IPv4 hanya bisa menyediakan ~4,3 miliar alamat unik. Di era IoT di mana setiap perangkat membutuhkan alamat, jumlah ini tidak mencukupi.',
        },
      },

      // ── 2. INQUIRY ────────────────────────────────────────────────
      {
        type: 'inquiry',
        title: 'Inquiry',
        description: 'Eksplorasi kelas-kelas IPv4, lalu kelompokkan berdasarkan karakteristiknya',
        objectiveCode: 'X.IPv4.3 – X.IPv4.4',
        objectiveDescription: 'Mampu menguraikan struktur dan mengkategorikan kelas IPv4',
        explorationSections: [
          {
            id: 'class-a',
            title: 'Kelas A — Jaringan Sangat Besar',
            content: 'Kelas A menggunakan oktet pertama antara 1–126. Subnet mask default: 255.0.0.0 (/8). Ini berarti 1 oktet untuk Network ID dan 3 oktet untuk Host ID, sehingga bisa menampung hingga 16 juta host per jaringan. Sangat cocok untuk organisasi besar atau ISP.',
            example: 'IP Private Kelas A: 10.0.0.0 – 10.255.255.255 | Public: 8.8.8.8 (Google DNS)',
          },
          {
            id: 'class-b',
            title: 'Kelas B — Jaringan Menengah',
            content: 'Kelas B menggunakan oktet pertama antara 128–191. Subnet mask default: 255.255.0.0 (/16). Dengan 2 oktet Network ID dan 2 oktet Host ID, tersedia hingga 65.534 host per jaringan. Cocok untuk universitas, perusahaan menengah-besar.',
            example: 'IP Private Kelas B: 172.16.0.0 – 172.31.255.255 | Contoh public: 130.10.5.20',
          },
          {
            id: 'class-c',
            title: 'Kelas C — Jaringan Kecil',
            content: 'Kelas C menggunakan oktet pertama antara 192–223. Subnet mask default: 255.255.255.0 (/24). Dengan 3 oktet Network ID dan 1 oktet Host ID, hanya tersedia 254 host per jaringan. Paling umum digunakan untuk jaringan rumah dan kantor kecil.',
            example: 'IP Private Kelas C: 192.168.0.0 – 192.168.255.255 | Ini yang paling sering kamu lihat di WiFi rumah!',
          },
          {
            id: 'special',
            title: 'Alamat Khusus IPv4',
            content: 'Beberapa range IPv4 memiliki fungsi khusus: 127.0.0.0/8 (Loopback — untuk testing jaringan di perangkat sendiri), 169.254.0.0/16 (APIPA — IP otomatis saat DHCP gagal), 224.0.0.0/4 (Multicast — untuk streaming ke banyak penerima), 255.255.255.255 (Broadcast — kirim ke semua perangkat di jaringan).',
            example: 'Ketika kamu ping 127.0.0.1, paket tidak benar-benar keluar ke jaringan — langsung dikembalikan ke perangkat sendiri.',
          },
          {
            id: 'subnetting',
            title: 'Subnetting — Memecah Jaringan',
            content: 'Subnetting adalah teknik meminjam bit dari Host ID untuk membuat lebih banyak jaringan (subnet) yang lebih kecil. Ini meningkatkan efisiensi, keamanan, dan manajemen jaringan. Notasi CIDR (/24, /26, dst.) menunjukkan berapa bit yang digunakan sebagai Network ID.',
            example: '/24 = 254 host/subnet | /26 = 62 host/subnet | /28 = 14 host/subnet',
          },
        ],
        groups: [
          { id: 'classful', label: 'Kelas Jaringan (Classful)', colorClass: 'blue' },
          { id: 'special-addr', label: 'Alamat Khusus', colorClass: 'amber' },
          { id: 'subnet-tech', label: 'Teknik Subnetting', colorClass: 'green' },
        ],
        groupItems: [
          { id: 'class-a-item', text: 'Kelas A — /8 default, hingga 16 juta host/jaringan', correctGroup: 'classful' },
          { id: 'class-b-item', text: 'Kelas B — /16 default, hingga 65.534 host/jaringan', correctGroup: 'classful' },
          { id: 'class-c-item', text: 'Kelas C — /24 default, hingga 254 host/jaringan', correctGroup: 'classful' },
          { id: 'loopback', text: '127.0.0.1 — testing jaringan internal tanpa keluar perangkat', correctGroup: 'special-addr' },
          { id: 'broadcast', text: '255.255.255.255 — kirim paket ke semua host di jaringan', correctGroup: 'special-addr' },
          { id: 'cidr', text: 'Notasi CIDR (/26, /28) — menentukan jumlah bit Network ID', correctGroup: 'subnet-tech' },
        ],
        question: 'Kelompokkan konsep-konsep IPv4 ke dalam kategori yang tepat',
      },

      // ── 3. QUESTIONING ────────────────────────────────────────────
      {
        type: 'questioning',
        title: 'Questioning',
        description: 'Analisis kasus subnetting dan pilih alasan yang paling tepat',
        objectiveCode: 'X.IPv4.5',
        objectiveDescription: 'Mampu membedakan kelas IPv4 disertai alasan yang logis',
        scenario: 'Sebuah kantor memiliki jaringan 192.168.10.0/24 dengan 254 alamat host. Setelah audit, ditemukan bahwa 150 alamat tidak pernah digunakan. Manajer IT memutuskan untuk melakukan subnetting — membagi jaringan menjadi 4 subnet lebih kecil, masing-masing untuk satu departemen.',
        whyQuestion: 'Mengapa melakukan subnetting pada kasus ini lebih baik dibanding terus menggunakan satu jaringan /24 untuk semua departemen?',
        hint: 'Bayangkan jika semua departemen (keuangan, HRD, IT, sales) ada di satu jaringan — apa risikonya dari sisi keamanan dan manajemen traffic?',
        reasonOptions: [
          {
            id: 'a',
            text: 'Karena subnetting membuat kecepatan internet kantor menjadi lebih cepat',
            isCorrect: false,
            feedback: 'Subnetting tidak langsung meningkatkan kecepatan internet. Manfaat utamanya adalah keamanan, efisiensi penggunaan alamat, dan pengurangan broadcast traffic — bukan peningkatan bandwidth.',
          },
          {
            id: 'b',
            text: 'Karena subnetting membatasi broadcast domain — traffic antar departemen tidak saling mengganggu, dan data keuangan terisolasi dari departemen lain',
            isCorrect: true,
            feedback: 'Tepat! Dengan subnetting: (1) Broadcast hanya menyebar di subnet yang sama, mengurangi overhead jaringan, (2) Isolasi keamanan — departemen keuangan tidak bisa diakses langsung dari subnet sales, (3) Manajemen lebih mudah per departemen.',
          },
          {
            id: 'c',
            text: 'Karena komputer lebih suka bekerja di jaringan kecil secara teknis',
            isCorrect: false,
            feedback: 'Komputer tidak memiliki preferensi ukuran jaringan. Manfaat subnetting bersifat administratif dan keamanan, bukan preferensi teknis perangkat.',
          },
          {
            id: 'd',
            text: 'Karena IPv4 mewajibkan setiap departemen memiliki subnet tersendiri',
            isCorrect: false,
            feedback: 'IPv4 tidak mewajibkan subnetting per departemen. Subnetting adalah keputusan desain jaringan, bukan persyaratan teknis IPv4.',
          },
        ],
      },

      // ── 4. LEARNING COMMUNITY ─────────────────────────────────────
      {
        type: 'learning-community',
        title: 'Learning Community',
        description: 'Pasangkan kelas IPv4 dengan range-nya, lalu analisis kasus subnetting',
        objectiveCode: 'X.IPv4.6 – X.IPv4.7',
        objectiveDescription: 'Mampu mengidentifikasi dan menerapkan subnetting IPv4',
        matchingPairs: [
          { left: 'Kelas A (/8)', right: 'Oktet pertama 1–126, ~16 juta host' },
          { left: 'Kelas B (/16)', right: 'Oktet pertama 128–191, ~65 ribu host' },
          { left: 'Kelas C (/24)', right: 'Oktet pertama 192–223, 254 host' },
          { left: 'CIDR /26', right: 'Subnet mask 255.255.255.192, 62 host' },
        ],
        caseScenario: {
          title: 'Kasus: Subnetting untuk Perusahaan',
          description: 'Sebuah startup memiliki network 192.168.20.0/24. Mereka ingin membagi menjadi 4 subnet untuk 4 divisi: Engineering (50 host), Marketing (30 host), Finance (20 host), dan Management (10 host). Keamanan antar divisi sangat penting.',
          question: 'Subnet mask mana yang paling tepat agar setiap divisi mendapat subnet yang cukup dan tidak boros alamat?',
          options: [
            {
              id: 'a',
              text: '/26 untuk semua divisi (62 host/subnet) — cukup untuk semua divisi termasuk Engineering',
              isCorrect: true,
              feedback: 'Tepat! /26 memberikan 62 host yang cukup untuk divisi terbesar (Engineering dengan 50 host). Pembagian 4 subnet /26 dari /24 adalah solusi efisien: 192.168.20.0/26, .64/26, .128/26, .192/26.',
            },
            {
              id: 'b',
              text: '/24 tetap untuk semua — tidak perlu subnetting, gunakan VLAN saja',
              isCorrect: false,
              feedback: 'VLAN memang alternatif yang valid, tapi pertanyaannya tentang subnetting IPv4. Satu /24 tanpa subnetting berarti semua divisi dalam satu broadcast domain — tidak ada isolasi jaringan di level IP.',
            },
            {
              id: 'c',
              text: '/28 untuk semua divisi (14 host/subnet) — lebih efisien karena tidak boros',
              isCorrect: false,
              feedback: '/28 hanya menyediakan 14 host. Engineering membutuhkan 50 host — /28 tidak cukup! Memilih subnet terlalu kecil akan menyebabkan kehabisan alamat.',
            },
            {
              id: 'd',
              text: '/8 untuk semua — pakai kelas A supaya tidak perlu khawatir kehabisan',
              isCorrect: false,
              feedback: 'Menggunakan /8 untuk startup kecil sangat berlebihan (16 juta host). Ini pemborosan alamat dan mempersulit manajemen. Pilih subnet sesuai kebutuhan aktual.',
            },
          ],
        },
        peerAnswers: [
          { name: 'Fajar', role: 'Kelompok A', answer: 'Kita pilih /26 karena divisi terbesar butuh 50 host. /26 kasih 62 host, cukup dengan sedikit cadangan.' },
          { name: 'Dewi', role: 'Kelompok B', answer: 'Kita bisa pakai variable subnetting — /26 untuk Engineering, /27 untuk Marketing, /28 untuk Finance dan Management.' },
          { name: 'Rian', role: 'Kelompok C', answer: 'Setuju /26 untuk semua supaya konsisten dan mudah di-manage, meski ada sedikit pemborosan di divisi kecil.' },
        ],
      },

      // ── 5. MODELING ───────────────────────────────────────────────
      {
        type: 'modeling',
        title: 'Modeling',
        description: 'Pelajari proses subnetting langkah demi langkah, lalu susun kembali urutannya',
        objectiveCode: 'X.IPv4.8',
        objectiveDescription: 'Mampu mengurutkan proses perhitungan subnet secara sistematis',
        steps: [
          {
            id: '1',
            title: 'Tentukan Kebutuhan',
            description: 'Langkah pertama: tentukan berapa subnet yang dibutuhkan dan berapa host maksimum per subnet. Misalnya: butuh 4 subnet, divisi terbesar punya 50 host.',
            visual: '📋',
          },
          {
            id: '2',
            title: 'Hitung Bit Subnet',
            description: 'Untuk 4 subnet, butuh 2 bit (2^2 = 4). Bit ini "dipinjam" dari bagian Host ID. Rumus: 2^n ≥ jumlah subnet yang dibutuhkan.',
            visual: '🔢',
          },
          {
            id: '3',
            title: 'Tentukan Subnet Mask Baru',
            description: 'Subnet mask baru = subnet mask asli + bit yang dipinjam. Contoh: /24 + 2 bit = /26. Subnet mask dalam desimal: 255.255.255.192.',
            visual: '🎭',
          },
          {
            id: '4',
            title: 'Hitung Jumlah Host per Subnet',
            description: 'Host per subnet = 2^(bit host) - 2 (dikurangi network address dan broadcast). Untuk /26: bit host = 32-26 = 6, host = 2^6 - 2 = 62 host.',
            visual: '👥',
          },
          {
            id: '5',
            title: 'Tentukan Range Setiap Subnet',
            description: 'Hitung range IP setiap subnet. Untuk 192.168.20.0/26: Subnet 1: .0 – .63 (host: .1–.62), Subnet 2: .64–.127, Subnet 3: .128–.191, Subnet 4: .192–.255.',
            visual: '📊',
          },
        ],
        question: 'Susun kembali langkah-langkah proses subnetting IPv4 dalam urutan yang benar',
        items: [
          { id: '1', text: 'Tentukan berapa subnet yang dibutuhkan dan ukuran host terbesar', order: 1 },
          { id: '2', text: 'Hitung jumlah bit yang perlu dipinjam: 2^n ≥ jumlah subnet', order: 2 },
          { id: '3', text: 'Tentukan subnet mask baru (/24 + n bit = subnet mask baru)', order: 3 },
          { id: '4', text: 'Hitung host per subnet: 2^(32-prefix) - 2', order: 4 },
          { id: '5', text: 'Hitung range IP (network address, host range, broadcast) tiap subnet', order: 5 },
        ],
      },

      // ── 6. REFLECTION ─────────────────────────────────────────────
      {
        type: 'reflection',
        title: 'Reflection',
        description: 'Refleksikan pemahamanmu tentang IPv4 dan subnetting',
        objectiveCode: 'X.IPv4.9',
        objectiveDescription: 'Mampu menjelaskan kembali alur pembagian jaringan secara logis',
        initialKnowledgeContext: 'Di awal pertemuan, kamu menjawab tentang implikasi batasan 32-bit IPv4. Setelah mempelajari kelas-kelas IPv4, alamat khusus, and teknik subnetting...',
        reflectionQuestion: 'Misalkan kamu diminta merancang jaringan untuk sebuah sekolah dengan 3 lab komputer (masing-masing 30 komputer) dan 1 ruang guru (20 komputer). Jelaskan bagaimana kamu akan menerapkan subnetting IPv4 untuk solusi ini!',
        selfEvaluationCriteria: [
          { id: 'structure', label: 'Saya dapat menjelaskan struktur 32-bit IPv4 dan format penulisannya' },
          { id: 'classes', label: 'Saya dapat membedakan kelas A, B, C dan menentukan kelas suatu IP Address' },
          { id: 'special', label: 'Saya dapat menyebutkan alamat khusus IPv4 (loopback, broadcast) dan fungsinya' },
          { id: 'subnet', label: 'Saya dapat menghitung subnet mask, jumlah host, dan range IP untuk subnetting' },
        ],
      },

      // ── 7. AUTHENTIC ASSESSMENT ───────────────────────────────────
      {
        type: 'authentic-assessment',
        title: 'Authentic Assessment',
        description: 'Studi kasus bercabang: Rancang skema subnetting yang tepat',
        objectiveCode: 'X.IPv4.10',
        objectiveDescription: 'Mampu mengaitkan struktur, kelas, dan subnetting IPv4 secara menyeluruh',
        branchingScenario: {
          context: 'Kamu adalah network engineer junior yang ditugaskan merancang jaringan untuk kantor pusat baru. Kantor ini punya 4 departemen: R&D (80 host), Operations (40 host), HR (20 host), dan Executive (10 host). Kamu diberikan network 10.0.0.0/24.',
          initialQuestion: 'Berapa bit yang harus kamu pinjam untuk membuat minimal 4 subnet dari /24?',
          choices: [
            {
              id: 'a',
              text: '1 bit — menghasilkan 2^1 = 2 subnet',
              isOptimal: false,
              consequence: '1 bit hanya menghasilkan 2 subnet — tidak cukup untuk 4 departemen. Kamu membutuhkan minimal 4 subnet.',
              followUpQuestion: 'Dengan hanya 2 subnet untuk 4 departemen, masalah apa yang paling serius?',
              followUpChoices: [
                {
                  id: 'a1',
                  text: 'Dua departemen harus berbagi satu subnet — tidak ada isolasi keamanan antar mereka',
                  isCorrect: true,
                  explanation: 'Tepat! Departemen yang berbagi subnet berarti traffic mereka berada di satu broadcast domain. R&D dan HR berbagi subnet misalnya — data riset sensitif bisa diakses di level jaringan.',
                },
                {
                  id: 'a2',
                  text: 'Komputer di departemen berbeda tidak bisa berkomunikasi sama sekali',
                  isCorrect: false,
                  explanation: 'Komunikasi antar departemen tetap bisa terjadi melalui router. Masalahnya adalah isolasi keamanan, bukan komunikasi.',
                },
              ],
            },
            {
              id: 'b',
              text: '2 bit — menghasilkan 2^2 = 4 subnet',
              isOptimal: true,
              consequence: 'Tepat! 2 bit menghasilkan persis 4 subnet. Subnet mask baru: /26 (255.255.255.192). Setiap subnet punya 62 host yang cukup untuk semua departemen, termasuk R&D dengan 80 host... tunggu, apakah 62 cukup?',
              followUpQuestion: 'R&D membutuhkan 80 host, tapi /26 hanya menyediakan 62 host per subnet. Apa solusi terbaik?',
              followUpChoices: [
                {
                  id: 'b1',
                  text: 'Gunakan /25 untuk subnet R&D saja (126 host), sisanya tetap /26 — ini disebut Variable Length Subnet Masking (VLSM)',
                  isCorrect: true,
                  explanation: 'Brilian! VLSM memungkinkan subnet yang berbeda-beda ukurannya dalam satu jaringan. R&D dapat /25 (126 host), tiga departemen lain mendapat /26 (62 host masing-masing). Ini solusi yang efisien dan profesional.',
                },
                {
                  id: 'b2',
                  text: 'Kurangi jumlah perangkat R&D agar muat di /26',
                  isCorrect: false,
                  explanation: 'Tidak tepat. Kebutuhan bisnis tidak boleh dikompromikan karena keterbatasan teknis yang bisa diatasi. Solusinya adalah menyesuaikan ukuran subnet (VLSM), bukan mengurangi perangkat.',
                },
              ],
            },
            {
              id: 'c',
              text: '4 bit — menghasilkan 2^4 = 16 subnet',
              isOptimal: false,
              consequence: '4 bit menghasilkan 16 subnet — lebih dari cukup untuk 4 departemen, tapi setiap subnet hanya punya 14 host (2^4-2). R&D dengan 80 host tidak bisa masuk dalam satu subnet /28!',
              followUpQuestion: 'Dengan /28 (14 host per subnet), bagaimana mengatasi kebutuhan R&D yang memerlukan 80 host?',
              followUpChoices: [
                {
                  id: 'c1',
                  text: 'Bagi R&D menjadi beberapa subnet dan gunakan routing antar subnet',
                  isCorrect: true,
                  explanation: 'Secara teknis bisa, tapi ini membuat manajemen jaringan sangat kompleks. R&D perlu 6 subnet /28 yang harus di-route — overhead yang tidak perlu. Pilih ukuran subnet yang sesuai kebutuhan dari awal.',
                },
                {
                  id: 'c2',
                  text: 'Tidak ada solusi — /28 tidak cocok untuk jaringan ini',
                  isCorrect: false,
                  explanation: 'Ada solusi teknis, tapi sangat tidak efisien. Pesan utamanya: pilih subnet mask yang tepat dari awal berdasarkan kebutuhan host terbesar.',
                },
              ],
            },
          ],
          finalEvaluation: 'Analisis kasus selesai! Poin kunci subnetting: (1) Hitung bit yang dipinjam berdasarkan jumlah subnet yang dibutuhkan; (2) Verifikasi host per subnet cukup untuk departemen terbesar; (3) Gunakan VLSM jika departemen memiliki kebutuhan host yang sangat berbeda; (4) Selalu sisakan beberapa alamat untuk pertumbuhan.',
        },
      },
    ],
    posttest: {
      questions: [
        {
          question: 'IPv4 menggunakan berapa bit?',
          options: ['16 bit', '32 bit', '64 bit', '128 bit'],
          correctAnswer: 1,
        },
        {
          question: 'Format penulisan IPv4 adalah...',
          options: [
            'Empat oktet dipisahkan titik',
            'Delapan heksadesimal dipisahkan titik dua',
            'Enam oktet dipisahkan titik',
            'Dua oktet dipisahkan titik',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Range IP Address kelas A adalah...',
          options: [
            '1.0.0.0 - 126.255.255.255',
            '128.0.0.0 - 191.255.255.255',
            '192.0.0.0 - 223.255.255.255',
            '224.0.0.0 - 239.255.255.255',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Subnet mask default kelas C adalah...',
          options: [
            '255.255.255.0',
            '255.255.0.0',
            '255.0.0.0',
            '255.255.255.255',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Alamat loopback IPv4 adalah...',
          options: [
            '127.0.0.1',
            '192.168.1.1',
            '10.0.0.1',
            '172.16.0.1',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Jumlah maksimal host pada subnet /24 adalah...',
          options: [
            '254 host',
            '256 host',
            '128 host',
            '512 host',
          ],
          correctAnswer: 0,
        },
        {
          question: 'CIDR /28 sama dengan subnet mask...',
          options: [
            '255.255.255.240',
            '255.255.255.224',
            '255.255.255.192',
            '255.255.255.128',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Alamat broadcast untuk network 192.168.1.0/24 adalah...',
          options: [
            '192.168.1.255',
            '192.168.1.0',
            '192.168.1.1',
            '192.168.1.254',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Kekurangan utama IPv4 adalah...',
          options: [
            'Jumlah alamat yang terbatas',
            'Terlalu rumit',
            'Tidak aman',
            'Terlalu lambat',
          ],
          correctAnswer: 0,
        },
        {
          question: 'NAT (Network Address Translation) digunakan untuk...',
          options: [
            'Menghemat penggunaan IP public',
            'Mempercepat koneksi',
            'Mengenkripsi data',
            'Membagi bandwidth',
          ],
          correctAnswer: 0,
        },
      ],
    },
  },
  '4': {
    id: '4',
    title: 'Pertemuan 4',
    topic: 'Pengenalan IPv6',
    description: 'Memahami struktur, format, dan keunggulan IPv6 sebagai pengganti IPv4',
    objectives: [
      'X.IPv6.1 : Mampu mendefinisikan IPv6 dalam jaringan komputer',
      'X.IPv6.2 : Mampu menentukan fungsi utama IPv6',
      'X.IPv6.3 : Mampu menguraikan mekanisme struktur IPv6',
      'X.IPv6.4 : Mampu mengkategorikan jenis alamat IPv6',
      'X.IPv6.5 : Mampu membedakan jenis alamat IPv6 disertai alasan yang logis',
      'X.IPv6.6 : Mampu mengidentifikasi fitur unggulan IPv6',
      'X.IPv6.7 : Mampu menerapkan fitur IPv6 dalam konteks kasus',
      'X.IPv6.8 : Mampu mengurutkan proses transisi IPv4 ke IPv6',
      'X.IPv6.9 : Mampu menjelaskan alur kerja IPv6 secara logis',
      'X.IPv6.10 : Mampu mengaitkan fungsi, struktur, dan transisi IPv6 secara menyeluruh',
    ],
    initialCompetencies: [
      'Siswa telah memahami struktur dan kelas IPv4 dari pertemuan sebelumnya',
      'Siswa mengetahui konsep subnetting pada IPv4',
      'Siswa memahami keterbatasan IPv4 dalam penyediaan alamat IP',
    ],
    materials: [
      'Pengertian dan struktur alamat IPv6 (128-bit, heksadesimal)',
      'Keunggulan IPv6 dibandingkan IPv4',
      'Jenis alamat IPv6: Unicast, Multicast, dan Anycast',
      'Fitur unggulan IPv6 (IPSec, SLAAC, NDP)',
      'Mekanisme transisi IPv4 ke IPv6 (Dual Stack, Tunneling, NAT64)',
    ],
    pretest: {
      questions: [
        {
          question: 'IPv6 menggunakan berapa bit?',
          options: ['32 bit', '64 bit', '128 bit', '256 bit'],
          correctAnswer: 2,
        },
        {
          question: 'Format penulisan IPv6 menggunakan...',
          options: [
            'Heksadesimal dipisahkan titik dua',
            'Desimal dipisahkan titik',
            'Biner',
            'Oktal',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Mengapa diperlukan IPv6?',
          options: [
            'IPv4 kehabisan alamat',
            'IPv4 terlalu lambat',
            'IPv4 tidak aman',
            'IPv4 ketinggalan zaman',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Berapa kelompok dalam alamat IPv6?',
          options: [
            '8 kelompok',
            '4 kelompok',
            '6 kelompok',
            '16 kelompok',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Metode transisi IPv4 ke IPv6 adalah...',
          options: [
            'Dual Stack',
            'Langsung replace',
            'Tidak bisa',
            'Hanya tunneling',
          ],
          correctAnswer: 0,
        },
      ],
    },
    stages: [
      // ── 1. CONSTRUCTIVISM ─────────────────────────────────────────
      {
        type: 'constructivism',
        title: 'Constructivism',
        description: 'Membangun pemahaman tentang kebutuhan IPv6 dari realita dunia digital',
        objectiveCode: 'X.IPv6.1 – X.IPv6.2',
        objectiveDescription: 'Mampu mendefinisikan IPv6 dan menentukan fungsi utamanya',
        apersepsi: 'Di tahun 2011, IANA (badan yang mengalokasikan alamat IP) resmi mengumumkan bahwa alokasi blok IPv4 terakhir sudah habis dibagikan. Saat ini lebih dari 15 miliar perangkat terhubung ke internet — smartphone, laptop, smart TV, kulkas pintar, sensor IoT — dan jumlahnya terus bertambah. Bagaimana internet bisa terus berkembang jika "alamat"-nya sudah habis?',
        question: 'IPv6 dikembangkan sebagai solusi untuk masalah IPv4. Apa perbedaan PALING MENDASAR antara IPv4 dan IPv6 yang menjawab masalah kehabisan alamat?',
        options: [
          { id: 'a', text: 'IPv6 menggunakan 128-bit vs IPv4 32-bit — menghasilkan 2^128 alamat (340 undecillion) vs 2^32 (~4,3 miliar)' },
          { id: 'b', text: 'IPv6 menggunakan format heksadesimal sementara IPv4 menggunakan desimal' },
          { id: 'c', text: 'IPv6 lebih cepat karena header-nya lebih sederhana' },
          { id: 'd', text: 'IPv6 memiliki fitur keamanan IPSec yang tidak ada di IPv4' },
        ],
        correctAnswer: 'a',
        feedback: {
          correct: 'Tepat! Penambahan panjang alamat dari 32-bit ke 128-bit adalah solusi utama. 2^128 menghasilkan jumlah alamat yang secara praktis tidak terbatas — cukup untuk setiap atom di permukaan bumi mendapat alamat IP-nya sendiri.',
          incorrect: 'Belum tepat. Perbedaan paling mendasar yang menjawab masalah kehabisan alamat adalah panjang bit: IPv4 = 32-bit (~4 miliar), IPv6 = 128-bit (~340 undecillion alamat). Format dan fitur lainnya adalah keunggulan tambahan.',
        },
      },

      // ── 2. INQUIRY ────────────────────────────────────────────────
      {
        type: 'inquiry',
        title: 'Inquiry',
        description: 'Eksplorasi karakteristik IPv6, lalu kelompokkan berdasarkan fungsinya',
        objectiveCode: 'X.IPv6.3 – X.IPv6.4',
        objectiveDescription: 'Mampu menguraikan struktur dan mengkategorikan jenis alamat IPv6',
        explorationSections: [
          {
            id: 'address-space',
            title: 'Ruang Alamat 128-bit',
            content: 'IPv6 menggunakan 128-bit untuk alamat, menghasilkan 2^128 = 340.282.366.920.938.463.463.374.607.431.768.211.456 alamat unik. Untuk memahami skalanya: jika seluruh permukaan bumi ditutupi perangkat dengan jarak 1mm, setiap perangkat masih bisa mendapat triliunan alamat IPv6.',
            example: 'Format: 8 kelompok heksadesimal dipisahkan titik dua → 2001:0db8:85a3:0000:0000:8a2e:0370:7334',
          },
          {
            id: 'notation',
            title: 'Penulisan & Penyingkatan',
            content: 'IPv6 ditulis dalam heksadesimal (0-9, A-F), 8 kelompok 4 digit dipisahkan titik dua. Ada dua aturan penyingkatan: (1) Leading zero boleh dihilangkan dalam satu kelompok: 0db8 → db8, (2) Satu rangkaian kelompok yang semuanya nol bisa diganti dengan :: (hanya boleh sekali).',
            example: '2001:0db8:0000:0000:0000:0000:0000:0001 disingkat → 2001:db8::1',
          },
          {
            id: 'security',
            title: 'IPSec Built-in',
            content: 'IPv6 mengintegrasikan IPSec (Internet Protocol Security) secara native. IPSec menyediakan enkripsi (ESP) dan autentikasi (AH) di level jaringan. Di IPv4, IPSec opsional dan harus dikonfigurasi terpisah.',
            example: 'Ini berarti setiap komunikasi IPv6 bisa dienkripsi secara transparan tanpa konfigurasi tambahan di lapisan aplikasi.',
          },
          {
            id: 'multicast',
            title: 'Multicast & Anycast (Tanpa Broadcast)',
            content: 'IPv6 menghapus broadcast yang ada di IPv4 dan menggantinya dengan multicast (kirim ke banyak penerima terdaftar) dan anycast (kirim ke node terdekat dari sekelompok node dengan alamat sama). Ini jauh lebih efisien karena tidak semua perangkat terganggu oleh traffic broadcast.',
            example: 'Multicast IPv6: ff02::1 (semua node di link), ff02::2 (semua router di link)',
          },
          {
            id: 'autoconfig',
            title: 'Stateless Autoconfiguration (SLAAC)',
            content: 'Perangkat IPv6 bisa mengkonfigurasi alamatnya sendiri tanpa DHCP menggunakan SLAAC (Stateless Address Autoconfiguration). Caranya: perangkat menggunakan Router Advertisement dari router untuk mendapat prefix jaringan, lalu menggabungkannya dengan MAC address untuk membuat alamat unik.',
            example: 'Ini menyederhanakan administrasi jaringan besar — tidak perlu DHCP server untuk setiap subnet.',
          },
        ],
        groups: [
          { id: 'addressing', label: 'Pengalamatan & Format', colorClass: 'blue' },
          { id: 'security-feat', label: 'Fitur Keamanan', colorClass: 'purple' },
          { id: 'efficiency', label: 'Efisiensi Jaringan', colorClass: 'green' },
        ],
        groupItems: [
          { id: 'bit128', text: '128-bit address space (2^128 alamat)', correctGroup: 'addressing' },
          { id: 'hexa', text: 'Format heksadesimal 8 kelompok dengan aturan penyingkatan', correctGroup: 'addressing' },
          { id: 'ipsec', text: 'IPSec terintegrasi secara native untuk enkripsi', correctGroup: 'security-feat' },
          { id: 'nobroadcast', text: 'Tidak ada broadcast — hanya multicast dan anycast', correctGroup: 'efficiency' },
          { id: 'slaac', text: 'SLAAC — konfigurasi alamat otomatis tanpa DHCP', correctGroup: 'efficiency' },
          { id: 'simpleheader', text: 'Header lebih sederhana dari IPv4 untuk pemrosesan lebih cepat', correctGroup: 'efficiency' },
        ],
        question: 'Kelompokkan karakteristik IPv6 ke dalam kategori yang tepat',
      },

      // ── 3. QUESTIONING ────────────────────────────────────────────
      {
        type: 'questioning',
        title: 'Questioning',
        description: 'Analisis skenario transisi IPv4-ke-IPv6 dan pilih alasan yang paling logis',
        objectiveCode: 'X.IPv6.5',
        objectiveDescription: 'Mampu membedakan jenis alamat IPv6 disertai alasan yang logis',
        scenario: 'Sebuah ISP besar telah beroperasi selama 20 tahun dengan infrastruktur IPv4. Mereka harus mulai mendukung IPv6 karena alokasi IPv4 baru sudah habis. Namun jutaan pelanggan mereka masih menggunakan perangkat lama yang hanya mendukung IPv4. ISP tidak bisa serta-merta mematikan IPv4.',
        whyQuestion: 'Mengapa transisi dari IPv4 ke IPv6 tidak bisa dilakukan secara seketika (big-bang migration), melainkan harus melalui periode koeksistensi yang panjang?',
        hint: 'Bayangkan berapa banyak perangkat, router, switch, server, dan aplikasi yang saat ini beroperasi dengan IPv4. Apa yang terjadi jika semua IPv4 dimatikan besok?',
        reasonOptions: [
          {
            id: 'a',
            text: 'Karena IPv6 belum stabil secara teknis dan masih dalam tahap pengembangan',
            isCorrect: false,
            feedback: 'Tidak tepat. IPv6 sudah distandardisasi sejak 1998 (RFC 2460) dan telah digunakan secara luas. Masalahnya bukan stabilitas teknis, tapi ekosistem dan kompatibilitas.',
          },
          {
            id: 'b',
            text: 'Karena miliaran perangkat, router, server, dan aplikasi yang ada tidak mendukung IPv6 — mengganti semuanya sekaligus tidak mungkin secara praktis dan ekonomis',
            isCorrect: true,
            feedback: 'Tepat! Inilah "transisi problem" IPv6. Solusinya adalah metode koeksistensi: (1) Dual Stack — perangkat menjalankan IPv4 dan IPv6 bersamaan; (2) Tunneling — mengirim paket IPv6 melalui infrastruktur IPv4; (3) Translation (NAT64) — menghubungkan jaringan IPv6-only dengan server IPv4.',
          },
          {
            id: 'c',
            text: 'Karena regulasi pemerintah mewajibkan periode transisi minimum 10 tahun',
            isCorrect: false,
            feedback: 'Tidak ada regulasi universal yang mewajibkan periode transisi tertentu. Alasan sebenarnya adalah teknis dan ekonomis — skala ekosistem IPv4 yang sangat besar.',
          },
          {
            id: 'd',
            text: 'Karena format heksadesimal IPv6 sulit dipahami sehingga administrator perlu pelatihan lebih dulu',
            isCorrect: false,
            feedback: 'Format bukan hambatan utama. Administrator jaringan profesional bisa belajar format IPv6 dengan cepat. Tantangan sebenarnya adalah infrastruktur dan kompatibilitas perangkat, bukan format penulisan.',
          },
        ],
      },

      // ── 4. LEARNING COMMUNITY ─────────────────────────────────────
      {
        type: 'learning-community',
        title: 'Learning Community',
        description: 'Pasangkan tipe alamat IPv6 dengan fungsinya, lalu analisis skenario implementasi',
        objectiveCode: 'X.IPv6.6 – X.IPv6.7',
        objectiveDescription: 'Mampu mengidentifikasi dan menerapkan fitur unggulan IPv6',
        matchingPairs: [
          { left: 'Unicast Global (2001::/16)', right: 'Alamat yang dapat dirutekan di internet global' },
          { left: 'Link-Local (fe80::/10)', right: 'Hanya berlaku di satu link/segmen jaringan lokal' },
          { left: 'Loopback (::1)', right: 'Testing jaringan internal — setara 127.0.0.1 IPv4' },
          { left: 'Multicast (ff00::/8)', right: 'Kirim paket ke sekelompok penerima terdaftar' },
        ],
        caseScenario: {
          title: 'Kasus: ISP Memulai Adopsi IPv6',
          description: 'ISP "NusaNet" memiliki 500.000 pelanggan rumahan. Mereka harus mulai mengalokasikan IPv6 karena stok IPv4 habis. Namun 60% pelanggan masih menggunakan router lama yang hanya mendukung IPv4. Beberapa pelanggan sudah punya router baru yang mendukung dual-stack.',
          question: 'Strategi transisi mana yang paling tepat untuk NusaNet?',
          options: [
            {
              id: 'a',
              text: 'Dual Stack — jalankan IPv4 dan IPv6 bersamaan selama masa transisi',
              isCorrect: true,
              feedback: 'Tepat! Dual Stack adalah strategi yang paling aman dan banyak digunakan. Pelanggan dengan router baru langsung dapat IPv6. Pelanggan dengan router lama tetap pakai IPv4. Secara bertahap, ketika pelanggan upgrade router, IPv4 bisa dikurangi.',
            },
            {
              id: 'b',
              text: 'Langsung switch ke IPv6-only — minta semua pelanggan ganti router dalam 1 bulan',
              isCorrect: false,
              feedback: 'Ini akan mengakibatkan 60% pelanggan kehilangan koneksi internet segera. Tidak praktis, sangat mahal (biaya ganti router), dan berpotensi kehilangan pelanggan massal.',
            },
            {
              id: 'c',
              text: 'Tetap IPv4-only dengan NAT — gunakan NAT444 (carrier-grade NAT) untuk menghemat alamat',
              isCorrect: false,
              feedback: 'NAT444 adalah solusi jangka pendek yang buruk — menambah kompleksitas, mengurangi performa, dan tidak menyelesaikan masalah fundamental. Ini hanya menunda transisi yang inevitable.',
            },
            {
              id: 'd',
              text: 'Tunneling saja — kirim IPv6 melalui tunneling di infrastruktur IPv4',
              isCorrect: false,
              feedback: 'Tunneling adalah teknik yang valid, tapi sebagai strategi utama untuk ISP besar, ini kurang efisien (overhead enkapsulasi) dan tidak menyelesaikan kebutuhan alokasi alamat jangka panjang.',
            },
          ],
        },
        peerAnswers: [
          { name: 'Hendra', role: 'Kelompok A', answer: 'Kita pilih Dual Stack karena paling realistis. Tidak memaksa pelanggan ganti router segera tapi mulai migrasi bertahap.' },
          { name: 'Putri', role: 'Kelompok B', answer: 'Dual Stack juga, tapi kita tambahkan deadline — dalam 2 tahun semua pelanggan harus punya router IPv6-capable.' },
          { name: 'Bagas', role: 'Kelompok C', answer: 'Kombinasi Dual Stack untuk pelanggan baru dan NAT64 untuk pelanggan lama yang tidak bisa upgrade.' },
        ],
      },

      // ── 5. MODELING ───────────────────────────────────────────────
      {
        type: 'modeling',
        title: 'Modeling',
        description: 'Pelajari proses komunikasi IPv6 langkah demi langkah, lalu susun kembali urutannya',
        objectiveCode: 'X.IPv6.8',
        objectiveDescription: 'Mampu mengurutkan proses transisi IPv4 ke IPv6',
        steps: [
          {
            id: '1',
            title: 'Perangkat Mendapat Alamat IPv6',
            description: 'Perangkat mendapatkan alamat IPv6 melalui salah satu cara: (1) Manual oleh administrator, (2) DHCPv6 dari server, atau (3) SLAAC — perangkat secara otomatis membuat alamat dari prefix yang didapat via Router Advertisement.',
            visual: '🔑',
          },
          {
            id: '2',
            title: 'Neighbor Discovery Protocol (NDP)',
            description: 'NDP adalah pengganti ARP di IPv6. Perangkat menggunakan NDP untuk: menemukan router di jaringan lokal (Router Solicitation/Advertisement), menemukan MAC address perangkat lain (Neighbor Solicitation/Advertisement), dan mendeteksi duplikasi alamat.',
            visual: '🔍',
          },
          {
            id: '3',
            title: 'Pembentukan Paket IPv6',
            description: 'Data dibungkus dalam paket IPv6. Header IPv6 lebih sederhana dari IPv4 (40 byte, fixed size) — tidak ada checksum header, tidak ada fragmentasi di router (hanya di pengirim). Ini membuat pemrosesan di router lebih cepat.',
            visual: '📦',
          },
          {
            id: '4',
            title: 'Routing IPv6',
            description: 'Router membaca IP tujuan di header IPv6 dan meneruskan paket berdasarkan routing table IPv6. Protocol routing seperti OSPFv3, BGP4+, dan RIPng digunakan untuk membangun tabel routing IPv6.',
            visual: '🌐',
          },
          {
            id: '5',
            title: 'Penerimaan & Pemrosesan',
            description: 'Paket tiba di tujuan. Perangkat memverifikasi alamat tujuan. Jika cocok, data diekstrak dan dikirim ke aplikasi yang meminta. Jika IPSec aktif, dekripsi dan verifikasi autentikasi dilakukan.',
            visual: '✅',
          },
        ],
        question: 'Susun kembali langkah-langkah komunikasi menggunakan IPv6 dalam urutan yang benar',
        items: [
          { id: '1', text: 'Perangkat mendapat alamat IPv6 (manual, DHCPv6, atau SLAAC)', order: 1 },
          { id: '2', text: 'NDP digunakan untuk menemukan router dan perangkat di jaringan lokal', order: 2 },
          { id: '3', text: 'Data dikemas dalam paket IPv6 dengan header yang lebih sederhana', order: 3 },
          { id: '4', text: 'Router meneruskan paket berdasarkan routing table IPv6', order: 4 },
          { id: '5', text: 'Paket diterima, diproses, dan data dikirim ke aplikasi tujuan', order: 5 },
        ],
      },

      // ── 6. REFLECTION ─────────────────────────────────────────────
      {
        type: 'reflection',
        title: 'Reflection',
        description: 'Refleksikan pemahamanmu tentang IPv6 and relevansinya',
        objectiveCode: 'X.IPv6.9',
        objectiveDescription: 'Mampu menjelaskan kembali alur kerja IPv6 secara logis',
        initialKnowledgeContext: 'Di awal pertemuan, kamu menjawab tentang perbedaan mendasar IPv4 and IPv6. Setelah mempelajari 128-bit address space, format heksadesimal, IPSec built-in, multicast, SLAAC, and metode transisi...',
        reflectionQuestion: 'Bayangkan kamu adalah seorang CTO startup IoT yang akan meluncurkan 10.000 sensor cerdas. Jelaskan mengapa kamu akan memilih IPv6 untuk semua perangkat tersebut, dan bagaimana IPv6 mengatasi tantangan yang akan kamu hadapi!',
        selfEvaluationCriteria: [
          { id: 'understand', label: 'Saya dapat menjelaskan mengapa IPv6 diperlukan dan kelebihan utamanya vs IPv4' },
          { id: 'format', label: 'Saya dapat membaca, menulis, dan menyingkat alamat IPv6 dengan benar' },
          { id: 'types', label: 'Saya dapat membedakan tipe alamat IPv6 (unicast, multicast, link-local, loopback)' },
          { id: 'transition', label: 'Saya dapat menjelaskan metode transisi IPv4-ke-IPv6 (Dual Stack, Tunneling, Translation)' },
        ],
      },

      // ── 7. AUTHENTIC ASSESSMENT ───────────────────────────────────
      {
        type: 'authentic-assessment',
        title: 'Authentic Assessment',
        description: 'Studi kasus bercabang: Rancang strategi implementasi IPv6',
        objectiveCode: 'X.IPv6.10',
        objectiveDescription: 'Mampu mengaitkan fungsi, struktur, dan transisi IPv6 secara menyeluruh',
        branchingScenario: {
          context: 'Kamu adalah konsultan jaringan yang dipercaya sebuah universitas besar. Universitas ini punya 50.000 perangkat (komputer, laptop mahasiswa, server, dan 5.000 sensor IoT di kampus). Mereka ingin mulai mengimplementasikan IPv6. Infrastruktur mereka campuran — 40% perangkat mendukung dual-stack, 60% hanya IPv4.',
          initialQuestion: 'Apa langkah PERTAMA yang paling krusial sebelum memulai implementasi IPv6 di universitas ini?',
          choices: [
            {
              id: 'a',
              text: 'Langsung konfigurasi IPv6 di semua router dan switch yang mendukung',
              isOptimal: false,
              consequence: 'Tanpa inventaris dan perencanaan yang matang, konfigurasi langsung bisa menyebabkan masalah: beberapa perangkat tidak bisa berkomunikasi, konflik konfigurasi, dan downtime tak terduga.',
              followUpQuestion: 'Masalah apa yang paling sering terjadi ketika implementasi jaringan dilakukan tanpa perencanaan terlebih dahulu?',
              followUpChoices: [
                {
                  id: 'a1',
                  text: 'Konfigurasi yang tidak konsisten menyebabkan sebagian jaringan berfungsi dan sebagian tidak — sulit di-debug',
                  isCorrect: true,
                  explanation: 'Tepat! Implementasi tanpa perencanaan sering menghasilkan partial deployment yang sangat sulit di-troubleshoot. "Kenapa laptop di lab A bisa IPv6 tapi lab B tidak?" tanpa dokumentasi bisa memakan waktu berhari-hari.',
                },
                {
                  id: 'a2',
                  text: 'Router akan otomatis menolak konfigurasi IPv6 yang salah',
                  isCorrect: false,
                  explanation: 'Router tidak otomatis menolak konfigurasi yang kurang tepat. Sebagian konfigurasi mungkin diterima tapi menghasilkan behavior yang tidak diharapkan — justru lebih berbahaya.',
                },
              ],
            },
            {
              id: 'b',
              text: 'Buat inventaris lengkap semua perangkat, tentukan mana yang IPv6-ready, dan buat rencana bertahap',
              isOptimal: true,
              consequence: 'Langkah yang tepat! Inventaris + rencana bertahap adalah fondasi implementasi yang berhasil. Kamu tahu: (1) Perangkat mana yang sudah IPv6-ready (40%), (2) Perangkat mana yang perlu upgrade, (3) Urutan prioritas (misal: server dulu, lalu lab utama, lalu sensor IoT).',
              followUpQuestion: 'Untuk 5.000 sensor IoT yang hanya mendukung IPv4, solusi transisi mana yang paling tepat?',
              followUpChoices: [
                {
                  id: 'b1',
                  text: 'NAT64/DNS64 — sensor tetap gunakan IPv4, tapi berkomunikasi dengan jaringan IPv6 melalui translation',
                  isCorrect: true,
                  explanation: 'Brilian! NAT64 memungkinkan perangkat IPv4-only (sensor) berkomunikasi dengan infrastruktur IPv6. Ini solusi pragmatis untuk perangkat yang tidak bisa di-upgrade firmware-nya — seperti sensor IoT yang mungkin terpasang di lokasi sulit.',
                },
                {
                  id: 'b2',
                  text: 'Ganti semua 5.000 sensor dengan model baru yang mendukung IPv6',
                  isCorrect: false,
                  explanation: 'Secara teknis benar, tapi tidak praktis. Biaya penggantian 5.000 sensor sangat besar dan penggantinya mungkin tidak tersedia untuk sensor dengan spesifikasi khusus. NAT64 adalah solusi yang jauh lebih hemat biaya.',
                },
              ],
            },
            {
              id: 'c',
              text: 'Tunda implementasi IPv6 — masih bisa menggunakan IPv4 dengan NAT selama beberapa tahun lagi',
              isOptimal: false,
              consequence: 'Menunda memang tidak akan langsung menimbulkan masalah, tapi ini kehilangan momentum. Semakin lama ditunda, semakin banyak perangkat yang perlu di-upgrade sekaligus, dan biaya transisi semakin besar.',
              followUpQuestion: 'Apa risiko nyata dari terus mengandalkan NAT IPv4 untuk universitas dengan 50.000 perangkat?',
              followUpChoices: [
                {
                  id: 'c1',
                  text: 'NAT membatasi kemampuan hosting layanan dari dalam kampus dan mempersulit troubleshooting koneksi peer-to-peer',
                  isCorrect: true,
                  explanation: 'Tepat! NAT memang menyelamatkan IPv4 sementara, tapi ada trade-off nyata: (1) Server di balik NAT tidak bisa diakses langsung dari internet, (2) Aplikasi peer-to-peer dan VoIP sering bermasalah, (3) Log jaringan lebih sulit dianalisis.',
                },
                {
                  id: 'c2',
                  text: 'Tidak ada risiko nyata — NAT sudah cukup untuk seterusnya',
                  isCorrect: false,
                  explanation: 'Pandangan yang kurang tepat untuk skala universitas. Dengan 50.000+ perangkat dan kebutuhan hosting layanan penelitian yang bisa diakses dari luar, keterbatasan NAT akan semakin terasa seiring waktu.',
                },
              ],
            },
          ],
          finalEvaluation: 'Kasus implementasi selesai! Poin kunci IPv6: (1) Ruang alamat 2^128 menyelesaikan masalah kehabisan IPv4; (2) Transisi memerlukan strategi bertahap — inventaris dulu, lalu implementasi; (3) Dual Stack untuk perangkat baru, NAT64 untuk legacy devices; (4) Mulai sekarang lebih baik dari menunda — biaya transisi bertambah seiring waktu.',
        },
      },
    ],
    posttest: {
      questions: [
        {
          question: 'IPv6 menggunakan berapa bit?',
          options: ['32 bit', '64 bit', '128 bit', '256 bit'],
          correctAnswer: 2,
        },
        {
          question: 'Format penulisan IPv6 menggunakan...',
          options: [
            'Heksadesimal dipisahkan titik dua',
            'Desimal dipisahkan titik',
            'Biner dipisahkan spasi',
            'Oktal dipisahkan titik',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Berapa kelompok heksadesimal dalam IPv6?',
          options: ['4 kelompok', '6 kelompok', '8 kelompok', '16 kelompok'],
          correctAnswer: 2,
        },
        {
          question: 'Alamat loopback IPv6 adalah...',
          options: [
            '::1',
            '127.0.0.1',
            'fe80::1',
            '2001::1',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Keunggulan IPv6 dibanding IPv4 adalah...',
          options: [
            'Ruang alamat sangat besar dan keamanan built-in',
            'Lebih mudah diingat',
            'Lebih cepat 10x lipat',
            'Tidak perlu router',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Prefix untuk link-local address IPv6 adalah...',
          options: [
            'fe80::/10',
            'ff00::/8',
            '2001::/16',
            'fc00::/7',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Metode transisi dari IPv4 ke IPv6 adalah...',
          options: [
            'Dual Stack, Tunneling, Translation',
            'Langsung replace semua',
            'Tidak bisa transisi',
            'Harus buat jaringan baru',
          ],
          correctAnswer: 0,
        },
        {
          question: 'IPv6 tidak menggunakan broadcast, tetapi menggunakan...',
          options: [
            'Multicast',
            'Unicast saja',
            'Anycast saja',
            'Broadcast tetap ada',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Jumlah alamat yang dapat disediakan IPv6 adalah...',
          options: [
            'Hampir tidak terbatas (2^128)',
            '4 miliar',
            '1 triliun',
            '1 juta',
          ],
          correctAnswer: 0,
        },
        {
          question: 'ICMPv6 pada IPv6 berfungsi untuk...',
          options: [
            'Error reporting dan Neighbor Discovery',
            'Hanya error checking',
            'Routing saja',
            'Enkripsi data',
          ],
          correctAnswer: 0,
        },
      ],
    },
  },
};
