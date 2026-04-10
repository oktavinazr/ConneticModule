import { X, BookOpen, CheckCircle, List, Trophy, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col border-2 border-[#D5DEEF]">
        {/* Header */}
        <div className="bg-[#628ECB] p-6 text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <HelpCircle className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">Panduan Penggunaan</h2>
              <p className="text-white/90">CONNETIC Module</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Tentang */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-6 h-6 text-[#628ECB]" />
              <h3 className="text-[#395886] font-semibold">Tentang CONNETIC Module</h3>
            </div>
            <p className="text-[#395886]/80 leading-relaxed">
              CONNETIC Module adalah media pembelajaran interaktif untuk mata pelajaran{' '}
              <strong>Dasar-Dasar Teknik Jaringan Komputer dan Telekomunikasi (DDTJKT)</strong> kelas X SMK.
              Media ini menerapkan model pembelajaran <strong>Contextual Teaching and Learning (CTL)</strong>{' '}
              dengan 7 tahapan yang harus diselesaikan secara berurutan.
            </p>
          </div>

          {/* Alur Pembelajaran */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <List className="w-6 h-6 text-[#628ECB]" />
              <h3 className="text-[#395886] font-semibold">Alur Pembelajaran</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3 items-start bg-[#628ECB]/10 p-4 rounded-lg border border-[#628ECB]/30">
                <div className="bg-[#628ECB] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-[#395886] mb-1">Pre-Test Umum</h4>
                  <p className="text-[#395886]/80 text-sm">
                    Kerjakan pre-test umum (20 menit) untuk mengukur pemahaman awal Anda sebelum memulai pembelajaran.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-[#628ECB]/10 p-4 rounded-lg border border-[#628ECB]/30">
                <div className="bg-[#628ECB] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-[#395886] mb-1">Pertemuan 1-4</h4>
                  <p className="text-[#395886]/80 text-sm mb-2">
                    Setiap pertemuan memiliki struktur: <strong>Pre-Test Pertemuan (10 menit)</strong> →
                    <strong> 7 Tahapan CTL</strong> → <strong>Post-Test Pertemuan (15 menit)</strong>
                  </p>
                  <p className="text-[#395886]/80 text-sm">
                    Pertemuan berikutnya akan terbuka setelah menyelesaikan pertemuan sebelumnya.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-[#628ECB]/10 p-4 rounded-lg border border-[#628ECB]/30">
                <div className="bg-[#628ECB] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-[#395886] mb-1">Post-Test Umum</h4>
                  <p className="text-[#395886]/80 text-sm">
                    Setelah menyelesaikan semua pertemuan, kerjakan post-test umum (20 menit) untuk mengukur capaian pembelajaran Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 7 Tahapan CTL */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-[#10B981]" />
              <h3 className="text-[#395886] font-semibold">7 Tahapan CTL</h3>
            </div>
            <div className="grid gap-2">
              {[
                { name: 'Constructivism', desc: 'Membangun pengetahuan melalui video pembelajaran' },
                { name: 'Inquiry', desc: 'Menemukan konsep melalui eksplorasi dan drag & drop' },
                { name: 'Questioning', desc: 'Bertanya dan menjawab dengan gambar interaktif' },
                { name: 'Learning Community', desc: 'Belajar bersama dalam kelompok dan aktivitas' },
                { name: 'Modeling', desc: 'Mencontoh praktik guru dan siswa' },
                { name: 'Reflection', desc: 'Merefleksikan pembelajaran melalui journaling' },
                { name: 'Authentic Assessment', desc: 'Penilaian otentik dengan format esai' },
              ].map((stage, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#D5DEEF] p-3 rounded-lg">
                  <span className="text-[#628ECB] font-bold">{idx + 1}.</span>
                  <div>
                    <h4 className="font-semibold text-[#395886] text-sm">{stage.name}</h4>
                    <p className="text-[#395886]/70 text-xs">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-[#F59E0B]" />
              <h3 className="text-[#395886] font-semibold">Tips Belajar</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[#395886]/80 text-sm">
                <span className="text-[#628ECB]">•</span>
                <span>Perhatikan timer pada setiap test dan kerjakan dengan fokus</span>
              </li>
              <li className="flex items-start gap-2 text-[#395886]/80 text-sm">
                <span className="text-[#628ECB]">•</span>
                <span>Selesaikan setiap tahapan CTL secara berurutan untuk pemahaman optimal</span>
              </li>
              <li className="flex items-start gap-2 text-[#395886]/80 text-sm">
                <span className="text-[#628ECB]">•</span>
                <span>Anda dapat mereview pembelajaran yang sudah selesai kapan saja</span>
              </li>
              <li className="flex items-start gap-2 text-[#395886]/80 text-sm">
                <span className="text-[#628ECB]">•</span>
                <span>Interaksi dengan materi akan meningkatkan pemahaman Anda</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#D5DEEF] px-6 py-4 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-[#628ECB] text-white px-6 py-2 rounded-lg hover:bg-[#395886] transition-colors shadow-md"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
