import { useState } from 'react';
import { ChevronRight, CheckCircle, XCircle, Lightbulb, HelpCircle, Eye, EyeOff, MessageSquare, User, RotateCcw, AlertCircle, Info } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';

interface ReasonOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

interface QuestionBankItem {
  id: string;
  text: string;
  response: string;
}

interface QuestioningStageProps {
  scenario?: string;
  whyQuestion?: string;
  hint?: string;
  reasonOptions?: ReasonOption[];
  teacherImage?: string;
  teacherQuestion?: string;
  questionBank?: QuestionBankItem[];
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: { selectedId: string; isCorrect: boolean; askedQuestions: string[] }) => void;
}

export function QuestioningStage({
  scenario,
  whyQuestion,
  hint,
  reasonOptions,
  teacherQuestion,
  questionBank,
  lessonId,
  stageIndex,
  onComplete,
}: QuestioningStageProps) {
  const user = getCurrentUser();
  const initialProgress = getLessonProgress(user!.id, lessonId);

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(initialProgress.stageAttempts[`stage_${stageIndex}`] || 0);

  const handleAsk = (id: string) => {
    setActiveQuestionId(id);
    setAskedQuestions(prev => new Set(prev).add(id));
  };

  const isCorrect = selectedReason !== null && (reasonOptions?.find((o) => o.id === selectedReason)?.isCorrect ?? false);
  const showExplanation = submitted && (isCorrect || attempts >= 3);
  const selectedFeedback = reasonOptions?.find((o) => o.id === (showExplanation ? reasonOptions.find(ro => ro.isCorrect)?.id : selectedReason))?.feedback;

  const handleSubmit = () => {
    if (selectedReason === null) return;
    
    const currentOption = reasonOptions?.find(o => o.id === selectedReason);
    const newIsCorrect = currentOption?.isCorrect ?? false;
    
    const newAttempts = saveStageAttempt(user!.id, lessonId, stageIndex, newIsCorrect);
    setAttempts(newAttempts);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setSubmitted(false);
    setSelectedReason(null);
  };

  const handleContinue = () => {
    onComplete({
      selectedId: (isCorrect || attempts < 3) ? (selectedReason ?? '') : (reasonOptions?.find(ro => ro.isCorrect)?.id ?? ''),
      isCorrect,
      askedQuestions: Array.from(askedQuestions),
    });
  };

  const activeResponse = questionBank?.find(q => q.id === activeQuestionId)?.response;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Bagian Skenario & Guru */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skenario */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-[#D5DEEF]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm border border-[#D5DEEF]">
              <Eye className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <h3 className="text-sm font-bold text-[#395886]">Observasi Kasus</h3>
          </div>
          <div className="p-6 flex-1 bg-gradient-to-br from-white to-[#F8FAFF]">
            <p className="text-[#395886]/80 leading-relaxed text-sm font-medium">
              {scenario}
            </p>
          </div>
        </div>

        {/* Guru / Fasilitator */}
        <div className="bg-white rounded-3xl border-2 border-[#8B5CF6]/20 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white mb-4 shadow-lg ring-4 ring-[#8B5CF6]/10">
            <User className="w-10 h-10" strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5CF6] mb-1">Media Fasilitator</p>
          <div className="relative bg-[#8B5CF6]/5 rounded-2xl p-4 border border-[#8B5CF6]/10">
            <p className="text-xs font-bold text-[#395886] leading-relaxed italic">
              "{teacherQuestion ?? 'Bagaimana pendapatmu mengenai kasus di samping? Silakan bertanya jika ada yang kurang jelas.'}"
            </p>
            <div className="absolute -left-2 top-4 w-4 h-4 bg-[#8B5CF6]/5 border-l border-t border-[#8B5CF6]/10 rotate-[-45deg]" />
          </div>
        </div>
      </div>

      {/* 2. Area Pertanyaan Interaktif */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bagian Siswa Bertanya */}
        <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B5CF6]/10">
              <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <h3 className="text-sm font-bold text-[#395886]">Tanyakan pada Media</h3>
          </div>
          
          <div className="space-y-2 mb-6">
            {questionBank?.map((q) => (
              <button
                key={q.id}
                onClick={() => handleAsk(q.id)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                  activeQuestionId === q.id
                    ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-md scale-[1.02]'
                    : askedQuestions.has(q.id)
                    ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20 text-[#8B5CF6]'
                    : 'bg-white border-[#D5DEEF] text-[#395886]/70 hover:border-[#8B5CF6]/40'
                }`}
              >
                {q.text}
              </button>
            ))}
          </div>

          {activeResponse && (
            <div className="bg-[#F0FDF4] border-2 border-[#10B981]/20 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <p className="text-[10px] font-black uppercase text-[#10B981]">Jawaban Media</p>
              </div>
              <p className="text-xs font-bold text-[#065F46] leading-relaxed">
                {activeResponse}
              </p>
            </div>
          )}
        </div>

        {/* Bagian Siswa Menjawab */}
        <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B5CF6]/10">
                <HelpCircle className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <h3 className="text-sm font-bold text-[#395886]">Berikan Argumenmu</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/5 border border-[#8B5CF6]/20">
              <AlertCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">
                {attempts < 3 ? `${3 - attempts} Percobaan Tersisa` : 'Kesempatan Habis'}
              </span>
            </div>
          </div>

          <p className="text-xs font-bold text-[#395886] mb-4 leading-relaxed bg-[#F8FAFF] p-3 rounded-xl border border-[#D5DEEF]">
            {whyQuestion}
          </p>

          <div className="space-y-2 mb-6">
            {reasonOptions?.map((option) => {
              const isSelected = selectedReason === option.id;
              const isThisCorrect = option.isCorrect;

              let cls = 'border-[#D5DEEF] hover:border-[#8B5CF6]/50';
              let bgCls = '';
              if (showExplanation) {
                if (isThisCorrect) {
                  cls = 'border-[#10B981]';
                  bgCls = 'bg-[#10B981]/8';
                } else if (isSelected) {
                  cls = 'border-red-400';
                  bgCls = 'bg-red-50';
                }
              } else if (submitted) {
                if (isSelected) {
                  cls = isCorrect ? 'border-[#10B981]' : 'border-red-400';
                  bgCls = isCorrect ? 'bg-[#10B981]/8' : 'bg-red-50';
                }
              } else if (isSelected) {
                cls = 'border-[#8B5CF6]';
                bgCls = 'bg-[#8B5CF6]/8';
              }

              return (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 p-3 border-2 rounded-xl transition-all ${cls} ${bgCls} ${submitted && (isCorrect || attempts >= 3) ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <input
                    type="radio"
                    name="questioning"
                    value={option.id}
                    checked={isSelected}
                    onChange={() => !submitted && setSelectedReason(option.id)}
                    disabled={submitted}
                    className="mt-0.5 accent-[#8B5CF6]"
                  />
                  <span className="flex-1 text-[13px] font-medium text-[#395886] leading-relaxed">{option.text}</span>
                  {showExplanation && isThisCorrect && (
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  )}
                </label>
              );
            })}
          </div>

          {submitted && selectedFeedback && (
            <div className={`mb-6 p-4 rounded-xl border-2 ${
              isCorrect 
                ? 'bg-[#10B981]/10 border-[#10B981]/20' 
                : attempts < 3 
                ? 'bg-red-50 border-red-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                ) : attempts < 3 ? (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-[13px] font-bold mb-0.5 ${isCorrect ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                    {isCorrect ? 'Analisis Tepat!' : attempts < 3 ? 'Analisis Kurang Tepat' : 'Kunci Analisis'}
                  </p>
                  <p className={`text-[13px] font-bold ${isCorrect ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                    {selectedFeedback}
                  </p>
                  {!isCorrect && attempts < 3 && (
                    <button
                      onClick={handleRetry}
                      className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Coba Analisis Lagi
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {(!submitted || (attempts < 3 && !isCorrect)) ? (
            <button
              onClick={handleSubmit}
              disabled={selectedReason === null}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                selectedReason !== null
                  ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
                  : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
              }`}
            >
              Kirim Jawaban
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full py-3 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isCorrect ? 'Lanjutkan' : 'Selesai & Lanjut'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
