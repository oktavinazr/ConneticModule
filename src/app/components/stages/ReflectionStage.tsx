import { useState } from 'react';
import { ChevronRight, Lightbulb, Star, User, Info, CheckCircle, Map, ArrowRight, XCircle } from 'lucide-react';

interface SelfEvalCriterion { id: string; label: string }

interface EssayReflection {
  materialSummaryPrompt: string;
  easyPartPrompt: string;
  hardPartPrompt: string;
}

interface ConceptMapNode {
  id: string;
  label: string;
  description?: string;
  colorClass?: string;
}

interface ConceptMapConnection {
  from: string;
  to: string;
  label: string;
  options: string[];
}

interface ReflectionStageProps {
  essayReflection?: EssayReflection;
  selfEvaluationCriteria?: SelfEvalCriterion[];
  conceptMapNodes?: ConceptMapNode[];
  conceptMapConnections?: ConceptMapConnection[];
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: {
    essays: Record<string, string>;
    selfEvaluation: Record<string, number>;
  }) => void;
  isCompleted?: boolean;
}

const RATING_LABELS = ['Belum paham', 'Cukup paham', 'Paham', 'Sangat paham'];
const RATING_COLORS = [
  'border-red-300 bg-red-50 text-red-700',
  'border-[#F59E0B] bg-[#F59E0B]/8 text-[#92400E]',
  'border-[#628ECB] bg-[#628ECB]/8 text-[#395886]',
  'border-[#10B981] bg-[#10B981]/8 text-[#065F46]',
];

const NODE_COLORS: Record<string, string> = {
  blue: 'bg-[#EBF2FF] border-[#628ECB] text-[#395886]',
  green: 'bg-[#ECFDF5] border-[#10B981] text-[#065F46]',
  purple: 'bg-[#F5F3FF] border-[#8B5CF6] text-[#5B21B6]',
  amber: 'bg-[#FFFBEB] border-[#F59E0B] text-[#92400E]',
  pink: 'bg-[#FFF1F2] border-[#EC4899] text-[#9D174D]',
  indigo: 'bg-[#EEF2FF] border-[#6366F1] text-[#3730A3]',
};

type Phase = 'conceptmap' | 'essay';

// ── Concept Map Builder ─────────────────────────────────────────────────────

function ConceptMapPhase({
  nodes,
  connections,
  onDone,
}: {
  nodes: ConceptMapNode[];
  connections: ConceptMapConnection[];
  onDone: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const allAnswered = connections.every((_, i) => answers[i] !== undefined);

  const correctCount = connections.filter((c, i) => answers[i] === c.label).length;

  const handleCheck = () => {
    if (!allAnswered) return;
    setChecked(true);
  };

  if (showSummary) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Summary header */}
        <div className="bg-white rounded-3xl border-2 border-[#10B981]/20 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/10">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">Peta Konsep Selesai</p>
              <p className="text-sm font-bold text-[#395886]">Kamu berhasil menghubungkan {correctCount} dari {connections.length} relasi dengan benar!</p>
            </div>
          </div>
        </div>

        {/* Visual summary */}
        <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6">
          <h3 className="text-sm font-black text-[#395886] mb-5 flex items-center gap-2">
            <Map className="w-4 h-4 text-[#628ECB]" />
            Ringkasan Peta Konsep TCP
          </h3>
          <div className="space-y-3">
            {connections.map((c, i) => {
              const fromNode = nodeMap[c.from];
              const toNode = nodeMap[c.to];
              const isCorrect = answers[i] === c.label;
              return (
                <div key={i} className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold ${NODE_COLORS[fromNode?.colorClass ?? 'blue'] ?? NODE_COLORS.blue}`}>
                    {fromNode?.label}
                  </span>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${isCorrect ? 'bg-[#ECFDF5] border-[#10B981]/30 text-[#065F46]' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    <ArrowRight className="w-3 h-3" />
                    {c.label}
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold ${NODE_COLORS[toNode?.colorClass ?? 'blue'] ?? NODE_COLORS.blue}`}>
                    {toNode?.label}
                  </span>
                  {isCorrect
                    ? <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full py-4 rounded-2xl bg-[#F59E0B] text-white font-black text-sm hover:bg-[#D97706] shadow-lg shadow-[#F59E0B]/20 transition-all flex items-center justify-center gap-2"
        >
          Lanjut ke Jurnal Refleksi <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border-2 border-[#F59E0B]/20 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white shadow-lg ring-4 ring-[#F59E0B]/10">
          <Map className="w-10 h-10" strokeWidth={2} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-1">X.TCP.9 — Concept Map Builder</p>
          <p className="text-sm font-bold text-[#395886] leading-relaxed italic">
            "Pilih kata penghubung yang TEPAT untuk setiap relasi antar konsep TCP. Peta konsep ini membantu kamu menyusun pemahaman holistik tentang TCP dari encapsulation hingga decapsulation."
          </p>
        </div>
      </div>

      {/* Node legend */}
      <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#395886]/60 mb-4">Konsep-Konsep Utama TCP</h3>
        <div className="flex flex-wrap gap-2">
          {nodes.map((n) => (
            <div
              key={n.id}
              title={n.description}
              className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold cursor-help ${NODE_COLORS[n.colorClass ?? 'blue'] ?? NODE_COLORS.blue}`}
            >
              {n.label}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] font-medium text-[#395886]/40">Arahkan kursor ke konsep untuk melihat deskripsinya.</p>
      </div>

      {/* Connection rows */}
      <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#628ECB]/10">
            <ArrowRight className="w-4 h-4 text-[#628ECB]" />
          </div>
          <h3 className="text-sm font-bold text-[#395886]">Lengkapi Relasi Antar Konsep</h3>
        </div>

        <div className="space-y-6">
          {connections.map((c, i) => {
            const fromNode = nodeMap[c.from];
            const toNode = nodeMap[c.to];
            const selected = answers[i];
            const isCorrect = checked && selected === c.label;
            const isWrong = checked && selected !== c.label;

            return (
              <div key={i} className={`rounded-2xl border-2 p-4 transition-all ${
                isCorrect ? 'border-[#10B981]/40 bg-[#ECFDF5]' :
                isWrong ? 'border-red-200 bg-red-50' :
                'border-[#D5DEEF] bg-[#F8FAFF]'
              }`}>
                {/* Node pair */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold ${NODE_COLORS[fromNode?.colorClass ?? 'blue'] ?? NODE_COLORS.blue}`}>
                    {fromNode?.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#395886]/30" />
                  <span className="text-xs font-black text-[#395886]/50 italic">???</span>
                  <ArrowRight className="w-4 h-4 text-[#395886]/30" />
                  <span className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold ${NODE_COLORS[toNode?.colorClass ?? 'blue'] ?? NODE_COLORS.blue}`}>
                    {toNode?.label}
                  </span>
                  {isCorrect && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
                  {isWrong && <XCircle className="w-4 h-4 text-red-500" />}
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-2">
                  {c.options.map((opt) => {
                    const isSelected = selected === opt;
                    const isOptCorrect = checked && opt === c.label;
                    const isOptWrong = checked && isSelected && opt !== c.label;
                    return (
                      <button
                        key={opt}
                        onClick={() => !checked && setAnswers((prev) => ({ ...prev, [i]: opt }))}
                        disabled={checked}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                          isOptCorrect
                            ? 'border-[#10B981] bg-[#10B981] text-white'
                            : isOptWrong
                            ? 'border-red-400 bg-red-400 text-white'
                            : isSelected
                            ? 'border-[#628ECB] bg-[#628ECB] text-white'
                            : 'border-[#D5DEEF] bg-white text-[#395886] hover:border-[#628ECB]/50'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation when wrong */}
                {isWrong && (
                  <div className="mt-3 flex items-start gap-2 bg-white rounded-xl border border-red-200 p-3">
                    <Info className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-red-700">
                      Jawaban benar: <span className="font-black">"{c.label}"</span>
                      {fromNode && toNode && ` — ${fromNode.label} ${c.label} ${toNode.label}.`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!checked ? (
        <button
          onClick={handleCheck}
          disabled={!allAnswered}
          className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-[0.98] ${
            allAnswered
              ? 'bg-[#628ECB] text-white hover:bg-[#395886] shadow-[#628ECB]/20'
              : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
          }`}
        >
          {allAnswered ? 'Periksa Peta Konsep' : `Pilih semua kata penghubung (${Object.keys(answers).length}/${connections.length})`}
        </button>
      ) : (
        <button
          onClick={() => setShowSummary(true)}
          className="w-full py-4 rounded-2xl bg-[#F59E0B] text-white font-black text-sm hover:bg-[#D97706] shadow-lg shadow-[#F59E0B]/20 transition-all flex items-center justify-center gap-2"
        >
          Lihat Peta Konsep Lengkap <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

// ── Essay + Self-Eval ───────────────────────────────────────────────────────

function EssayPhase({
  essayReflection,
  selfEvaluationCriteria,
  onComplete,
}: {
  essayReflection?: EssayReflection;
  selfEvaluationCriteria?: SelfEvalCriterion[];
  onComplete: (answer: { essays: Record<string, string>; selfEvaluation: Record<string, number> }) => void;
}) {
  const [essays, setEssays] = useState<Record<string, string>>({ summary: '', easy: '', hard: '' });
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
    if (!allEssaysValid) { setError('Lengkapi semua isian refleksi dengan penjelasan yang memadai.'); return; }
    if (!allEvaluated) { setError('Nilai semua kriteria kompetensi diri.'); return; }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Fasilitator bubble */}
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
        {/* Essay area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F59E0B]/10">
                <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <h3 className="text-sm font-bold text-[#395886]">Jurnal Refleksi Siswa</h3>
            </div>

            <div className="space-y-6">
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

        {/* Self eval */}
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
        <div className="bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold px-6 py-3 rounded-2xl text-center">
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
          onClick={() => onComplete({ essays, selfEvaluation: selfEval })}
          className="w-full py-4 rounded-2xl bg-[#628ECB] text-white font-black text-sm hover:bg-[#395886] shadow-lg shadow-[#628ECB]/20 transition-all flex items-center justify-center gap-2"
        >
          Selesaikan Tahap Refleksi <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

// ── Root component ──────────────────────────────────────────────────────────

export function ReflectionStage(props: ReflectionStageProps) {
  const {
    essayReflection,
    selfEvaluationCriteria,
    conceptMapNodes,
    conceptMapConnections,
    onComplete,
    isCompleted,
  } = props;
  
  const hasConceptMap = !!(conceptMapNodes && conceptMapConnections && conceptMapConnections.length > 0);
  const [phase, setPhase] = useState<Phase>(hasConceptMap ? 'conceptmap' : 'essay');

  const SkipButton = ({ targetPhase, nextLabel }: { targetPhase?: 'essay' | 'complete', nextLabel: string }) => {
    if (!isCompleted) return null;
    return (
      <div className="flex justify-center my-6">
        <button
          onClick={() => {
            if (targetPhase === 'complete') onComplete({ essays: {}, selfEvaluation: {} });
            else if (targetPhase) setPhase(targetPhase);
          }}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#10B981] text-white font-black text-sm hover:bg-[#059669] transition-all shadow-xl shadow-[#10B981]/20 active:scale-95"
        >
          {nextLabel} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (phase === 'conceptmap' && hasConceptMap) {
    return (
      <div className="space-y-4">
        <ConceptMapPhase
          nodes={conceptMapNodes!}
          connections={conceptMapConnections!}
          onDone={() => setPhase('essay')}
        />
        <SkipButton targetPhase="essay" nextLabel="Lanjut ke Jurnal Refleksi" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EssayPhase
        essayReflection={essayReflection}
        selfEvaluationCriteria={selfEvaluationCriteria}
        onComplete={onComplete}
      />
      <SkipButton targetPhase="complete" nextLabel="Selesaikan Tahap Ini" />
    </div>
  );
}
