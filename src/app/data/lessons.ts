// Lesson content data structure
export interface Stage {
  type: 'constructivism' | 'inquiry' | 'questioning' | 'learning-community' | 'modeling' | 'reflection' | 'authentic-assessment';
  title: string;
  description: string;
  objectiveCode?: string;
  objectiveDescription?: string;
  activityGuide?: string[];
  logicalThinkingIndicators?: string[];
  facilitatorNotes?: string[];
  atpAbcd?: {
    audience: string;
    behavior: string;
    condition: string;
    degree: string;
  };

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

  // ── CONSTRUCTIVISM (extended) ────────────────────────────────────────────
  storyScramble?: {
    instruction: string;
    fragments: Array<{ id: string; text: string; order: number }>;
    successMessage: string;
    reflection?: string;
    reflectionAnswer?: string;
  };
  analogySortGroups?: Array<{ id: string; label: string; colorClass: 'blue' | 'green' | 'purple' | 'amber' }>;
  analogySortItems?: Array<{ id: string; text: string; correctGroup: string; correctOrder?: number; courierAnalogy?: string }>;
  constructivismEssay1?: string;
  constructivismEssay2?: string;

  // ── INQUIRY (extended) ──────────────────────────────────────────────────
  flowItems?: Array<{
    id: string;
    text: string;
    correctOrder: number;
    description?: string;
    colorClass?: 'blue' | 'green' | 'purple' | 'amber' | 'pink' | 'indigo';
  }>;
  flowInstruction?: string;
  labelingSlots?: Array<{ id: string; label: string; description: string }>;
  labelingLabels?: Array<{ id: string; text: string; correctSlot: string }>;
  inquiryReflection1?: string;
  inquiryReflection2?: string;

  // ── QUESTIONING (extended) ──────────────────────────────────────────────
  problemVisual?: {
    icon: string;
    title: string;
    description: string;
    problemType: 'corruption' | 'packet-loss' | 'collision' | 'delay';
  };

  // ── LEARNING COMMUNITY (extended) ─────────────────────────────────────────
  peerVotingScenario?: {
    context: string;
    question: string;
    methods: Array<{ id: string; title: string; description: string; votes?: number; pros: string; cons: string }>;
    correctMethodId: string;
  };
  peerComments?: Array<{ name: string; avatar: string; comment: string; votedFor: string }>;
  caseComparisonData?: {
    title: string;
    process: Array<{ id: string; step: string; correctOrder: number }>;
    peerAnalyses: Array<{ name: string; analysis: string; isCorrect: boolean }>;
  };
  encapsulationCaseData?: {
    title: string;
    process: Array<{ id: string; step: string; correctOrder: number }>;
    groupAnswers: Array<{ name: string; analysis: string; isCorrect: boolean }>;
  };

  // ── REFLECTION (extended) ──────────────────────────────────────────────
  conceptMapNodes?: Array<{ id: string; label: string; description?: string; colorClass?: string }>;
  conceptMapConnections?: Array<{ from: string; to: string; label: string; options: string[] }>;

  // ── AUTHENTIC ASSESSMENT ────────────────────────────────────────────────
  branchingScenario?: {
    context: string;
    initialQuestion: string;
    focusAreas?: string[];
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
  atpAbcd?: {
    audience: string;
    behavior: string;
    condition: string;
    degree: string;
  };
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
  '1': 'Pada pertemuan ini, peserta didik mempelajari konsep dasar TCP, fungsi utama, dan perannya dalam jaringan melalui rangkaian aktivitas CTL interaktif.',
  '2': 'Pada pertemuan ini, peserta didik mempelajari mekanisme kerja TCP secara mendalam termasuk three-way handshake dan flow control.',
  '3': 'Pada pertemuan ini, peserta didik mempelajari struktur IPv4, pengelompokan kelas alamat, dan dasar pengalamatan jaringan.',
  '4': 'Pada pertemuan ini, peserta didik mempelajari struktur IPv6, jenis alamat, fitur unggulan, serta mekanisme transisi dari IPv4 ke IPv6.',
};

export const stageLearningObjectivesByLesson: Record<string, Partial<Record<StageType, StageLearningObjective[]>>> = {
  '1': {
    constructivism: [
      {
        code: 'X.TCP.1',
        description: 'Mampu mendefinisikan TCP dalam jaringan komputer',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu mendefinisikan TCP dalam jaringan komputer dan telekomunikasi',
          condition: 'melalui aktivitas constructivism berupa apersepsi animasi berbasis pengalaman penggunaan internet pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
      {
        code: 'X.TCP.2',
        description: 'Mampu menentukan fungsi utama TCP',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu menentukan fungsi utama TCP',
          condition: 'melalui aktivitas constructivism berupa pengelompokan analogi kurir fisik dan protokol digital pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
    inquiry: [
      {
        code: 'X.TCP.3',
        description: 'Mampu mengurutkan hierarki lapisan TCP/IP dalam proses encapsulation',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu mengurutkan hierarki lapisan TCP/IP dalam proses encapsulation',
          condition: 'melalui aktivitas inquiry berupa eksplorasi visual dan Logic Flow Builder pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
      {
        code: 'X.TCP.4',
        description: 'Mampu mengkategorikan fungsi komponen TCP Header',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu mengkategorikan fungsi komponen TCP Header',
          condition: 'melalui aktivitas inquiry berupa Drag-and-Drop Labeling pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
    questioning: [
      {
        code: 'X.TCP.5',
        description: 'Mampu menganalisis masalah paket data dan memilih solusi berdasarkan TCP Header yang relevan',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu menganalisis masalah paket data dan memilih solusi berdasarkan TCP Header yang relevan',
          condition: 'melalui aktivitas questioning berupa analisis kasus data corruption dan argumen logis pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
    'learning-community': [
      {
        code: 'X.TCP.6',
        description: 'Mampu memilih metode komunikasi terbaik pada skenario CSMA/CD dengan argumentasi logis',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu memilih metode komunikasi terbaik pada skenario CSMA/CD dengan argumentasi logis',
          condition: 'melalui aktivitas learning community berupa peer voting dan diskusi komunitas pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
      {
        code: 'X.TCP.7',
        description: 'Mampu membandingkan dan memvalidasi urutan proses decapsulation TCP/IP',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu membandingkan dan memvalidasi urutan proses decapsulation TCP/IP',
          condition: 'melalui aktivitas learning community berupa perbandingan analisis kasus pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
    modeling: [
      {
        code: 'X.TCP.8',
        description: 'Mampu mengurutkan proses encapsulation, transmisi, dan decapsulation TCP/IP secara menyeluruh',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu mengurutkan proses encapsulation, transmisi, dan decapsulation TCP/IP secara menyeluruh',
          condition: 'melalui aktivitas modeling berupa Interactive Walkthrough dan simulasi langkah demi langkah pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
    reflection: [
      {
        code: 'X.TCP.9',
        description: 'Mampu menyusun peta konsep hubungan antar konsep TCP dari encapsulation hingga decapsulation',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu menyusun peta konsep hubungan antar konsep TCP dari encapsulation hingga decapsulation',
          condition: 'melalui aktivitas reflection berupa penyusunan Concept Map Builder dan jurnal refleksi pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
    'authentic-assessment': [
      {
        code: 'X.TCP.10',
        description: 'Mampu mendiagnosis masalah pengiriman paket TCP melalui studi kasus bercabang secara autentik',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu mendiagnosis masalah pengiriman paket TCP melalui studi kasus bercabang secara autentik',
          condition: 'melalui aktivitas authentic assessment berupa Branching Troubleshooter pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
  },
  '2': {
    inquiry: [
      {
        code: 'X.TCP.3',
        description: 'Mampu mengurutkan hierarki lapisan TCP/IP dalam proses encapsulation',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu mengurutkan hierarki lapisan TCP/IP dalam proses encapsulation',
          condition: 'melalui aktivitas inquiry berupa eksplorasi visual alur data pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
      {
        code: 'X.TCP.4',
        description: 'Mampu mengkategorikan fungsi komponen TCP Header',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu mengkategorikan fungsi komponen TCP Header',
          condition: 'melalui aktivitas inquiry berupa Drag-and-Drop Labeling pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
    questioning: [
      {
        code: 'X.TCP.5',
        description: 'Mampu menganalisis masalah paket data dan memilih solusi berdasarkan TCP Header yang relevan',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu menganalisis masalah paket data dan memilih solusi berdasarkan TCP Header yang relevan',
          condition: 'melalui aktivitas questioning berupa analisis kasus flow control pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
    modeling: [
      {
        code: 'X.TCP.8',
        description: 'Mampu mengurutkan proses three-way handshake TCP',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu mengurutkan proses three-way handshake TCP',
          condition: 'melalui aktivitas modeling berupa Interactive Walkthrough mekanisme sinkronisasi paket pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
  },
  '3': {
    inquiry: [
      {
        code: 'X.IP.3',
        description: 'Mampu menguraikan struktur dan kelas IPv4',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu menguraikan struktur dan kelas IPv4',
          condition: 'melalui aktivitas inquiry berupa eksplorasi visual pengalamatan jaringan pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
  },
  '4': {
    'authentic-assessment': [
      {
        code: 'X.IPv6.10',
        description: 'Mampu merancang strategi transisi IPv6',
        atpAbcd: {
          audience: 'Peserta didik',
          behavior: 'mampu merancang strategi transisi IPv6',
          condition: 'melalui aktivitas authentic assessment berupa studi kasus transisi dual-stack pada media CONNETIC Module',
          degree: 'dengan tepat',
        },
      },
    ],
  },
};

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
  ] as TestQuestion[],
};

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
      question: 'Alamat loopback IPv6 adalah...',
      options: ['::1', '127.0.0.1', 'fe80::1', 'ff00::1'],
      correctAnswer: 0,
    },
  ] as TestQuestion[],
};

import { createDefaultStages } from './defaultStages';
import { lesson1Stages } from './lesson1Stages';

export const lessons: Record<string, Lesson> = {
  '1': {
    id: '1',
    title: 'Pertemuan 1',
    topic: 'Konsep Dasar TCP',
    description: 'Memahami dasar-dasar Transmission Control Protocol (TCP), komponen TCP Header, dan proses encapsulation/decapsulation',
    objectives: ['X.TCP.1', 'X.TCP.2', 'X.TCP.3', 'X.TCP.4', 'X.TCP.5', 'X.TCP.6', 'X.TCP.7', 'X.TCP.8', 'X.TCP.9', 'X.TCP.10'],
    initialCompetencies: ['Dasar jaringan komputer', 'Konsep protokol komunikasi', 'Model lapisan jaringan'],
    materials: ['Definisi & Fungsi TCP', 'Lapisan TCP/IP', 'Komponen TCP Header', 'Proses Encapsulation & Decapsulation'],
    pretest: {
      questions: [
        {
          question: 'Apa kepanjangan dari TCP?',
          options: ['Transmission Control Protocol', 'Transfer Control Protocol', 'Technical Control Protocol', 'Transport Control Protocol'],
          correctAnswer: 0,
        },
        {
          question: 'TCP bekerja pada lapisan mana dalam model TCP/IP?',
          options: ['Network Access Layer', 'Internet Layer', 'Transport Layer', 'Application Layer'],
          correctAnswer: 2,
        },
        {
          question: 'Field TCP Header manakah yang digunakan untuk mendeteksi kerusakan data?',
          options: ['Sequence Number', 'Window Size', 'Checksum', 'Source Port'],
          correctAnswer: 2,
        },
      ],
    },
    stages: lesson1Stages,
    posttest: {
      questions: [
        {
          question: 'Manakah yang merupakan karakteristik utama TCP?',
          options: ['Connectionless', 'Connection-oriented', 'Stateless', 'Best-effort delivery'],
          correctAnswer: 1,
        },
        {
          question: 'Urutan lapisan TCP/IP dari atas ke bawah dalam proses encapsulation adalah...',
          options: [
            'Network Access → Internet → Transport → Application',
            'Application → Transport → Internet → Network Access',
            'Transport → Application → Network Access → Internet',
            'Internet → Transport → Application → Network Access',
          ],
          correctAnswer: 1,
        },
        {
          question: 'Field TCP Header yang berperan dalam menyusun ulang segmen yang tiba tidak berurutan adalah...',
          options: ['Checksum', 'Window Size', 'Sequence Number', 'Destination Port'],
          correctAnswer: 2,
        },
      ],
    },
  },
  '2': {
    id: '2',
    title: 'Pertemuan 2',
    topic: 'Mekanisme TCP',
    description: 'Mendalami mekanisme kerja TCP seperti Three-Way Handshake dan Flow Control',
    objectives: ['X.TCP.3', 'X.TCP.4', 'X.TCP.5', 'X.TCP.8'],
    initialCompetencies: ['Konsep dasar TCP'],
    materials: ['Handshake', 'Flow Control'],
    pretest: {
      questions: [
        {
          question: 'Proses pembukaan koneksi pada TCP disebut...',
          options: ['Two-way handshake', 'Three-way handshake', 'Four-way handshake', 'Direct connection'],
          correctAnswer: 1,
        },
      ],
    },
    stages: createDefaultStages('TCP_MECH', 'Mekanisme TCP'),
    posttest: {
      questions: [
        {
          question: 'Urutan paket dalam three-way handshake adalah...',
          options: ['SYN, SYN-ACK, ACK', 'ACK, SYN, SYN-ACK', 'SYN, ACK, SYN-ACK', 'SYN, ACK, FIN'],
          correctAnswer: 0,
        },
      ],
    },
  },
  '3': {
    id: '3',
    title: 'Pertemuan 3',
    topic: 'Internet Protocol Version 4 (IPv4)',
    description: 'Memahami struktur, kelas, dan pengalamatan IPv4',
    objectives: ['X.IP.1', 'X.IP.3', 'X.IP.4'],
    initialCompetencies: ['Dasar IP'],
    materials: ['Struktur IPv4', 'Kelas IP', 'Subnet Mask'],
    pretest: {
      questions: [
        {
          question: 'Berapa jumlah bit dalam alamat IPv4?',
          options: ['16 bit', '32 bit', '64 bit', '128 bit'],
          correctAnswer: 1,
        },
      ],
    },
    stages: createDefaultStages('IPv4', 'Internet Protocol Version 4'),
    posttest: {
      questions: [
        {
          question: 'Alamat IP 192.168.1.1 termasuk dalam kelas...',
          options: ['Kelas A', 'Kelas B', 'Kelas C', 'Kelas D'],
          correctAnswer: 2,
        },
      ],
    },
  },
  '4': {
    id: '4',
    title: 'Pertemuan 4',
    topic: 'Internet Protocol Version 6 (IPv6)',
    description: 'Memahami struktur dan keunggulan IPv6',
    objectives: ['X.IPv6.1', 'X.IPv6.3', 'X.IPv6.8'],
    initialCompetencies: ['Dasar IPv4'],
    materials: ['Struktur IPv6', 'Transisi'],
    pretest: {
      questions: [
        {
          question: 'Berapa jumlah bit dalam alamat IPv6?',
          options: ['32 bit', '64 bit', '128 bit', '256 bit'],
          correctAnswer: 2,
        },
      ],
    },
    stages: createDefaultStages('IPv6', 'Internet Protocol Version 6'),
    posttest: {
      questions: [
        {
          question: 'Keunggulan utama IPv6 dibandingkan IPv4 adalah...',
          options: ['Ruang alamat lebih besar', 'Kecepatan lebih tinggi', 'Biaya lebih murah', 'Kompatibilitas penuh'],
          correctAnswer: 0,
        },
      ],
    },
  },
};
