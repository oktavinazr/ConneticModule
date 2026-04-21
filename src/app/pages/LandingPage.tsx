import { Link } from 'react-router';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Home,
  Info,
  Instagram,
  Linkedin,
  LogIn,
  Mail,
  Network,
  ShieldCheck,
  Target,
  Trophy,
  User,
  Zap,
} from 'lucide-react';
import { MobileSidebar } from '../components/MobileSidebar';
import { useEffect, useState } from 'react';
import profileImg from '../../assets/images/Profil.jpeg';

const desktopContainer = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';

export function LandingPage() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'profile'];
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { label: 'Beranda', href: '#home', id: 'home' },
    { label: 'Tentang', href: '#about', id: 'about' },
    { label: 'Profil', href: '#profile', id: 'profile' },
  ];

  const stages = [
    { name: 'Constructivism', desc: 'Membangun pemahaman dengan menghubungkan pengetahuan baru dengan pengalaman nyata.' },
    { name: 'Inquiry', desc: 'Proses perpindahan dari pengamatan menjadi pemahaman melalui siklus penyelidikan.' },
    { name: 'Questioning', desc: 'Mendorong rasa ingin tahu siswa melalui interaksi tanya jawab yang produktif.' },
    { name: 'Learning Community', desc: 'Menciptakan lingkungan belajar kolaboratif melalui diskusi kelompok.' },
    { name: 'Modeling', desc: 'Pemberian model atau contoh yang dapat ditiru oleh siswa untuk menguasai keterampilan.' },
    { name: 'Reflection', desc: 'Meninjau kembali apa yang telah dipelajari untuk memperkuat struktur kognitif.' },
    { name: 'Authentic Assessment', desc: 'Proses pengumpulan berbagai data yang memberikan gambaran perkembangan belajar.' },
  ];

  const features = [
    {
      icon: <Network className="h-8 w-8" />,
      title: 'Keruntutan Berpikir',
      desc: 'Kemampuan menyusun gagasan secara sistematis, logis, dan berurutan dalam memahami konsep jaringan komputer.',
      color: 'bg-[#10B981]',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Kemampuan Berargumen',
      desc: 'Kemampuan memberikan alasan yang kuat dan relevan untuk mendukung suatu pendapat atau solusi dalam konteks jaringan.',
      color: 'bg-[#628ECB]',
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'Penarikan Kesimpulan',
      desc: 'Kemampuan mengambil kesimpulan yang tepat berdasarkan fakta dan data yang diperoleh selama proses pembelajaran.',
      color: 'bg-[#F59E0B]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F3FA] text-[#395886]">
      <header className="sticky top-0 z-50 w-full border-b border-[#D5DEEF] bg-white/90 shadow-sm backdrop-blur-md transition-all">
        <div className={`${desktopContainer}`}>
          <div className="flex min-h-[76px] items-center justify-between gap-4">
            {/* Logo – selalu di kiri */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB] shadow-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-lg font-bold">CONNETIC Module</p>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
              </div>
            </div>

            {/* Navigasi – tengah, hanya desktop */}
            <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 transition-colors hover:text-[#628ECB] ${
                    activeSection === item.id ? 'text-[#628ECB]' : 'text-[#395886]'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#628ECB] transition-all" />
                  )}
                </a>
              ))}
            </nav>

            {/* Tombol Aksi – selalu di kanan */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden rounded-full bg-[#628ECB] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#395886] hover:shadow-lg active:scale-95 md:block"
              >
                Login
              </Link>
              <MobileSidebar
                title="Menu Utama"
                description="Navigasi cepat ke seluruh bagian halaman."
                items={[
                  { label: 'Beranda', href: '#home', icon: <Home className="h-4 w-4" /> },
                  { label: 'Tentang', href: '#about', icon: <Info className="h-4 w-4" /> },
                  { label: 'Profil', href: '#profile', icon: <User className="h-4 w-4" /> },
                  { label: 'Login', to: '/login', icon: <LogIn className="h-4 w-4" /> },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── BERANDA ─────────────────────────────────────────────────────────── */}
      <section id="home" className="relative flex min-h-[calc(100vh-76px)] scroll-mt-20 items-center overflow-hidden py-16 lg:py-0">
        {/* Blob dekoratif */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_40%,_rgba(98,142,203,0.14),_transparent),radial-gradient(ellipse_50%_50%_at_100%_80%,_rgba(16,185,129,0.10),_transparent)]" />
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-[#628ECB]/8 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#10B981]/6 blur-3xl" />

        <div className={`${desktopContainer} relative`}>
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="space-y-8">
              {/* Label brand */}
              <div className="space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.35em] text-[#628ECB]">
                  Selamat Datang di CONNETIC Module
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-4 py-1.5 text-sm font-bold text-[#0F8A66]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Media Pembelajaran Interaktif Berbasis CTL
                </div>
              </div>

              {/* Tagline + deskripsi */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="h-1 w-8 shrink-0 rounded-full bg-[#628ECB]" />
                  <p className="whitespace-nowrap text-lg font-bold text-[#395886] sm:text-xl lg:text-2xl">
                    Belajar jadi lebih terarah dan logis.
                  </p>
                </div>

                <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#395886] sm:text-5xl lg:text-6xl">
                  Platform CTL untuk Siswa{' '}
                  <span className="relative whitespace-nowrap">
                    <span className="relative z-10">DDTJKT</span>
                    <span className="absolute -bottom-1 left-0 h-3 w-full rounded-full bg-[#628ECB]/20" />
                  </span>{' '}
                  SMK.
                </h1>

                <p className="max-w-lg text-base leading-relaxed text-[#395886]/70">
                  Dirancang khusus untuk kelas X TJKT, membahas materi{' '}
                  <strong className="text-[#395886]">TCP, IP Address, IPv4,</strong> dan{' '}
                  <strong className="text-[#395886]">IPv6</strong> melalui 7 tahapan CTL yang terstruktur dan
                  bermakna — meningkatkan kemampuan <strong className="text-[#395886]">logical thinking</strong> siswa.
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#628ECB] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#628ECB]/25 transition-all hover:bg-[#395886] hover:-translate-y-0.5 active:scale-95"
                >
                  Mulai Belajar Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:flex lg:flex-col lg:gap-4">
              <div className="absolute -left-8 -top-8 h-64 w-64 rounded-full bg-[#628ECB]/10 blur-3xl" />
              <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-[#10B981]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[40px] border border-white/50 bg-gradient-to-br from-[#628ECB] to-[#395886] p-8 shadow-2xl">
                <div className="grid gap-4">
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
                    <div className="mb-3 flex items-center gap-2">
                      <Network className="h-7 w-7 text-white" />
                      <h3 className="text-base font-bold text-white">Kurikulum Terpadu</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { num: 1, topic: 'TCP' },
                        { num: 2, topic: 'IP Address' },
                        { num: 3, topic: 'IPv4' },
                        { num: 4, topic: 'IPv6' },
                      ].map((item) => (
                        <div key={item.num} className="rounded-xl bg-white/15 px-3 py-2.5 text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/55">Pertemuan {item.num}</p>
                          <p className="mt-0.5 text-sm font-bold text-white">{item.topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
                    <div className="mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-7 w-7 text-white" />
                      <h3 className="text-base font-bold text-white">Evaluasi Terukur</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">
                      Dilengkapi dengan pretest dan posttest untuk mengukur tingkat pemahaman siswa secara akurat.
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistik — kolom kanan, di bawah kartu gradien */}
              <div className="relative grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center rounded-2xl border border-[#D5DEEF]/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-2xl font-extrabold text-[#628ECB]">4</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#395886]/50">Pertemuan</p>
                </div>
                <div className="flex flex-col items-center rounded-2xl border border-[#D5DEEF]/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-2xl font-extrabold text-[#10B981]">7</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#395886]/50">Tahapan CTL</p>
                </div>
                <div className="flex flex-col items-center rounded-2xl border border-[#D5DEEF]/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-2xl font-extrabold text-[#F59E0B]">2</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#395886]/50">Evaluasi Umum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TENTANG ─────────────────────────────────────────────────────────── */}
      <section id="about" className="scroll-mt-20 border-y border-[#D5DEEF] bg-[#F8FAFD] pt-7 pb-12 sm:pt-9 sm:pb-14">
        <div className={`${desktopContainer}`}>
          {/* Kepala bagian */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tentang CONNETIC</h2>
            <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#628ECB]" />
            <p className="mt-3 text-base text-[#395886]/70">
              Media pembelajaran digital berbasis CTL untuk mata pelajaran DDTJKT kelas X TJKT.
            </p>
          </div>

          {/* Kiri: deskripsi + fitur | Kanan: tahapan CTL */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
            {/* Kolom kiri: teks deskripsi + Keunggulan */}
            <div className="space-y-7">
              {/* Deskripsi */}
              <div className="space-y-4 text-base leading-relaxed text-[#395886]/80">
                <p>
                  <strong>CONNETIC Module</strong> adalah media pembelajaran interaktif berbasis web yang dirancang untuk mendukung pembelajaran mata pelajaran <strong>Dasar-Dasar Teknik Jaringan Komputer dan Telekomunikasi (DDTJKT)</strong> pada siswa kelas X TJKT SMK.
                </p>
                <p>
                  Media ini menggunakan pendekatan <strong>Contextual Teaching and Learning (CTL)</strong> yang menghubungkan materi pembelajaran dengan situasi nyata, sehingga siswa dapat memahami konsep secara lebih mendalam. Materi yang dibahas meliputi <strong>TCP, IP Address, IPv4,</strong> dan <strong>IPv6</strong>.
                </p>
                <p>
                  Tujuan utama pengembangan media ini adalah meningkatkan kemampuan <strong>logical thinking</strong> (berpikir logis) siswa melalui aktivitas pembelajaran yang terstruktur, interaktif, dan bermakna dengan 7 tahapan CTL.
                </p>
              </div>

              {/* Indikator Logical Thinking */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#395886]">Indikator Logical Thinking</h3>
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 rounded-2xl border border-[#D5DEEF] bg-white p-4 shadow-sm transition-all hover:border-[#628ECB] hover:shadow-md"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${feature.color} text-white shadow-md transition-transform group-hover:scale-105`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#395886]">{feature.title}</h4>
                      <p className="mt-0.5 text-sm leading-relaxed text-[#395886]/60">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom kanan: tahapan CTL */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#395886]">7 Tahapan Pembelajaran CTL</h3>
              <div className="space-y-2.5">
                {stages.map((stage, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm transition-all hover:shadow-md hover:translate-x-1"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#628ECB]/10 text-sm font-bold text-[#628ECB]">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#395886] text-sm">{stage.name}</h4>
                      <p className="mt-0.5 text-xs text-[#395886]/60 leading-relaxed">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROFIL PEMBUAT ──────────────────────────────────────────────────── */}
      <section id="profile" className="scroll-mt-20 bg-white pt-7 pb-12 sm:pt-9 sm:pb-14">
        <div className={`${desktopContainer}`}>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Profil Pembuat Media</h2>
            <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#628ECB]" />
            <p className="mt-3 text-base text-[#395886]/70 whitespace-nowrap">
              Dikembangkan sebagai bagian dari penelitian skripsi.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-12">
            {/* Kartu Profil */}
            <div className="flex flex-col items-center lg:items-start">
              {/* Foto Profil */}
              <div className="relative mb-6 group">
                <div className="relative h-44 w-44 overflow-hidden rounded-[2.5rem] border-4 border-white bg-[#D5DEEF] shadow-2xl shadow-[#628ECB]/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[#628ECB]/30">
                  <img
                    src={profileImg}
                    alt="Oktavina Zahra Rahmawati"
                    className="h-full w-full object-cover transition-opacity duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.profile-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    }}
                  />
                  {/* Fallback initials if image fails to load */}
                  <div className="profile-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#395886] to-[#628ECB] hidden">
                    <span className="text-5xl font-black text-white tracking-tighter">OZ</span>
                  </div>
                  {/* Always show if profileImg is not defined or fails immediately */}
                  {!profileImg && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#395886] to-[#628ECB]">
                      <span className="text-5xl font-black text-white tracking-tighter">OZ</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981] shadow-lg ring-4 ring-white transition-transform duration-500 group-hover:rotate-12">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Identitas */}
              <div className="text-center lg:text-left space-y-1">
                <h3 className="text-2xl font-bold text-[#395886]">Oktavina Zahra Rahmawati</h3>
                <p className="text-[#628ECB] font-semibold text-sm">Pendidikan Ilmu Komputer</p>
                <p className="text-[#395886]/60 text-sm font-medium">Universitas Pendidikan Indonesia</p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#628ECB]/10 px-3 py-1 text-xs font-bold text-[#628ECB] mt-2">
                  Angkatan 2022
                </div>
              </div>

              {/* Kontak */}
              <div className="mt-6 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                <a
                  href="https://instagram.com/oktavinazr_"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-3.5 py-2 text-sm font-semibold text-[#395886] shadow-sm transition-all hover:border-[#E1306C] hover:text-[#E1306C]"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <a
                  href="https://linkedin.com/in/oktavinazr"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-3.5 py-2 text-sm font-semibold text-[#395886] shadow-sm transition-all hover:border-[#0A66C2] hover:text-[#0A66C2]"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href="mailto:oktavinazahrarahmawati@gmail.com"
                  title="Gmail"
                  className="flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-3.5 py-2 text-sm font-semibold text-[#395886] shadow-sm transition-all hover:border-[#EA4335] hover:text-[#EA4335]"
                >
                  <Mail className="h-4 w-4" />
                  Gmail
                </a>
                <a
                  href="mailto:oktavinazahrarahmawati@upi.edu"
                  title="Email UPI"
                  className="flex items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-3.5 py-2 text-sm font-semibold text-[#395886] shadow-sm transition-all hover:border-[#628ECB] hover:text-[#628ECB]"
                >
                  <Mail className="h-4 w-4" />
                  UPI
                </a>
              </div>
            </div>

            {/* Kartu Detail */}
            <div className="space-y-5">
              {/* Skripsi */}
              <div className="rounded-[1.5rem] border border-[#D5DEEF] bg-[#F8FAFD] p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#628ECB] mb-2">Judul Skripsi</p>
                <p className="text-[#395886] font-semibold leading-relaxed">
                  CONNETIC Module: Media Pembelajaran Interaktif dengan Penerapan Contextual Teaching and
                  Learning (CTL) Untuk Meningkatkan Logical Thinking Siswa
                </p>
              </div>

              {/* Pembimbing */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[#D5DEEF] bg-[#F8FAFD] p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#628ECB] mb-3">Pembimbing I</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#628ECB]/10 text-[#628ECB]">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#395886] text-sm">Drs. H. Eka Fitrajaya Rahman, M.T.</p>
                      <p className="text-xs text-[#395886]/60">Dosen Pembimbing I</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-[#D5DEEF] bg-[#F8FAFD] p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#628ECB] mb-3">Pembimbing II</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#628ECB]/10 text-[#628ECB]">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#395886] text-sm">Jajang Kusnendar, M.T.</p>
                      <p className="text-xs text-[#395886]/60">Dosen Pembimbing II</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ucapan Terima Kasih */}
              <div className="rounded-[1.5rem] border border-[#10B981]/20 bg-[#10B981]/5 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-[#10B981] mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#10B981] mb-2">Ucapan Terima Kasih</p>
                    <p className="text-sm text-[#395886]/80 leading-relaxed">
                      Terima kasih kepada Allah SWT atas segala karunia-Nya, kedua orang tua dan keluarga yang
                      selalu memberikan doa dan dukungan, kepada dosen pembimbing yang telah membimbing dengan
                      sabar, serta seluruh pihak yang telah membantu terselesaikannya penelitian dan pengembangan
                      media pembelajaran CONNETIC ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-gradient-to-br from-[#2d4a73] via-[#395886] to-[#4a6fa0] text-white">
        {/* Konten utama footer */}
        <div className={`${desktopContainer} py-12`}>
          <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr_1fr]">
            {/* Identitas Merek */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-tight">CONNETIC Module</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Interactive Learning</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                Media pembelajaran interaktif berbasis web untuk menunjang proses belajar mengajar pada mata pelajaran Dasar-Dasar Teknik Jaringan Komputer dan Telekomunikasi SMK kelas X. Dikembangkan dengan pendekatan Contextual Teaching and Learning (CTL) untuk meningkatkan pemahaman dan logical thinking siswa.
              </p>
            </div>

            {/* Navigasi */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">Navigasi</h4>
              <nav className="flex flex-col gap-2.5 text-sm text-white/70">
                <a href="#home" className="inline-block transition-all hover:text-white hover:translate-x-1">Beranda</a>
                <a href="#about" className="inline-block transition-all hover:text-white hover:translate-x-1">Tentang</a>
                <a href="#profile" className="inline-block transition-all hover:text-white hover:translate-x-1">Profil Pembuat</a>
              </nav>
            </div>

            {/* Akses */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">Akses Platform</h4>
              <nav className="flex flex-col gap-2.5 text-sm text-white/70">
                <Link to="/login" className="inline-block transition-all hover:text-white hover:translate-x-1">Masuk Sistem</Link>
                <Link to="/register" className="inline-block transition-all hover:text-white hover:translate-x-1">Registrasi Siswa</Link>
              </nav>
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">Materi</h4>
                <div className="flex flex-wrap gap-2">
                  {['TCP', 'IP Address', 'IPv4', 'IPv6'].map((m) => (
                    <span key={m} className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bilah hak cipta */}
        <div className="border-t border-white/10">
          <div className={`${desktopContainer} py-5 text-center`}>
            <p className="text-xs text-white/40">
              &copy; 2026 CONNETIC Module. All rights reserved. &nbsp;·&nbsp; Designed for Modern Education
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
