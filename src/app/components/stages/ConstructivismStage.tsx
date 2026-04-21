import { useState } from 'react';
import { ChevronRight, CheckCircle, XCircle, Lightbulb, HelpCircle, PlayCircle, RotateCcw, AlertCircle, Info } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';

interface ConstructivismStageProps {
  apersepsi?: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer?: string;
  feedback?: { correct: string; incorrect: string };
  videoUrl?: string;
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: { selectedOption: string; reason: string; isCorrect: boolean }) => void;
}

export function ConstructivismStage({
  apersepsi,
  question,
  options,
  correctAnswer,
  feedback,
  videoUrl,
  lessonId,
  stageIndex,
  onComplete,
}: ConstructivismStageProps) {
  const user = getCurrentUser();
  const initialProgress = getLessonProgress(user!.id, lessonId);

  const [selectedOption, setSelectedOption] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(initialProgress.stageAttempts[`stage_${stageIndex}`] || 0);

  const isCorrect = selectedOption === correctAnswer;
  const showExplanation = submitted && (isCorrect || attempts >= 3);

  const handleSubmit = () => {
    if (!selectedOption) {
      setError('Pilih salah satu jawaban terlebih dahulu.');
      return;
    }
    if (reason.trim().length < 10) {
      setError('Tuliskan alasan minimal 10 karakter.');
      return;
    }
    setError('');
    
    const newIsCorrect = selectedOption === correctAnswer;
    const newAttempts = saveStageAttempt(user!.id, lessonId, stageIndex, newIsCorrect);
    setAttempts(newAttempts);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setSubmitted(false);
    setSelectedOption('');
    setReason('');
    setError('');
  };

  const handleContinue = () => {
    onComplete({ selectedOption, reason, isCorrect });
  };

  // Fungsi pembantu untuk mendapatkan ID YouTube dari URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Bagian Media / Konteks */}
      <div className="bg-white rounded-2xl border-2 border-[#628ECB]/20 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#628ECB]/8 border-b border-[#628ECB]/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#628ECB]/15">
            <PlayCircle className="w-4 h-4 text-[#628ECB]" />
          </div>
          <h3 className="text-sm font-bold text-[#395886]">Konteks Pembelajaran</h3>
        </div>
        
        <div className="p-0">
          {videoUrl ? (
            <div className="aspect-video w-full bg-black shadow-inner">
              {getYouTubeId(videoUrl) ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Video tidak dapat dimuat</p>
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 py-6 bg-gradient-to-br from-[#628ECB]/5 to-transparent">
               <div className="flex items-start gap-4">
                 <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#628ECB]/10">
                   <Lightbulb className="w-5 h-5 text-[#628ECB]" />
                 </div>
                 <p className="text-[#395886]/80 leading-relaxed text-sm italic">
                   "{apersepsi}"
                 </p>
               </div>
            </div>
          )}
        </div>
        
        {videoUrl && apersepsi && (
          <div className="px-5 py-4 border-t border-[#D5DEEF]/50 bg-gray-50/50">
            <p className="text-[#395886]/80 leading-relaxed text-sm">{apersepsi}</p>
          </div>
        )}
      </div>

      {/* Kartu Pertanyaan */}
      <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5 sm:p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#628ECB]/10">
              <HelpCircle className="w-4 h-4 text-[#628ECB]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#628ECB] mb-0.5">Pertanyaan Pemantik</p>
              <p className="text-[#395886] font-semibold text-sm leading-relaxed">{question}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#628ECB]/5 border border-[#628ECB]/20">
              <AlertCircle className="w-3.5 h-3.5 text-[#628ECB]" />
              <span className="text-[10px] font-bold text-[#628ECB] uppercase tracking-wider">
                {attempts < 3 ? `${3 - attempts} Percobaan Tersisa` : 'Kesempatan Habis'}
              </span>
            </div>
          </div>
        </div>

        {/* Pilihan Jawaban */}
        <div className="space-y-2 mb-5">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isThisCorrect = option.id === correctAnswer;

            let borderCls = 'border-[#D5DEEF] hover:border-[#628ECB]/50';
            let bgCls = '';
            if (showExplanation) {
              if (isThisCorrect) {
                borderCls = 'border-[#10B981]';
                bgCls = 'bg-[#10B981]/8';
              } else if (isSelected && !isThisCorrect) {
                borderCls = 'border-red-400';
                bgCls = 'bg-red-50';
              }
            } else if (submitted) {
              if (isSelected) {
                borderCls = isCorrect ? 'border-[#10B981]' : 'border-red-400';
                bgCls = isCorrect ? 'bg-[#10B981]/8' : 'bg-red-50';
              }
            } else if (isSelected) {
              borderCls = 'border-[#628ECB]';
              bgCls = 'bg-[#628ECB]/8';
            }

            return (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all ${borderCls} ${bgCls} ${submitted && (isCorrect || attempts >= 3) ? 'cursor-default' : ''}`}
              >
                <input
                  type="radio"
                  name="constructivism"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => {
                    if (!submitted) {
                      setSelectedOption(option.id);
                      setError('');
                    }
                  }}
                  disabled={submitted}
                  className="mt-0.5 accent-[#628ECB]"
                />
                <span className="flex-1 text-[#395886] text-[13px] leading-relaxed">{option.text}</span>
                {showExplanation && isThisCorrect && (
                  <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                )}
                {submitted && isSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
              </label>
            );
          })}
        </div>

        {/* Umpan balik setelah mengirim */}
        {submitted && feedback && (
          <div
            className={`rounded-xl p-3.5 mb-5 border-2 ${
              isCorrect
                ? 'bg-[#10B981]/8 border-[#10B981]/40'
                : attempts < 3
                ? 'bg-red-50 border-red-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              ) : attempts < 3 ? (
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-[13px] font-bold mb-0.5 ${isCorrect ? 'text-[#10B981]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                  {isCorrect ? 'Jawaban Tepat!' : attempts < 3 ? 'Belum Tepat' : 'Kunci Jawaban'}
                </p>
                <p className={`text-[13px] leading-relaxed ${isCorrect ? 'text-[#10B981]' : attempts < 3 ? 'text-red-700' : 'text-amber-800'}`}>
                  {isCorrect ? feedback.correct : (attempts >= 3 ? feedback.correct : feedback.incorrect)}
                </p>
                {!isCorrect && attempts < 3 && (
                  <button
                    onClick={handleRetry}
                    className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Coba Lagi
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Input Alasan */}
        <div className="mb-5">
          <label className="block text-[13px] font-bold text-[#395886] mb-1.5">
            Tuliskan alasanmu memilih jawaban tersebut:
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            disabled={submitted}
            rows={3}
            className="w-full px-4 py-2.5 border-2 border-[#D5DEEF] rounded-xl text-[13px] text-[#395886] placeholder:text-[#395886]/40 focus:outline-none focus:ring-2 focus:ring-[#628ECB]/30 focus:border-[#628ECB] transition disabled:bg-[#F0F3FA] disabled:cursor-default resize-none"
            placeholder="Jelaskan dengan singkat mengapa kamu memilih jawaban tersebut..."
          />
          <p className={`text-[11px] mt-1 ${reason.trim().length >= 10 ? 'text-[#10B981]' : 'text-[#395886]/50'}`}>
            {reason.trim().length >= 10 ? '✓ ' : ''}{reason.trim().length} karakter (minimal 10)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-4">
            {error}
          </div>
        )}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || reason.trim().length < 10}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              selectedOption && reason.trim().length >= 10
                ? 'bg-[#628ECB] text-white hover:bg-[#395886]'
                : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
            }`}
          >
            Periksa Jawaban
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full py-2.5 rounded-xl bg-[#628ECB] text-white font-semibold text-sm hover:bg-[#395886] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Lanjutkan ke Tahap Berikutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
