import { Link } from 'react-router';
import { BookOpen, GraduationCap, Users, CheckCircle, Target, Zap, Trophy } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-[#D5DEEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#628ECB] rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#395886]">
                CONNETIC Module
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#home" className="text-[#395886] hover:text-[#628ECB] transition-colors font-medium">
                Beranda
              </a>
              <a href="#about" className="text-[#395886] hover:text-[#628ECB] transition-colors font-medium">
                Tentang
              </a>
              <a href="#start" className="bg-[#628ECB] text-white px-6 py-2 rounded-lg hover:bg-[#395886] transition-all transform hover:scale-105 font-medium shadow-md">
                Mulai
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20" id="home">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-block bg-[#10B981] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                🎓 Media Pembelajaran Interaktif
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-[#395886] leading-tight">
                Belajar Jaringan
                <span className="block text-[#628ECB]">
                  Jadi Lebih Mudah
                </span>
              </h1>
              <p className="text-xl text-[#395886]/80 leading-relaxed">
                Platform pembelajaran DDTJKT dengan metode CTL yang interaktif untuk siswa SMK kelas X
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <a
                  href="#start"
                  className="bg-[#628ECB] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#395886] hover:shadow-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  Mulai Belajar Sekarang
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-[#628ECB] border-2 border-[#8AAEE0]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white space-y-6 p-8">
                    <div className="flex justify-center gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold">4</div>
                        <div className="text-sm opacity-90">Materi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold">7</div>
                        <div className="text-sm opacity-90">Tahapan CTL</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold">100%</div>
                        <div className="text-sm opacity-90">Interaktif</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-white rounded-xl p-4 border border-[#D5DEEF] shadow-sm">
                        <div className="text-3xl mb-2">📡</div>
                        <div className="text-sm font-semibold text-[#395886]">TCP</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-[#D5DEEF] shadow-sm">
                        <div className="text-3xl mb-2">🌐</div>
                        <div className="text-sm font-semibold text-[#395886]">IP Address</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-[#D5DEEF] shadow-sm">
                        <div className="text-3xl mb-2">📍</div>
                        <div className="text-sm font-semibold text-[#395886]">IPv4</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-[#D5DEEF] shadow-sm">
                        <div className="text-3xl mb-2">🚀</div>
                        <div className="text-sm font-semibold text-[#395886]">IPv6</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F59E0B] rounded-full opacity-40"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#10B981] rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#395886] mb-4">
              Kenapa Pilih CONNETIC Module?
            </h2>
            <p className="text-xl text-[#395886]/70 max-w-2xl mx-auto">
              Platform pembelajaran yang dirancang khusus dengan fitur-fitur unggulan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Green Accent */}
            <div className="group bg-[#D5DEEF] p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-[#B1C9EF] hover:border-[#10B981]">
              <div className="w-16 h-16 bg-[#10B981] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-md">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#395886] mb-3">
                7 Tahapan CTL
              </h3>
              <p className="text-[#395886]/70 leading-relaxed">
                Pembelajaran kontekstual yang sistematis dan mudah dipahami
              </p>
            </div>

            {/* Feature 2 - Purple Accent */}
            <div className="group bg-[#D5DEEF] p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-[#B1C9EF] hover:border-[#8B5CF6]">
              <div className="w-16 h-16 bg-[#8B5CF6] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-md">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#395886] mb-3">
                100% Interaktif
              </h3>
              <p className="text-[#395886]/70 leading-relaxed">
                Polling, drag-drop, matching, dan simulasi yang menarik
              </p>
            </div>

            {/* Feature 3 - Orange Accent */}
            <div className="group bg-[#D5DEEF] p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-[#B1C9EF] hover:border-[#F59E0B]">
              <div className="w-16 h-16 bg-[#F59E0B] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-md">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#395886] mb-3">
                Tracking Progress
              </h3>
              <p className="text-[#395886]/70 leading-relaxed">
                Pantau perkembangan dengan pretest dan posttest
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 bg-[#F0F3FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#395886] mb-4">
              Apa yang Akan Kamu Pelajari?
            </h2>
            <p className="text-xl text-[#395886]/70">
              4 Materi Pokok Jaringan Komputer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group border-2 border-[#D5DEEF] hover:border-[#628ECB]">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📡</div>
              <h3 className="text-xl font-bold text-[#395886] mb-2">Pertemuan 1</h3>
              <p className="text-[#628ECB] font-semibold mb-2">Konsep Dasar TCP</p>
              <p className="text-[#395886]/70 text-sm">
                Pelajari protokol TCP dan cara kerjanya
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group border-2 border-[#D5DEEF] hover:border-[#10B981]">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🌐</div>
              <h3 className="text-xl font-bold text-[#395886] mb-2">Pertemuan 2</h3>
              <p className="text-[#10B981] font-semibold mb-2">Konsep IP Address</p>
              <p className="text-[#395886]/70 text-sm">
                Memahami pengalamatan jaringan
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group border-2 border-[#D5DEEF] hover:border-[#8B5CF6]">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📍</div>
              <h3 className="text-xl font-bold text-[#395886] mb-2">Pertemuan 3</h3>
              <p className="text-[#8B5CF6] font-semibold mb-2">Pengenalan IPv4</p>
              <p className="text-[#395886]/70 text-sm">
                Mengenal format dan struktur IPv4
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group border-2 border-[#D5DEEF] hover:border-[#F59E0B]">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="text-xl font-bold text-[#395886] mb-2">Pertemuan 4</h3>
              <p className="text-[#F59E0B] font-semibold mb-2">Pengenalan IPv6</p>
              <p className="text-[#395886]/70 text-sm">
                Teknologi jaringan masa depan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Simplified */}
      <section className="py-20 bg-white" id="about">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#395886] mb-4">
              Tentang CONNETIC Module
            </h2>
            <p className="text-xl text-[#395886]/70">
              Media pembelajaran interaktif untuk siswa SMK kelas X
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#D5DEEF] p-8 rounded-2xl border-2 border-[#B1C9EF]">
              <h3 className="text-2xl font-bold text-[#395886] mb-4">🎯 Metode CTL</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] mt-1 flex-shrink-0" />
                  <span className="text-[#395886]/80">7 tahapan pembelajaran berurutan</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] mt-1 flex-shrink-0" />
                  <span className="text-[#395886]/80">Soal interaktif di setiap tahap</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] mt-1 flex-shrink-0" />
                  <span className="text-[#395886]/80">Contextual & mudah dipahami</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#D5DEEF] p-8 rounded-2xl border-2 border-[#B1C9EF]">
              <h3 className="text-2xl font-bold text-[#395886] mb-4">📊 Evaluasi Lengkap</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
                  <span className="text-[#395886]/80">Pretest & Posttest global</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
                  <span className="text-[#395886]/80">Evaluasi per pertemuan</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#8B5CF6] mt-1 flex-shrink-0" />
                  <span className="text-[#395886]/80">Monitoring progres oleh guru</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Role Selection */}
      <section className="py-20 bg-[#628ECB] relative overflow-hidden" id="start">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#395886] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#395886] rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Siap Untuk Memulai?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Pilih role kamu dan mulai perjalanan belajar yang menyenangkan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Card */}
            <Link
              to="/login?role=student"
              className="group relative bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-[#D5DEEF] hover:border-[#10B981]"
            >
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center group-hover:bg-[#10B981]/20 transition-colors">
                  <GraduationCap className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div>
                  <div className="inline-block bg-[#10B981] text-white px-3 py-1 rounded-full text-sm font-semibold mb-3 shadow-sm">
                    Untuk Siswa
                  </div>
                  <h3 className="text-3xl font-bold text-[#395886] mb-2">Siswa</h3>
                  <p className="text-[#395886]/70 leading-relaxed">
                    Akses pembelajaran interaktif, kerjakan soal, dan pantau progres belajar kamu
                  </p>
                </div>
                <div className="flex items-center text-[#10B981] font-semibold group-hover:gap-3 gap-2 transition-all">
                  <span>Mulai Belajar</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* Teacher Card */}
            <Link
              to="/login?role=teacher"
              className="group relative bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-[#D5DEEF] hover:border-[#F59E0B]"
            >
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center group-hover:bg-[#F59E0B]/20 transition-colors">
                  <Users className="w-6 h-6 text-[#F59E0B]" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div>
                  <div className="inline-block bg-[#F59E0B] text-white px-3 py-1 rounded-full text-sm font-semibold mb-3 shadow-sm">
                    Untuk Guru
                  </div>
                  <h3 className="text-3xl font-bold text-[#395886] mb-2">Guru</h3>
                  <p className="text-[#395886]/70 leading-relaxed">
                    Monitor progres siswa, lihat hasil evaluasi, dan kelola pembelajaran
                  </p>
                </div>
                <div className="flex items-center text-[#F59E0B] font-semibold group-hover:gap-3 gap-2 transition-all">
                  <span>Dashboard Guru</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#395886] text-white py-8 border-t-4 border-[#628ECB]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#628ECB] rounded-lg flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">CONNETIC Module</span>
          </div>
          <p className="text-white/80">
            Media Pembelajaran DDTJKT - Dasar-Dasar Teknik Jaringan Komputer dan Telekomunikasi
          </p>
          <p className="text-white/60 text-sm mt-4">
            &copy; 2026 CONNETIC Module. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}