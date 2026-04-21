import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ArrowRight, BookOpen, LogIn, ShieldCheck, Eye, EyeOff, Home, CheckCircle } from 'lucide-react';
import { login } from '../utils/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get('registered') === '1';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = login(identifier, password);
    if (!user) {
      setError('Username/email atau password salah. Periksa kembali username/email dan password Anda.');
      return;
    }

    setSuccess(true);
    const destination = user.role === 'admin' ? '/admin' : '/dashboard';
    setTimeout(() => navigate(destination), 1500);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(98,142,203,0.18),_transparent_40%),linear-gradient(135deg,#eef4ff_0%,#f8fbff_52%,#e7efff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <header className="sticky top-4 z-50 mx-auto flex w-full max-w-[1280px] items-center justify-between rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_55px_rgba(57,88,134,0.08)] backdrop-blur sm:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#628ECB] shadow-md">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#395886]">CONNETIC Module</p>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#628ECB]">Interactive Learning</p>
            </div>
          </Link>
          <div className="mx-4 hidden h-8 w-px bg-[#D5DEEF] sm:block" />
          <span className="hidden text-sm font-bold uppercase tracking-widest text-[#628ECB] sm:block">Login</span>
        </div>
        <Link
          to="/"
          className="hidden items-center gap-2 rounded-xl border border-[#D5DEEF] bg-white px-4 py-2 text-sm font-semibold text-[#395886] transition-all hover:border-[#628ECB] hover:text-[#628ECB] sm:inline-flex"
        >
          <Home className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-[1280px] items-center py-6">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_30px_80px_rgba(57,88,134,0.14)] backdrop-blur lg:grid-cols-[1.02fr_0.98fr]">
          <section className="relative overflow-hidden bg-[#395886] px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(213,222,239,0.24),_transparent_32%)]" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                  <LogIn className="h-5 w-5" />
                  Masuk ke Akun
                </div>

                <div className="space-y-3">
                  <h1 className="max-w-md text-3xl font-bold leading-tight sm:text-4xl">
                    Masuk untuk melanjutkan aktivitas belajar Anda.
                  </h1>
                  <p className="max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                    Gunakan username atau email yang telah terdaftar. Admin dapat masuk menggunakan kredensial khusus.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <ShieldCheck className="mb-3 h-8 w-8 text-[#D5DEEF]" />
                  <p className="mb-1 text-sm font-semibold">Akses Terintegrasi</p>
                  <p className="text-sm text-white/75">Siswa dan admin masuk melalui satu pintu yang sama.</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <BookOpen className="mb-3 h-8 w-8 text-[#D5DEEF]" />
                  <p className="mb-1 text-sm font-semibold">Keamanan Data</p>
                  <p className="text-sm text-white/75">Progres belajar Anda tersimpan aman dan dapat diakses kapan saja.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto flex h-full max-w-md flex-col justify-center">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#628ECB]">Login</p>
                <h2 className="mt-2 text-3xl font-bold text-[#395886]">
                  Selamat Datang
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#395886]/70">
                  Masukkan identitas akun Anda untuk masuk ke sistem pembelajaran.
                </p>
              </div>

              {justRegistered && (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Registrasi berhasil. Silakan login menggunakan akun yang baru dibuat.
                </div>
              )}

              {success && (
                <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 px-5 py-4">
                  <CheckCircle className="h-5 w-5 shrink-0 text-[#10B981] mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[#10B981]">Login berhasil!</p>
                    <p className="text-xs text-[#10B981]/80 mt-0.5">Mengarahkan ke halaman dashboard...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="identifier" className="block text-sm font-semibold text-[#395886]">
                    Username atau Email
                  </label>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full rounded-2xl border border-[#D5DEEF] bg-white px-4 py-3.5 text-[#395886] outline-none transition focus:border-[#628ECB] focus:ring-4 focus:ring-[#628ECB]/15"
                    placeholder="username atau nama@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-[#395886]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-[#D5DEEF] bg-white px-4 py-3.5 pr-12 text-[#395886] outline-none transition focus:border-[#628ECB] focus:ring-4 focus:ring-[#628ECB]/15"
                      placeholder="Masukkan password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#395886]/50 hover:text-[#628ECB]"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#D5DEEF] text-[#628ECB] focus:ring-[#628ECB]"
                    />
                    <span className="text-sm text-[#395886]/70">Ingat saya</span>
                  </label>
                  <Link to="/register" className="text-sm font-semibold text-[#628ECB] hover:underline">
                    Lupa password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={success}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#628ECB] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#628ECB]/20 transition hover:bg-[#395886] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {success ? 'Mengalihkan...' : 'Masuk'}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <p className="mt-6 text-sm text-[#395886]/75">
                Belum punya akun siswa?{' '}
                <Link to="/register" className="font-semibold text-[#628ECB] hover:text-[#395886]">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
