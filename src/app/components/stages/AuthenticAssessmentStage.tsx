import { useState } from 'react';
import { ChevronRight, CheckCircle, XCircle, AlertCircle, Trophy, RotateCcw, User, Info, ArrowRight } from 'lucide-react';

interface FollowUpChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface BranchChoice {
  id: string;
  text: string;
  isOptimal: boolean;
  consequence: string;
  followUpQuestion?: string;
  followUpChoices?: FollowUpChoice[];
}

interface BranchingScenario {
  context: string;
  initialQuestion: string;
  choices: BranchChoice[];
  finalEvaluation: string;
}

interface AuthenticAssessmentStageProps {
  branchingScenario?: BranchingScenario;
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: any) => void;
}

export function AuthenticAssessmentStage({
  branchingScenario,
  lessonId,
  stageIndex,
  onComplete,
}: AuthenticAssessmentStageProps) {
  const [initialChoice, setInitialChoice] = useState<string | null>(null);
  const [initialSubmitted, setInitialSubmitted] = useState(false);
  const [followUpChoice, setFollowUpChoice] = useState<string | null>(null);
  const [followUpSubmitted, setFollowUpSubmitted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const scenario = branchingScenario;
  if (!scenario) return null;

  const selectedBranch = scenario.choices.find((c) => c.id === initialChoice);
  const followUpChoices = selectedBranch?.followUpChoices ?? [];
  const selectedFollowUp = followUpChoices.find((c) => c.id === followUpChoice);

  const handleComplete = () => {
    setIsDone(true);
    onComplete({
      initialChoice,
      followUpChoice,
      isOptimal: selectedBranch?.isOptimal
    });
  };

  const handleReset = () => {
    setInitialChoice(null);
    setInitialSubmitted(false);
    setFollowUpChoice(null);
    setFollowUpSubmitted(false);
    setIsDone(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Kepala Guru/Fasilitator */}
      <div className="bg-white rounded-3xl border-2 border-[#8B5CF6]/20 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-lg ring-4 ring-[#8B5CF6]/10">
          <User className="w-10 h-10" strokeWidth={2.5} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5CF6] mb-1">Analisis Kasus (Fasilitator)</p>
          <p className="text-sm font-bold text-[#395886] leading-relaxed italic">
            "Ini adalah tantangan terakhir! Gunakan seluruh pemahamanmu untuk memecahkan situasi nyata berikut. Ambil keputusan dengan bijak."
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Kiri: Konteks */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-[#D5DEEF] shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-[#D5DEEF] flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-bold text-[#395886]">Konteks Situasi</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#395886]/80 leading-relaxed font-medium">
                {scenario.context}
              </p>
            </div>
          </div>

          {initialSubmitted && (
            <div className={`p-6 rounded-[2rem] border-2 animate-in slide-in-from-left duration-500 ${selectedBranch?.isOptimal ? 'bg-[#F0FDF4] border-[#10B981]/20' : 'bg-[#FFFBEB] border-[#F59E0B]/20'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${selectedBranch?.isOptimal ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}>
                  {selectedBranch?.isOptimal ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <p className={`text-xs font-black uppercase tracking-widest ${selectedBranch?.isOptimal ? 'text-[#065F46]' : 'text-[#92400E]'}`}>
                  Konsekuensi Keputusan
                </p>
              </div>
              <p className={`text-sm font-bold leading-relaxed ${selectedBranch?.isOptimal ? 'text-[#065F46]' : 'text-[#92400E]'}`}>
                {selectedBranch?.consequence}
              </p>
            </div>
          )}
        </div>

        {/* Kanan: Keputusan Interaktif */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-[#D5DEEF] shadow-sm p-6">
            <p className="text-sm font-bold text-[#395886] mb-4">{scenario.initialQuestion}</p>
            
            <div className="space-y-3 mb-6">
              {scenario.choices.map((choice) => (
                <button
                  key={choice.id}
                  disabled={initialSubmitted}
                  onClick={() => setInitialChoice(choice.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-xs font-bold ${
                    initialChoice === choice.id
                      ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-md'
                      : 'bg-white border-[#D5DEEF] text-[#395886]/70 hover:border-[#8B5CF6]/40'
                  } ${initialSubmitted && initialChoice !== choice.id ? 'opacity-40 grayscale' : ''}`}
                >
                  {choice.text}
                </button>
              ))}
            </div>

            {!initialSubmitted && (
              <button
                onClick={() => setInitialSubmitted(true)}
                disabled={!initialChoice}
                className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
                  initialChoice ? 'bg-[#8B5CF6] text-white shadow-lg' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
                }`}
              >
                Ambil Keputusan
              </button>
            )}

            {/* Tindak lanjut jika ada */}
            {initialSubmitted && selectedBranch?.followUpQuestion && (
              <div className="mt-8 pt-8 border-t border-[#D5DEEF] animate-in fade-in duration-700">
                <p className="text-sm font-bold text-[#395886] mb-4">{selectedBranch.followUpQuestion}</p>
                <div className="space-y-3 mb-6">
                  {followUpChoices.map((f) => (
                    <button
                      key={f.id}
                      disabled={followUpSubmitted}
                      onClick={() => setFollowUpChoice(f.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-xs font-bold ${
                        followUpChoice === f.id
                          ? 'bg-[#628ECB] border-[#628ECB] text-white shadow-md'
                          : 'bg-white border-[#D5DEEF] text-[#395886]/70 hover:border-[#628ECB]/40'
                      } ${followUpSubmitted && followUpChoice !== f.id ? 'opacity-40' : ''}`}
                    >
                      {f.text}
                    </button>
                  ))}
                </div>
                {!followUpSubmitted && (
                  <button
                    onClick={() => setFollowUpSubmitted(true)}
                    disabled={!followUpChoice}
                    className={`w-full py-3 rounded-xl font-black text-sm bg-[#628ECB] text-white shadow-lg disabled:opacity-50`}
                  >
                    Konfirmasi Analisis Lanjutan
                  </button>
                )}
              </div>
            )}

            {/* Aksi Akhir */}
            {(initialSubmitted && (!selectedBranch?.followUpQuestion || followUpSubmitted)) && (
              <div className="mt-8 bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-[#D5DEEF] text-center animate-in zoom-in duration-500">
                <Trophy className="w-10 h-10 text-[#F59E0B] mx-auto mb-3" />
                <h4 className="text-sm font-black text-[#395886] mb-2 uppercase tracking-widest">Analisis Selesai</h4>
                <p className="text-xs font-medium text-[#395886]/70 mb-6 leading-relaxed">
                  {scenario.finalEvaluation}
                </p>
                
                {!isDone ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3 rounded-xl border-2 border-[#D5DEEF] text-[#395886] font-bold text-xs hover:bg-white transition-all"
                    >
                      <RotateCcw className="w-4 h-4 mx-auto mb-1" />
                      Coba Jalur Lain
                    </button>
                    <button
                      onClick={handleComplete}
                      className="flex-[2] py-3 rounded-xl bg-[#10B981] text-white font-black text-sm shadow-lg hover:bg-[#059669] transition-all flex items-center justify-center gap-2"
                    >
                      Selesaikan Penilaian <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#10B981] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Penilaian Berhasil Disimpan
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
