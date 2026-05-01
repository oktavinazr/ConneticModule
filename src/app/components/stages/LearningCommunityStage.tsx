import { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, CheckCircle, XCircle, Users, Link as LinkIcon, FileSearch,
  MessageSquare, Info, RotateCcw, AlertCircle, ThumbsUp, ArrowUpDown, GripVertical,
  ArrowDown, ArrowUp, Activity, Award, Eye,
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';
import { TcpIpInteractive } from '../ui/TcpIpInteractive';

// ── Types ──────────────────────────────────────────────────────────────────────

interface MatchingPair { left: string; right: string }
interface CaseOption { id: string; text: string; isCorrect: boolean; feedback: string }
interface CaseScenario { title: string; description: string; question: string; options?: CaseOption[] }
interface PeerAnswer { name: string; role: string; answer: string; score?: number }
interface PeerVotingMethod { id: string; title: string; description: string; votes?: number; pros: string; cons: string }
interface PeerVotingScenario { context: string; question: string; methods: PeerVotingMethod[]; correctMethodId: string }
interface PeerComment { name: string; avatar: string; comment: string; votedFor: string }
interface CaseComparisonProcess { id: string; step: string; correctOrder: number }
interface CaseComparisonData { title: string; process: CaseComparisonProcess[]; peerAnalyses: Array<{ name: string; analysis: string; isCorrect: boolean }> }
interface EncapsulationCaseData { title: string; process: CaseComparisonProcess[]; groupAnswers: Array<{ name: string; analysis: string; isCorrect: boolean }> }

interface LearningCommunityStageProps {
  matchingPairs?: MatchingPair[];
  caseScenario?: CaseScenario;
  peerAnswers?: PeerAnswer[];
  peerVotingScenario?: PeerVotingScenario;
  peerComments?: PeerComment[];
  caseComparisonData?: CaseComparisonData;
  encapsulationCaseData?: EncapsulationCaseData;
  lessonId: string;
  stageIndex: number;
  isCompleted?: boolean;
  onComplete: (answer: any) => void;
}

// ── Sortable Step Card (DnD) ──────────────────────────────────────────────────

const DRAG_CASE = 'CASE_STEP';

function SortableStepCard({
  step, index, moveItem, validated,
}: {
  step: CaseComparisonProcess;
  index: number;
  moveItem: (from: number, to: number) => void;
  validated: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isCorrect = validated && step.correctOrder === index + 1;
  const isWrong = validated && step.correctOrder !== index + 1;

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_CASE,
    item: () => ({ index }),
    canDrag: !validated,
    collect: (m) => ({ isDragging: m.isDragging() }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: DRAG_CASE,
    hover: (dragged: { index: number }) => {
      if (dragged.index === index) return;
      moveItem(dragged.index, index);
      dragged.index = index;
    },
    collect: (m) => ({ isOver: m.isOver() }),
  });

  drag(drop(ref));

  let cardCls = 'border-[#D5DEEF] bg-white';
  if (isOver && !validated) cardCls = 'border-[#F59E0B]/60 bg-[#F59E0B]/5 shadow-md';
  if (isCorrect) cardCls = 'border-[#10B981] bg-[#10B981]/8';
  if (isWrong) cardCls = 'border-red-400 bg-red-50';

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all select-none ${cardCls} ${isDragging ? 'opacity-30 scale-[0.98]' : ''} ${!validated ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${isCorrect ? 'bg-[#10B981] text-white' : isWrong ? 'bg-red-400 text-white' : 'bg-[#D5DEEF] text-[#395886]/60'}`}>
        {index + 1}
      </div>
      {!validated && <GripVertical className="w-4 h-4 text-[#395886]/25 shrink-0" />}
      <p className="flex-1 text-sm text-[#395886] leading-relaxed">{step.step}</p>
      {isCorrect && <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />}
      {isWrong && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
    </div>
  );
}

// ── Group Answer Panel ─────────────────────────────────────────────────────────

function GroupAnswerPanel({
  groupAnswers, studentCorrect, onDone, nextLabel,
}: {
  groupAnswers: Array<{ name: string; analysis: string; isCorrect: boolean }>;
  studentCorrect: boolean;
  onDone: () => void;
  nextLabel: string;
}) {
  const rankingData = [
    ...groupAnswers.filter(g => g.isCorrect).map((g, i) => ({ ...g, rank: i + (studentCorrect ? 2 : 1) })),
    ...groupAnswers.filter(g => !g.isCorrect).map((g, i) => ({ ...g, rank: groupAnswers.filter(x => x.isCorrect).length + (studentCorrect ? 2 : 1) + i })),
  ];
  if (studentCorrect) rankingData.unshift({ name: 'Kamu', analysis: 'Jawaban kamu benar!', isCorrect: true, rank: 1 });

  return (
    <div className="bg-white rounded-2xl border-2 border-[#F59E0B]/20 shadow-sm p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10">
          <Users className="w-5 h-5 text-[#F59E0B]" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">Group Answer Panel</p>
          <h3 className="text-sm font-bold text-[#395886]">Perbandingan Jawaban Kelompok</h3>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#F0FDF4] border border-[#10B981]/20 p-3 rounded-xl flex items-start gap-2">
        <Info className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
        <p className="text-xs font-bold text-[#065F46]">
          Kamu dapat melihat jawaban anggota kelompok, tetapi tidak dapat mengubahnya. Gunakan perbandingan ini untuk memahami perbedaan pendekatan dan memperkuat pemahamanmu.
        </p>
      </div>

      {/* Student's own answer */}
      <div className={`p-4 rounded-xl border-2 ${studentCorrect ? 'border-[#628ECB] bg-[#628ECB]/5' : 'border-amber-300 bg-amber-50'}`}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[#628ECB] flex items-center justify-center text-[10px] font-black text-white">KM</div>
          <p className="text-xs font-black text-[#628ECB]">Jawaban Kamu</p>
          <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${studentCorrect ? 'bg-[#10B981] text-white' : 'bg-amber-400 text-white'}`}>
            {studentCorrect ? '✓ BENAR' : 'PERLU DITINJAU'}
          </span>
        </div>
        <p className="text-xs text-[#628ECB]/70 mt-1">{studentCorrect ? 'Urutan yang kamu susun sudah sesuai dengan alur yang benar.' : 'Lihat urutan yang benar dari teman kelompok yang mendapat ✓.'}</p>
      </div>

      {/* Group members */}
      <div className="space-y-3">
        {groupAnswers.map((member, i) => (
          <div key={i} className={`p-4 rounded-xl border-2 ${member.isCorrect ? 'border-[#10B981]/30 bg-[#10B981]/5' : 'border-red-200 bg-red-50/50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#628ECB] to-[#395886] flex items-center justify-center text-[10px] font-black text-white">
                {member.name.substring(0, 2).toUpperCase()}
              </div>
              <p className="text-xs font-black text-[#395886]">{member.name}</p>
              <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${member.isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-400 text-white'}`}>
                {member.isCorrect ? '✓ BENAR' : '✗ PERLU KOREKSI'}
              </span>
            </div>
            <p className="text-xs text-[#395886]/80 leading-relaxed italic">"{member.analysis}"</p>
          </div>
        ))}
      </div>

      {/* Argument Ranking Board */}
      <div className="bg-[#F8FAFF] rounded-xl border border-[#D5DEEF] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-[#628ECB]" />
          <p className="text-xs font-black text-[#395886]">Ranking Argumen — Berdasarkan Ketepatan</p>
        </div>
        <div className="space-y-2">
          {rankingData.slice(0, 5).map(item => (
            <div key={item.rank} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#D5DEEF]">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${item.rank <= 2 ? 'bg-[#10B981]' : item.rank <= 4 ? 'bg-amber-400' : 'bg-red-400'}`}>
                {item.rank}
              </span>
              <span className="text-xs font-bold text-[#395886]">{item.name}</span>
              <span className="text-[10px] text-[#395886]/50 hidden sm:block truncate">{item.analysis.slice(0, 50)}...</span>
              <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ${item.isCorrect ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-100 text-red-600'}`}>
                {item.isCorrect ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onDone} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all active:scale-95">
        {nextLabel} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── TCP/IP Visual Phase ────────────────────────────────────────────────────────

function TcpIpVisualPhase({ onComplete }: { onComplete: () => void }) {
  const [understood, setUnderstood] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl border-2 border-[#F59E0B]/20 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#F59E0B]/8 border-b border-[#F59E0B]/20">
          <Activity className="w-4 h-4 text-[#F59E0B]" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">Pengantar — Simulasi Interaktif</p>
            <h3 className="text-sm font-bold text-[#395886]">Visualisasi Proses TCP/IP U-Shape</h3>
          </div>
        </div>
        <div className="p-5 bg-gradient-to-br from-[#F59E0B]/5 to-transparent">
          <p className="text-sm text-[#395886]/80 leading-relaxed">
            Sebelum mengerjakan studi kasus, simak terlebih dahulu bagaimana proses <strong>encapsulation</strong> (pembungkusan data dari lapisan atas ke bawah) dan <strong>decapsulation</strong> (pembukaan data dari lapisan bawah ke atas) bekerja secara nyata. Klik <em>Mulai Simulasi</em> dan ikuti setiap langkahnya.
          </p>
        </div>
      </div>

      <TcpIpInteractive />

      <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${understood ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-[#D5DEEF] group-hover:border-[#F59E0B]/50'}`}
            onClick={() => setUnderstood(!understood)}
          >
            {understood && <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm font-medium text-[#395886] select-none" onClick={() => setUnderstood(!understood)}>
            Saya telah memahami visualisasi TCP/IP di atas dan siap mengerjakan studi kasus encapsulation.
          </span>
        </label>

        <button
          onClick={onComplete}
          disabled={!understood}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${understood ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-sm active:scale-95' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}
        >
          Lanjut ke Aktivitas X.TCP.6 — Studi Kasus Encapsulation <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Encapsulation Case Phase (X.TCP.6) ────────────────────────────────────────

function EncapsulationCasePhase({
  data, lessonId, stageIndex, onComplete,
}: { data: EncapsulationCaseData; lessonId: string; stageIndex: number; onComplete: (answer: any) => void }) {
  const user = getCurrentUser();
  const [ordered, setOrdered] = useState<CaseComparisonProcess[]>(() => {
    const arr = [...data.process];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showGroupPanel, setShowGroupPanel] = useState(false);

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then((p) => setAttempts(p.stageAttempts[`stage_${stageIndex}_encap`] || 0));
  }, []);

  const isCorrectOrder = ordered.every((p, i) => p.correctOrder === i + 1);

  const moveItem = (from: number, to: number) => {
    if (validated) return;
    const arr = [...ordered];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setOrdered(arr);
  };

  const handleValidate = async () => {
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, isCorrectOrder, `stage_${stageIndex}_encap`);
    setAttempts(newA);
    setValidated(true);
    if (isCorrectOrder || newA >= 3) setTimeout(() => setShowGroupPanel(true), 800);
  };

  const handleRetry = () => {
    setValidated(false);
    const arr = [...ordered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrdered(arr);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white rounded-2xl border-2 border-[#F59E0B]/20 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#F59E0B]/8 border-b border-[#F59E0B]/20">
            <ArrowDown className="w-4 h-4 text-[#F59E0B]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">Aktivitas 1 — Studi Kasus Encapsulation (X.TCP.6)</p>
              <h3 className="text-sm font-bold text-[#395886]">{data.title}</h3>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F59E0B]/20">
              <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[10px] font-bold text-[#F59E0B]">{attempts < 3 ? `${3 - attempts} percobaan` : 'Habis'}</span>
            </div>
          </div>
          <div className="px-5 py-4 bg-gradient-to-br from-[#F59E0B]/5 to-transparent space-y-3">
            <p className="text-sm text-[#395886]/80 leading-relaxed">
              <strong>Skenario:</strong> Alya akan mengirim email berisi lampiran tugas kepada temannya melalui internet. Susun urutan proses <strong>Encapsulation</strong> TCP/IP yang benar — dari lapisan atas (Application) ke lapisan bawah (Network Access). Seret kartu menggunakan ikon ≡.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5">
          <div className="space-y-2 mb-5">
            {ordered.map((step, idx) => (
              <SortableStepCard key={step.id} step={step} index={idx} moveItem={moveItem} validated={validated} />
            ))}
          </div>

          {validated && (
            <div className={`mb-5 p-4 rounded-xl border-2 ${isCorrectOrder ? 'bg-[#10B981]/8 border-[#10B981]/40' : attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-start gap-3">
                {isCorrectOrder
                  ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  : attempts < 3
                    ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    : <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-sm font-bold ${isCorrectOrder ? 'text-[#10B981]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                    {isCorrectOrder
                      ? 'Urutan encapsulation benar! Kamu memahami alur pembungkusan data dari Application ke Network Access.'
                      : attempts < 3
                        ? `Belum tepat. Punya ${3 - attempts} kesempatan lagi!`
                        : 'Urutan benar: Application → Transport → Internet → Network Access'}
                  </p>
                  {!isCorrectOrder && attempts < 3 && (
                    <button onClick={handleRetry} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
                      <RotateCcw className="w-3.5 h-3.5" /> Susun Ulang
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!validated ? (
            <button onClick={handleValidate} className="w-full py-2.5 rounded-xl bg-[#F59E0B] text-white font-bold text-sm hover:bg-[#D97706] shadow-sm transition-all active:scale-95">
              Periksa Urutan
            </button>
          ) : (isCorrectOrder || attempts >= 3) && !showGroupPanel ? (
            <button onClick={() => setShowGroupPanel(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all active:scale-95">
              <Users className="w-4 h-4" /> Lihat Jawaban Kelompok <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {showGroupPanel && (
          <GroupAnswerPanel
            groupAnswers={data.groupAnswers}
            studentCorrect={isCorrectOrder}
            onDone={() => onComplete({ orderedIds: ordered.map(s => s.id), correct: isCorrectOrder, groupSeen: true })}
            nextLabel="Lanjut ke Aktivitas X.TCP.7 — Studi Kasus Decapsulation"
          />
        )}
      </div>
    </DndProvider>
  );
}

// ── Decapsulation Case Phase (X.TCP.7) ────────────────────────────────────────

function DecapsulationCasePhase({
  data, lessonId, stageIndex, onComplete,
}: { data: CaseComparisonData; lessonId: string; stageIndex: number; onComplete: (answer: any) => void }) {
  const user = getCurrentUser();
  const [ordered, setOrdered] = useState<CaseComparisonProcess[]>(() => {
    const arr = [...data.process];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showAnalyses, setShowAnalyses] = useState(false);

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then((p) => setAttempts(p.stageAttempts[`stage_${stageIndex}_case`] || 0));
  }, []);

  const isCorrectOrder = ordered.every((p, i) => p.correctOrder === i + 1);

  const moveItem = (from: number, to: number) => {
    if (validated) return;
    const arr = [...ordered];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setOrdered(arr);
  };

  const handleValidate = async () => {
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, isCorrectOrder, `stage_${stageIndex}_case`);
    setAttempts(newA);
    setValidated(true);
    if (isCorrectOrder || newA >= 3) setTimeout(() => setShowAnalyses(true), 800);
  };

  const handleRetry = () => {
    setValidated(false);
    const arr = [...ordered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrdered(arr);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white rounded-2xl border-2 border-[#F59E0B]/20 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#F59E0B]/8 border-b border-[#F59E0B]/20">
            <ArrowUp className="w-4 h-4 text-[#F59E0B]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">Aktivitas 2 — Studi Kasus Decapsulation (X.TCP.7)</p>
              <h3 className="text-sm font-bold text-[#395886]">{data.title}</h3>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F59E0B]/20">
              <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[10px] font-bold text-[#F59E0B]">{attempts < 3 ? `${3 - attempts} percobaan` : 'Habis'}</span>
            </div>
          </div>
          <div className="px-5 py-4 bg-gradient-to-br from-[#F59E0B]/5 to-transparent">
            <p className="text-sm text-[#395886]/80 leading-relaxed">
              <strong>Skenario:</strong> PC B menerima sinyal dari jaringan. Susun urutan proses <strong>Decapsulation</strong> TCP/IP yang benar — dari lapisan bawah (Network Access) ke lapisan atas (Application). Seret kartu menggunakan ikon ≡.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5">
          <div className="space-y-2 mb-5">
            {ordered.map((step, idx) => (
              <SortableStepCard key={step.id} step={step} index={idx} moveItem={moveItem} validated={validated} />
            ))}
          </div>

          {validated && (
            <div className={`mb-5 p-4 rounded-xl border-2 ${isCorrectOrder ? 'bg-[#10B981]/8 border-[#10B981]/40' : attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-start gap-3">
                {isCorrectOrder
                  ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  : attempts < 3
                    ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    : <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-sm font-bold ${isCorrectOrder ? 'text-[#10B981]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                    {isCorrectOrder
                      ? 'Urutan decapsulation benar! Kamu memahami alur TCP/IP dengan baik.'
                      : attempts < 3
                        ? `Belum tepat. Punya ${3 - attempts} kesempatan lagi!`
                        : 'Urutan benar: Network Access → Internet → Transport → Application'}
                  </p>
                  {!isCorrectOrder && attempts < 3 && (
                    <button onClick={handleRetry} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
                      <RotateCcw className="w-3.5 h-3.5" /> Susun Ulang
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!validated ? (
            <button onClick={handleValidate} className="w-full py-2.5 rounded-xl bg-[#F59E0B] text-white font-bold text-sm hover:bg-[#D97706] shadow-sm transition-all active:scale-95">
              Periksa Urutan
            </button>
          ) : (isCorrectOrder || attempts >= 3) && !showAnalyses ? (
            <button onClick={() => setShowAnalyses(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all active:scale-95">
              <Users className="w-4 h-4" /> Validasi Logika Teman <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {showAnalyses && (
          <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-sm font-bold text-[#395886]">Validasi Logika — Analisis Teman Kelompok</h3>
            </div>
            <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#10B981]/20 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-[#065F46]">Identifikasi mana analisis yang BENAR dan mana yang mengandung kesalahan logika. Ini membantu kamu memvalidasi pemahaman dari berbagai sudut pandang.</p>
            </div>
            <div className="space-y-3">
              {data.peerAnalyses.map((analysis, i) => (
                <div key={i} className={`p-4 rounded-xl border-2 ${analysis.isCorrect ? 'border-[#10B981]/30 bg-[#10B981]/5' : 'border-red-300 bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#628ECB] to-[#395886] flex items-center justify-center text-[10px] font-black text-white">
                      {analysis.name.substring(0, 2).toUpperCase()}
                    </div>
                    <p className="text-xs font-black text-[#395886]">{analysis.name}</p>
                    <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${analysis.isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'}`}>
                      {analysis.isCorrect ? '✓ LOGIKA BENAR' : '✗ ADA KESALAHAN'}
                    </span>
                  </div>
                  <p className="text-xs text-[#395886]/80 leading-relaxed italic">"{analysis.analysis}"</p>
                  {!analysis.isCorrect && (
                    <p className="mt-2 text-[11px] font-bold text-red-700">
                      💡 Kesalahan: Decapsulation berlangsung dari lapisan bawah ke atas (Network Access → Internet → Transport), bukan dari lapisan atas ke bawah.
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => onComplete({ orderedIds: ordered.map(s => s.id), correct: isCorrectOrder, analysesSeen: true })} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all active:scale-95">
              Selesaikan Tahap Learning Community <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

// ── Lesson 1 Learning Community ────────────────────────────────────────────────

function Lesson1LearningCommunity({
  encapsulationCaseData, caseComparisonData, lessonId, stageIndex, onComplete,
}: {
  encapsulationCaseData?: EncapsulationCaseData;
  caseComparisonData?: CaseComparisonData;
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: any) => void;
}) {
  const [phase, setPhase] = useState<'tcp-visual' | 'encapsulation' | 'decapsulation'>('tcp-visual');
  const [encapsulationAnswer, setEncapsulationAnswer] = useState<any>(null);

  if (phase === 'tcp-visual') {
    return (
      <TcpIpVisualPhase
        onComplete={() => { setPhase('encapsulation'); window.scrollTo(0, 0); }}
      />
    );
  }

  if (phase === 'encapsulation' && encapsulationCaseData) {
    return (
      <EncapsulationCasePhase
        data={encapsulationCaseData}
        lessonId={lessonId}
        stageIndex={stageIndex}
        onComplete={(answer) => {
          setEncapsulationAnswer(answer);
          setPhase('decapsulation');
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (phase === 'decapsulation' && caseComparisonData) {
    return (
      <DecapsulationCasePhase
        data={caseComparisonData}
        lessonId={lessonId}
        stageIndex={stageIndex}
        onComplete={(decapAnswer) => {
          onComplete({
            simulationViewed: true,
            encapsulation: encapsulationAnswer,
            decapsulation: decapAnswer,
          });
        }}
      />
    );
  }

  return null;
}

// ── Peer Voting Phase (for non-lesson-1) ──────────────────────────────────────

function PeerVotingPhase({
  scenario, peerComments, lessonId, stageIndex, onComplete,
}: { scenario: PeerVotingScenario; peerComments?: PeerComment[]; lessonId: string; stageIndex: number; onComplete: () => void }) {
  const user = getCurrentUser();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [comment, setComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [showPeers, setShowPeers] = useState(false);

  const isCorrect = selectedMethod === scenario.correctMethodId;

  const handleVote = async () => {
    if (!selectedMethod) return;
    await saveStageAttempt(user!.id, lessonId, stageIndex, isCorrect);
    setVoted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl border-2 border-[#F59E0B]/20 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#F59E0B]/8 border-b border-[#F59E0B]/20">
          <Users className="w-4 h-4 text-[#F59E0B]" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">Aktivitas 1 — Peer Voting</p>
            <h3 className="text-sm font-bold text-[#395886]">Pilih Metode Komunikasi Terbaik</h3>
          </div>
        </div>
        <div className="p-5 bg-gradient-to-br from-[#F59E0B]/5 to-transparent">
          <p className="text-sm text-[#395886]/80 leading-relaxed">{scenario.context}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5">
        <p className="text-sm font-bold text-[#395886] mb-4 leading-relaxed">{scenario.question}</p>
        <div className="space-y-3 mb-5">
          {scenario.methods.map(method => {
            const isSelected = selectedMethod === method.id;
            const isThisCorrect = method.id === scenario.correctMethodId;
            let cls = 'border-[#D5DEEF] bg-white hover:border-[#F59E0B]/40';
            if (voted && isThisCorrect) cls = 'border-[#10B981] bg-[#10B981]/8';
            else if (voted && isSelected && !isThisCorrect) cls = 'border-red-400 bg-red-50';
            else if (isSelected) cls = 'border-[#F59E0B] bg-[#F59E0B]/8';
            return (
              <div key={method.id} onClick={() => !voted && setSelectedMethod(method.id)} className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${cls} ${voted ? 'cursor-default' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${isSelected ? 'border-[#F59E0B] bg-[#F59E0B]' : 'border-[#D5DEEF] bg-white'}`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-bold text-[#395886]">{method.title}</p>
                      {method.votes && <span className="text-[10px] font-black text-[#395886]/40 bg-gray-100 px-2 py-0.5 rounded-full">{method.votes} votes</span>}
                    </div>
                    <p className="text-xs text-[#395886]/70 leading-relaxed mb-2">{method.description}</p>
                    {voted && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="p-2 rounded-lg bg-[#10B981]/8 border border-[#10B981]/20">
                          <p className="text-[10px] font-black text-[#10B981] mb-1">✅ Kelebihan</p>
                          <p className="text-[11px] text-[#065F46]">{method.pros}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                          <p className="text-[10px] font-black text-red-600 mb-1">⚠️ Kekurangan</p>
                          <p className="text-[11px] text-red-700">{method.cons}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {voted && isThisCorrect && <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />}
                  {voted && isSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                </div>
              </div>
            );
          })}
        </div>

        {voted && (
          <div className={`mb-4 p-4 rounded-xl border-2 ${isCorrect ? 'bg-[#10B981]/8 border-[#10B981]/40' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {isCorrect ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" /> : <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              <p className={`text-sm font-bold ${isCorrect ? 'text-[#065F46]' : 'text-amber-800'}`}>
                {isCorrect ? 'Pilihan tepat! Full-Duplex dengan Managed Switch mengeliminasi collision domain per port.' : 'Pilihan kurang optimal. Lihat hijau (✅) untuk pilihan terbaik dan bandingkan kelebihan/kekurangannya.'}
              </p>
            </div>
          </div>
        )}

        {!voted ? (
          <button onClick={handleVote} disabled={!selectedMethod} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedMethod ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-sm' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
            <ThumbsUp className="w-4 h-4" /> Kirim Vote
          </button>
        ) : !showPeers ? (
          <button onClick={() => setShowPeers(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all">
            Lihat Pendapat Komunitas <ChevronRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {showPeers && (
        <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5 space-y-5">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-sm font-bold text-[#395886]">Pendapat Komunitas</h3>
          </div>
          <div className="space-y-3">
            {peerComments?.map((pc, i) => {
              const votedMethod = scenario.methods.find(m => m.id === pc.votedFor);
              return (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-[#F8FAFF] rounded-xl border border-[#D5DEEF]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#628ECB] to-[#395886] flex items-center justify-center text-[10px] font-black text-white shrink-0">{pc.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-black text-[#395886]">{pc.name}</p>
                      <span className="text-[9px] font-bold text-[#628ECB] bg-[#628ECB]/10 px-2 py-0.5 rounded-full">Pilih: {votedMethod?.title.split(' ')[0]}</span>
                    </div>
                    <p className="text-xs text-[#395886]/70 leading-relaxed italic">"{pc.comment}"</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <label className="block text-xs font-bold text-[#395886] mb-2">Berikan komentarmu atau penguatan terhadap pendapat di atas:</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} disabled={commentSubmitted} rows={3} className="w-full p-3 rounded-xl border-2 border-[#D5DEEF] focus:border-[#F59E0B] outline-none text-sm transition-all disabled:bg-[#F0F3FA] resize-none" placeholder="Tuliskan argumen atau penguatan terhadap salah satu pendapat di atas..." />
            <p className={`text-[11px] mt-1 ${comment.length >= 15 ? 'text-[#10B981]' : 'text-[#395886]/40'}`}>{comment.length} karakter (minimal 15)</p>
          </div>
          {!commentSubmitted ? (
            <button onClick={() => setCommentSubmitted(true)} disabled={comment.length < 15} className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${comment.length >= 15 ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-sm' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
              Kirim Komentar
            </button>
          ) : (
            <button onClick={onComplete} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all">
              Lanjut ke Aktivitas 2 <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Case Comparison Phase (original path) ────────────────────────────────────

function CaseComparisonPhase({
  data, lessonId, stageIndex, onComplete,
}: { data: CaseComparisonData; lessonId: string; stageIndex: number; onComplete: () => void }) {
  const user = getCurrentUser();
  const [ordered, setOrdered] = useState<CaseComparisonProcess[]>(() => {
    const arr = [...data.process];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showAnalyses, setShowAnalyses] = useState(false);

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then((p) => setAttempts(p.stageAttempts[`stage_${stageIndex}_case`] || 0));
  }, []);

  const isCorrectOrder = ordered.every((p, i) => p.correctOrder === i + 1);

  const moveItem = (from: number, to: number) => {
    if (validated) return;
    const arr = [...ordered];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setOrdered(arr);
  };

  const handleValidate = async () => {
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, isCorrectOrder, `stage_${stageIndex}_case`);
    setAttempts(newA);
    setValidated(true);
    if (isCorrectOrder) setTimeout(() => setShowAnalyses(true), 800);
  };

  const handleRetry = () => {
    setValidated(false);
    const arr = [...ordered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrdered(arr);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white rounded-2xl border-2 border-[#F59E0B]/20 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#F59E0B]/8 border-b border-[#F59E0B]/20">
            <ArrowUpDown className="w-4 h-4 text-[#F59E0B]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">Aktivitas 2 — Case Comparison</p>
              <h3 className="text-sm font-bold text-[#395886]">{data.title}</h3>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F59E0B]/20">
              <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[10px] font-bold text-[#F59E0B]">{attempts < 3 ? `${3 - attempts} percobaan` : 'Habis'}</span>
            </div>
          </div>
          <div className="px-5 py-4 bg-gradient-to-br from-[#F59E0B]/5 to-transparent">
            <p className="text-sm text-[#395886]/80">Susun urutan proses Decapsulation TCP/IP yang benar! Seret kartu ke posisi yang tepat menggunakan ikon ≡.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5">
          <div className="space-y-2 mb-5">
            {ordered.map((step, idx) => (
              <SortableStepCard key={step.id} step={step} index={idx} moveItem={moveItem} validated={validated} />
            ))}
          </div>

          {validated && (
            <div className={`mb-5 p-4 rounded-xl border-2 ${isCorrectOrder ? 'bg-[#10B981]/8 border-[#10B981]/40' : attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-start gap-3">
                {isCorrectOrder ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" /> : attempts < 3 ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> : <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-sm font-bold ${isCorrectOrder ? 'text-[#10B981]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                    {isCorrectOrder ? 'Urutan decapsulation benar! Kamu memahami alur TCP/IP dengan baik.' : attempts < 3 ? `Belum tepat. Punya ${3 - attempts} kesempatan lagi!` : 'Urutan benar: Network Access → Internet → Transport → Application'}
                  </p>
                  {!isCorrectOrder && attempts < 3 && (
                    <button onClick={handleRetry} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
                      <RotateCcw className="w-3.5 h-3.5" /> Susun Ulang
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!validated ? (
            <button onClick={handleValidate} className="w-full py-2.5 rounded-xl bg-[#F59E0B] text-white font-bold text-sm hover:bg-[#D97706] shadow-sm transition-all">
              Periksa Urutan
            </button>
          ) : (isCorrectOrder || attempts >= 3) && !showAnalyses ? (
            <button onClick={() => setShowAnalyses(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all">
              Bandingkan Analisis Teman <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {showAnalyses && (
          <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-sm font-bold text-[#395886]">Validasi Logika — Analisis Teman</h3>
            </div>
            <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#10B981]/20 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-[#065F46]">Identifikasi mana analisis yang BENAR dan mana yang mengandung kesalahan logika.</p>
            </div>
            <div className="space-y-3">
              {data.peerAnalyses.map((analysis, i) => (
                <div key={i} className={`p-4 rounded-xl border-2 ${analysis.isCorrect ? 'border-[#10B981]/30 bg-[#10B981]/5' : 'border-red-300 bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#628ECB] to-[#395886] flex items-center justify-center text-[10px] font-black text-white">{analysis.name.substring(0, 2).toUpperCase()}</div>
                    <p className="text-xs font-black text-[#395886]">{analysis.name}</p>
                    <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${analysis.isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'}`}>{analysis.isCorrect ? '✓ LOGIKA BENAR' : '✗ ADA KESALAHAN'}</span>
                  </div>
                  <p className="text-xs text-[#395886]/80 leading-relaxed italic">"{analysis.analysis}"</p>
                  {!analysis.isCorrect && (
                    <p className="mt-2 text-[11px] font-bold text-red-700">💡 Kesalahan: Decapsulation berlangsung dari lapisan bawah ke atas, bukan dari lapisan atas ke bawah.</p>
                  )}
                </div>
              ))}
            </div>
            <button onClick={onComplete} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all">
              Selesaikan Tahap Ini <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

// ── Matching Ropes (original) ──────────────────────────────────────────────────

function MatchingRopes({ pairs, lessonId, stageIndex, onDone }: { pairs: MatchingPair[]; lessonId: string; stageIndex: number; onDone: (matches: Record<string, string>) => void }) {
  const user = getCurrentUser();
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [, forceUpdate] = useState({});

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then((p) => setAttempts(p.stageAttempts[`stage_${stageIndex}`] || 0));
  }, []);

  useEffect(() => {
    const handler = () => forceUpdate({});
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLeftClick = (left: string) => {
    if (validated || attempts >= 3) return;
    setSelectedLeft(prev => prev === left ? null : left);
  };

  const handleRightClick = (right: string) => {
    if (validated || !selectedLeft || attempts >= 3) return;
    setMatches(prev => {
      const next = { ...prev };
      const oldLeft = Object.keys(next).find(k => next[k] === right);
      if (oldLeft) delete next[oldLeft];
      next[selectedLeft] = right;
      return next;
    });
    setSelectedLeft(null);
  };

  const handleValidate = async () => {
    const ok = pairs.every(p => matches[p.left] === p.right);
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, ok);
    setAttempts(newA);
    setValidated(true);
  };

  const handleRetry = () => { setValidated(false); setMatches({}); setSelectedLeft(null); };

  const correctCount = pairs.filter(p => matches[p.left] === p.right).length;
  const allCorrect = validated && correctCount === pairs.length;
  const showExpl = validated && (allCorrect || attempts >= 3);

  const renderLines = () => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const lines = showExpl
      ? pairs.map(p => ({ left: p.left, right: p.right, ok: true }))
      : Object.entries(matches).map(([left, right]) => ({ left, right, ok: validated ? pairs.find(p => p.left === left)?.right === right : undefined }));

    return lines.map(({ left, right, ok }) => {
      const lEl = leftRefs.current[left];
      const rEl = rightRefs.current[right];
      if (!lEl || !rEl) return null;
      const lR = lEl.getBoundingClientRect(), rR = rEl.getBoundingClientRect();
      const x1 = lR.right - rect.left, y1 = lR.top + lR.height / 2 - rect.top;
      const x2 = rR.left - rect.left, y2 = rR.top + rR.height / 2 - rect.top;
      const color = showExpl ? '#10B981' : (ok === false ? '#EF4444' : '#628ECB');
      return <line key={`${left}-${right}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeDasharray={validated ? '' : '5,5'} className="transition-all duration-500" />;
    });
  };

  const allMatched = Object.keys(matches).length === pairs.length;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-bold text-[#395886]/60 uppercase tracking-widest">Aktivitas Matching</p>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F59E0B]/5 border border-[#F59E0B]/20">
          <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-[10px] font-bold text-[#F59E0B]">{attempts < 3 ? `${3 - attempts} Percobaan Tersisa` : 'Habis'}</span>
        </div>
      </div>

      <svg className="absolute inset-0 pointer-events-none z-0" style={{ width: '100%', height: '100%' }}>{renderLines()}</svg>

      <div className="grid grid-cols-2 gap-16 relative z-10">
        <div className="space-y-3">
          {pairs.map(p => (
            <button key={p.left} ref={el => { leftRefs.current[p.left] = el; }} onClick={() => handleLeftClick(p.left)} disabled={validated && attempts < 3} className={`w-full text-left p-3 rounded-xl border-2 text-xs font-bold transition-all ${selectedLeft === p.left ? 'border-[#F59E0B] bg-[#F59E0B]/10 shadow-md scale-105' : !!matches[p.left] || showExpl ? 'border-[#628ECB] bg-white' : 'border-[#D5DEEF] bg-white hover:border-[#628ECB]/50'}`}>{p.left}</button>
          ))}
        </div>
        <div className="space-y-3">
          {pairs.map((p, idx) => (
            <button key={idx} ref={el => { rightRefs.current[p.right] = el; }} onClick={() => handleRightClick(p.right)} disabled={validated && attempts < 3} className={`w-full text-left p-3 rounded-xl border-2 text-xs font-bold transition-all ${Object.values(matches).includes(p.right) || showExpl ? 'border-[#628ECB] bg-white' : 'border-[#D5DEEF] bg-white hover:border-[#628ECB]/50'}`}>{p.right}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {validated && (
          <div className={`p-4 rounded-xl border-2 ${allCorrect ? 'bg-[#10B981]/10 border-[#10B981]/20' : attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {allCorrect ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" /> : attempts < 3 ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> : <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              <div>
                <p className={`text-sm font-bold mb-1 ${allCorrect ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                  {allCorrect ? 'Semua pasangan tepat!' : attempts < 3 ? `Ada ${pairs.length - correctCount} pasangan belum tepat. Punya ${3 - attempts} kesempatan.` : 'Pelajari kunci jawaban (garis hijau).'}
                </p>
                {!allCorrect && attempts < 3 && (
                  <button onClick={handleRetry} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"><RotateCcw className="w-3.5 h-3.5" /> Coba Lagi</button>
                )}
              </div>
            </div>
          </div>
        )}

        {!validated || (!allCorrect && attempts < 3) ? (
          <button onClick={handleValidate} disabled={!allMatched} className={`py-3 rounded-xl font-bold text-sm transition-all ${allMatched ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-md' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
            Hubungkan Konsep
          </button>
        ) : (
          <button onClick={() => onDone(matches)} className="py-3 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-md transition-all flex items-center justify-center gap-2">
            Lanjut ke Analisis Kasus <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main LearningCommunityStage ────────────────────────────────────────────────

export function LearningCommunityStage({
  matchingPairs, caseScenario, peerAnswers, peerVotingScenario, peerComments,
  caseComparisonData, encapsulationCaseData, lessonId, stageIndex, isCompleted, onComplete,
}: LearningCommunityStageProps) {
  // For lesson 1: use the new TCP/IP flow (TcpIpInteractive + Encapsulation + Decapsulation)
  if (lessonId === '1') {
    return (
      <Lesson1LearningCommunity
        encapsulationCaseData={encapsulationCaseData}
        caseComparisonData={caseComparisonData}
        lessonId={lessonId}
        stageIndex={stageIndex}
        onComplete={onComplete}
      />
    );
  }

  // For other lessons: use original flow
  const hasVoting = !!peerVotingScenario;
  const hasComparison = !!caseComparisonData;

  const [phase, setPhase] = useState<'voting' | 'comparison' | 'matching' | 'case' | 'peer'>(() => {
    if (hasVoting) return 'voting';
    return 'matching';
  });
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [caseAnswer, setCaseAnswer] = useState('');
  const [caseSubmitted, setCaseSubmitted] = useState(false);
  const [caseOption, setCaseOption] = useState<string | null>(null);

  const handleComplete = () => onComplete({ matches, caseAnswer });

  if (phase === 'voting' && hasVoting) {
    return (
      <PeerVotingPhase
        scenario={peerVotingScenario!}
        peerComments={peerComments}
        lessonId={lessonId}
        stageIndex={stageIndex}
        onComplete={() => setPhase(hasComparison ? 'comparison' : 'peer')}
      />
    );
  }

  if (phase === 'comparison' && hasComparison) {
    return (
      <CaseComparisonPhase
        data={caseComparisonData!}
        lessonId={lessonId}
        stageIndex={stageIndex}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex bg-white rounded-2xl border border-[#D5DEEF] p-1.5 shadow-sm">
        {[
          { id: 'matching', label: 'Hubungkan', icon: LinkIcon },
          { id: 'case', label: 'Analisis Kasus', icon: FileSearch },
          { id: 'peer', label: 'Diskusi Komunitas', icon: Users },
        ].map((p, i) => {
          const isActive = phase === p.id;
          const isDone = (phase === 'case' && i === 0) || (phase === 'peer' && i < 2);
          return (
            <div key={p.id} className="flex-1 flex items-center">
              <div className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all ${isActive ? 'bg-[#F59E0B] text-white shadow-sm' : isDone ? 'text-[#10B981]' : 'text-[#395886]/40'}`}>
                <p.icon className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-tight hidden sm:inline">{p.label}</span>
                {isDone && <CheckCircle className="w-3 h-3" strokeWidth={3} />}
              </div>
              {i < 2 && <div className="w-px h-4 bg-[#D5DEEF] mx-1" />}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-6 sm:p-8">
        {phase === 'matching' && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10"><LinkIcon className="w-5 h-5 text-[#F59E0B]" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-0.5">Fase 1: Koneksi Konsep</p>
                <h3 className="text-lg font-bold text-[#395886]">Hubungkan item kiri dengan penjelasan di kanan</h3>
              </div>
            </div>
            <MatchingRopes pairs={matchingPairs ?? []} lessonId={lessonId} stageIndex={stageIndex} onDone={(m) => { setMatches(m); setPhase('case'); }} />
          </>
        )}

        {phase === 'case' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10"><FileSearch className="w-5 h-5 text-[#F59E0B]" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-0.5">Fase 2: Studi Kasus</p>
                <h3 className="text-lg font-bold text-[#395886]">{caseScenario?.title}</h3>
              </div>
            </div>
            <div className="bg-[#F8FAFF] rounded-2xl p-5 border border-[#D5DEEF] mb-6">
              <p className="text-sm text-[#395886]/80 leading-relaxed font-medium">{caseScenario?.description}</p>
            </div>

            {caseScenario?.options ? (
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#395886] mb-3">{caseScenario.question}</label>
                <div className="space-y-2">
                  {caseScenario.options.map(opt => {
                    const isS = caseOption === opt.id;
                    const isC = caseSubmitted && opt.isCorrect;
                    const isW = caseSubmitted && isS && !opt.isCorrect;
                    let cls = 'border-[#D5DEEF] bg-white hover:border-[#F59E0B]/40';
                    if (isC) cls = 'border-[#10B981] bg-[#10B981]/8';
                    else if (isW) cls = 'border-red-400 bg-red-50';
                    else if (isS) cls = 'border-[#F59E0B] bg-[#F59E0B]/8';
                    return (
                      <label key={opt.id} className={`flex items-start gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all ${cls}`}>
                        <input type="radio" name="case" value={opt.id} checked={isS} onChange={() => !caseSubmitted && setCaseOption(opt.id)} disabled={caseSubmitted} className="mt-0.5 accent-[#F59E0B]" />
                        <span className="text-sm text-[#395886]">{opt.text}</span>
                        {isC && <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />}
                      </label>
                    );
                  })}
                </div>
                {caseSubmitted && caseScenario.options.find(o => o.id === caseOption) && (
                  <div className={`mt-3 p-3 rounded-xl border-2 ${caseScenario.options.find(o => o.id === caseOption)?.isCorrect ? 'bg-[#10B981]/8 border-[#10B981]/40' : 'bg-red-50 border-red-200'}`}>
                    <p className="text-sm font-bold text-[#395886]">{caseScenario.options.find(o => o.id === caseOption)?.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#395886] mb-3">{caseScenario?.question}</label>
                <textarea value={caseAnswer} onChange={(e) => setCaseAnswer(e.target.value)} disabled={caseSubmitted} rows={4} className="w-full p-4 rounded-2xl border-2 border-[#D5DEEF] focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all outline-none text-sm font-medium" placeholder="Tuliskan analisis jawabanmu di sini..." />
              </div>
            )}

            {!caseSubmitted ? (
              <button onClick={() => setCaseSubmitted(true)} disabled={caseScenario?.options ? !caseOption : caseAnswer.length < 20} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${(caseScenario?.options ? !!caseOption : caseAnswer.length >= 20) ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-md' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
                Kirim Analisis
              </button>
            ) : (
              <button onClick={() => setPhase('peer')} className="w-full py-3 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-md transition-all flex items-center justify-center gap-2">
                Bandingkan Jawaban Komunitas <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}

        {phase === 'peer' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10"><Users className="w-5 h-5 text-[#F59E0B]" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-0.5">Fase 3: Refleksi Sosial</p>
                <h3 className="text-lg font-bold text-[#395886]">Jawaban Anggota Komunitas</h3>
              </div>
            </div>
            <div className="bg-[#F0FDF4] border border-[#10B981]/20 p-4 rounded-2xl mb-8 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-[#065F46] leading-relaxed">Jawaban diurutkan berdasarkan tingkat ketepatan analisis teknis. Gunakan untuk memperkaya pemahamanmu.</p>
            </div>
            <div className="space-y-4 mb-8">
              {[...(peerAnswers ?? [])].sort((a, b) => (b.score || 0) - (a.score || 0)).map((peer, i) => (
                <div key={i} className="bg-white border-2 border-[#D5DEEF] rounded-2xl p-5 shadow-sm hover:border-[#628ECB]/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-[#395886]">{peer.name.substring(0, 2).toUpperCase()}</div>
                      <div><p className="text-xs font-black text-[#395886]">{peer.name}</p><p className="text-[10px] font-bold text-[#628ECB]">{peer.role}</p></div>
                    </div>
                    {i === 0 && <div className="bg-[#10B981] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">ANALISIS TERBAIK</div>}
                  </div>
                  <p className="text-sm text-[#395886]/80 leading-relaxed italic">&ldquo;{peer.answer}&rdquo;</p>
                </div>
              ))}
            </div>
            <button onClick={handleComplete} className="w-full py-4 rounded-2xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-lg shadow-[#628ECB]/20 transition-all flex items-center justify-center gap-2">
              Selesaikan Tahap Ini <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
