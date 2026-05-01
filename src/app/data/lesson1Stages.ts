import type { Stage } from './lessons';

export const lesson1Stages: Stage[] = [
  {
    type: 'constructivism',
    title: 'Constructivism',
    description:
      'Siswa membangun pemahaman awal tentang TCP dari pengalaman digital sehari-hari melalui Story Scramble dan Analogy Sorting.',
    objectiveCode: 'X.TCP.1 & X.TCP.2',
    activityGuide: [
      'Tonton video konteks, lalu susun potongan cerita aktivitas digital sampai alurnya masuk akal.',
      'Tulis definisi TCP dengan kata-katamu sendiri berdasarkan cerita yang kamu susun.',
      'Kelompokkan kartu analogi kurir dan fungsi TCP, lalu tulis fungsi utama TCP dengan bahasamu sendiri.',
    ],
    apersepsi:
      'Pernahkah kamu mengirim file besar ke teman lewat internet, lalu file-nya tiba-tiba rusak atau tidak lengkap saat diterima? Atau saat chat, pesanmu muncul di urutan yang berbeda dari yang kamu kirim? Bayangkan bagaimana internet memastikan semua data yang kamu kirim tiba dengan utuh dan berurutan...',
    storyScramble: {
      instruction:
        'Raka sedang browsing referensi, mengirim chat ke temannya, lalu mengirim file presentasi kelompok. Susun 6 potongan cerita berikut menjadi urutan yang logis agar kamu bisa menyimpulkan sendiri peran TCP.',
      fragments: [
        {
          id: 'f1',
          text: 'Raka membuka browser untuk mencari referensi, lalu menyiapkan file presentasi kelompok di laptopnya.',
          order: 1,
        },
        {
          id: 'f2',
          text: 'Setelah itu Raka mengirim chat kepada Dina bahwa ia akan mengirim file presentasi final lewat internet.',
          order: 2,
        },
        {
          id: 'f3',
          text: 'Saat tombol kirim ditekan, data chat dan file tidak dikirim sekaligus, tetapi dipecah menjadi segmen-segmen kecil.',
          order: 3,
        },
        {
          id: 'f4',
          text: 'Setiap segmen diberi nomor urut dan informasi tujuan agar bisa dikenali selama perjalanan di jaringan.',
          order: 4,
        },
        {
          id: 'f5',
          text: 'Segmen-segmen melintas melalui jaringan; ada yang tiba lebih dahulu, ada yang terlambat, dan yang rusak atau hilang harus diminta ulang.',
          order: 5,
        },
        {
          id: 'f6',
          text: 'Di sisi penerima, segmen disusun kembali sesuai urutannya sehingga chat terbaca utuh dan file presentasi bisa dibuka dengan benar.',
          order: 6,
        },
      ],
      successMessage:
        'Urutanmu sudah logis! Kamu berhasil membangun pemahaman awal tentang bagaimana data digital dikirim.',
    },
    constructivismEssay1:
      'Berdasarkan alur cerita yang baru saja kamu susun, apa itu TCP menurut pemahamanmu? Tuliskan definisimu dengan kata-katamu sendiri!',
    analogySortGroups: [
      { id: 'tcp', label: 'Proses Kerja TCP', colorClass: 'blue' },
    ],
    analogySortItems: [
      { 
        id: 'ap1', 
        text: 'TCP memecah data menjadi segmen-segmen kecil sebelum pengiriman.', 
        courierAnalogy: 'Kurir memecah barang kiriman yang besar menjadi beberapa paket kecil agar mudah dibawa.',
        correctGroup: 'tcp', 
        correctOrder: 1 
      },
      { 
        id: 'ap2', 
        text: 'Setiap segmen diberi nomor urut (sequence number) agar dapat disusun kembali.', 
        courierAnalogy: 'Setiap paket diberi nomor urut (1, 2, 3...) pada labelnya agar tidak tertukar urutannya.',
        correctGroup: 'tcp', 
        correctOrder: 2 
      },
      { 
        id: 'ap3', 
        text: 'Segmen-segmen dikirim melalui jaringan menuju komputer tujuan.', 
        courierAnalogy: 'Paket-paket dibawa oleh kurir melewati rute jalan raya menuju alamat penerima.',
        correctGroup: 'tcp', 
        correctOrder: 3 
      },
      { 
        id: 'ap4', 
        text: 'Penerima memverifikasi integritas setiap segmen menggunakan checksum.', 
        courierAnalogy: 'Penerima memeriksa kondisi fisik paket; jika ada yang sobek atau terbuka, paket dianggap rusak.',
        correctGroup: 'tcp', 
        correctOrder: 4 
      },
      { 
        id: 'ap5', 
        text: 'Segmen yang rusak atau datang tidak berurutan disusun ulang sesuai sequence number.', 
        courierAnalogy: 'Penerima menunggu semua paket tiba, lalu menyusunnya kembali sesuai nomor urut di label.',
        correctGroup: 'tcp', 
        correctOrder: 5 
      },
      { 
        id: 'ap6', 
        text: 'TCP mengirim acknowledgment (ACK) ke pengirim sebagai tanda data diterima dengan utuh.', 
        courierAnalogy: 'Kurir atau penerima memberikan laporan konfirmasi (tanda tangan) bahwa barang telah sampai dengan aman.',
        correctGroup: 'tcp', 
        correctOrder: 6 
      },
    ],
    constructivismEssay2:
      'Berdasarkan urutan proses yang baru saja kamu susun, jelaskan bagaimana TCP memastikan data tiba dengan utuh dan berurutan! Tuliskan dengan kata-katamu sendiri.',
  },
  {
    type: 'inquiry',
    title: 'Inquiry',
    description:
      'Siswa mengeksplorasi hierarki 5 lapisan TCP/IP dan memahami fungsi spesifik setiap lapisan secara bertahap.',
    objectiveCode: 'X.TCP.3 & X.TCP.4',
    activityGuide: [
      'Pelajari setiap lapisan TCP/IP melalui panel eksplorasi interaktif.',
      'Susun urutan 5 lapisan TCP/IP dengan benar pada aktivitas Layer Sorting.',
      'Pasangkan setiap lapisan dengan fungsi teknisnya yang paling tepat.',
      'Tuliskan refleksimu untuk memperkuat pemahaman konsep.',
    ],
    logicalThinkingIndicators: [
      'Keruntutan Berpikir: menata hierarki 5 lapisan TCP/IP secara logis.',
      'Analisis Fungsi: menghubungkan peran teknis dengan lapisan yang sesuai.',
      'Refleksi Konsep: menjelaskan kembali struktur dan fungsi dengan bahasa sendiri.',
    ],
    facilitatorNotes: [
      'Guru memastikan siswa memahami perbedaan antara lapisan atas (software-oriented) dan lapisan bawah (hardware-oriented).',
      'Guru mendorong siswa untuk meninjau kembali materi eksplorasi jika mengalami kesulitan pada tahap matching.',
    ],
    atpAbcd: {
      audience: 'Peserta didik kelas X.',
      behavior:
        'Mengurutkan 5 lapisan TCP/IP dan memasangkan fungsi yang tepat pada setiap lapisan.',
      condition:
        'Diberi visual clickable layer stack, Interactive Layer Sorter, dan Matching Connector berbasis web.',
      degree:
        'Mampu menyusun urutan layer secara tepat dan menjelaskan fungsi setiap layer melalui refleksi tertulis.',
    },
    explorationSections: [
      {
        id: 'e1',
        title: 'Application Layer (Lapisan 5)',
        content:
          'Lapisan paling atas yang berinteraksi langsung dengan pengguna. Di sinilah protokol seperti HTTP (web), SMTP (email), dan FTP (file) bekerja untuk menghasilkan data yang akan dikirim.',
        example:
          'Saat kamu mengetik pesan di WhatsApp atau membuka website di Chrome, kamu sedang berada di Application Layer.',
      },
      {
        id: 'e2',
        title: 'Transport Layer (Lapisan 4)',
        content:
          'Bertanggung jawab untuk komunikasi end-to-end. Di sini data dipecah menjadi potongan kecil (segmen) dan diberikan nomor urut agar bisa disusun kembali dengan benar di tujuan.',
        example:
          'TCP bekerja di sini untuk memastikan semua potongan data sampai tanpa ada yang hilang atau rusak.',
      },
      {
        id: 'e3',
        title: 'Internet Layer / Network Layer (Lapisan 3)',
        content:
          'Menentukan jalur terbaik (routing) untuk mengirimkan paket data melalui jaringan. Lapisan ini menambahkan alamat IP sumber dan tujuan pada setiap paket.',
        example:
          'Seperti kantor pos yang menentukan rute tercepat berdasarkan alamat yang tertulis di amplop surat.',
      },
      {
        id: 'e4',
        title: 'Data Link Layer (Lapisan 2)',
        content:
          'Mengatur bagaimana data dikirimkan melalui media fisik (kabel atau wireless). Di sini paket dibungkus menjadi "Frame" dan ditambahkan alamat fisik (MAC Address).',
        example:
          'Memastikan data terkirim dengan aman dari satu perangkat ke perangkat berikutnya dalam satu jaringan lokal.',
      },
      {
        id: 'e5',
        title: 'Physical Layer (Lapisan 1)',
        content:
          'Lapisan terbawah yang menangani pengiriman bit (0 dan 1) dalam bentuk sinyal listrik, cahaya, atau gelombang radio melalui media transmisi.',
        example:
          'Kabel LAN (UTP), serat optik, atau sinyal Wi-Fi adalah bagian dari Physical Layer.',
      },
    ],
    flowInstruction:
      'Susun "The Layer Sorting": Urutkan 5 lapisan TCP/IP mulai dari yang paling atas (dekat dengan pengguna) ke yang paling bawah (fisik).',
    flowItems: [
      {
        id: 'fl1',
        text: 'Application Layer',
        correctOrder: 1,
        description: 'Menghasilkan data dari aplikasi pengguna.',
        colorClass: 'purple',
      },
      {
        id: 'fl2',
        text: 'Transport Layer',
        correctOrder: 2,
        description: 'Memecah data dan menjamin keandalan pengiriman.',
        colorClass: 'blue',
      },
      {
        id: 'fl3',
        text: 'Internet Layer',
        correctOrder: 3,
        description: 'Menentukan rute dan pengalamatan IP.',
        colorClass: 'green',
      },
      {
        id: 'fl4',
        text: 'Data Link Layer',
        correctOrder: 4,
        description: 'Membungkus data menjadi frame dengan MAC Address.',
        colorClass: 'amber',
      },
      {
        id: 'fl5',
        text: 'Physical Layer',
        correctOrder: 5,
        description: 'Mengirimkan bit melalui media fisik (kabel/sinyal).',
        colorClass: 'pink',
      },
    ],
    inquiryReflection1:
      'Jelaskan pemahamanmu tentang urutan 5 lapisan TCP/IP tersebut. Mengapa data harus melewati urutan tersebut dari atas ke bawah saat dikirim?',
    matchingPairs: [
      { left: 'Application Layer', right: 'Antarmuka pengguna dan pembuatan data awal.' },
      { left: 'Transport Layer', right: 'Segmentasi data dan kontrol kesalahan (TCP).' },
      { left: 'Internet Layer', right: 'Pengalamatan logis (IP) dan penentuan rute paket.' },
      { left: 'Data Link Layer', right: 'Kontrol akses media dan pengalamatan fisik (MAC).' },
      { left: 'Physical Layer', right: 'Transmisi bit data melalui media fisik jaringan.' },
    ],
    inquiryReflection2:
      'Sekarang, jelaskan fungsi tiap layer dengan bahasamu sendiri! Bagaimana setiap layer bekerja sama untuk memastikan data sampai ke tujuan?',
  },
  {
    type: 'questioning',
    title: 'Questioning',
    description:
      'Siswa mengeksplorasi rasa ingin tahu, memilih solusi teknis, dan membangun argumen logis berdasarkan field TCP Header yang relevan.',
    objectiveCode: 'X.TCP.5',
    activityGuide: [
      'Amati skenario kerusakan paket dan aktifkan pertanyaanmu lewat bank pertanyaan.',
      'Pilih solusi teknis yang paling sesuai dengan field TCP Header yang relevan.',
      'Jelaskan alasan logismu sebelum mengirim jawaban.',
    ],
    logicalThinkingIndicators: [
      'Kemampuan Berargumen: memilih alasan teknis yang tepat dan menjelaskannya secara logis.',
      'Penarikan Kesimpulan: menyimpulkan field TCP Header yang paling relevan dari bukti kasus.',
    ],
    facilitatorNotes: [
      'Guru memancing pertanyaan siswa tentang mengapa segmen bisa rusak dan bagaimana TCP merespons.',
      'Guru menekankan hubungan antara bukti kasus, field header, dan keputusan teknis siswa.',
    ],
    atpAbcd: {
      audience: 'Peserta didik kelas X.',
      behavior:
        'Menganalisis masalah paket data dan memilih solusi teknis berdasarkan field TCP Header yang relevan.',
      condition:
        'Diberi ilustrasi kasus data corruption, bank pertanyaan, hint, dan opsi alasan pada media interaktif.',
      degree:
        'Mampu memilih solusi yang tepat dan menyampaikan alasan logis secara tertulis.',
    },
    problemVisual: {
      icon: '!',
      title: 'Data corruption pada file audio',
      description:
        'Server streaming menerima file audio yang terdengar rusak setelah dikirim melalui jaringan. Beberapa bit data berubah di tengah perjalanan.',
      problemType: 'corruption',
    },
    teacherQuestion:
      'Jika gejalanya adalah data berubah atau rusak, field TCP Header mana yang paling masuk akal diperiksa lebih dulu? Jelaskan alasanmu.',
    scenario:
      'Sebuah file audio dikirim dalam banyak segmen TCP. Setelah sampai di server, sebagian segmen membuat audio terdistorsi. Tim teknis menemukan bahwa beberapa bit berubah selama transmisi sehingga file tidak bisa direkonstruksi dengan benar.',
    whyQuestion:
      'Field TCP Header mana yang pertama kali paling relevan untuk mendeteksi data corruption dan memicu proses pengiriman ulang?',
    hint:
      'Cari field yang dihitung dari isi segmen dan akan berubah bila satu bit saja ikut berubah.',
    reasonOptions: [
      {
        id: 'r1',
        text: 'Sequence Number, karena urutan segmen berubah saat data rusak.',
        isCorrect: false,
        feedback:
          'Sequence Number berguna untuk mengurutkan segmen, tetapi tidak memeriksa apakah isi segmen mengalami kerusakan.',
      },
      {
        id: 'r2',
        text: 'Checksum, karena nilainya dihitung dari data dan header sehingga bisa mendeteksi perubahan bit.',
        isCorrect: true,
        feedback:
          'Tepat. Checksum dipakai untuk memverifikasi integritas segmen. Bila hasil perhitungan penerima tidak cocok, segmen dianggap rusak dan perlu dikirim ulang.',
      },
      {
        id: 'r3',
        text: 'Destination Port, karena port tujuan menentukan aplikasi yang menerima segmen.',
        isCorrect: false,
        feedback:
          'Destination Port hanya menunjukkan aplikasi tujuan. Port tidak memeriksa apakah isi data berubah atau rusak.',
      },
      {
        id: 'r4',
        text: 'Window Size, karena kerusakan data terjadi saat buffer penerima terlalu penuh.',
        isCorrect: false,
        feedback:
          'Window Size berkaitan dengan flow control, bukan deteksi data corruption pada isi segmen.',
      },
    ],
    questionBank: [
      {
        id: 'q1',
        text: 'Apa fungsi checksum pada TCP?',
        response:
          'Checksum membantu penerima memverifikasi apakah isi segmen yang datang masih utuh atau sudah berubah selama transmisi.',
      },
      {
        id: 'q2',
        text: 'Mengapa segmen rusak bisa memicu retransmission?',
        response:
          'Segmen yang gagal diverifikasi tidak dianggap berhasil diterima. Akibatnya pengirim tidak mendapat konfirmasi yang valid dan akan mengirim ulang segmen tersebut.',
      },
      {
        id: 'q3',
        text: 'Mengapa sequence number belum cukup untuk kasus ini?',
        response:
          'Sequence Number hanya memberi tahu posisi segmen. Kerusakan isi data tetap harus dicek dengan mekanisme integritas seperti checksum.',
      },
    ],
  },
  {
    type: 'learning-community',
    title: 'Learning Community',
    description:
      'Siswa memvalidasi pemikiran melalui voting, komentar, dan perbandingan analisis decapsulation bersama komunitas belajar.',
    objectiveCode: 'X.TCP.6 & X.TCP.7',
    activityGuide: [
      'Simak visualisasi interaktif TCP/IP U-Shape untuk memahami alur encapsulation dan decapsulation secara menyeluruh.',
      'Pada X.TCP.6, susun urutan proses encapsulation (dari Application ke Network Access) berdasarkan skenario pengiriman email.',
      'Bandingkan jawabanmu dengan analisis teman kelompok pada Group Answer Panel.',
      'Pada X.TCP.7, susun urutan decapsulation (dari Network Access ke Application) dan validasi logika analisis teman.',
    ],
    logicalThinkingIndicators: [
      'Kemampuan Berargumen: memberi penguatan atau koreksi terhadap jawaban teman.',
      'Keruntutan Berpikir: memeriksa urutan decapsulation secara tepat.',
      'Penarikan Kesimpulan: membedakan analisis yang logis dan yang keliru.',
    ],
    facilitatorNotes: [
      'Guru memfasilitasi diskusi singkat tentang mengapa satu solusi lebih tepat untuk skenario multi-perangkat.',
      'Guru meminta siswa membuktikan urutan decapsulation dengan dasar layer yang menambah dan melepas header.',
    ],
    atpAbcd: {
      audience: 'Peserta didik kelas X.',
      behavior:
        'Memilih metode komunikasi terbaik dan membandingkan urutan decapsulation secara logis.',
      condition:
        'Diberi skenario peer voting, komentar komunitas, dan aktivitas perbandingan kasus pada media interaktif.',
      degree:
        'Mampu memberi pilihan yang beralasan serta memvalidasi jawaban teman secara tepat.',
    },
    peerVotingScenario: {
      context:
        'Laboratorium komputer sekolah menggunakan banyak perangkat secara bersamaan saat simulasi ujian. Saat trafik tinggi, collision sering muncul karena sebagian perangkat masih berbagi medium lama yang sama.',
      question:
        'Metode komunikasi jaringan mana yang paling efektif untuk mengurangi collision pada skenario laboratorium tersebut?',
      methods: [
        {
          id: 'm1',
          title: 'CSMA/CD standar',
          description:
            'Perangkat mendengarkan media sebelum mengirim, lalu berhenti dan mencoba lagi bila collision terjadi.',
          votes: 7,
          pros: 'Mudah dipahami dan sudah dikenal pada Ethernet lama.',
          cons: 'Collision tetap mungkin terjadi dan performa turun saat banyak perangkat aktif.',
        },
        {
          id: 'm2',
          title: 'Token Ring',
          description:
            'Perangkat harus menunggu token sebelum mengirim sehingga giliran pengiriman menjadi teratur.',
          votes: 4,
          pros: 'Collision dapat dihindari karena hanya pemegang token yang boleh mengirim.',
          cons: 'Kurang relevan untuk infrastruktur modern dan lebih lambat untuk implementasi saat ini.',
        },
        {
          id: 'm3',
          title: 'Full-duplex dengan managed switch',
          description:
            'Setiap port switch menjadi collision domain tersendiri dan perangkat dapat kirim-terima data secara bersamaan.',
          votes: 19,
          pros: 'Menghilangkan collision per port dan memberi bandwidth lebih stabil untuk banyak pengguna.',
          cons: 'Membutuhkan perangkat switch yang baik dan konfigurasi yang benar.',
        },
      ],
      correctMethodId: 'm3',
    },
    peerComments: [
      {
        name: 'Dika R.',
        avatar: 'DR',
        comment:
          'Saya memilih full-duplex dengan managed switch karena collision domain dipisahkan per port, jadi tabrakan data tidak lagi terjadi seperti pada media bersama.',
        votedFor: 'm3',
      },
      {
        name: 'Sari N.',
        avatar: 'SN',
        comment:
          'CSMA/CD memang ada di Ethernet, tetapi saat banyak perangkat aktif bersamaan performanya cepat turun.',
        votedFor: 'm1',
      },
      {
        name: 'Budi P.',
        avatar: 'BP',
        comment:
          'Token Ring menarik secara teori, tetapi untuk laboratorium modern managed switch jauh lebih realistis.',
        votedFor: 'm3',
      },
      {
        name: 'Ayu M.',
        avatar: 'AM',
        comment:
          'Managed switch juga membantu prioritas trafik jika nanti laboratorium perlu membedakan layanan penting dan tidak penting.',
        votedFor: 'm3',
      },
    ],
    caseComparisonData: {
      title: 'Perbandingan urutan decapsulation TCP/IP',
      process: [
        {
          id: 'dc1',
          step: 'Network Access Layer menerima sinyal dan mengubahnya menjadi frame digital.',
          correctOrder: 1,
        },
        {
          id: 'dc2',
          step: 'Frame Header diperiksa lalu dilepas agar data bisa naik ke Internet Layer.',
          correctOrder: 2,
        },
        {
          id: 'dc3',
          step: 'Internet Layer memeriksa alamat IP tujuan lalu melepas IP Header.',
          correctOrder: 3,
        },
        {
          id: 'dc4',
          step: 'Transport Layer memverifikasi checksum, menyusun segmen, lalu melepas TCP Header.',
          correctOrder: 4,
        },
        {
          id: 'dc5',
          step: 'Application Layer menerima kembali data utuh yang siap dipakai aplikasi.',
          correctOrder: 5,
        },
      ],
      peerAnalyses: [
        {
          name: 'Reza A.',
          analysis:
            'Decapsulation dimulai dari layer paling bawah karena frame datang sebagai sinyal fisik lebih dulu, lalu setiap header dilepas satu per satu sampai data sampai ke aplikasi.',
          isCorrect: true,
        },
        {
          name: 'Maya L.',
          analysis:
            'TCP Header harus dilepas lebih dulu karena Transport Layer lebih penting daripada Internet Layer.',
          isCorrect: false,
        },
        {
          name: 'Fajar K.',
          analysis:
            'Urutan decapsulation adalah kebalikan encapsulation. Layer yang terakhir menambah pembungkus akan menjadi yang pertama melepasnya.',
          isCorrect: true,
        },
      ],
    },
    encapsulationCaseData: {
      title: 'Studi Kasus Encapsulation — Proses Pengiriman Data (X.TCP.6)',
      process: [
        {
          id: 'en1',
          step: 'Application Layer: Alya menekan "Kirim" di aplikasi email. Data pesan dan lampiran file disiapkan oleh aplikasi.',
          correctOrder: 1,
        },
        {
          id: 'en2',
          step: 'Transport Layer: Data dipecah menjadi segmen-segmen kecil. TCP Header (Source Port, Sequence Number, Checksum) ditambahkan ke setiap segmen.',
          correctOrder: 2,
        },
        {
          id: 'en3',
          step: 'Internet Layer: Setiap segmen diberi IP Header berisi alamat IP sumber (laptop Alya) dan tujuan (server email teman).',
          correctOrder: 3,
        },
        {
          id: 'en4',
          step: 'Network Access Layer: Paket IP dibungkus menjadi Frame dengan MAC Address dan FCS, lalu diubah menjadi sinyal listrik untuk dikirim melalui kabel.',
          correctOrder: 4,
        },
      ],
      groupAnswers: [
        {
          name: 'Dika R.',
          isCorrect: true,
          analysis:
            'Encapsulation bergerak dari atas (aplikasi) ke bawah (fisik). Application menghasilkan data, lalu Transport memecahnya dan menambah header TCP, Internet menambah IP, terakhir Network Access membungkus jadi frame.',
        },
        {
          name: 'Sari N.',
          isCorrect: false,
          analysis:
            'Menurut saya Internet Layer harus berjalan lebih dulu agar alamat IP tersedia, baru kemudian Transport Layer bisa mengirim segmen.',
        },
        {
          name: 'Budi P.',
          isCorrect: true,
          analysis:
            'Alur encapsulation dari Application → Transport → Internet → Network Access. Setiap lapisan menambahkan headernya masing-masing sebelum diteruskan ke bawah.',
        },
        {
          name: 'Ayu M.',
          isCorrect: false,
          analysis:
            'Saya meletakkan Network Access di urutan kedua karena koneksi fisik harus siap sebelum data bisa dipecah-pecah oleh TCP.',
        },
      ],
    },
    matchingPairs: [
      { left: 'TCP Header dilepas di', right: 'Transport Layer' },
      { left: 'IP Header dilepas di', right: 'Internet Layer' },
      { left: 'Frame Header dilepas di', right: 'Network Access Layer' },
    ],
    caseScenario: {
      title: 'Urutan decapsulation',
      description: 'Analisis proses decapsulation TCP/IP.',
      question: 'Urutkan proses decapsulation yang benar.',
      options: [
        {
          id: 'o1',
          text: 'Network Access -> Internet -> Transport -> Application',
          isCorrect: true,
          feedback: 'Tepat. Decapsulation bergerak dari bawah ke atas.',
        },
        {
          id: 'o2',
          text: 'Application -> Transport -> Internet -> Network Access',
          isCorrect: false,
          feedback: 'Itu adalah arah encapsulation, bukan decapsulation.',
        },
      ],
    },
    peerAnswers: [
      {
        name: 'Reza A.',
        role: 'Siswa',
        answer:
          'Decapsulation dimulai dari Network Access ke Application karena setiap header dilepas sesuai urutan pembungkusannya.',
        score: 95,
      },
      {
        name: 'Fajar K.',
        role: 'Siswa',
        answer:
          'Urutannya adalah Network Access, Internet, Transport, lalu Application.',
        score: 90,
      },
      {
        name: 'Maya L.',
        role: 'Siswa',
        answer:
          'TCP Header saya letakkan lebih dulu karena menurut saya transport lebih penting dari IP.',
        score: 40,
      },
    ],
  },
  {
    type: 'modeling',
    title: 'Modeling',
    description:
      'Siswa mengikuti simulasi langkah demi langkah proses encapsulation, transmission, dan decapsulation untuk memahami cara kerja TCP secara utuh.',
    objectiveCode: 'X.TCP.8',
    activityGuide: [
      'Ikuti urutan simulasi dari Application Layer sampai data diterima kembali.',
      'Selesaikan aksi praktik pada setiap langkah yang meminta interaksi.',
      'Gunakan model ini sebagai contoh sistematis sebelum menarik kesimpulan akhir.',
    ],
    logicalThinkingIndicators: [
      'Keruntutan Berpikir: mengikuti alur kerja TCP secara sistematis dari awal hingga akhir.',
    ],
    facilitatorNotes: [
      'Guru menegaskan istilah encapsulation, transmission, dan decapsulation saat siswa berpindah langkah.',
      'Guru dapat menghentikan simulasi sejenak untuk meminta siswa memprediksi langkah berikutnya.',
    ],
    atpAbcd: {
      audience: 'Peserta didik kelas X.',
      behavior:
        'Menelusuri dan mempraktikkan langkah kerja TCP/IP dari pembuatan data sampai data diterima kembali.',
      condition:
        'Diberi Interactive Walkthrough dengan contoh, simulasi, dan aksi praktik mandiri pada media interaktif.',
      degree:
        'Mampu menyelesaikan seluruh rangkaian langkah dengan urutan yang benar.',
    },
    modelingSteps: [
      {
        id: 'mw1',
        type: 'example',
        title: 'Step 1 - Application Layer membuat data',
        content:
          'Alya menulis pesan dan menyiapkan lampiran tugas pada aplikasi email. Pada tahap ini data masih berupa isi pesan dan file asli tanpa header jaringan.',
        interactiveAction:
          'Teruskan data dari aplikasi ke Transport Layer untuk memulai proses pengiriman.',
      },
      {
        id: 'mw2',
        type: 'example',
        title: 'Step 2 - Transport Layer menambah TCP Header',
        content:
          'TCP memecah data menjadi segmen dan menambahkan informasi seperti Source Port, Destination Port, Sequence Number, dan Checksum.',
        interactiveAction:
          'Bungkus data dengan TCP Header agar segmen siap diteruskan ke layer berikutnya.',
      },
      {
        id: 'mw3',
        type: 'example',
        title: 'Step 3 - Internet Layer menambah IP Header',
        content:
          'Internet Layer menambahkan alamat IP sumber dan tujuan agar paket dapat diarahkan menuju perangkat yang benar.',
        interactiveAction:
          'Tambahkan alamat IP sumber dan tujuan pada paket sebelum dikirim ke jaringan.',
      },
      {
        id: 'mw4',
        type: 'example',
        title: 'Step 4 - Network Access Layer mengirim frame',
        content:
          'Paket dibungkus menjadi frame dan diubah menjadi sinyal agar dapat melintas melalui media jaringan.',
        interactiveAction:
          'Kirim frame ke media jaringan dan bayangkan paket melintasi router menuju tujuan.',
      },
      {
        id: 'mw5',
        type: 'practice',
        title: 'Step 5 - Network Access menerima frame',
        content:
          'Di sisi penerima, sinyal diubah kembali menjadi frame digital lalu Frame Header diperiksa.',
        interactiveAction:
          'Lepaskan Frame Header agar data bisa naik ke Internet Layer.',
      },
      {
        id: 'mw6',
        type: 'practice',
        title: 'Step 6 - Internet Layer melepas IP Header',
        content:
          'Internet Layer memeriksa alamat tujuan. Setelah cocok, IP Header dilepas agar segmen diteruskan ke TCP.',
        interactiveAction:
          'Verifikasi alamat IP dan lepaskan IP Header untuk melanjutkan proses decapsulation.',
      },
      {
        id: 'mw7',
        type: 'practice',
        title: 'Step 7 - TCP memverifikasi dan menyusun segmen',
        content:
          'TCP memeriksa checksum, mengurutkan segmen berdasarkan sequence number, lalu menyiapkan acknowledgment.',
        interactiveAction:
          'Periksa checksum, susun segmen, dan kirim acknowledgment ke pengirim.',
      },
      {
        id: 'mw8',
        type: 'practice',
        title: 'Step 8 - Application menerima data utuh',
        content:
          'Setelah semua header dilepas, aplikasi penerima mendapatkan kembali pesan dan file yang sama seperti saat dikirim.',
        interactiveAction:
          'Buka kembali pesan dan lampiran di aplikasi untuk menutup seluruh alur TCP.',
      },
    ],
  },
  {
    type: 'reflection',
    title: 'Reflection',
    description:
      'Siswa menyusun peta konsep dan refleksi tertulis untuk merangkum hubungan antar konsep TCP dari encapsulation hingga decapsulation.',
    objectiveCode: 'X.TCP.9',
    activityGuide: [
      'Lengkapi peta konsep terlebih dahulu agar hubungan antar ide utama terlihat jelas.',
      'Ringkas kembali pemahamanmu dengan kalimat sendiri.',
      'Nilai perkembangan dirimu pada seluruh capaian pembelajaran pertemuan ini.',
    ],
    logicalThinkingIndicators: [
      'Penarikan Kesimpulan: menghubungkan konsep inti menjadi gambaran utuh tentang cara kerja TCP.',
    ],
    facilitatorNotes: [
      'Guru mendorong siswa membandingkan hasil refleksi dengan pemahaman awal pada tahap Constructivism.',
      'Guru dapat memakai hasil refleksi untuk menentukan bagian mana yang perlu diperkuat pada pertemuan berikutnya.',
    ],
    atpAbcd: {
      audience: 'Peserta didik kelas X.',
      behavior:
        'Menyusun peta konsep dan menuliskan kesimpulan visual tentang hubungan konsep TCP utama.',
      condition:
        'Diberi Concept Map Builder, jurnal refleksi, dan lembar penilaian diri pada media interaktif.',
      degree:
        'Mampu menghubungkan konsep dengan tepat dan menuliskan refleksi yang menunjukkan pemahaman menyeluruh.',
    },
    conceptMapNodes: [
      {
        id: 'cn1',
        label: 'TCP',
        description: 'Protokol andal pada Transport Layer.',
        colorClass: 'blue',
      },
      {
        id: 'cn2',
        label: 'Encapsulation',
        description: 'Proses penambahan header saat data turun ke jaringan.',
        colorClass: 'green',
      },
      {
        id: 'cn3',
        label: 'TCP Header',
        description: 'Informasi kontrol yang menyertai setiap segmen TCP.',
        colorClass: 'purple',
      },
      {
        id: 'cn4',
        label: 'Sequence Number',
        description: 'Field yang membantu menjaga urutan segmen.',
        colorClass: 'amber',
      },
      {
        id: 'cn5',
        label: 'Checksum',
        description: 'Field yang memverifikasi integritas segmen.',
        colorClass: 'amber',
      },
      {
        id: 'cn6',
        label: 'Decapsulation',
        description: 'Proses pelepasan header di sisi penerima.',
        colorClass: 'green',
      },
      {
        id: 'cn7',
        label: 'Acknowledgment',
        description: 'Konfirmasi bahwa segmen berhasil diterima.',
        colorClass: 'pink',
      },
      {
        id: 'cn8',
        label: 'Transport Layer',
        description: 'Layer tempat TCP bekerja.',
        colorClass: 'indigo',
      },
    ],
    conceptMapConnections: [
      { from: 'cn1', to: 'cn8', label: 'bekerja di', options: ['bekerja di', 'menghapus', 'mengabaikan', 'bertentangan dengan'] },
      { from: 'cn1', to: 'cn2', label: 'melakukan', options: ['melakukan', 'menghindari', 'mengganti', 'menolak'] },
      { from: 'cn2', to: 'cn3', label: 'menambahkan', options: ['menambahkan', 'menghapus', 'melewatkan', 'menyamakan'] },
      { from: 'cn3', to: 'cn4', label: 'memuat', options: ['memuat', 'meniadakan', 'mengabaikan', 'mengganti'] },
      { from: 'cn3', to: 'cn5', label: 'memuat', options: ['memuat', 'menolak', 'menghapus', 'melewatkan'] },
      { from: 'cn2', to: 'cn6', label: 'berkebalikan dengan', options: ['berkebalikan dengan', 'sama dengan', 'lebih tinggi dari', 'tidak terkait dengan'] },
      { from: 'cn5', to: 'cn7', label: 'mendukung', options: ['mendukung', 'menghambat', 'menggantikan', 'menghilangkan'] },
    ],
    essayReflection: {
      materialSummaryPrompt:
        'Jelaskan dengan bahasamu sendiri apa itu TCP dan bagaimana encapsulation serta decapsulation saling berhubungan.',
      easyPartPrompt:
        'Bagian konsep TCP mana yang paling mudah kamu pahami hari ini? Jelaskan alasannya.',
      hardPartPrompt:
        'Bagian mana yang masih membingungkan atau perlu kamu pelajari lagi?',
    },
    selfEvaluationCriteria: [
      { id: 'sc1', label: 'Saya mampu mendefinisikan TCP dalam jaringan komputer.' },
      { id: 'sc2', label: 'Saya mampu menentukan fungsi utama TCP melalui analogi.' },
      { id: 'sc3', label: 'Saya mampu mengurutkan lapisan TCP/IP dalam proses encapsulation.' },
      { id: 'sc4', label: 'Saya mampu mengidentifikasi fungsi Source Port, Destination Port, Sequence Number, dan Checksum.' },
      { id: 'sc5', label: 'Saya mampu menganalisis masalah paket data dengan memilih field TCP Header yang relevan.' },
      { id: 'sc6', label: 'Saya mampu memberi argumentasi pada skenario peer voting.' },
      { id: 'sc7', label: 'Saya mampu memvalidasi urutan decapsulation dan logika jawaban teman.' },
      { id: 'sc8', label: 'Saya mampu mengikuti alur encapsulation sampai decapsulation secara lengkap.' },
      { id: 'sc9', label: 'Saya mampu menyusun hubungan antar konsep TCP menjadi satu peta konsep.' },
      { id: 'sc10', label: 'Saya mampu mengambil keputusan teknis pada studi kasus TCP secara autentik.' },
    ],
  },
  {
    type: 'authentic-assessment',
    title: 'Authentic Assessment',
    description:
      'Siswa menyelesaikan studi kasus bercabang yang menilai analisis, argumentasi, dan penarikan kesimpulan pada beberapa masalah pengiriman paket TCP.',
    objectiveCode: 'X.TCP.10',
    activityGuide: [
      'Baca konteks, bukti masalah, dan fokus gangguan sebelum mengambil keputusan awal.',
      'Pilih jalur diagnosis yang paling logis lalu jelaskan alasan setiap pilihanmu.',
      'Ikuti cabang kasus sampai akhir dan simpulkan langkah prioritas perbaikannya.',
    ],
    logicalThinkingIndicators: [
      'Keruntutan Berpikir: menentukan urutan diagnosis yang paling masuk akal.',
      'Kemampuan Berargumen: memberi alasan teknis pada tiap keputusan bercabang.',
      'Penarikan Kesimpulan: memilih prioritas tindakan berdasarkan bukti kasus.',
    ],
    facilitatorNotes: [
      'Guru memosisikan diri sebagai fasilitator yang menanyakan alasan prioritas tindakan siswa.',
      'Guru menggunakan hasil jalur keputusan untuk melihat apakah siswa mampu membedakan collision, packet loss, dan data corruption.',
    ],
    atpAbcd: {
      audience: 'Peserta didik kelas X.',
      behavior:
        'Mendiagnosis masalah pengiriman paket TCP dan menentukan prioritas solusi berdasarkan bukti kasus.',
      condition:
        'Diberi Branching Troubleshooter dengan kondisi collision, packet loss, dan data corruption serta konsekuensi pada setiap keputusan.',
      degree:
        'Mampu memilih jalur diagnosis yang logis, menjelaskan alasan, dan menyimpulkan prioritas solusi secara tepat.',
    },
    branchingScenario: {
      context:
        'Kamu menjadi teknisi jaringan pada studio pembelajaran daring sekolah. Menjelang siaran kelas live, sistem monitoring menunjukkan tiga gejala sekaligus: collision burst pada segmen lama yang masih memakai hub, packet loss tinggi pada uplink internet, dan data corruption pada beberapa segmen yang melewati patch cord yang mulai rusak.',
      initialQuestion:
        'Langkah awal mana yang paling profesional untuk memulai diagnosis masalah pengiriman paket TCP ini?',
      focusAreas: ['Collision', 'Packet Loss', 'Data Corruption'],
      choices: [
        {
          id: 'c1',
          text:
            'Analisis log TCP dan topologi jaringan lebih dulu untuk memetakan pola collision, packet loss, dan checksum error.',
          isOptimal: true,
          consequence:
            'Pilihanmu tepat. Dari log ditemukan collision burst pada segmen yang masih memakai hub, packet loss 28% pada uplink utama, dan checksum error 11% pada jalur yang memakai patch cord rusak.',
          followUpQuestion:
            'Masalah mana yang harus diprioritaskan lebih dulu agar kualitas live class paling cepat stabil untuk semua pengguna?',
          followUpChoices: [
            {
              id: 'f1a',
              text:
                'Packet loss pada uplink internet, karena kehilangan paket tinggi langsung menurunkan kualitas layanan untuk seluruh pengguna.',
              isCorrect: true,
              explanation:
                'Prioritas ini paling logis karena packet loss 28% memukul seluruh aliran data utama. Setelah throughput stabil, collision pada segmen hub dan data corruption karena kabel rusak dapat ditangani bertahap.',
            },
            {
              id: 'f1b',
              text:
                'Collision pada segmen hub, karena collision selalu lebih penting daripada masalah lain.',
              isCorrect: false,
              explanation:
                'Collision memang harus ditangani, tetapi dampak packet loss pada uplink utama lebih luas dan lebih cepat merusak layanan live untuk semua pengguna.',
            },
            {
              id: 'f1c',
              text:
                'Data corruption karena patch cord rusak, karena integritas data harus selalu ditangani pertama kali.',
              isCorrect: false,
              explanation:
                'Data corruption perlu diperbaiki, tetapi pada kasus ini packet loss pada jalur utama lebih mendesak karena memengaruhi lebih banyak trafik secara langsung.',
            },
          ],
        },
        {
          id: 'c2',
          text: 'Restart semua perangkat jaringan dan server streaming agar koneksi TCP dimulai ulang.',
          isOptimal: false,
          consequence:
            'Restart menghabiskan waktu, tetapi akar masalah belum terlihat. Setelah sistem kembali hidup, collision, packet loss, dan checksum error masih tetap muncul.',
          followUpQuestion:
            'Setelah restart gagal, langkah apa yang seharusnya dilakukan untuk mendapatkan bukti teknis yang jelas?',
          followUpChoices: [
            {
              id: 'f2a',
              text:
                'Analisis log TCP dan topologi untuk melihat pola kehilangan ACK, collision, dan checksum error.',
              isCorrect: true,
              explanation:
                'Langkah ini memberi bukti teknis yang dapat dipakai untuk menentukan prioritas penanganan secara objektif.',
            },
            {
              id: 'f2b',
              text:
                'Menunggu beberapa menit sambil berharap masalah hilang sendiri setelah restart.',
              isCorrect: false,
              explanation:
                'Menunggu pasif tidak memberi bukti baru dan tidak membantu membedakan sumber masalah jaringan.',
            },
          ],
        },
        {
          id: 'c3',
          text:
            'Langsung mengganti patch cord yang rusak tanpa memeriksa log karena data corruption terlihat paling berbahaya.',
          isOptimal: false,
          consequence:
            'Mengganti kabel memang berpotensi mengurangi checksum error, tetapi collision burst dan packet loss pada uplink utama tetap belum terpetakan sehingga layanan masih tidak stabil.',
          followUpQuestion:
            'Jika kabel sudah diganti tetapi siaran tetap tersendat, data tambahan apa yang paling perlu diperiksa selanjutnya?',
          followUpChoices: [
            {
              id: 'f3a',
              text:
                'Periksa log TCP dan topologi untuk membedakan collision lokal dari packet loss pada uplink utama.',
              isCorrect: true,
              explanation:
                'Langkah ini membantumu melihat bahwa masalah tidak hanya satu. Packet loss pada uplink utama harus diprioritaskan, lalu collision lokal ditangani dengan mengganti hub menjadi switch.',
            },
            {
              id: 'f3b',
              text:
                'Fokus pada pergantian kabel lain secara acak sampai layanan terasa membaik.',
              isCorrect: false,
              explanation:
                'Pergantian acak tidak sistematis dan tidak menjawab kemungkinan masalah lain seperti collision dan packet loss.',
            },
          ],
        },
      ],
      finalEvaluation:
        'Gunakan bukti untuk menentukan prioritas, jelaskan alasan teknis, lalu simpulkan solusi TCP yang paling berdampak terhadap layanan.',
    },
  },
];
