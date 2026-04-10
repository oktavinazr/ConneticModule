import { useState } from 'react';
import { Users, ChevronRight, MessageSquare, Lightbulb } from 'lucide-react';

interface GroupActivity {
  groupNames: string[];
  activity: string;
  discussionPoints: string[];
}

interface LearningCommunityStageProps {
  groupActivity?: GroupActivity;
  question: string;
  options: Array<{ id: string; text: string }>;
  onComplete: (answer: { stance: string; reason: string; selectedGroup?: string }) => void;
}

export function LearningCommunityStage({
  groupActivity,
  question,
  options,
  onComplete,
}: LearningCommunityStageProps) {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [stance, setStance] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (groupActivity && !selectedGroup) {
      setError('Pilih kelompok Anda terlebih dahulu');
      return;
    }
    if (!stance) {
      setError('Pilih sikap Anda terhadap pernyataan');
      return;
    }
    if (reason.trim().length < 15) {
      setError('Berikan alasan minimal 15 karakter');
      return;
    }

    onComplete({ stance, reason, selectedGroup });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Group Selection */}
      {groupActivity && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-[#628ECB]" />
            <h3 className="text-xl font-bold text-[#395886]">Pembagian Kelompok</h3>
          </div>

          <p className="text-[#395886]/70 mb-4">
            Pilih kelompok Anda untuk diskusi:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {groupActivity.groupNames.map((group, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedGroup(group);
                  setError('');
                }}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedGroup === group
                    ? 'border-[#628ECB] bg-[#628ECB]/10'
                    : 'border-[#D5DEEF] hover:border-[#628ECB]/50'
                }`}
              >
                <Users className={`w-6 h-6 mx-auto mb-2 ${
                  selectedGroup === group ? 'text-[#628ECB]' : 'text-gray-400'
                }`} />
                <span className="text-sm text-[#395886]">{group}</span>
              </button>
            ))}
          </div>

          {/* Activity Instructions */}
          <div className="bg-[#628ECB]/10 border-2 border-[#628ECB]/30 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#628ECB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#395886] font-semibold mb-2">Aktivitas Kelompok:</h4>
                <p className="text-[#395886]">{groupActivity.activity}</p>
              </div>
            </div>
          </div>

          {/* Discussion Points */}
          <div className="bg-[#F0F3FA] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-[#628ECB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#395886] font-semibold mb-2">Poin Diskusi:</h4>
                <ul className="space-y-2">
                  {groupActivity.discussionPoints.map((point, index) => (
                    <li key={index} className="text-[#395886] text-sm flex items-start gap-2">
                      <span className="text-[#628ECB] mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Question */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-8 h-8 text-[#628ECB]" />
          <h3 className="text-xl font-bold text-[#395886]">Evaluasi Pernyataan</h3>
        </div>

        <div className="bg-[#628ECB]/10 border-l-4 border-[#628ECB] p-4 mb-6">
          <p className="text-lg text-[#395886] italic font-semibold">&quot;{question}&quot;</p>
        </div>

        {/* Stance Options */}
        <div className="mb-6">
          <h4 className="text-[#395886] font-semibold mb-3">Sikap Anda:</h4>
          <div className="grid grid-cols-2 gap-4">
            {options.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                  stance === option.id
                    ? 'border-[#628ECB] bg-[#628ECB]/10'
                    : 'border-[#D5DEEF] hover:border-[#628ECB]/50'
                }`}
              >
                <input
                  type="radio"
                  name="stance"
                  value={option.id}
                  checked={stance === option.id}
                  onChange={(e) => {
                    setStance(e.target.value);
                    setError('');
                  }}
                  className="sr-only"
                />
                <span className="text-lg text-[#395886]">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="mb-6">
          <label className="block text-[#395886] font-semibold mb-2">
            Jelaskan alasan Anda (hasil diskusi kelompok):
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB] min-h-[120px]"
            placeholder="Berikan argumen yang mendukung sikap kelompok Anda berdasarkan hasil diskusi..."
          />
          <p className="text-sm text-[#395886]/60 mt-1">
            {reason.length} karakter (minimal 15)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-[#628ECB] text-white py-3 rounded-lg hover:bg-[#395886] transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          Lanjutkan
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}