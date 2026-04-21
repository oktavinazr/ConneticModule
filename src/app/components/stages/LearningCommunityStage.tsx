import { useState, useRef, useEffect } from 'react';
import { ChevronRight, CheckCircle, XCircle, Users, Link as LinkIcon, FileSearch, MessageSquare, Info, RotateCcw, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';

// ── Tipe ──────────────────────────────────────────────────────────────────────

interface MatchingPair { left: string; right: string }
interface CaseScenario { title: string; description: string; question: string }
interface PeerAnswer   { name: string; role: string; answer: string; score?: number }

interface LearningCommunityStageProps {
  matchingPairs?: MatchingPair[];
  caseScenario?: CaseScenario;
  peerAnswers?: PeerAnswer[];
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: { matches: Record<string, string>; caseAnswer: string }) => void;
}

// ── Aktivitas pencocokan dengan "Tali" (Garis SVG) ────────────────────────────

function MatchingRopes({
  pairs,
  lessonId,
  stageIndex,
  onDone,
}: {
  pairs: MatchingPair[];
  lessonId: string;
  stageIndex: number;
  onDone: (matches: Record<string, string>) => void;
}) {
  const user = getCurrentUser();
  const initialProgress = getLessonProgress(user!.id, lessonId);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // kiri → kanan
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(initialProgress.stageAttempts[`stage_${stageIndex}`] || 0);
  
  // Untuk menggambar SVG
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [, forceUpdate] = useState({});

  useEffect(() => {
    window.addEventListener('resize', () => forceUpdate({}));
    return () => window.removeEventListener('resize', () => forceUpdate({}));
  }, []);

  const handleLeftClick = (left: string) => {
    if (validated || attempts >= 3) return;
    if (selectedLeft === left) { setSelectedLeft(null); return; }
    setSelectedLeft(left);
  };

  const handleRightClick = (right: string) => {
    if (validated || !selectedLeft || attempts >= 3) return;
    
    setMatches(prev => {
      const next = { ...prev };
      // Hapus pasangan yang ada sebelumnya untuk sisi kanan ini
      const oldLeft = Object.keys(next).find(k => next[k] === right);
      if (oldLeft) delete next[oldLeft];
      
      next[selectedLeft] = right;
      return next;
    });
    setSelectedLeft(null);
  };

  const handleValidate = () => {
    const isCorrect = pairs.every(p => matches[p.left] === p.right);
    const newAttempts = saveStageAttempt(user!.id, lessonId, stageIndex, isCorrect);
    setAttempts(newAttempts);
    setValidated(true);
  };

  const handleRetry = () => {
    setValidated(false);
    setMatches({});
    setSelectedLeft(null);
  };

  const showExplanation = validated && (pairs.every(p => matches[p.left] === p.right) || attempts >= 3);

  const renderLines = () => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();

    const linesToRender = showExplanation 
      ? pairs.map(p => ({ left: p.left, right: p.right, isCorrect: true }))
      : Object.entries(matches).map(([left, right]) => ({
          left,
          right,
          isCorrect: validated ? pairs.find(p => p.left === left)?.right === right : undefined
        }));

    return linesToRender.map(({ left, right, isCorrect }) => {
      const leftEl = leftRefs.current[left];
      const rightEl = rightRefs.current[right];
      if (!leftEl || !rightEl) return null;

      const lRect = leftEl.getBoundingClientRect();
      const rRect = rightEl.getBoundingClientRect();

      const x1 = lRect.right - rect.left;
      const y1 = lRect.top + lRect.height / 2 - rect.top;
      const x2 = rRect.left - rect.left;
      const y2 = rRect.top + rRect.height / 2 - rect.top;

      const color = showExplanation ? '#10B981' : (isCorrect === false ? '#EF4444' : '#628ECB');

      return (
        <line 
          key={`${left}-${right}`}
          x1={x1} y1={y1} x2={x2} y2={y2} 
          stroke={color} strokeWidth="3" 
          strokeDasharray={validated || showExplanation ? "" : "5,5"}
          className="transition-all duration-500"
        />
      );
    });
  };

  const allMatched = Object.keys(matches).length === pairs.length;
  const correctCount = pairs.filter((p) => matches[p.left] === p.right).length;
  const allCorrect = validated && correctCount === pairs.length;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-bold text-[#395886]/60 uppercase tracking-widest">Aktivitas Matching</p>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F59E0B]/5 border border-[#F59E0B]/20">
          <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">
            {attempts < 3 ? `${3 - attempts} Percobaan Tersisa` : 'Kesempatan Habis'}
          </span>
        </div>
      </div>

      <svg className="absolute inset-0 pointer-events-none z-0" style={{ width: '100%', height: '100%' }}>
        {renderLines()}
      </svg>

      <div className="grid grid-cols-2 gap-16 relative z-10">
        <div className="space-y-3">
          {pairs.map((pair) => {
            const isMatched = !!matches[pair.left] || showExplanation;
            return (
              <button
                key={pair.left}
                ref={el => { leftRefs.current[pair.left] = el; }}
                onClick={() => handleLeftClick(pair.left)}
                disabled={validated && attempts < 3}
                className={`w-full text-left p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                  selectedLeft === pair.left ? 'border-[#F59E0B] bg-[#F59E0B]/10 shadow-md scale-105' : 
                  isMatched ? 'border-[#628ECB] bg-white' : 'border-[#D5DEEF] bg-white hover:border-[#628ECB]/50'
                }`}
              >
                {pair.left}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {pairs.map((pair, idx) => {
            const isMatched = Object.values(matches).includes(pair.right) || showExplanation;
            return (
              <button
                key={idx}
                ref={el => { rightRefs.current[pair.right] = el; }}
                onClick={() => handleRightClick(pair.right)}
                disabled={validated && attempts < 3}
                className={`w-full text-left p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                  isMatched ? 'border-[#628ECB] bg-white' : 'border-[#D5DEEF] bg-white hover:border-[#628ECB]/50'
                }`}
              >
                {pair.right}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {validated && (
          <div className={`p-4 rounded-xl border-2 ${allCorrect ? 'bg-[#10B981]/10 border-[#10B981]/20' : attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {allCorrect ? (
                <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              ) : attempts < 3 ? (
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-bold mb-1 ${allCorrect ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                  {allCorrect 
                    ? 'Semua pasangan tepat!' 
                    : attempts < 3 
                    ? `Ada ${pairs.length - correctCount} pasangan yang belum tepat. Kamu punya ${3 - attempts} kesempatan lagi.` 
                    : 'Kamu sudah mencoba 3 kali. Pelajari kunci jawaban yang muncul (garis hijau) untuk memahami materi.'}
                </p>
                {!allCorrect && attempts < 3 && (
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

        {!validated || (!allCorrect && attempts < 3) ? (
          <button
            onClick={handleValidate}
            disabled={!allMatched}
            className={`py-3 rounded-xl font-bold text-sm transition-all ${
              allMatched ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-md' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
            }`}
          >
            Hubungkan Konsep
          </button>
        ) : (
          <button
            onClick={() => onDone(matches)}
            className="py-3 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-md transition-all flex items-center justify-center gap-2"
          >
            Lanjut ke Analisis Kasus <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Komponen utama ────────────────────────────────────────────────────────────

export function LearningCommunityStage({
  matchingPairs,
  caseScenario,
  peerAnswers,
  lessonId,
  stageIndex,
  onComplete,
}: LearningCommunityStageProps) {
  const [phase, setPhase] = useState<'matching' | 'case' | 'peer'>('matching');
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [caseAnswer, setCaseAnswer] = useState('');
  const [caseSubmitted, setCaseSubmitted] = useState(false);

  const handleComplete = () => {
    onComplete({ matches, caseAnswer });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Langkah Fase */}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10">
                <LinkIcon className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-0.5">Fase 1: Koneksi Konsep</p>
                <h3 className="text-lg font-bold text-[#395886]">Hubungkan item kiri dengan penjelasan di kanan</h3>
              </div>
            </div>
            <MatchingRopes 
              pairs={matchingPairs ?? []} 
              lessonId={lessonId}
              stageIndex={stageIndex}
              onDone={(m) => { setMatches(m); setPhase('case'); }} 
            />
          </>
        )}

        {phase === 'case' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10">
                <FileSearch className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-0.5">Fase 2: Studi Kasus</p>
                <h3 className="text-lg font-bold text-[#395886]">{caseScenario?.title}</h3>
              </div>
            </div>
            
            <div className="bg-[#F8FAFF] rounded-2xl p-5 border border-[#D5DEEF] mb-6">
              <p className="text-sm text-[#395886]/80 leading-relaxed font-medium">{caseScenario?.description}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-[#395886] mb-3">{caseScenario?.question}</label>
              <textarea
                value={caseAnswer}
                onChange={(e) => setCaseAnswer(e.target.value)}
                disabled={caseSubmitted}
                rows={4}
                className="w-full p-4 rounded-2xl border-2 border-[#D5DEEF] focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all outline-none text-sm font-medium"
                placeholder="Tuliskan penjelasan dan analisis jawabanmu di sini..."
              />
            </div>

            {!caseSubmitted ? (
              <button
                onClick={() => setCaseSubmitted(true)}
                disabled={caseAnswer.length < 20}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  caseAnswer.length >= 20 ? 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-md' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
                }`}
              >
                Kirim Analisis
              </button>
            ) : (
              <button
                onClick={() => setPhase('peer')}
                className="w-full py-3 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-md transition-all flex items-center justify-center gap-2"
              >
                Bandingkan Jawaban Komunitas <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}

        {phase === 'peer' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10">
                <Users className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-0.5">Fase 3: Refleksi Sosial</p>
                <h3 className="text-lg font-bold text-[#395886]">Jawaban Anggota Komunitas</h3>
              </div>
            </div>

            <div className="bg-[#F0FDF4] border border-[#10B981]/20 p-4 rounded-2xl mb-8 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-[#065F46] leading-relaxed">
                Jawaban di bawah telah diurutkan berdasarkan tingkat ketepatan analisis teknis. Gunakan ini untuk memperkaya pemahamanmu.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[...(peerAnswers ?? [])]
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map((peer, i) => (
                  <div key={i} className="bg-white border-2 border-[#D5DEEF] rounded-2xl p-5 shadow-sm hover:border-[#628ECB]/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-[#395886]">
                          {peer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#395886]">{peer.name}</p>
                          <p className="text-[10px] font-bold text-[#628ECB]">{peer.role}</p>
                        </div>
                      </div>
                      {i === 0 && (
                        <div className="bg-[#10B981] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                          ANALISIS TERBAIK
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-[#395886]/80 leading-relaxed italic">&ldquo;{peer.answer}&rdquo;</p>
                  </div>
                ))}
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-2xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-lg shadow-[#628ECB]/20 transition-all flex items-center justify-center gap-2"
            >
              Selesaikan Tahap Ini <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
