import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, MonitorPlay, User, Info, ArrowRight, AlertCircle, RotateCcw } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';

interface ModelingStep {
  id: string;
  type: 'example' | 'practice';
  title: string;
  content: string;
  interactiveAction?: string;
}

interface ModelingStageProps {
  modelingSteps?: ModelingStep[];
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: any) => void;
}

export function ModelingStage({ modelingSteps, lessonId, stageIndex, onComplete }: ModelingStageProps) {
  const user = getCurrentUser();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [practiceDone, setPracticeDone] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then((p) => {
      setAttempts(p.stageAttempts[`stage_${stageIndex}`] || 0);
    });
  }, []);

  const steps = modelingSteps ?? [];
  const currentStep = steps[currentIdx];

  const handleNext = () => {
    const newCompleted = new Set(completedSteps).add(currentStep.id);
    if (currentIdx < steps.length - 1) {
      setCompletedSteps(newCompleted);
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete({ completedSteps: Array.from(newCompleted), practiceDone });
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const handlePracticeAction = async () => {
    await saveStageAttempt(user!.id, lessonId, stageIndex, true);
    setPracticeDone(prev => ({ ...prev, [currentStep.id]: true }));
  };

  if (steps.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Dialog Guru / Fasilitator */}
      <div className="bg-white rounded-3xl border-2 border-[#EC4899]/20 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-[#EC4899] to-[#DB2777] flex items-center justify-center text-white shadow-lg ring-4 ring-[#EC4899]/10">
          <User className="w-10 h-10" strokeWidth={2.5} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-between gap-4 mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#EC4899]">Peragaan Media (Fasilitator)</p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC4899]/5 border border-[#EC4899]/20">
              <MonitorPlay className="w-3.5 h-3.5 text-[#EC4899]" />
              <span className="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider">Mode Peragaan</span>
            </div>
          </div>
          <p className="text-sm font-bold text-[#395886] leading-relaxed italic">
            "{currentStep.type === 'example' 
              ? 'Perhatikan contoh peragaan berikut ini. Ikuti alur logikanya sebelum kamu mencoba sendiri.' 
              : 'Sekarang giliranmu! Cobalah instruksi di bawah untuk mempraktikkan materi yang sudah kita pelajari.'}"
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-[#D5DEEF] shadow-sm overflow-hidden">
        {/* Indikator Langkah */}
        <div className="px-8 py-4 bg-gray-50 border-b border-[#D5DEEF] flex items-center justify-between overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    i === currentIdx ? 'w-8 bg-[#EC4899]' : i < currentIdx ? 'w-2.5 bg-[#10B981]' : 'w-2.5 bg-[#D5DEEF]'
                  }`} 
                />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-[#395886]/40 uppercase tracking-widest ml-4 whitespace-nowrap">
            Langkah {currentIdx + 1} dari {steps.length}
          </span>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Konten Kiri */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${currentStep.type === 'example' ? 'bg-[#628ECB]/10 text-[#628ECB]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
                  {currentStep.type === 'example' ? <MonitorPlay className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${currentStep.type === 'example' ? 'text-[#628ECB]' : 'text-[#10B981]'}`}>
                    {currentStep.type === 'example' ? 'Mode Peragaan' : 'Mode Praktik'}
                  </p>
                  <h3 className="text-lg font-bold text-[#395886]">{currentStep.title}</h3>
                </div>
              </div>

              <div className="bg-[#F8FAFF] rounded-2xl p-6 border border-[#D5DEEF]">
                <p className="text-sm text-[#395886]/80 leading-relaxed font-medium">
                  {currentStep.content}
                </p>
              </div>
            </div>

            {/* Area Interaktif Kanan */}
            <div className="bg-gray-900 rounded-3xl p-6 min-h-[300px] flex flex-col shadow-2xl relative border-4 border-gray-800">
              <div className="absolute top-4 left-6 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              
              <div className="mt-8 flex-1 flex flex-col items-center justify-center text-center p-4">
                {currentStep.interactiveAction ? (
                  <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <Info className="w-3.5 h-3.5" /> Instruksi Simulasi
                      </p>
                      <p className="text-sm text-gray-300 font-medium leading-relaxed">
                        {currentStep.interactiveAction}
                      </p>
                    </div>

                    {!practiceDone[currentStep.id] ? (
                      <button
                        onClick={handlePracticeAction}
                        className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white font-black text-sm shadow-xl shadow-[#EC4899]/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Lakukan Aksi Simulasi
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#10B981]">
                        <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center animate-bounce">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest">Simulasi Berhasil!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <MonitorPlay className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Contoh Visual Statis</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                <span>Simulation Sandbox v1.0</span>
                <span className={practiceDone[currentStep.id] ? 'text-green-500' : 'text-yellow-500'}>
                  {practiceDone[currentStep.id] ? 'System OK' : 'Waiting Input...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kaki Navigasi */}
        <div className="px-8 py-6 bg-gray-50 border-t border-[#D5DEEF] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              currentIdx > 0 ? 'bg-white border-2 border-[#D5DEEF] text-[#395886] hover:bg-gray-50 shadow-sm' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep.type === 'practice' && !practiceDone[currentStep.id]}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
              currentStep.type === 'practice' && !practiceDone[currentStep.id]
                ? 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed shadow-none'
                : 'bg-[#628ECB] text-white hover:bg-[#395886] shadow-[#628ECB]/20'
            }`}
          >
            {currentIdx === steps.length - 1 ? 'Selesaikan Peragaan' : 'Langkah Berikutnya'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
