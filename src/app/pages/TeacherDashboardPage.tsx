import { BookOpen, LogOut, User, Users, TrendingUp, Award, Eye } from 'lucide-react';
import { getCurrentUser, logout, getAllStudents } from '../utils/auth';
import { useNavigate } from 'react-router';
import { lessons } from '../data/lessons';
import { getAllProgress, getGlobalTestProgress } from '../utils/progress';
import { useState } from 'react';
import { ProfileModal } from '../components/ProfileModal';

interface StudentProgress {
  student: {
    id: string;
    name: string;
    email: string;
    class: string;
    nis: string;
  };
  globalPretest: number | null;
  globalPosttest: number | null;
  lessonsProgress: {
    lessonId: string;
    lessonTitle: string;
    pretest: number | null;
    posttest: number | null;
    completedStages: number;
    totalStages: number;
  }[];
  overallProgress: number;
}

export function TeacherDashboardPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'nis'>('name');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Arahkan ulang jika belum terautentikasi
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Ambil semua data siswa
  const students = getAllStudents();

  // Hitung progres untuk semua siswa
  const studentsProgress: StudentProgress[] = students.map((student) => {
    const progress = getAllProgress(student.id);
    const globalTests = getGlobalTestProgress(student.id);

    const lessonsProgress = Object.values(lessons).map((lesson) => {
      const lessonProgress = progress.find((p) => p.lessonId === lesson.id);
      return {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        pretest: lessonProgress?.pretestScore ?? null,
        posttest: lessonProgress?.posttestScore ?? null,
        completedStages: lessonProgress?.completedStages.length ?? 0,
        totalStages: lesson.stages.length,
      };
    });

    // Hitung progres keseluruhan
    const totalSteps =
      2 + // pretest & posttest global
      Object.values(lessons).length * 9; // Setiap pertemuan: pretest + 7 tahap + posttest
    let completedSteps = 0;

    if (globalTests.globalPretestCompleted) completedSteps += 1;
    if (globalTests.globalPosttestCompleted) completedSteps += 1;

    lessonsProgress.forEach((lp) => {
      if (lp.pretest !== null) completedSteps += 1;
      completedSteps += lp.completedStages;
      if (lp.posttest !== null) completedSteps += 1;
    });

    const overallProgress = Math.round((completedSteps / totalSteps) * 100);

    return {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        nis: student.nis,
      },
      globalPretest: globalTests.globalPretestScore ?? null,
      globalPosttest: globalTests.globalPosttestScore ?? null,
      lessonsProgress,
      overallProgress,
    };
  });

  // Hitung statistik
  const totalStudents = students.length;
  const activeStudents = studentsProgress.filter((sp) => sp.overallProgress > 0).length;
  const averageProgress =
    totalStudents > 0
      ? Math.round(studentsProgress.reduce((sum, sp) => sum + sp.overallProgress, 0) / totalStudents)
      : 0;
  const completedStudents = studentsProgress.filter((sp) => sp.overallProgress === 100).length;

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      {/* Kepala */}
      <header className="bg-white shadow-sm border-b border-[#D5DEEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#628ECB] rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#395886]">CONNETIC Module - Dashboard Guru</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
                <span className="text-[#395886]/60 text-sm">(Guru)</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#395886] mb-4">Dashboard Guru</h1>
          <p className="text-lg text-[#395886]/70">Monitoring Progres dan Hasil Belajar Siswa</p>
        </div>

        {/* Kartu Statistik */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#395886]/70 mb-1">Total Siswa</p>
                <p className="text-3xl font-bold text-[#395886]">{totalStudents}</p>
              </div>
              <Users className="w-12 h-12 text-[#628ECB]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#395886]/70 mb-1">Siswa Aktif</p>
                <p className="text-3xl font-bold text-[#10B981]">{activeStudents}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#10B981]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#395886]/70 mb-1">Rata-rata Progress</p>
                <p className="text-3xl font-bold text-[#628ECB]">{averageProgress}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#628ECB]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#395886]/70 mb-1">Selesai Semua</p>
                <p className="text-3xl font-bold text-[#F59E0B]">{completedStudents}</p>
              </div>
              <Award className="w-12 h-12 text-[#F59E0B]" />
            </div>
          </div>
        </div>

        {/* Tabel Siswa */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#D5DEEF]">
          <div className="p-6 bg-gradient-to-r from-[#628ECB] to-[#8B5CF6]">
            <h2 className="text-white font-bold text-xl">Daftar Siswa</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F0F3FA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#395886] uppercase tracking-wider">
                    NIS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#395886] uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#395886] uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#395886] uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#395886] uppercase tracking-wider">
                    Pre-Test Umum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#395886] uppercase tracking-wider">
                    Post-Test Umum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#395886] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#D5DEEF]">
                {studentsProgress.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-[#395886]/60">
                      Belum ada siswa terdaftar
                    </td>
                  </tr>
                ) : (
                  studentsProgress.map((sp) => (
                    <tr key={sp.student.id} className="hover:bg-[#F0F3FA]">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#395886]">{sp.student.nis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#395886] font-semibold">{sp.student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#395886]">{sp.student.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[#D5DEEF] rounded-full h-2">
                            <div
                              className="bg-[#628ECB] h-2 rounded-full"
                              style={{ width: `${sp.overallProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-[#395886] font-semibold">{sp.overallProgress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {sp.globalPretest !== null ? (
                          <span className="text-[#10B981] font-semibold">{sp.globalPretest}/10</span>
                        ) : (
                          <span className="text-[#395886]/40">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {sp.globalPosttest !== null ? (
                          <span className="text-[#10B981] font-semibold">{sp.globalPosttest}/10</span>
                        ) : (
                          <span className="text-[#395886]/40">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedStudent(sp)}
                          className="text-[#628ECB] hover:text-[#395886] flex items-center gap-1 font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Detail */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedStudent(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col border-2 border-[#D5DEEF]">
            {/* Kepala */}
            <div className="bg-gradient-to-r from-[#628ECB] to-[#8B5CF6] p-6 text-white flex-shrink-0">
              <h2 className="text-2xl font-bold">{selectedStudent.student.name}</h2>
              <p className="text-white/80">
                {selectedStudent.student.nis} - {selectedStudent.student.class}
              </p>
            </div>

            {/* Konten */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Tes Global */}
              <div>
                <h3 className="text-[#395886] font-bold text-lg mb-4">Test Umum</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#628ECB]/10 p-4 rounded-lg border-2 border-[#628ECB]/30">
                    <p className="text-sm text-[#395886]/70 mb-2">Pre-Test Umum</p>
                    {selectedStudent.globalPretest !== null ? (
                      <p className="text-2xl font-bold text-[#628ECB]">{selectedStudent.globalPretest}/10</p>
                    ) : (
                      <p className="text-[#395886]/40">Belum dikerjakan</p>
                    )}
                  </div>
                  <div className="bg-[#8B5CF6]/10 p-4 rounded-lg border-2 border-[#8B5CF6]/30">
                    <p className="text-sm text-[#395886]/70 mb-2">Post-Test Umum</p>
                    {selectedStudent.globalPosttest !== null ? (
                      <p className="text-2xl font-bold text-[#8B5CF6]">{selectedStudent.globalPosttest}/10</p>
                    ) : (
                      <p className="text-[#395886]/40">Belum dikerjakan</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Pertemuan */}
              <div>
                <h3 className="text-[#395886] font-bold text-lg mb-4">Progress Pertemuan</h3>
                <div className="space-y-4">
                  {selectedStudent.lessonsProgress.map((lp) => (
                    <div key={lp.lessonId} className="bg-[#F0F3FA] p-4 rounded-lg border-2 border-[#D5DEEF]">
                      <h4 className="font-semibold text-[#395886] mb-3">{lp.lessonTitle}</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-[#395886]/70 mb-1">Pre-Test</p>
                          {lp.pretest !== null ? (
                            <p className="text-lg font-bold text-[#10B981]">{lp.pretest}/5</p>
                          ) : (
                            <p className="text-[#395886]/40 text-sm">-</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-[#395886]/70 mb-1">Tahapan CTL</p>
                          <p className="text-lg font-bold text-[#628ECB]">
                            {lp.completedStages}/{lp.totalStages}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#395886]/70 mb-1">Post-Test</p>
                          {lp.posttest !== null ? (
                            <p className="text-lg font-bold text-[#8B5CF6]">{lp.posttest}/5</p>
                          ) : (
                            <p className="text-[#395886]/40 text-sm">-</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kaki */}
            <div className="bg-[#F0F3FA] px-6 py-4 flex justify-end flex-shrink-0 border-t-2 border-[#D5DEEF]">
              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-[#628ECB] text-white px-6 py-2 rounded-lg hover:bg-[#395886] transition-colors shadow-md"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Profil */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user!}
        onUpdate={() => {
          // Paksa render ulang dengan memuat ulang halaman
          window.location.reload();
        }}
      />
    </div>
  );
}