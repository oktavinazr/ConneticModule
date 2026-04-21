import { useState } from 'react';
import { ChevronRight, Lightbulb, Star, User, Info, CheckCircle } from 'lucide-react';

interface SelfEvalCriterion { id: string; label: string }

interface EssayReflection {
  materialSummaryPrompt: string;
  easyPartPrompt: string;
  hardPartPrompt: string;
}

interface ReflectionStageProps {
  essayReflection?: EssayReflection;
  selfEvaluationCriteria?: SelfEvalCriterion[];
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: {
    essays: Record<string, string>;
    selfEvaluation: Record<string, number>;
  }) => void;
}

const RATING_LABELS = ['Belum paham', 'Cukup paham', 'Paham', 'Sangat paham'];
const RATING_COLORS = [
  'border-red-300 bg-red-50 text-red-700',
  'border-[#F59E0B] bg-[#F59E0B]/8 text-[#92400E]',
  'border-[#628ECB] bg-[#628ECB]/8 text-[#395886]',
  'border-[#10B981] bg-[#10B981]/8 text-[#065F46]',
];

export function ReflectionStage({
  essayReflection,
  selfEvaluationCriteria,
  lessonId,
  stageIndex,
  onComplete,
}: ReflectionStageProps) {
  const [essays, setEssays] = useState<Record<string, string>>({
    summary: '',
    easy: '',
    hard: '',
  });
  const [selfEval, setSelfEval] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const criteria = selfEvaluationCriteria ?? [];
  const prompts = essayReflection ?? {
    materialSummaryPrompt: 'Jelaskan kembali apa yang telah kamu pelajari hari ini dengan bahasamu sendiri!',
    easyPartPrompt: 'Bagian mana dari materi yang menurutmu paling mudah dipahami? Mengapa?',
    hardPartPrompt: 'Bagian mana yang menurutmu paling sulit atau masih membingungkan?',
  };

  const allEssaysValid = essays.summary.length >= 30 && essays.easy.length >= 10 && essays.hard.length >= 10;
  const allEvaluated = criteria.length === 0 || criteria.every((c) => selfEval[c.id] !== undefined);

  const handleSubmit = () => {
    if (!allEssaysValid) {
      setError('Lengkapi semua isian refleksi dengan penjelasan yang memadai.');
      return;
    }
    if (!allEvaluated) {
      setError('Nilai semua kriteria kompetensi diri.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleContinue = () => {
    onComplete({ essays, selfEvaluation: selfEval });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Kepala Guru/Fasilitator */}
      <div className="bg-white rounded-3xl border-2 border-[#F59E0B]/20 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white shadow-lg ring-4 ring-[#F59E0B]/10">
          <User className="w-10 h-10" strokeWidth={2.5} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-1">Refleksi Akhir (Fasilitator)</p>
          <p className="text-sm font-bold text-[#395886] leading-relaxed italic">
            "Selamat! Kamu telah menyelesaikan seluruh rangkaian aktivitas CTL. Sekarang saatnya berhenti sejenak untuk merenungkan apa yang sudah kamu dapatkan."
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Bagian Esai */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F59E0B]/10">
                <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <h3 className="text-sm font-bold text-[#395886]">Jurnal Refleksi Siswa</h3>
            </div>

            <div className="space-y-6">
              {/* Ringkasan */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#395886]/60 mb-2">
                  {prompts.materialSummaryPrompt}
                </label>
                <textarea
                  value={essays.summary}
                  onChange={(e) => setEssays(prev => ({ ...prev, summary: e.target.value }))}
                  disabled={submitted}
                  rows={4}
                  className="w-full p-4 rounded-2xl border-2 border-[#D5DEEF] bg-[#F8FAFF] focus:bg-white focus:border-[#F59E0B] transition-all outline-none text-sm font-medium"
                  placeholder="Ringkasan pemahamanmu..."
                />
                <div className="mt-1 flex justify-end">
                  <span className={`text-[10px] font-bold ${essays.summary.length >= 30 ? 'text-[#10B981]' : 'text-[#395886]/40'}`}>
                    {essays.summary.length} / 30 karakter
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Mudah */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#10B981]/70 mb-2">
                    {prompts.easyPartPrompt}
                  </label>
                  <textarea
                    value={essays.easy}
                    onChange={(e) => setEssays(prev => ({ ...prev, easy: e.target.value }))}
                    disabled={submitted}
                    rows={3}
                    className="w-full p-4 rounded-2xl border-2 border-[#D5DEEF] bg-[#F8FAFF] focus:bg-white focus:border-[#10B981]/40 transition-all outline-none text-sm font-medium"
                    placeholder="Apa yang paling mudah?"
                  />
                </div>
                {/* Sulit */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-red-400 mb-2">
                    {prompts.hardPartPrompt}
                  </label>
                  <textarea
                    value={essays.hard}
                    onChange={(e) => setEssays(prev => ({ ...prev, hard: e.target.value }))}
                    disabled={submitted}
                    rows={3}
                    className="w-full p-4 rounded-2xl border-2 border-[#D5DEEF] bg-[#F8FAFF] focus:bg-white focus:border-red-300 transition-all outline-none text-sm font-medium"
                    placeholder="Apa yang paling sulit?"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Evaluasi Diri */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F59E0B]/10">
                <Star className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <h3 className="text-sm font-bold text-[#395886]">Penilaian Diri</h3>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl mb-6 flex items-start gap-3 border border-blue-100">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                Nilai pemahamanmu secara jujur untuk setiap kriteria berikut guna membantu perbaikan belajarmu.
              </p>
            </div>

            <div className="space-y-6">
              {criteria.map((c) => (
                <div key={c.id}>
                  <p className="text-xs font-bold text-[#395886] mb-3">{c.label}</p>
                  <div className="flex items-center justify-between gap-1">
                    {[1, 2, 3, 4].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => !submitted && setSelfEval(prev => ({ ...prev, [c.id]: rating }))}
                        disabled={submitted}
                        className={`flex-1 h-10 rounded-xl border-2 text-[10px] font-black transition-all ${
                          selfEval[c.id] === rating 
                            ? RATING_COLORS[rating - 1] 
                            : 'border-[#D5DEEF] bg-white text-[#395886]/30 hover:border-[#F59E0B]/40'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 flex justify-between px-1 text-[9px] font-black text-[#395886]/30 uppercase tracking-tighter">
                    <span>Kurang</span>
                    <span>Sangat Paham</span>
                  </div>
                </div>
              ))}
            </div>

            {submitted && (
              <div className="mt-8 bg-[#F0FDF4] p-4 rounded-2xl border border-[#10B981]/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#065F46]">Refleksi tersimpan dengan sukses!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold px-6 py-3 rounded-2xl text-center animate-shake">
          {error}
        </div>
      )}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-[#F59E0B] text-white font-black text-sm hover:bg-[#D97706] shadow-lg shadow-[#F59E0B]/20 transition-all active:scale-[0.98]"
        >
          Kirim Jurnal Refleksi
        </button>
      ) : (
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-[#628ECB] text-white font-black text-sm hover:bg-[#395886] shadow-lg shadow-[#628ECB]/20 transition-all flex items-center justify-center gap-2"
        >
          Lanjutkan ke Tahap Terakhir <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
