import { type Stage, getStageDisplayTitle } from './lessons';

// Helper to create a complete set of 7 stages
export function createDefaultStages(lessonId: string, topic: string): Stage[] {
  return [
    {
      type: 'constructivism',
      title: 'Constructivism',
      description: `Membangun pemahaman awal tentang ${topic} melalui pengamatan fenomena nyata.`,
      objectiveCode: `X.${lessonId}.1`,
      apersepsi: `Bayangkan sebuah skenario di mana ${topic} sangat berperan penting dalam kehidupan sehari-hari...`,
      question: `Menurut pendapatmu, apa peran utama dari ${topic} dalam situasi tersebut?`,
      options: [
        { id: 'a', text: 'Menyediakan koneksi yang stabil' },
        { id: 'b', text: 'Mengatur pengiriman paket data' },
        { id: 'c', text: 'Mengidentifikasi perangkat' },
        { id: 'd', text: 'Semua benar' }
      ],
      correctAnswer: 'd',
      feedback: { correct: 'Benar! Kamu memahami peran pentingnya.', incorrect: 'Hampir tepat, pelajari lagi konsep dasarnya.' },
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder
    },
    {
      type: 'inquiry',
      title: 'Inquiry',
      description: `Menemukan konsep ${topic} melalui eksplorasi mandiri dan analisis data.`,
      objectiveCode: `X.${lessonId}.2`,
      explorationSections: [
        { id: '1', title: `Definisi ${topic}`, content: `${topic} adalah sebuah konsep penting dalam jaringan komputer yang berfungsi untuk...`, example: `Contoh penerapan ${topic} pada...` },
        { id: '2', title: `Karakteristik ${topic}`, content: `Beberapa ciri khas dari ${topic} meliputi...`, example: 'Misalnya...' }
      ],
      groups: [
        { id: 'g1', label: 'Kategori A', colorClass: 'blue' },
        { id: 'g2', label: 'Kategori B', colorClass: 'green' }
      ],
      groupItems: [
        { id: 'i1', text: 'Item 1', correctGroup: 'g1' },
        { id: 'i2', text: 'Item 2', correctGroup: 'g2' }
      ]
    },
    {
      type: 'questioning',
      title: 'Questioning',
      description: `Menganalisis skenario kritis dan merumuskan pertanyaan tentang ${topic}.`,
      objectiveCode: `X.${lessonId}.3`,
      teacherQuestion: `Mengapa menurut kalian ${topic} harus mengikuti aturan tertentu dalam jaringan?`,
      scenario: `Jika sebuah sistem mengalami kendala pada ${topic}, apa yang akan terjadi pada aliran data?`,
      whyQuestion: 'Apa alasan logis di balik mekanisme ini?',
      reasonOptions: [
        { id: 'r1', text: 'Untuk efisiensi data', isCorrect: true, feedback: 'Tepat sekali!' },
        { id: 'r2', text: 'Hanya sebagai formalitas', isCorrect: false, feedback: 'Kurang tepat, ada alasan teknis di baliknya.' }
      ],
      questionBank: [
        { id: 'q1', text: `Apa dampak ${topic} pada kecepatan?`, response: 'Sangat berpengaruh karena...' }
      ]
    },
    {
      type: 'learning-community',
      title: 'Learning Community',
      description: `Bekerja sama dalam kelompok untuk memecahkan masalah terkait ${topic}.`,
      objectiveCode: `X.${lessonId}.4`,
      matchingPairs: [
        { left: 'Konsep A', right: 'Definisi A' },
        { left: 'Konsep B', right: 'Definisi B' }
      ],
      caseScenario: {
        title: `Studi Kasus ${topic}`,
        description: `Sebuah jaringan perusahaan mengalami masalah pada ${topic}...`,
        question: 'Apa solusi terbaik yang harus diambil kelompokmu?',
        options: [
          { id: 'o1', text: 'Optimasi konfigurasi', isCorrect: true, feedback: 'Kelompokmu memilih langkah yang tepat.' },
          { id: 'o2', text: 'Restart perangkat', isCorrect: false, feedback: 'Ini hanya solusi sementara.' }
        ]
      },
      peerAnswers: [
        { name: 'Andi', role: 'Analis', answer: 'Saya pikir kita harus fokus pada header paket.' },
        { name: 'Siti', role: 'Teknisi', answer: 'Konfigurasi IP juga perlu dicek.' }
      ],
      groupActivity: { groupNames: ['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4', 'Kelompok 5', 'Kelompok 6', 'Kelompok 7', 'Kelompok 8'] }
    },
    {
      type: 'modeling',
      title: 'Modeling',
      description: `Mengamati dan mempraktikkan peragaan model dari konsep ${topic}.`,
      objectiveCode: `X.${lessonId}.5`,
      steps: [
        { id: 's1', title: 'Langkah 1', description: 'Persiapkan lingkungan simulasi...', visual: '🛠️' },
        { id: 's2', title: 'Langkah 2', description: 'Konfigurasikan parameter...', visual: '⚙️' }
      ],
      items: [
        { id: 'it1', text: 'Inisialisasi', order: 1 },
        { id: 'it2', text: 'Pemrosesan', order: 2 },
        { id: 'it3', text: 'Selesai', order: 3 }
      ]
    },
    {
      type: 'reflection',
      title: 'Reflection',
      description: `Merefleksikan apa yang telah dipelajari dan menghubungkannya dengan pengetahuan awal.`,
      objectiveCode: `X.${lessonId}.6`,
      essayReflection: {
        materialSummaryPrompt: 'Tuliskan ringkasan apa yang kamu pahami hari ini...',
        easyPartPrompt: 'Bagian mana yang paling mudah menurutmu?',
        hardPartPrompt: 'Bagian mana yang masih menantang?'
      },
      selfEvaluationCriteria: [
        { id: 'c1', label: 'Memahami teori dasar' },
        { id: 'c2', label: 'Dapat melakukan praktik' }
      ]
    },
    {
      type: 'authentic-assessment',
      title: 'Authentic Assessment',
      description: `Menerapkan pemahaman ${topic} dalam situasi dunia nyata yang kompleks.`,
      objectiveCode: `X.${lessonId}.7`,
      branchingScenario: {
        context: `Kamu adalah seorang administrator jaringan yang harus menangani migrasi ${topic}...`,
        initialQuestion: 'Langkah strategis apa yang pertama kali kamu lakukan?',
        choices: [
          { id: 'c1', text: 'Audit sistem saat ini', isOptimal: true, consequence: 'Keputusan yang sangat bagus. Kamu memiliki data dasar.' },
          { id: 'c2', text: 'Langsung ganti perangkat', isOptimal: false, consequence: 'Terlalu berisiko tanpa perencanaan.' }
        ],
        finalEvaluation: 'Evaluasi menunjukkan bahwa pemahamanmu sudah sangat matang.'
      }
    }
  ];
}
