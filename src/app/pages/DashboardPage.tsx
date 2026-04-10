import { Link } from 'react-router';
import { BookOpen, LogOut, User, CheckCircle, Lock, Trophy, Target, HelpCircle } from 'lucide-react';
import { getCurrentUser, logout } from '../utils/auth';
import {
  getAllProgress,
  getGlobalTestProgress,
  isLessonUnlocked,
  isGlobalPosttestUnlocked,
} from '../utils/progress';
import { useNavigate } from 'react-router';
import { lessons } from '../data/lessons';
import { ProfileModal } from '../components/ProfileModal';
import { GuideModal } from '../components/GuideModal';
import { useState } from 'react';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const progress = getAllProgress(user!.id);
  const globalTestProgress = getGlobalTestProgress(user!.id);
  const globalPosttestUnlocked = isGlobalPosttestUnlocked(user!.id);

  // State for modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Get first name for header display
  const firstName = user?.name.split(' ')[0] || user?.name;
  // Get full name for greeting
  const fullName = user?.name;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if global pretest completed
  if (!globalTestProgress.globalPretestCompleted) {
    return (
      <div className="min-h-screen bg-[#F0F3FA]">
        <header className="bg-white shadow-sm border-b border-[#D5DEEF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#628ECB] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-[#395886]">CONNETIC Module</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[#395886]">
                  <User className="w-5 h-5" />
                  <span>{firstName}</span>
                  <span className="text-[#395886]/70">({user?.class})</span>
                </div>
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

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome & Dashboard Title */}
          <div className="mb-8">
            <p className="text-xl text-[#395886]/70 mb-2">Hai, {fullName}! 👋</p>
            <h1 className="text-3xl font-bold text-[#628ECB] mb-2">Dashboard</h1>
            <p className="text-[#395886]/70">Selamat datang di halaman pembelajaran Anda</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-[#D5DEEF]">
            <Trophy className="w-20 h-20 text-[#628ECB] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#395886] mb-4">Mulai Pembelajaran</h3>
            <p className="text-lg text-[#395886]/70 mb-6">
              Sebelum memulai pembelajaran, Anda harus mengerjakan Pre-Test Umum terlebih dahulu
              untuk mengukur pemahaman awal Anda.
            </p>
            <Link
              to="/global-pretest"
              className="inline-block bg-[#628ECB] text-white px-8 py-3 rounded-lg hover:bg-[#395886] transition-colors shadow-md"
            >
              Mulai Pre-Test Umum
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#D5DEEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#628ECB] rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#395886]">CONNETIC Module</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
                <span>{firstName}</span>
              </button>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-5 h-5" />
                Panduan
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome & Dashboard Title */}
        <div className="mb-8">
          <p className="text-xl text-[#395886]/70 mb-2">Hai, {fullName}! 👋</p>
          <h1 className="text-3xl font-bold text-[#628ECB] mb-2">Dashboard</h1>
          <p className="text-[#395886]/70">Kelola progres pembelajaran Anda di sini</p>
        </div>

        {/* Capaian Pembelajaran */}
        <div className="bg-[#D5DEEF] rounded-xl shadow-lg p-6 mb-8 border-2 border-[#B1C9EF]">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-[#628ECB] flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#395886] mb-3">Capaian Pembelajaran</h2>
              <div className="bg-white rounded-lg p-4 border border-[#D5DEEF]">
                <h3 className="text-lg font-semibold text-[#395886] mb-3">Elemen: Media dan Jaringan Telekomunikasi</h3>
                <p className="text-[#395886]/80 leading-relaxed">
                  Pada akhir fase E peserta didik mampu memahami prinsip dasar sistem IPV4/IPV6, TCP IP, 
                  Networking Service, Sistem Keamanan Jaringan Telekomunikasi, Sistem Seluler, 
                  Sistem Microwave, Sistem VSAT IP, Sistem Optik, dan Sistem WLAN.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Pretest Result */}
        {globalTestProgress.globalPretestCompleted && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-[#D5DEEF]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#395886] mb-2">Pre-Test Umum</h3>
                <p className="text-[#395886]/70">
                  Nilai Anda: {globalTestProgress.globalPretestScore}/10 (
                  {Math.round(((globalTestProgress.globalPretestScore || 0) / 10) * 100)}%)
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#10B981]" />
            </div>
          </div>
        )}

        {/* Lesson Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {Object.values(lessons).map((lesson) => {
            const lessonProgress = progress.find((p) => p.lessonId === lesson.id);
            const pretestCompleted = lessonProgress?.pretestCompleted || false;
            const completedStages = lessonProgress?.completedStages.length || 0;
            const totalStages = lesson.stages.length;
            const posttestCompleted = lessonProgress?.posttestCompleted || false;
            const unlocked = isLessonUnlocked(user!.id, lesson.id);

            // Calculate total progress (pretest + stages + posttest)
            const totalSteps = 1 + totalStages + 1; // pretest + 7 stages + posttest
            let completedSteps = 0;
            if (pretestCompleted) completedSteps += 1;
            completedSteps += completedStages;
            if (posttestCompleted) completedSteps += 1;

            const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
            const fullyCompleted = pretestCompleted && completedStages === totalStages && posttestCompleted;

            return (
              <div
                key={lesson.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-[#D5DEEF] ${
                  !unlocked ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#395886] mb-2">{lesson.title}</h2>
                      <h3 className="text-[#628ECB] font-semibold mb-3">{lesson.topic}</h3>
                    </div>
                    {unlocked ? (
                      fullyCompleted && <CheckCircle className="w-8 h-8 text-[#10B981]" />
                    ) : (
                      <Lock className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  <p className="text-[#395886]/70 mb-4">{lesson.description}</p>

                  {/* Progress Bar */}
                  {unlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[#395886]/70">Progress</span>
                        <span className="text-sm text-[#628ECB] font-semibold">
                          {completedSteps}/{totalSteps} tahap
                        </span>
                      </div>
                      <div className="w-full bg-[#D5DEEF] rounded-full h-2">
                        <div
                          className="bg-[#628ECB] h-2 rounded-full transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Status Badges */}
                  {unlocked && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          fullyCompleted
                            ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]'
                            : pretestCompleted
                            ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        Pre-Test {pretestCompleted && '✓'}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          fullyCompleted
                            ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]'
                            : completedStages === totalStages
                            ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        Tahapan CTL {completedStages}/{totalStages} {completedStages === totalStages && '✓'}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          fullyCompleted
                            ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]'
                            : posttestCompleted
                            ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        Post-Test {posttestCompleted && '✓'}
                      </span>
                    </div>
                  )}

                  {/* Buttons */}
                  {unlocked ? (
                    <Link
                      to={
                        completedSteps === 0
                          ? `/lesson-pretest/${lesson.id}`
                          : fullyCompleted
                          ? `/lesson/${lesson.id}`
                          : !pretestCompleted
                          ? `/lesson-pretest/${lesson.id}`
                          : posttestCompleted
                          ? `/lesson/${lesson.id}`
                          : completedStages === totalStages
                          ? `/evaluation/${lesson.id}`
                          : `/lesson/${lesson.id}`
                      }
                      className="block w-full bg-[#628ECB] text-white text-center py-3 rounded-lg hover:bg-[#395886] transition-colors shadow-md"
                    >
                      {completedSteps === 0 ? 'Mulai' : fullyCompleted ? 'Review' : 'Lanjutkan'}
                    </Link>
                  ) : (
                    <div className="block w-full bg-gray-300 text-gray-500 text-center py-3 rounded-lg cursor-not-allowed">
                      <Lock className="w-5 h-5 inline-block mr-2" />
                      Terkunci
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Posttest Card */}
        <div
          className={`bg-[#F59E0B]/10 rounded-xl shadow-lg p-6 border-2 border-[#F59E0B]/30 ${
            !globalPosttestUnlocked ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-[#F59E0B]" />
                <h2 className="text-2xl font-bold text-[#395886]">Post-Test Umum</h2>
              </div>
              <p className="text-[#395886]/70 mb-4">
                Tes akhir untuk mengukur pemahaman Anda setelah menyelesaikan semua pertemuan
              </p>
              {globalTestProgress.globalPosttestCompleted && (
                <p className="text-[#10B981] mb-4 font-semibold">
                  ✓ Selesai - Nilai: {globalTestProgress.globalPosttestScore}/10 (
                  {Math.round(((globalTestProgress.globalPosttestScore || 0) / 10) * 100)}%)
                </p>
              )}
            </div>
            <div>
              {globalPosttestUnlocked ? (
                <Link
                  to="/global-posttest"
                  className="inline-block bg-[#F59E0B] text-white px-6 py-3 rounded-lg hover:bg-[#D97706] transition-colors shadow-md"
                >
                  {globalTestProgress.globalPosttestCompleted ? 'Lihat Hasil' : 'Mulai Post-Test'}
                </Link>
              ) : (
                <div className="inline-block bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed">
                  <Lock className="w-5 h-5 inline-block mr-2" />
                  Terkunci
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user!}
        onUpdate={() => {
          // Refresh user data
          const updatedUser = getCurrentUser();
          if (updatedUser) {
            // Data will be refreshed on page reload
          }
        }}
      />

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}