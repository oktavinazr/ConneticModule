import { X, User, Mail, GraduationCap, Calendar, IdCard, Edit2, Save } from 'lucide-react';
import { useState } from 'react';
import { updateUser, getCurrentUser } from '../utils/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    class: string;
    nis: string;
    registeredAt?: string;
    role: string;
  };
  onUpdate: () => void;
}

export function ProfileModal({ isOpen, onClose, user, onUpdate }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user.name,
    email: user.email,
    class: user.class,
    nis: user.nis,
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setError('');

    // Validate email
    if (!editedData.email.includes('@')) {
      setError('Email tidak valid');
      return;
    }

    // Update user
    const success = updateUser(user.id, editedData);
    if (success) {
      setIsEditing(false);
      onUpdate();
      // Reload to reflect changes
      window.location.reload();
    } else {
      setError('Email atau NIS sudah digunakan oleh akun lain');
    }
  };

  const handleCancel = () => {
    setEditedData({
      name: user.name,
      email: user.email,
      class: user.class,
      nis: user.nis,
    });
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-[#D5DEEF]">
        {/* Header */}
        <div className="bg-[#628ECB] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-[#395886] rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-[#628ECB]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name.split(' ')[0]}</h2>
              {user.role === 'student' && <p className="text-white/90">{user.class}</p>}
              {user.role === 'teacher' && <p className="text-white/90">Guru</p>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Nama */}
          <div className="flex items-start gap-3 p-4 bg-[#F0F3FA] rounded-lg border-2 border-[#D5DEEF]">
            <User className="w-5 h-5 text-[#628ECB] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#395886]/70">Nama Lengkap</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB]"
                />
              ) : (
                <p className="text-[#395886] font-medium">{user.name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 p-4 bg-[#F0F3FA] rounded-lg border-2 border-[#D5DEEF]">
            <Mail className="w-5 h-5 text-[#628ECB] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#395886]/70">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB]"
                />
              ) : (
                <p className="text-[#395886] font-medium">{user.email}</p>
              )}
            </div>
          </div>

          {/* Kelas - Only for students */}
          {user.role === 'student' && (
            <div className="flex items-start gap-3 p-4 bg-[#F0F3FA] rounded-lg border-2 border-[#D5DEEF]">
              <GraduationCap className="w-5 h-5 text-[#10B981] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#395886]/70">Kelas</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.class}
                    onChange={(e) => setEditedData({ ...editedData, class: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB]"
                  />
                ) : (
                  <p className="text-[#395886] font-medium">{user.class}</p>
                )}
              </div>
            </div>
          )}

          {/* NIS - Only for students */}
          {user.role === 'student' && (
            <div className="flex items-start gap-3 p-4 bg-[#F0F3FA] rounded-lg border-2 border-[#D5DEEF]">
              <IdCard className="w-5 h-5 text-[#8B5CF6] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#395886]/70">NIS</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.nis}
                    onChange={(e) => setEditedData({ ...editedData, nis: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB]"
                  />
                ) : (
                  <p className="text-[#395886] font-medium">{user.nis}</p>
                )}
              </div>
            </div>
          )}

          {/* Tanggal Registrasi */}
          {user.registeredAt && (
            <div className="flex items-start gap-3 p-4 bg-[#F0F3FA] rounded-lg border-2 border-[#D5DEEF]">
              <Calendar className="w-5 h-5 text-[#F59E0B] mt-0.5" />
              <div>
                <p className="text-sm text-[#395886]/70">Terdaftar Sejak</p>
                <p className="text-[#395886] font-medium">
                  {new Date(user.registeredAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F0F3FA] px-6 py-4 flex justify-end gap-3 border-t-2 border-[#D5DEEF]">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="bg-[#628ECB] text-white px-6 py-2 rounded-lg hover:bg-[#395886] hover:shadow-lg transition-all flex items-center gap-2 font-medium shadow-md"
              >
                <Save className="w-4 h-4" />
                Simpan
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Tutup
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#628ECB] text-white px-6 py-2 rounded-lg hover:bg-[#395886] hover:shadow-lg transition-all flex items-center gap-2 font-medium shadow-md"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profil
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}