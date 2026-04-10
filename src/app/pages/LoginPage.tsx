import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { BookOpen, LogIn } from 'lucide-react';
import { login } from '../utils/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') as 'student' | 'teacher' | null;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAs, setLoginAs] = useState<'student' | 'teacher'>(roleFromUrl || 'student');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = login(email, password);
    if (user) {
      // Redirect based on selected role
      if (loginAs === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#D5DEEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#628ECB] rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#395886]">
                CONNETIC Module
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-[#395886] hover:text-[#628ECB] transition-colors font-medium">
                Beranda
              </Link>
              <Link to="/register" className="text-[#628ECB] hover:text-[#395886] transition-colors font-medium">
                Daftar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#D5DEEF]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#628ECB] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#395886] mb-2">Login</h1>
            <p className="text-[#395886]/70">Masuk ke akun Anda untuk melanjutkan pembelajaran</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login As Selection */}
            <div>
              <label className="block text-[#395886] mb-2 font-medium">
                Login Sebagai
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLoginAs('student')}
                  className={`px-4 py-3 border-2 rounded-lg transition-all flex items-center justify-center gap-2 font-medium ${
                    loginAs === 'student'
                      ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                      : 'border-[#D5DEEF] text-[#395886]/70 hover:border-[#10B981]'
                  }`}
                >
                  👨‍🎓 Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setLoginAs('teacher')}
                  className={`px-4 py-3 border-2 rounded-lg transition-all flex items-center justify-center gap-2 font-medium ${
                    loginAs === 'teacher'
                      ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]'
                      : 'border-[#D5DEEF] text-[#395886]/70 hover:border-[#F59E0B]'
                  }`}
                >
                  👨‍🏫 Guru
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[#395886] mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB]"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#395886] mb-2 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#628ECB] text-white py-3 rounded-lg hover:bg-[#395886] hover:shadow-xl transition-all transform hover:scale-[1.02] font-medium shadow-md"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#395886]/70">
              Belum punya akun?{' '}
              <Link to="/register" className="text-[#628ECB] hover:text-[#395886] font-medium">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}