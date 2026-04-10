import { useState } from 'react';
import { MessageCircle, ChevronRight, Video, Play } from 'lucide-react';

interface ConstructivismStageProps {
  videoUrl?: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  onComplete: (answer: { selectedOption: string; reason: string }) => void;
}

export function ConstructivismStage({ videoUrl, question, options, onComplete }: ConstructivismStageProps) {
  const [selectedOption, setSelectedOption] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [videoWatched, setVideoWatched] = useState(!videoUrl); // If no video, mark as watched

  const handleSubmit = () => {
    if (!videoWatched) {
      setError('Tonton video terlebih dahulu sebelum menjawab');
      return;
    }
    if (!selectedOption) {
      setError('Pilih salah satu jawaban');
      return;
    }
    if (reason.trim().length < 10) {
      setError('Berikan alasan minimal 10 karakter');
      return;
    }

    onComplete({ selectedOption, reason });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Video Section */}
      {videoUrl && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-8 h-8 text-[#628ECB]" />
            <h3 className="text-xl font-bold text-[#395886]">Video Pembelajaran</h3>
          </div>
          <p className="text-[#395886]/70 mb-4">
            Tonton video berikut untuk membangun pemahaman awal Anda
          </p>
          
          <div className="relative aspect-video bg-[#F0F3FA] rounded-lg overflow-hidden mb-4">
            <iframe
              src={videoUrl}
              title="Video Pembelajaran"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setVideoWatched(true)}
            />
          </div>

          {!videoWatched && (
            <div className="flex items-center gap-2 text-[#628ECB] bg-[#628ECB]/10 px-4 py-3 rounded-lg border border-[#628ECB]">
              <Play className="w-5 h-5" />
              <p className="text-sm">Silakan tonton video terlebih dahulu</p>
            </div>
          )}
        </div>
      )}

      {/* Question Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="w-8 h-8 text-[#628ECB]" />
          <h3 className="text-xl font-bold text-[#395886]">Pertanyaan Pemantik</h3>
        </div>

        <p className="text-lg text-[#395886] mb-6">{question}</p>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <label
              key={option.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === option.id
                  ? 'border-[#628ECB] bg-[#628ECB]/10'
                  : 'border-[#D5DEEF] hover:border-[#628ECB]/50'
              }`}
            >
              <input
                type="radio"
                name="constructivism"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  setError('');
                }}
                className="mr-3"
              />
              <span className="text-[#395886]">{option.text}</span>
            </label>
          ))}
        </div>

        {/* Reason */}
        <div className="mb-6">
          <label className="block text-[#395886] font-semibold mb-2">
            Berikan alasan Anda:
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB] min-h-[100px]"
            placeholder="Jelaskan mengapa Anda memilih jawaban tersebut..."
          />
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