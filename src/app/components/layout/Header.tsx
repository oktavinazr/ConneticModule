import React from 'react';
import { Link } from 'react-router';
import { User, LogOut, HelpCircle, Users, Lock, BookOpen } from 'lucide-react';
import { Logo } from './Logo';
import { MobileSidebar } from '../MobileSidebar';

interface HeaderProps {
  user: { name: string; username: string; role: string } | null;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onOpenGuide?: () => void;
  onOpenGroup?: () => void;
  selectedGroup?: string;
  isPretestCompleted?: boolean;
  activeSection?: string;
  role: 'student' | 'admin';
}

export function Header({
  user,
  onLogout,
  onOpenProfile,
  onOpenGuide,
  onOpenGroup,
  selectedGroup,
  isPretestCompleted = true,
  activeSection,
  role,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#C8D8F0] bg-white/95 shadow-md backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link to={role === 'admin' ? '/admin' : '/dashboard'}>
              <Logo />
            </Link>
            <div className="h-8 w-px bg-[#D5DEEF] hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#628ECB]/10 px-3 py-1 text-xs font-bold text-[#628ECB] uppercase tracking-widest border border-[#628ECB]/20">
              {activeSection || (role === 'admin' ? 'Admin Panel' : 'Dashboard')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-6 md:flex">
              {role === 'student' && (
                <>
                  <button
                    onClick={onOpenProfile}
                    className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-all cursor-pointer text-sm font-bold group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#395886]/5 flex items-center justify-center group-hover:bg-[#628ECB]/10 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <span>{user?.username}</span>
                  </button>
                  <button
                    onClick={() => isPretestCompleted && onOpenGroup?.()}
                    className={`flex items-center gap-2 transition-all text-sm font-bold relative group ${
                      isPretestCompleted
                        ? 'text-[#395886] hover:text-[#628ECB] cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    title={!isPretestCompleted ? 'Selesaikan Pre-Test Umum untuk mengakses fitur Kelompok' : undefined}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isPretestCompleted ? 'bg-[#395886]/5 group-hover:bg-[#628ECB]/10' : 'bg-gray-100'
                    }`}>
                      {isPretestCompleted ? <Users className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <span>{selectedGroup || 'Kelompok'}</span>
                    {!isPretestCompleted && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 text-[7px] font-black text-white ring-2 ring-white">!</span>
                    )}
                  </button>
                  <button
                    onClick={onOpenGuide}
                    className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-all cursor-pointer text-sm font-bold group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#395886]/5 flex items-center justify-center group-hover:bg-[#628ECB]/10 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    Panduan
                  </button>
                </>
              )}
              {role === 'student' && (
                <>
                  <div className="h-8 w-px bg-[#D5DEEF]" />
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-all text-sm font-black hover:scale-105 active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>

            <MobileSidebar
              title={role === 'admin' ? 'Menu Admin' : 'Menu Dashboard'}
              description={role === 'admin' ? 'Panel administrasi CONNETIC.' : 'Akses fitur utama dashboard siswa.'}
              items={role === 'admin' ? [
                { label: 'Dashboard Admin', to: '/admin', icon: <BookOpen className="h-4 w-4" /> },
                { label: 'Logout', onClick: onLogout, icon: <LogOut className="h-4 w-4" />, danger: true },
              ] : [
                { label: 'Dashboard', to: '/dashboard', icon: <BookOpen className="h-4 w-4" /> },
                { label: isPretestCompleted ? 'Kelompok' : 'Kelompok (Terkunci)', onClick: isPretestCompleted ? onOpenGroup : undefined, icon: isPretestCompleted ? <Users className="h-4 w-4" /> : <Lock className="h-4 w-4" /> },
                { label: 'Panduan', onClick: onOpenGuide, icon: <HelpCircle className="h-4 w-4" /> },
                { label: 'Logout', onClick: onLogout, icon: <LogOut className="h-4 w-4" />, danger: true },
              ]}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
