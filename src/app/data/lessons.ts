// Lesson content data structure
export interface Stage {
  type: 'constructivism' | 'inquiry' | 'questioning' | 'learning-community' | 'modeling' | 'reflection' | 'authentic-assessment';
  title: string;
  description: string;
  question: string;
  videoUrl?: string; // For constructivism
  imageUrl?: string; // For questioning
  material?: {
    title: string;
    content: string[];
    examples?: string[];
  }; // For inquiry
  groupActivity?: {
    groupNames: string[];
    activity: string;
    discussionPoints: string[];
  }; // For learning community
  practiceInstructions?: {
    forTeacher: string[];
    forStudent: string[];
  }; // For modeling
  reflectionPrompts?: string[]; // For reflection
  options?: any[];
  correctAnswer?: any;
  feedback?: Record<string, string>;
  items?: any[];
  pairs?: any[];
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
  pretest: {
    questions: TestQuestion[];
  };
  stages: Stage[];
  posttest: {
    questions: TestQuestion[];
  };
}

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
      'Memahami fungsi dan karakteristik protokol TCP',
      'Mengidentifikasi proses three-way handshake',
      'Menganalisis perbedaan TCP dan UDP',
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
      {
        type: 'constructivism',
        title: 'Constructivism',
        description: 'Mari kita mulai dengan membangun pemahaman dari pengetahuan awal Anda',
        videoUrl: 'https://www.youtube.com/embed/qqRYkcta6IE', // Video tentang TCP basics
        question: 'Setelah menonton video, menurut Anda, mengapa beberapa aplikasi internet seperti video call memerlukan koneksi yang stabil?',
        options: [
          { id: 'a', text: 'Karena data harus dikirim secara berurutan dan lengkap' },
          { id: 'b', text: 'Karena memerlukan bandwidth yang besar' },
          { id: 'c', text: 'Karena menggunakan protokol khusus' },
          { id: 'd', text: 'Karena server lebih cepat' },
        ],
      },
      {
        type: 'inquiry',
        title: 'Inquiry',
        description: 'Eksplorasi: Pelajari materi kemudian pasangkan karakteristik TCP dengan fungsinya',
        material: {
          title: 'Materi: Karakteristik TCP',
          content: [
            'TCP (Transmission Control Protocol) adalah protokol transport layer yang memiliki beberapa karakteristik penting:',
            '1. Connection-oriented: TCP membangun koneksi terlebih dahulu sebelum mengirim data melalui proses three-way handshake.',
            '2. Reliable: TCP menjamin data sampai dengan lengkap dan benar ke tujuan. Jika ada paket yang hilang, akan dikirim ulang.',
            '3. Flow Control: TCP mengatur kecepatan pengiriman data agar tidak membanjiri penerima (menggunakan window size).',
            '4. Error Checking: TCP memeriksa kesalahan pada setiap paket data yang diterima menggunakan checksum.',
            '5. Ordered: Data yang dikirim akan diterima dalam urutan yang sama.',
          ],
          examples: [
            'Contoh penggunaan TCP: browsing web (HTTP/HTTPS), email (SMTP, POP3, IMAP), transfer file (FTP), remote access (SSH)',
          ],
        },
        question: 'Tarik dan lepaskan setiap karakteristik ke fungsi yang sesuai',
        pairs: [
          { left: 'Connection-oriented', right: 'Membangun koneksi sebelum mengirim data' },
          { left: 'Reliable', right: 'Menjamin data sampai dengan lengkap' },
          { left: 'Flow Control', right: 'Mengatur kecepatan pengiriman data' },
          { left: 'Error Checking', right: 'Memeriksa kesalahan pada data yang diterima' },
        ],
      },
      {
        type: 'questioning',
        title: 'Questioning',
        description: 'Analisis: Perhatikan gambar dan jawab pertanyaan berikut dengan cermat',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', // Network diagram
        question: 'Apa yang terjadi jika dalam proses three-way handshake, paket SYN-ACK tidak diterima oleh client?',
        options: [
          'Client akan mengirim ulang paket SYN',
          'Koneksi langsung terputus',
          'Server akan mengirim ulang paket SYN-ACK',
          'Data akan dikirim tanpa konfirmasi',
        ],
        correctAnswer: 0,
        feedback: {
          correct: 'Benar! Client akan mengirim ulang paket SYN karena belum menerima konfirmasi dari server.',
          incorrect: 'Kurang tepat. Dalam three-way handshake, jika SYN-ACK tidak diterima, client akan mencoba mengirim ulang paket SYN.',
        },
      },
      {
        type: 'learning-community',
        title: 'Learning Community',
        description: 'Diskusi Kelompok: Evaluasi pernyataan berikut bersama kelompok Anda',
        groupActivity: {
          groupNames: ['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4', 'Kelompok 5'],
          activity: 'Diskusikan dengan kelompok Anda apakah TCP lebih baik daripada UDP dalam segala situasi',
          discussionPoints: [
            'Pertimbangkan kecepatan vs keandalan',
            'Pikirkan aplikasi real-time seperti gaming atau streaming',
            'Analisis overhead yang dibutuhkan TCP',
            'Diskusikan trade-off antara kedua protokol',
          ],
        },
        question: '"TCP lebih baik daripada UDP dalam segala situasi." Apakah kelompok Anda setuju dengan pernyataan ini?',
        options: [
          { id: 'agree', text: 'Setuju' },
          { id: 'disagree', text: 'Tidak Setuju' },
        ],
      },
      {
        type: 'modeling',
        title: 'Modeling',
        description: 'Praktik: Guru mendemonstrasikan, kemudian siswa mempraktikkan dengan mengurutkan langkah-langkah',
        practiceInstructions: {
          forTeacher: [
            'Demonstrasikan proses three-way handshake menggunakan diagram di papan',
            'Jelaskan setiap langkah dengan analogi sederhana (misal: proses berjabat tangan)',
            'Tunjukkan apa yang terjadi jika salah satu langkah gagal',
            'Beri kesempatan siswa bertanya',
          ],
          forStudent: [
            'Perhatikan demonstrasi dari guru',
            'Catat poin-poin penting dari setiap langkah',
            'Sekarang urutkan langkah-langkah three-way handshake dengan benar',
            'Diskusikan dengan teman sebangku jika ada yang kurang jelas',
          ],
        },
        question: 'Urutkan langkah-langkah proses three-way handshake dalam TCP',
        items: [
          { id: '1', text: 'Client mengirim paket SYN ke server', order: 1 },
          { id: '2', text: 'Server menerima SYN dan mengirim SYN-ACK', order: 2 },
          { id: '3', text: 'Client menerima SYN-ACK dan mengirim ACK', order: 3 },
          { id: '4', text: 'Koneksi terbentuk dan data mulai ditransmisikan', order: 4 },
        ],
      },
      {
        type: 'reflection',
        title: 'Reflection',
        description: 'Refleksi: Renungkan pembelajaran Anda dan tarik kesimpulan',
        reflectionPrompts: [
          'Apa konsep paling penting yang Anda pelajari hari ini?',
          'Bagaimana TCP dapat diterapkan dalam kehidupan sehari-hari?',
          'Apa yang masih membingungkan dan perlu dipelajari lebih lanjut?',
          'Bagaimana pengetahuan ini akan berguna untuk karir Anda di bidang jaringan?',
        ],
        question: 'Pilih pernyataan yang paling tepat menggambarkan TCP berdasarkan pemahaman Anda',
        options: [
          'TCP adalah protokol yang menjamin pengiriman data secara berurutan dan reliable melalui mekanisme koneksi dan error checking',
          'TCP adalah protokol yang cepat untuk mengirim data tanpa memerlukan konfirmasi',
          'TCP hanya digunakan untuk transfer file besar',
          'TCP tidak memerlukan proses handshake',
        ],
        correctAnswer: 0,
      },
      {
        type: 'authentic-assessment',
        title: 'Authentic Assessment',
        description: 'Studi Kasus: Aplikasikan pengetahuan Anda dengan menjawab secara esai',
        question: 'Sebuah perusahaan ingin mengembangkan aplikasi chat yang harus memastikan setiap pesan sampai dengan urutan yang benar. Jelaskan secara detail:\n\n1. Protokol mana yang sebaiknya digunakan dan mengapa?\n2. Bagaimana protokol tersebut menjamin pesan sampai dengan benar?\n3. Apa yang terjadi jika ada pesan yang hilang di tengah jalan?\n4. Apa kelebihan dan kekurangan menggunakan protokol tersebut untuk aplikasi chat?',
        // No options or correctAnswer for essay-type question
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
      'Memahami fungsi IP Address dalam jaringan',
      'Mengidentifikasi komponen IP Address',
      'Membedakan IP Address public dan private',
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
      {
        type: 'constructivism',
        title: 'Constructivism',
        description: 'Mari kita mulai dengan membangun pemahaman dari pengetahuan awal Anda',
        videoUrl: 'https://www.youtube.com/embed/5WfiTHiU4x8', // Video tentang IP Address basics
        question: 'Setelah menonton video, menurut Anda, mengapa setiap perangkat yang terhubung ke internet memerlukan alamat unik?',
        options: [
          { id: 'a', text: 'Agar data dapat dikirim ke perangkat yang tepat' },
          { id: 'b', text: 'Agar koneksi lebih cepat' },
          { id: 'c', text: 'Agar lebih aman dari hacker' },
          { id: 'd', text: 'Agar lebih hemat bandwidth' },
        ],
      },
      {
        type: 'inquiry',
        title: 'Inquiry',
        description: 'Eksplorasi: Pelajari materi kemudian pasangkan komponen IP Address dengan fungsinya',
        material: {
          title: 'Materi: Komponen IP Address',
          content: [
            'IP Address (Internet Protocol Address) adalah alamat unik yang digunakan untuk mengidentifikasi perangkat dalam jaringan komputer.',
            '1. Network ID: Bagian yang mengidentifikasi jaringan tempat perangkat berada. Semua perangkat dalam jaringan yang sama memiliki Network ID yang sama.',
            '2. Host ID: Bagian yang mengidentifikasi perangkat spesifik (host) dalam jaringan tersebut. Setiap perangkat memiliki Host ID yang berbeda.',
            '3. Subnet Mask: Digunakan untuk membedakan bagian Network ID dan Host ID dari sebuah alamat IP.',
            '4. Default Gateway: Router atau perangkat yang menjadi pintu keluar dari jaringan lokal ke jaringan lain.',
          ],
          examples: [
            'Contoh: IP 192.168.1.10 dengan subnet mask 255.255.255.0, maka Network ID = 192.168.1 dan Host ID = 10',
            'IP Private: 10.0.0.0-10.255.255.255, 172.16.0.0-172.31.255.255, 192.168.0.0-192.168.255.255',
            'IP Public: Alamat yang dapat diakses dari internet, seperti 8.8.8.8 (DNS Google)',
          ],
        },
        question: 'Tarik dan lepaskan setiap komponen ke fungsi yang sesuai',
        pairs: [
          { left: 'Network ID', right: 'Mengidentifikasi jaringan tempat perangkat berada' },
          { left: 'Host ID', right: 'Mengidentifikasi perangkat spesifik dalam jaringan' },
          { left: 'Subnet Mask', right: 'Membedakan bagian network dan host' },
          { left: 'Default Gateway', right: 'Pintu keluar ke jaringan lain' },
        ],
      },
      {
        type: 'questioning',
        title: 'Questioning',
        description: 'Analisis: Perhatikan gambar dan jawab pertanyaan berikut dengan cermat',
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800', // Network infrastructure
        question: 'Jika sebuah perangkat memiliki IP 192.168.1.10 dengan subnet mask 255.255.255.0, bagian mana yang merupakan Network ID?',
        options: [
          '192.168.1',
          '192.168',
          '10',
          '192.168.1.10',
        ],
        correctAnswer: 0,
        feedback: {
          correct: 'Benar! Dengan subnet mask 255.255.255.0, tiga oktet pertama (192.168.1) adalah Network ID.',
          incorrect: 'Perhatikan subnet mask 255.255.255.0 yang menunjukkan bahwa 3 oktet pertama adalah bagian network.',
        },
      },
      {
        type: 'learning-community',
        title: 'Learning Community',
        description: 'Diskusi Kelompok: Evaluasi pernyataan berikut bersama kelompok Anda',
        groupActivity: {
          groupNames: ['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4', 'Kelompok 5'],
          activity: 'Diskusikan dengan kelompok Anda apakah IP Address public dan private dapat digunakan secara bergantian',
          discussionPoints: [
            'Pertimbangkan perbedaan fungsi IP Public dan Private',
            'Pikirkan aspek keamanan jaringan lokal',
            'Analisis keterbatasan jumlah IP Public yang tersedia',
            'Diskusikan skenario penggunaan masing-masing jenis IP',
          ],
        },
        question: '"IP Address public dan private memiliki fungsi yang sama dan dapat digunakan secara bergantian." Apakah kelompok Anda setuju dengan pernyataan ini?',
        options: [
          { id: 'agree', text: 'Setuju' },
          { id: 'disagree', text: 'Tidak Setuju' },
        ],
      },
      {
        type: 'modeling',
        title: 'Modeling',
        description: 'Praktik: Guru mendemonstrasikan, kemudian siswa mempraktikkan dengan mengurutkan langkah-langkah',
        practiceInstructions: {
          forTeacher: [
            'Demonstrasikan proses pengiriman data menggunakan IP Address dengan diagram',
            'Jelaskan peran setiap komponen dalam proses pengiriman',
            'Tunjukkan bagaimana router membaca IP tujuan',
            'Beri kesempatan siswa bertanya',
          ],
          forStudent: [
            'Perhatikan demonstrasi dari guru',
            'Catat urutan proses pengiriman data',
            'Sekarang urutkan langkah-langkah pengiriman data dengan benar',
            'Diskusikan dengan teman sebangku jika ada yang kurang jelas',
          ],
        },
        question: 'Urutkan proses pengiriman data menggunakan IP Address',
        items: [
          { id: '1', text: 'Perangkat sumber menentukan IP tujuan', order: 1 },
          { id: '2', text: 'Data dibungkus dalam paket dengan header IP', order: 2 },
          { id: '3', text: 'Router membaca IP tujuan dan meneruskan paket', order: 3 },
          { id: '4', text: 'Paket sampai di perangkat tujuan', order: 4 },
        ],
      },
      {
        type: 'reflection',
        title: 'Reflection',
        description: 'Refleksi: Renungkan pembelajaran Anda dan tarik kesimpulan',
        reflectionPrompts: [
          'Apa konsep paling penting yang Anda pelajari hari ini tentang IP Address?',
          'Bagaimana IP Address membantu komunikasi data dalam jaringan?',
          'Apa perbedaan yang paling penting antara IP Public dan Private?',
          'Bagaimana pengetahuan tentang IP Address akan berguna untuk Anda?',
        ],
        question: 'Pilih pernyataan yang paling tepat menggambarkan IP Address berdasarkan pemahaman Anda',
        options: [
          'IP Address adalah alamat unik yang mengidentifikasi perangkat dalam jaringan dan memungkinkan komunikasi data',
          'IP Address hanya digunakan untuk keamanan jaringan',
          'IP Address selalu tetap dan tidak pernah berubah',
          'IP Address hanya diperlukan untuk koneksi internet',
        ],
        correctAnswer: 0,
      },
      {
        type: 'authentic-assessment',
        title: 'Authentic Assessment',
        description: 'Studi Kasus: Aplikasikan pengetahuan Anda dengan menjawab secara detail',
        question: 'Sebuah kantor dengan 50 komputer ingin membuat jaringan lokal yang aman dan efisien. Jelaskan secara detail:\n\n1. Jenis IP Address apa yang sebaiknya digunakan (Public atau Private) dan mengapa?\n2. Bagaimana pembagian Network ID dan Host ID yang tepat?\n3. Apa fungsi Default Gateway dalam jaringan ini?\n4. Mengapa penggunaan IP Private lebih menguntungkan untuk jaringan lokal?',
        // No options or correctAnswer for essay-type question
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
      'Memahami format dan struktur IPv4',
      'Mengidentifikasi kelas-kelas IPv4',
      'Menghitung subnet pada IPv4',
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
      {
        type: 'constructivism',
        title: 'Constructivism',
        description: 'Mari kita mulai dengan membangun pemahaman dari pengetahuan awal Anda',
        videoUrl: 'https://www.youtube.com/embed/vcArZIAmnYQ', // Video tentang IPv4
        question: 'Setelah menonton video, menurut Anda, mengapa IPv4 menggunakan 4 kelompok angka yang dipisahkan titik?',
        options: [
          { id: 'a', text: 'Untuk memudahkan pembacaan dan pengelompokan alamat' },
          { id: 'b', text: 'Agar terlihat lebih menarik' },
          { id: 'c', text: 'Karena komputer hanya bisa membaca 4 angka' },
          { id: 'd', text: 'Tidak ada alasan khusus' },
        ],
      },
      {
        type: 'inquiry',
        title: 'Inquiry',
        description: 'Eksplorasi: Pelajari materi kemudian pasangkan kelas IPv4 dengan karakteristiknya',
        material: {
          title: 'Materi: Kelas-Kelas IPv4',
          content: [
            'IPv4 (Internet Protocol version 4) adalah sistem pengalamatan 32-bit yang terbagi menjadi beberapa kelas berdasarkan oktet pertamanya.',
            '1. Kelas A: Oktet pertama 1-126, subnet mask default 255.0.0.0, digunakan untuk jaringan sangat besar dengan banyak host.',
            '2. Kelas B: Oktet pertama 128-191, subnet mask default 255.255.0.0, digunakan untuk jaringan menengah.',
            '3. Kelas C: Oktet pertama 192-223, subnet mask default 255.255.255.0, digunakan untuk jaringan kecil.',
            '4. Alamat Khusus: 127.0.0.1 adalah loopback untuk testing internal, 0.0.0.0 berarti tidak ada alamat.',
            '5. Subnetting: Teknik membagi jaringan besar menjadi jaringan-jaringan kecil untuk efisiensi.',
          ],
          examples: [
            'Contoh Kelas A: 10.0.0.1 (private), 8.8.8.8 (DNS Google - public)',
            'Contoh Kelas B: 172.16.0.1 (private), 128.10.5.20 (public)',
            'Contoh Kelas C: 192.168.1.1 (private), 203.10.5.1 (public)',
          ],
        },
        question: 'Tarik dan lepaskan setiap kelas ke karakteristik yang sesuai',
        pairs: [
          { left: 'Kelas A', right: 'Oktet pertama: 1-126, untuk jaringan besar' },
          { left: 'Kelas B', right: 'Oktet pertama: 128-191, untuk jaringan menengah' },
          { left: 'Kelas C', right: 'Oktet pertama: 192-223, untuk jaringan kecil' },
          { left: 'Loopback', right: 'Alamat 127.0.0.1 untuk testing lokal' },
        ],
      },
      {
        type: 'questioning',
        title: 'Questioning',
        description: 'Analisis: Perhatikan gambar dan jawab pertanyaan berikut dengan cermat',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', // Network technology
        question: 'IP Address 172.16.50.10 termasuk kelas apa dan subnet mask default-nya?',
        options: [
          'Kelas B, 255.255.0.0',
          'Kelas A, 255.0.0.0',
          'Kelas C, 255.255.255.0',
          'Kelas D, 255.255.255.255',
        ],
        correctAnswer: 0,
        feedback: {
          correct: 'Benar! 172 berada di range 128-191, termasuk kelas B dengan subnet mask default 255.255.0.0.',
          incorrect: 'Perhatikan oktet pertama (172) dan range kelas IPv4.',
        },
      },
      {
        type: 'learning-community',
        title: 'Learning Community',
        description: 'Diskusi Kelompok: Evaluasi pernyataan berikut bersama kelompok Anda',
        groupActivity: {
          groupNames: ['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4', 'Kelompok 5'],
          activity: 'Diskusikan dengan kelompok Anda apakah IPv4 masih cukup untuk kebutuhan internet saat ini',
          discussionPoints: [
            'Pertimbangkan jumlah perangkat yang terhubung ke internet',
            'Pikirkan tentang IoT dan pertumbuhan perangkat',
            'Analisis keterbatasan 4 miliar alamat IPv4',
            'Diskusikan solusi seperti NAT dan penggunaan IPv6',
          ],
        },
        question: '"IPv4 sudah cukup untuk kebutuhan internet saat ini dan tidak perlu diganti." Apakah kelompok Anda setuju?',
        options: [
          { id: 'agree', text: 'Setuju' },
          { id: 'disagree', text: 'Tidak Setuju' },
        ],
      },
      {
        type: 'modeling',
        title: 'Modeling',
        description: 'Praktik: Guru mendemonstrasikan, kemudian siswa mempraktikkan dengan mengurutkan langkah-langkah',
        practiceInstructions: {
          forTeacher: [
            'Demonstrasikan proses subnetting dengan contoh network 192.168.10.0/24',
            'Jelaskan cara menghitung jumlah subnet dan host per subnet',
            'Tunjukkan cara menentukan subnet mask baru',
            'Beri kesempatan siswa bertanya dan latihan',
          ],
          forStudent: [
            'Perhatikan demonstrasi perhitungan subnetting dari guru',
            'Catat rumus dan langkah-langkah subnetting',
            'Sekarang urutkan proses subnetting dengan benar',
            'Diskusikan dengan teman sebangku jika ada yang kurang jelas',
          ],
        },
        question: 'Urutkan proses subnetting pada IPv4',
        items: [
          { id: '1', text: 'Tentukan jumlah subnet yang dibutuhkan', order: 1 },
          { id: '2', text: 'Hitung bit yang dipinjam dari host', order: 2 },
          { id: '3', text: 'Tentukan subnet mask baru', order: 3 },
          { id: '4', text: 'Hitung range IP untuk setiap subnet', order: 4 },
        ],
      },
      {
        type: 'reflection',
        title: 'Reflection',
        description: 'Refleksi: Renungkan pembelajaran Anda dan tarik kesimpulan',
        reflectionPrompts: [
          'Apa konsep paling penting yang Anda pelajari tentang struktur IPv4?',
          'Bagaimana pembagian kelas IPv4 membantu organisasi jaringan?',
          'Mengapa IPv4 memiliki keterbatasan alamat?',
          'Bagaimana pengetahuan subnetting akan berguna di dunia kerja?',
        ],
        question: 'Pilih pernyataan yang paling tepat menggambarkan IPv4 berdasarkan pemahaman Anda',
        options: [
          'IPv4 adalah sistem pengalamatan 32-bit yang terbagi dalam kelas-kelas dan memiliki keterbatasan jumlah alamat',
          'IPv4 tidak memiliki batasan jumlah alamat',
          'IPv4 hanya digunakan untuk jaringan lokal',
          'IPv4 dan IPv6 sama persis',
        ],
        correctAnswer: 0,
      },
      {
        type: 'authentic-assessment',
        title: 'Authentic Assessment',
        description: 'Studi Kasus: Aplikasikan pengetahuan Anda dengan menjawab secara detail',
        question: 'Sebuah perusahaan memiliki network 192.168.10.0/24 dan ingin membagi menjadi 4 subnet untuk 4 departemen berbeda. Jelaskan secara detail:\\n\\n1. Berapa subnet mask baru yang harus digunakan dan mengapa?\\n2. Berapa jumlah host yang tersedia di setiap subnet?\\n3. Tuliskan range IP untuk masing-masing subnet!\\n4. Apa kelebihan dan kekurangan dari subnetting ini?',
        // No options or correctAnswer for essay-type question
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
      'Memahami format dan struktur IPv6',
      'Mengidentifikasi keunggulan IPv6 dibanding IPv4',
      'Mengenal jenis-jenis alamat IPv6',
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
      {
        type: 'constructivism',
        title: 'Constructivism',
        description: 'Mari kita mulai dengan membangun pemahaman dari pengetahuan awal Anda',
        videoUrl: 'https://www.youtube.com/embed/ThdO9beHhpA', // Video tentang IPv6
        question: 'Setelah menonton video, menurut Anda, mengapa diperlukan IPv6 padahal IPv4 sudah ada?',
        options: [
          { id: 'a', text: 'Karena IPv4 kehabisan alamat untuk jumlah perangkat yang terus bertambah' },
          { id: 'b', text: 'Karena IPv4 terlalu lambat' },
          { id: 'c', text: 'Karena IPv4 tidak aman' },
          { id: 'd', text: 'Karena IPv4 sudah ketinggalan zaman' },
        ],
      },
      {
        type: 'inquiry',
        title: 'Inquiry',
        description: 'Eksplorasi: Pelajari materi kemudian pasangkan karakteristik IPv6 dengan penjelasannya',
        material: {
          title: 'Materi: Karakteristik IPv6',
          content: [
            'IPv6 (Internet Protocol version 6) adalah generasi baru sistem pengalamatan yang menggunakan 128-bit.',
            '1. Ruang Alamat Besar: IPv6 menyediakan 2^128 alamat (340 undecillion), jauh lebih banyak dari IPv4.',
            '2. Format Heksadesimal: Ditulis dalam 8 kelompok yang dipisahkan titik dua, menggunakan karakter 0-9 dan A-F.',
            '3. Keamanan Built-in: IPSec sudah terintegrasi secara default untuk enkripsi dan autentikasi.',
            '4. Tidak Ada Broadcast: IPv6 menggunakan multicast dan anycast, lebih efisien daripada broadcast.',
            '5. Autoconfiguration: Perangkat dapat mengkonfigurasi alamatnya sendiri (SLAAC).',
          ],
          examples: [
            'Contoh IPv6 lengkap: 2001:0db8:0000:0000:0000:0000:0000:0001',
            'Contoh IPv6 disingkat: 2001:db8::1 (leading zero dihilangkan, kelompok 0 berturut diganti ::)',
            'Loopback IPv6: ::1 (setara dengan 127.0.0.1 di IPv4)',
          ],
        },
        question: 'Tarik dan lepaskan setiap karakteristik ke penjelasan yang sesuai',
        pairs: [
          { left: '128-bit address', right: 'Menyediakan alamat yang sangat banyak' },
          { left: 'Heksadesimal', right: 'Format penulisan menggunakan 0-9 dan A-F' },
          { left: 'IPSec built-in', right: 'Keamanan terintegrasi secara default' },
          { left: 'No broadcast', right: 'Menggunakan multicast sebagai gantinya' },
        ],
      },
      {
        type: 'questioning',
        title: 'Questioning',
        description: 'Analisis: Perhatikan gambar dan jawab pertanyaan berikut dengan cermat',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', // Technology
        question: 'Alamat IPv6 2001:0db8:0000:0000:0000:0000:0000:0001 dapat disingkat menjadi?',
        options: [
          '2001:db8::1',
          '2001:db8:0:0:0:0:0:1',
          '2001:0db8::1',
          '2001:db8:1',
        ],
        correctAnswer: 0,
        feedback: {
          correct: 'Benar! Leading zero dihilangkan dan kelompok 0 berturut-turut diganti dengan ::',
          incorrect: 'Ingat aturan penyingkatan IPv6: hilangkan leading zero dan kelompok 0 berturut-turut bisa diganti :: (hanya sekali).',
        },
      },
      {
        type: 'learning-community',
        title: 'Learning Community',
        description: 'Diskusi Kelompok: Evaluasi pernyataan berikut bersama kelompok Anda',
        groupActivity: {
          groupNames: ['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4', 'Kelompok 5'],
          activity: 'Diskusikan dengan kelompok Anda apakah transisi dari IPv4 ke IPv6 dapat dilakukan secara langsung',
          discussionPoints: [
            'Pertimbangkan kompatibilitas perangkat yang sudah ada',
            'Pikirkan tentang infrastruktur jaringan yang sudah berjalan',
            'Analisis metode transisi seperti Dual Stack dan Tunneling',
            'Diskusikan waktu dan biaya yang diperlukan untuk transisi penuh',
          ],
        },
        question: '"Transisi dari IPv4 ke IPv6 dapat dilakukan secara langsung tanpa masa transisi." Apakah kelompok Anda setuju dengan pernyataan ini?',
        options: [
          { id: 'agree', text: 'Setuju' },
          { id: 'disagree', text: 'Tidak Setuju' },
        ],
      },
      {
        type: 'modeling',
        title: 'Modeling',
        description: 'Praktik: Guru mendemonstrasikan, kemudian siswa mempraktikkan dengan mengurutkan langkah-langkah',
        practiceInstructions: {
          forTeacher: [
            'Demonstrasikan proses komunikasi IPv6 dengan diagram',
            'Jelaskan perbedaan header IPv6 yang lebih sederhana',
            'Tunjukkan cara Neighbor Discovery Protocol bekerja',
            'Beri kesempatan siswa bertanya',
          ],
          forStudent: [
            'Perhatikan demonstrasi dari guru',
            'Catat perbedaan utama IPv6 dengan IPv4',
            'Sekarang urutkan proses komunikasi menggunakan IPv6 dengan benar',
            'Diskusikan dengan teman sebangku jika ada yang kurang jelas',
          ],
        },
        question: 'Urutkan proses komunikasi menggunakan IPv6',
        items: [
          { id: '1', text: 'Perangkat mendapat alamat IPv6 (manual/auto)', order: 1 },
          { id: '2', text: 'Neighbor Discovery Protocol mencari perangkat lain', order: 2 },
          { id: '3', text: 'Paket IPv6 dibuat dengan header yang lebih sederhana', order: 3 },
          { id: '4', text: 'Data dikirim melalui routing IPv6', order: 4 },
        ],
      },
      {
        type: 'reflection',
        title: 'Reflection',
        description: 'Refleksi: Renungkan pembelajaran Anda dan tarik kesimpulan',
        reflectionPrompts: [
          'Apa keunggulan utama IPv6 dibandingkan IPv4?',
          'Mengapa IPv6 penting untuk masa depan internet?',
          'Bagaimana IPv6 mengatasi masalah keterbatasan IPv4?',
          'Bagaimana pengetahuan IPv6 akan berguna untuk karir Anda?',
        ],
        question: 'Pilih pernyataan yang paling tepat menggambarkan IPv6 berdasarkan pemahaman Anda',
        options: [
          'IPv6 adalah sistem pengalamatan 128-bit dengan ruang alamat yang sangat besar, keamanan built-in, dan header yang lebih efisien',
          'IPv6 hanya berbeda format penulisan dari IPv4',
          'IPv6 lebih lambat daripada IPv4',
          'IPv6 tidak compatible dengan internet saat ini',
        ],
        correctAnswer: 0,
      },
      {
        type: 'authentic-assessment',
        title: 'Authentic Assessment',
        description: 'Studi Kasus: Aplikasikan pengetahuan Anda dengan menjawab secara detail',
        question: 'Sebuah ISP baru ingin membangun infrastruktur jaringan modern yang bisa bertahan puluhan tahun ke depan. Jelaskan secara detail:\n\n1. Versi IP apa yang sebaiknya digunakan dan mengapa?\n2. Apa keunggulan utama dari versi IP yang Anda pilih?\n3. Bagaimana cara melakukan transisi jika masih ada pengguna IPv4?\n4. Apa tantangan yang mungkin dihadapi dalam implementasi?',
        // No options or correctAnswer for essay-type question
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