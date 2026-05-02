import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  AlertCircle, AlertTriangle, CheckCircle, ChevronRight, Clock, Eye,
  GripVertical, HelpCircle, Info, Lightbulb, MessageSquare, PenLine,
  RotateCcw, User, WifiOff, XCircle, Zap, ArrowRight, MapPin,
} from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';

// ── Interfaces ─────────────────────────────────────────────────────────────────

interface ReasonOption { id: string; text: string; isCorrect: boolean; feedback: string }
interface QuestionBankItem { id: string; text: string; response: string }
interface ProblemVisual { icon: string; title: string; description: string; problemType: 'corruption' | 'packet-loss' | 'collision' | 'delay' }

interface QuestioningStageProps {
  scenario?: string;
  whyQuestion?: string;
  hint?: string;
  reasonOptions?: ReasonOption[];
  teacherImage?: string;
  imageUrl?: string;
  teacherQuestion?: string;
  questionBank?: QuestionBankItem[];
  problemVisual?: ProblemVisual;
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: { selectedId: string; isCorrect: boolean; askedQuestions: string[]; justification: string }) => void;
}

// ── Pizza Layers ───────────────────────────────────────────────────────────────

const PIZZA_LAYERS = [
  {
    num: 5, name: 'Application Layer', emoji: '🍕', role: 'Pesanan Pizza',
    desc: 'Data asli yang dibuat pengguna — seperti pesan yang kamu tulis di aplikasi.',
    gradient: 'from-[#8B5CF6] to-[#7C3AED]', light: 'bg-[#EDE9FE]',
    border: 'border-[#8B5CF6]', text: 'text-[#6D28D9]', badge: 'bg-[#8B5CF6]',
  },
  {
    num: 4, name: 'Transport Layer', emoji: '📦', role: 'Boks Pemanas & Nomor Urut',
    desc: 'Membungkus data dengan checksum dan sequence number agar tiba utuh dan berurutan.',
    gradient: 'from-[#628ECB] to-[#395886]', light: 'bg-[#EEF4FF]',
    border: 'border-[#628ECB]', text: 'text-[#395886]', badge: 'bg-[#628ECB]',
  },
  {
    num: 3, name: 'Network Layer', emoji: '🗺️', role: 'GPS & Alamat Kompleks',
    desc: 'IP Address dan routing menentukan jalur terbaik dari pengirim ke penerima.',
    gradient: 'from-[#10B981] to-[#059669]', light: 'bg-[#ECFDF5]',
    border: 'border-[#10B981]', text: 'text-[#065F46]', badge: 'bg-[#10B981]',
  },
  {
    num: 2, name: 'Data Link Layer', emoji: '🏠', role: 'Nomor Rumah & Bel Spesifik',
    desc: 'MAC Address mengidentifikasi perangkat tepat dalam jaringan lokal.',
    gradient: 'from-[#F59E0B] to-[#D97706]', light: 'bg-[#FFFBEB]',
    border: 'border-[#F59E0B]', text: 'text-[#78350F]', badge: 'bg-[#F59E0B]',
  },
  {
    num: 1, name: 'Physical Layer', emoji: '🏍️', role: 'Jalan, Motor & Media Fisik',
    desc: 'Kabel, sinyal Wi-Fi, atau serat optik yang membawa bit secara fisik.',
    gradient: 'from-[#EC4899] to-[#DB2777]', light: 'bg-[#FDF2F8]',
    border: 'border-[#EC4899]', text: 'text-[#831843]', badge: 'bg-[#EC4899]',
  },
];

// ── Disruption Scenarios ───────────────────────────────────────────────────────

const DISRUPTIONS = [
  {
    id: 'A', letter: 'A',
    emoji: '🏠❌',
    scenario: '"Alamat GPS benar, tapi nomor rumah terhapus."',
    detail: 'Kurir tahu perumahan tujuan via GPS, tapi tidak bisa menentukan rumah mana yang tepat karena nomor identifikasi hilang.',
    correctLayer: 'Data Link Layer',
    correctFeedback: 'Data Link Layer bertanggung jawab atas pengalamatan fisik (MAC Address) — seperti nomor rumah spesifik yang dipakai kurir untuk ketuk pintu yang benar.',
    wrongFeedback: {
      'Transport Layer': 'Transport Layer mengurusi boks/integritas paket, bukan identifikasi perangkat lokal. GPS sudah benar, yang hilang adalah cara mengenali pintu spesifik di jaringan.',
      'Physical Layer': 'Physical Layer adalah jalan/kabel. Jalan masih ada karena kurir bisa sampai ke kawasan. Yang hilang adalah cara identifikasi unit spesifik di level lokal.',
      'Network Layer': 'Network Layer (GPS) justru benar di skenario ini! Yang bermasalah adalah identifikasi lokal di bawahnya — nomor rumah = MAC Address = Data Link Layer.',
      'Application Layer': 'Pesanan pizzanya ada dan benar. Masalahnya ada di cara menemukan perangkat tujuan yang tepat di jaringan lokal, bukan isi datanya.',
    },
  },
  {
    id: 'B', letter: 'B',
    emoji: '🚫🏍️',
    scenario: '"Nomor rumah ada, tapi jalan menuju kompleks ditutup total."',
    detail: 'Identifikasi rumah jelas dan GPS berfungsi, namun tidak ada jalur fisik yang bisa dilewati kurir untuk tiba di lokasi.',
    correctLayer: 'Physical Layer',
    correctFeedback: 'Physical Layer adalah medium transmisi fisik (kabel, sinyal, jalan). Jika jalur fisik tidak ada atau putus, semua layer di atasnya tidak bisa beroperasi sama sekali.',
    wrongFeedback: {
      'Transport Layer': 'Transport Layer mengurusi keandalan paket. Boks pizza masih rapi, masalahnya kurir tidak bisa jalan karena jalanan fisik ditutup.',
      'Data Link Layer': 'Data Link Layer (nomor rumah) masih ada di skenario ini. Yang tidak ada adalah jalur fisik (jalan/kabel) yang dibutuhkan untuk lewat.',
      'Network Layer': 'Network Layer bisa menunjukkan rute, tapi kalau mediumnya ditutup, routing tidak berguna. Tanpa jalan = tanpa Physical Layer.',
      'Application Layer': 'Pesanannya ada. Masalahnya ada di infrastruktur fisik pengiriman, bukan isi atau pembungkus datanya.',
    },
  },
  {
    id: 'C', letter: 'C',
    emoji: '📦💥',
    scenario: '"Alamat lengkap, tapi pizza hancur karena boks terbuka."',
    detail: 'Rute dan identifikasi sempurna, namun isi paket rusak karena pembungkus gagal menjaga integritas data selama perjalanan.',
    correctLayer: 'Transport Layer',
    correctFeedback: 'Transport Layer bertanggung jawab atas integritas data via checksum TCP. Boks terbuka = checksum gagal → segmen dianggap rusak dan perlu retransmission.',
    wrongFeedback: {
      'Data Link Layer': 'Nomor rumah/MAC Address aman karena alamat lengkap. Masalahnya bukan identifikasi perangkat, tapi integritas isi paket selama transmisi.',
      'Physical Layer': 'Jalan dan motor normal. Masalahnya bukan medium fisik, tapi pembungkus (segment) yang gagal menjaga isi data tetap utuh.',
      'Network Layer': 'Alamat GPS/rute sudah benar. Yang rusak adalah pembungkus dan mekanisme verifikasi integritas — itu tanggung jawab Transport Layer.',
      'Application Layer': 'Pizza (data asli) baik sebelum dibungkus. Yang gagal adalah proses pembungkusan dan checksum saat pengiriman — ranah Transport Layer.',
    },
  },
];

// ── Drag & Drop for Pizza Simulation ─────────────────────────────────────────

const DRAG_PIZZA = 'PIZZA_LAYER_DND';
const DRAG_PIZZA_POOL = 'PIZZA_POOL_RETURN';

function DraggableLayerTag({ name, layer, disabled }: {
  name: string; layer: typeof PIZZA_LAYERS[0]; disabled?: boolean;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_PIZZA,
    item: { layerName: name },
    canDrag: !disabled,
    collect: m => ({ isDragging: m.isDragging() }),
  });
  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border-b-4 text-white text-xs font-bold select-none transition-all
        bg-gradient-to-r ${layer.gradient} ${layer.border}
        ${disabled ? 'cursor-default opacity-60' : isDragging ? 'opacity-30 scale-90 cursor-grabbing' : 'cursor-grab hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg'}`}
    >
      <GripVertical className="w-3.5 h-3.5 opacity-60 shrink-0" />
      <span className="text-lg leading-none">{layer.emoji}</span>
      <span className="tracking-tight">{name}</span>
    </div>
  );
}

function DisruptionDropZone({ disruption, droppedLayerName, validated, isCorrect, onDrop }: {
  disruption: typeof DISRUPTIONS[0];
  droppedLayerName?: string;
  validated: boolean;
  isCorrect?: boolean;
  onDrop: (disruptionId: string, layerName: string) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: DRAG_PIZZA,
    drop: (d: { layerName: string }) => onDrop(disruption.id, d.layerName),
    collect: m => ({ isOver: m.isOver() }),
  });

  const droppedLayer = droppedLayerName ? PIZZA_LAYERS.find(l => l.name === droppedLayerName) : null;

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`rounded-2xl border-2 p-5 transition-all duration-300 bg-white border-[#D5DEEF]
        ${isOver && !validated ? 'ring-2 ring-offset-2 ring-[#628ECB] scale-[1.02] shadow-lg border-[#628ECB]' : ''}`}
    >
      {/* Disruption Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#395886] text-white text-sm font-black">
          {disruption.letter}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#395886]/60 mb-1">Gangguan {disruption.letter}</p>
          <p className="text-sm font-bold text-[#395886] leading-relaxed italic">{disruption.scenario}</p>
        </div>
        <span className="text-2xl">{disruption.emoji}</span>
      </div>

      <p className="text-xs text-[#395886]/70 leading-relaxed mb-4">{disruption.detail}</p>

      {/* Drop zone */}
      <div className={`rounded-xl border-2 border-dashed p-3 min-h-[52px] flex items-center justify-center transition-all duration-300
        ${isOver && !validated ? 'bg-[#628ECB]/8 border-[#628ECB] shadow-md' : droppedLayer ? 'border-transparent' : 'border-[#D5DEEF] bg-[#F8FAFF]'}`}
      >
        {droppedLayer ? (
          <div className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white text-xs font-bold
            bg-gradient-to-r ${droppedLayer.gradient}`}
          >
            <span className="text-base">{droppedLayer.emoji}</span>
            <span className="flex-1">{droppedLayer.name}</span>
            {validated && (isCorrect
              ? <CheckCircle className="w-4 h-4 shrink-0" />
              : <XCircle className="w-4 h-4 shrink-0" />)}
          </div>
        ) : (
          <p className={`text-xs font-bold text-center transition-colors
            ${isOver ? 'text-[#395886]' : 'text-[#395886]/25'}`}
          >
            {isOver ? '↓ Lepaskan layer di sini!' : 'Seret layer yang sesuai ke sini...'}
          </p>
        )}
      </div>

      {/* Feedback after validation */}
      {validated && droppedLayerName && (
        <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed font-medium
          ${isCorrect ? 'bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30'
            : 'bg-white/80 text-red-800 border border-red-200'}`}
        >
          {isCorrect
            ? <><CheckCircle className="inline w-3.5 h-3.5 mr-1 text-[#10B981]" />{disruption.correctFeedback}</>
            : <><XCircle className="inline w-3.5 h-3.5 mr-1 text-red-500" />
                <strong>Bukan {droppedLayerName}.</strong>{' '}
                {(disruption.wrongFeedback as unknown as Record<string, string>)[droppedLayerName] ?? 'Analisis lebih dalam hubungan layer dengan skenario gangguan ini.'}</>
          }
        </div>
      )}
    </div>
  );
}

function PoolDropZone({ children, onReturn }: { children: React.ReactNode; onReturn: (layerName: string) => void }) {
  const [{ isOver }, drop] = useDrop({
    accept: DRAG_PIZZA,
    drop: (d: { layerName: string }) => onReturn(d.layerName),
    collect: m => ({ isOver: m.isOver() }),
  });
  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`flex flex-wrap gap-2.5 min-h-[52px] p-3 rounded-2xl border-2 border-dashed transition-all
        ${isOver ? 'border-[#628ECB] bg-[#628ECB]/8 shadow-inner' : 'border-[#D5DEEF] bg-[#F8FAFF]'}`}
    >
      {children}
      {isOver && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-[#628ECB] text-[#628ECB] text-xs font-bold">
          ↓ Kembalikan ke sini
        </div>
      )}
    </div>
  );
}

// ── Pizza Visual Map ───────────────────────────────────────────────────────────

function PizzaLayerMap() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-amber-100">
        <div className="text-2xl">🍕</div>
        <div className="flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Analogi Kontekstual — X.TCP.5</p>
          <h3 className="text-sm font-bold text-[#395886]">The Smart Pizza: 5 Lapisan TCP/IP sebagai Pengiriman Pizza</h3>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
          <MapPin className="w-3 h-3" /> Klik layer untuk detail
        </div>
      </div>

      {/* Journey visual */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {/* Sender */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">👤</div>
            <p className="text-[8px] font-bold text-[#395886]/40 uppercase">Pengirim</p>
          </div>
          <div className="h-px w-4 bg-[#D5DEEF] shrink-0" />

          {/* Layer Cards */}
          {PIZZA_LAYERS.map((layer, idx) => (
            <React.Fragment key={layer.num}>
              <button
                onClick={() => setExpanded(expanded === layer.num ? null : layer.num)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 border-b-4 shrink-0 w-[90px] text-center transition-all
                  bg-gradient-to-br ${layer.gradient} ${layer.border} text-white
                  ${expanded === layer.num ? 'scale-110 shadow-xl -translate-y-1 z-10' : 'hover:scale-105 hover:-translate-y-0.5 shadow-md'}`}
              >
                <span className="text-2xl">{layer.emoji}</span>
                <p className="text-[9px] font-black uppercase tracking-wide leading-tight">{layer.role}</p>
                <p className="text-[8px] opacity-70 font-bold">Lap. {layer.num}</p>
              </button>
              {idx < PIZZA_LAYERS.length - 1 && (
                <div className="flex flex-col items-center shrink-0">
                  <div className="h-px w-4 bg-[#D5DEEF]" />
                </div>
              )}
            </React.Fragment>
          ))}

          <div className="h-px w-4 bg-[#D5DEEF] shrink-0" />
          {/* Receiver */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">🏠</div>
            <p className="text-[8px] font-bold text-[#395886]/40 uppercase">Penerima</p>
          </div>
        </div>
      </div>

      {/* Expanded layer detail */}
      {expanded !== null && (() => {
        const layer = PIZZA_LAYERS.find(l => l.num === expanded)!;
        return (
          <div className={`mx-4 mb-4 p-4 rounded-xl border-2 ${layer.light} ${layer.border}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">{layer.emoji}</span>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${layer.text}`}>
                  Lapisan {layer.num} — {layer.name}
                </p>
                <p className={`text-sm font-bold mb-1 ${layer.text}`}>{layer.role}</p>
                <p className="text-xs text-[#395886]/70 leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Labels */}
      <div className="flex items-center justify-center gap-2 px-5 pb-4 flex-wrap">
        {PIZZA_LAYERS.map(l => (
          <span key={l.num} className={`text-[9px] font-black px-2 py-1 rounded-full text-white ${l.badge}`}>
            {l.emoji} {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Disruption Simulation ──────────────────────────────────────────────────────

function DisruptionSimulation({ lessonId, stageIndex, onSimulationDone }: {
  lessonId: string; stageIndex: number; onSimulationDone: (isCorrect: boolean) => void;
}) {
  const user = getCurrentUser();
  const [placement, setPlacement] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const shuffledDisruptions = DISRUPTIONS;

  const [shuffledLayerNames] = useState<string[]>(() => {
    const arr = PIZZA_LAYERS.map(l => l.name);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then(p =>
      setAttempts(p.stageAttempts[`stage_${stageIndex}_pizza`] || 0)
    );
  }, []);

  const handleDropToSlot = (disruptionId: string, layerName: string) => {
    if (validated) return;
    setPlacement(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (next[k] === layerName) delete next[k]; });
      next[disruptionId] = layerName;
      return next;
    });
  };

  const handleReturnToPool = (layerName: string) => {
    if (validated) return;
    setPlacement(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (next[k] === layerName) delete next[k]; });
      return next;
    });
  };

  const placedIds = new Set(Object.values(placement));
  const unplacedLayers = shuffledLayerNames.filter(n => !placedIds.has(n));
  const allFilled = shuffledDisruptions.every(d => placement[d.id]);

  const correctCount = validated
    ? shuffledDisruptions.filter(d => placement[d.id] === d.correctLayer).length
    : 0;
  const allCorrect = validated && correctCount === shuffledDisruptions.length;

  const handleValidate = async () => {
    const ok = shuffledDisruptions.every(d => placement[d.id] === d.correctLayer);
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, ok, `stage_${stageIndex}_pizza`);
    setAttempts(newA);
    setValidated(true);
  };

  const handleRetry = () => {
    const wrongIds = shuffledDisruptions.filter(d => placement[d.id] !== d.correctLayer).map(d => d.id);
    const next = { ...placement };
    wrongIds.forEach(id => delete next[id]);
    setPlacement(next);
    setValidated(false);
  };

  const isDone = validated && (allCorrect || attempts >= 3);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border-2 border-[#8B5CF6]/20 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#8B5CF6]/10 to-red-50 border-b border-[#8B5CF6]/15">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/15">
            <AlertCircle className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Simulasi Gangguan — X.TCP.5</p>
            <h3 className="text-sm font-bold text-[#395886]">Identifikasi Lapisan yang Bertanggung Jawab</h3>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold
            ${attempts >= 3 ? 'border-red-200 bg-red-50 text-red-500' : 'border-[#8B5CF6]/20 bg-white text-[#8B5CF6]'}`}>
            <AlertCircle className="w-3 h-3" />
            {attempts >= 3 ? 'Habis' : `${3 - attempts} percobaan`}
          </div>
        </div>
        <div className="px-5 py-3 bg-gradient-to-br from-[#8B5CF6]/4 to-transparent">
          <p className="text-sm text-[#395886]/80 leading-relaxed">
            Tiga skenario gangguan muncul saat pengiriman pizza. Seret kartu layer yang paling bertanggung jawab ke tiap gangguan, lalu jelaskan alasanmu.
          </p>
          <p className="text-xs text-[#8B5CF6] font-semibold mt-1.5">
            💡 Pikirkan: layer mana yang fungsinya berkaitan langsung dengan jenis gangguan tersebut?
          </p>
        </div>
      </div>

      {/* Layer chip pool */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#395886]/50 mb-2.5 flex items-center gap-2">
          <GripVertical className="w-3 h-3" /> Kartu Layer ({unplacedLayers.length} tersisa) — Seret ke gangguan yang sesuai
        </p>
        <PoolDropZone onReturn={handleReturnToPool}>
          {unplacedLayers.map(name => {
            const layer = PIZZA_LAYERS.find(l => l.name === name)!;
            return <DraggableLayerTag key={name} name={name} layer={layer} disabled={validated} />;
          })}
          {unplacedLayers.length === 0 && !validated && (
            <p className="text-xs font-bold text-[#395886]/30 py-2 w-full text-center">
              Semua kartu sudah diletakkan ✓ — Kamu bisa kembali seret ke sini jika ingin mengubah
            </p>
          )}
        </PoolDropZone>
      </div>

      {/* Disruption cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {shuffledDisruptions.map(disruption => {
          const droppedName = placement[disruption.id];
          const correct = validated && droppedName === disruption.correctLayer;
          return (
            <DisruptionDropZone
              key={disruption.id}
              disruption={disruption}
              droppedLayerName={droppedName}
              validated={validated}
              isCorrect={correct}
              onDrop={handleDropToSlot}
            />
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-[#EEF2FF] rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(Object.keys(placement).length / shuffledDisruptions.length) * 100}%`,
              background: allFilled ? 'linear-gradient(90deg,#10B981,#059669)' : 'linear-gradient(90deg,#8B5CF6,#628ECB)',
            }}
          />
        </div>
        <span className={`text-xs font-bold shrink-0 ${allFilled ? 'text-[#10B981]' : 'text-[#8B5CF6]'}`}>
          {Object.keys(placement).length} / {shuffledDisruptions.length} diisi
        </span>
      </div>

      {/* Result feedback */}
      {validated && (
        <div className={`p-4 rounded-xl border-2 ${allCorrect ? 'bg-[#ECFDF5] border-[#10B981]/30' : attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-3">
            {allCorrect ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" /> :
              attempts < 3 ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> :
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
            <div>
              <p className={`text-sm font-bold ${allCorrect ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                {allCorrect
                  ? `Semua ${shuffledDisruptions.length} gangguan teridentifikasi dengan tepat! Analisismu logis dan runtut.`
                  : attempts < 3
                  ? `${correctCount}/${shuffledDisruptions.length} gangguan benar. Baca umpan balik di tiap kartu dan coba lagi!`
                  : 'Lihat penjelasan di tiap kartu untuk memahami hubungan layer dengan gangguannya.'}
              </p>
              {!allCorrect && attempts < 3 && (
                <button onClick={handleRetry} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
                  <RotateCcw className="w-3.5 h-3.5" /> Perbaiki yang Salah
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action button */}
      {!validated ? (
        <button onClick={handleValidate} disabled={!allFilled}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${allFilled
            ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/20 active:scale-[0.98]'
            : 'bg-[#EEF2FF] text-[#395886]/30 cursor-not-allowed'}`}
        >
          {allFilled ? 'Periksa Identifikasi Layer' : `Letakkan layer ke ${shuffledDisruptions.length - Object.keys(placement).length} gangguan lagi...`}
        </button>
      ) : isDone ? (
        <button onClick={() => onSimulationDone(allCorrect)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#628ECB] to-[#8B5CF6] text-white font-bold text-sm hover:from-[#395886] hover:to-[#7C3AED] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          <PenLine className="w-4 h-4" /> Lanjut ke Refleksi Argumentatif
        </button>
      ) : null}
    </div>
  );
}

// ── Argumentative Reflection ───────────────────────────────────────────────────

const REFLECTION_PROMPT = 'Jika kurir sudah sampai di gerbang perumahan (Network Layer) tetapi motornya mogok (Physical Layer), mengapa hal tersebut tetap dapat menggagalkan pesanan yang sebenarnya sudah dibungkus rapi (Transport Layer)? Jelaskan berdasarkan keruntutan fungsi lapisan TCP/IP.';

function ArgumentativeReflection({ onDone }: { onDone: (essay: string) => void }) {
  const [essay, setEssay] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 250);
    return () => clearTimeout(t);
  }, []);

  const hints = [
    'Pikirkan: apakah Network Layer bisa bekerja sendiri tanpa Physical Layer?',
    'Apa yang terjadi jika lapisan bawah gagal sementara lapisan atas sudah siap?',
    'Hubungkan dengan konsep "dependency" atau ketergantungan antar lapisan.',
  ];

  return (
    <div ref={ref} className="bg-white rounded-2xl border-2 border-[#628ECB]/20 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#628ECB]/10 to-[#8B5CF6]/5 border-b border-[#628ECB]/15">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#628ECB]/15">
          <PenLine className="w-5 h-5 text-[#628ECB]" />
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#628ECB]">Refleksi Argumentatif — Logical Thinking</p>
          <p className="text-sm font-bold text-[#395886]">Argumentasikan pemahamanmu tentang keterkaitan antar layer</p>
        </div>
        {submitted && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Tersimpan
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Scenario callout */}
        <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Pertanyaan Argumentasi</p>
              <p className="text-sm font-bold text-[#395886] leading-relaxed">{REFLECTION_PROMPT}</p>
            </div>
          </div>
        </div>

        {/* Thinking hints */}
        <div className="mb-4 p-3 rounded-xl bg-[#F8FAFF] border border-[#D5DEEF]">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#628ECB] mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3" /> Panduan Berpikir
          </p>
          <div className="space-y-1.5">
            {hints.map((h, i) => (
              <p key={i} className="text-[11px] text-[#395886]/70 flex gap-2">
                <span className="font-black text-[#628ECB] shrink-0">{i + 1}.</span> {h}
              </p>
            ))}
          </div>
        </div>

        <textarea
          value={essay}
          onChange={e => setEssay(e.target.value)}
          disabled={submitted}
          rows={5}
          className={`w-full p-4 rounded-xl border-2 outline-none transition-all text-sm leading-relaxed resize-none
            ${submitted ? 'border-[#10B981]/30 bg-[#ECFDF5] text-[#065F46]'
              : 'border-[#D5DEEF] bg-[#F8FAFF] focus:bg-white focus:border-[#628ECB]'}`}
          placeholder="Jelaskan argumentasimu secara runtut... (minimal 50 karakter)
Contoh: 'Meskipun Network Layer sudah mengetahui rute dan Transport Layer sudah mempersiapkan paket dengan baik, keduanya tidak dapat berfungsi tanpa Physical Layer karena...'"
        />

        <div className="flex items-center justify-between mt-3">
          <span className={`text-[10px] font-bold ${essay.length >= 50 ? 'text-[#10B981]' : 'text-[#395886]/40'}`}>
            {essay.length} karakter{essay.length > 0 && essay.length < 50 ? ` (${50 - essay.length} lagi)` : ''}{essay.length >= 50 ? ' ✓' : ''}
          </span>
          {submitted ? (
            <span className="text-xs font-bold text-[#10B981]">Refleksi berhasil disimpan</span>
          ) : (
            <button
              onClick={() => { setSubmitted(true); onDone(essay); }}
              disabled={essay.length < 50}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                essay.length >= 50
                  ? 'bg-[#628ECB] text-white hover:bg-[#395886] shadow-sm active:scale-[0.97]'
                  : 'bg-[#EEF2FF] text-[#395886]/30 cursor-not-allowed'}`}
            >
              Kirim Argumen →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lesson 1 Questioning (Pizza Analogy) ─────────────────────────────────────

function QuestioningLesson1({ lessonId, stageIndex, onComplete }: QuestioningStageProps) {
  const [simulationDone, setSimulationDone] = useState(false);
  const [simulationCorrect, setSimulationCorrect] = useState(false);
  const reflectionRef = useRef<HTMLDivElement>(null);

  const handleSimulationDone = (isCorrect: boolean) => {
    setSimulationCorrect(isCorrect);
    setSimulationDone(true);
    setTimeout(() => reflectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  };

  const handleReflectionDone = (essay: string) => {
    onComplete({
      selectedId: 'pizza_simulation',
      isCorrect: simulationCorrect,
      askedQuestions: [],
      justification: essay,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Intro header */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl border-2 border-amber-200 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🍕</div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1">Tahap Questioning — X.TCP.5</p>
            <h2 className="text-xl font-black text-[#395886] mb-2">The Smart Pizza</h2>
            <p className="text-sm text-[#395886]/75 leading-relaxed max-w-2xl">
              Bayangkan pengiriman pizza sebagai analogi jaringan TCP/IP. Setiap lapisan punya peran spesifik — jika satu lapisan gagal, seluruh pengiriman terganggu.
              Eksplorasi peta lapisan, identifikasi gangguan, lalu argumentasikan pemahamanmu secara logis dan runtut.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Pizza Map */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-[#D5DEEF] to-transparent" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-amber-200">
            <span className="text-sm">🗺️</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Peta Analogi</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-[#D5DEEF] to-transparent" />
        </div>
        <PizzaLayerMap />
      </div>

      {/* Section 2: Simulation */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-[#D5DEEF] to-transparent" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
            <AlertCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Simulasi Gangguan</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-[#D5DEEF] to-transparent" />
        </div>
        <DisruptionSimulation
          lessonId={lessonId}
          stageIndex={stageIndex}
          onSimulationDone={handleSimulationDone}
        />
      </div>

      {/* Section 3: Reflection (inline) */}
      {simulationDone && (
        <div ref={reflectionRef}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-[#D5DEEF] to-transparent" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#628ECB]/10 border border-[#628ECB]/20">
              <PenLine className="w-3.5 h-3.5 text-[#628ECB]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#628ECB]">Refleksi Argumentatif</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-[#D5DEEF] to-transparent" />
          </div>
          <ArgumentativeReflection onDone={handleReflectionDone} />
        </div>
      )}
    </div>
  );
}

// ── Original Questioning Stage (for other lessons) ─────────────────────────────

const problemTypeConfig = {
  corruption: { color: 'border-red-400 bg-red-50', icon: Zap, iconColor: 'text-red-500', badge: 'bg-red-500 text-white' },
  'packet-loss': { color: 'border-orange-400 bg-orange-50', icon: WifiOff, iconColor: 'text-orange-500', badge: 'bg-orange-500 text-white' },
  collision: { color: 'border-yellow-400 bg-yellow-50', icon: AlertTriangle, iconColor: 'text-yellow-600', badge: 'bg-yellow-500 text-white' },
  delay: { color: 'border-blue-400 bg-blue-50', icon: Clock, iconColor: 'text-blue-500', badge: 'bg-blue-500 text-white' },
} as const;

function QuestioningOriginal({
  scenario, whyQuestion, hint, reasonOptions, teacherQuestion,
  questionBank, problemVisual, lessonId, stageIndex, onComplete, imageUrl
}: QuestioningStageProps) {
  const user = getCurrentUser();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [justification, setJustification] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then(progress =>
      setAttempts(progress.stageAttempts[`stage_${stageIndex}`] || 0)
    );
  }, [lessonId, stageIndex, user]);

  const currentOption = reasonOptions?.find(o => o.id === selectedReason);
  const correctOption = reasonOptions?.find(o => o.isCorrect);
  const isCorrect = currentOption?.isCorrect ?? false;
  const activeResponse = questionBank?.find(q => q.id === activeQuestionId)?.response;
  const feedbackToShow = submitted ? (isCorrect ? currentOption?.feedback : attempts >= 3 ? correctOption?.feedback : currentOption?.feedback) : '';

  const handleAsk = (id: string) => {
    setActiveQuestionId(id);
    setAskedQuestions(prev => { const next = new Set(prev); next.add(id); return next; });
  };

  const handleSubmit = async () => {
    if (!selectedReason) { setError('Pilih satu solusi teknis terlebih dahulu.'); return; }
    if (justification.trim().length < 30) { setError('Tuliskan alasan logis minimal 30 karakter.'); return; }
    setError('');
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, isCorrect);
    setAttempts(newA);
    setSubmitted(true);
  };

  const handleRetry = () => { setSubmitted(false); setSelectedReason(null); setError(''); };

  const handleContinue = () => {
    onComplete({
      selectedId: isCorrect || attempts < 3 ? selectedReason ?? '' : correctOption?.id ?? '',
      isCorrect, askedQuestions: Array.from(askedQuestions), justification,
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {imageUrl && (
        <div className="rounded-3xl border-2 border-[#D5DEEF] bg-white p-2 shadow-sm overflow-hidden group">
           <img 
             src={imageUrl} 
             alt="Kasus Pertanyaan" 
             className="w-full h-auto max-h-[400px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]" 
           />
        </div>
      )}
      {problemVisual && (() => {
        const config = problemTypeConfig[problemVisual.problemType];
        const IconComponent = config.icon;
        return (
          <div className={`rounded-2xl border-2 p-5 ${config.color}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <span className="text-2xl">{problemVisual.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${config.badge}`}>{problemVisual.problemType.replace('-', ' ')}</span>
                  <h3 className="text-base font-black text-[#395886]">{problemVisual.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-[#395886]/80">{problemVisual.description}</p>
              </div>
              <IconComponent className={`h-6 w-6 shrink-0 ${config.iconColor}`} />
            </div>
          </div>
        );
      })()}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border-2 border-[#D5DEEF] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#D5DEEF] bg-gray-50 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#D5DEEF] bg-white shadow-sm">
                <Eye className="h-4 w-4 text-[#8B5CF6]" />
              </div>
              <h3 className="text-sm font-bold text-[#395886]">Observasi Kasus</h3>
            </div>
            <div className="bg-gradient-to-br from-white to-[#F8FAFF] p-6">
              <p className="text-sm font-medium leading-relaxed text-[#395886]/80">{scenario}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border-2 border-[#8B5CF6]/20 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg ring-4 ring-[#8B5CF6]/10">
            <User className="h-10 w-10" strokeWidth={2.5} />
          </div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Media Fasilitator</p>
          <div className="relative rounded-2xl border border-[#8B5CF6]/10 bg-[#8B5CF6]/5 p-4">
            <p className="text-xs font-bold italic leading-relaxed text-[#395886]">"{teacherQuestion ?? 'Perhatikan kasusnya, lalu putuskan field TCP Header yang paling relevan.'}"</p>
            <div className="absolute -left-2 top-4 h-4 w-4 rotate-[-45deg] border-l border-t border-[#8B5CF6]/10 bg-[#8B5CF6]/5" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border-2 border-[#D5DEEF] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B5CF6]/10">
              <MessageSquare className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <h3 className="text-sm font-bold text-[#395886]">Tanyakan pada Media</h3>
          </div>
          <div className="space-y-2">
            {questionBank?.map(question => (
              <button key={question.id} onClick={() => handleAsk(question.id)}
                className={`w-full rounded-xl border-2 p-3 text-left text-xs font-bold transition-all ${
                  activeQuestionId === question.id ? 'scale-[1.02] border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-md' :
                  askedQuestions.has(question.id) ? 'border-[#8B5CF6]/20 bg-[#8B5CF6]/5 text-[#8B5CF6]' :
                  'border-[#D5DEEF] bg-white text-[#395886]/70 hover:border-[#8B5CF6]/40'}`}>
                {question.text}
              </button>
            ))}
          </div>
          {activeResponse && (
            <div className="mt-6 rounded-2xl border-2 border-[#10B981]/20 bg-[#F0FDF4] p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#10B981]" />
                <p className="text-[10px] font-black uppercase text-[#10B981]">Jawaban Media</p>
              </div>
              <p className="text-xs font-bold leading-relaxed text-[#065F46]">{activeResponse}</p>
            </div>
          )}
          {hint && (
            <div className="mt-5 rounded-2xl border border-[#D5DEEF] bg-[#F8FAFF] p-4">
              <button onClick={() => setShowHint(v => !v)} className="flex w-full items-center justify-between gap-3 text-left">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#8B5CF6]">
                  <Lightbulb className="h-4 w-4" /> Hint
                </span>
                <span className="text-[11px] font-bold text-[#395886]/60">{showHint ? 'Sembunyikan' : 'Tampilkan'}</span>
              </button>
              {showHint && <p className="mt-3 text-xs font-medium leading-relaxed text-[#395886]/80">{hint}</p>}
            </div>
          )}
        </div>

        <div className="rounded-3xl border-2 border-[#D5DEEF] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B5CF6]/10">
                <HelpCircle className="h-4 w-4 text-[#8B5CF6]" />
              </div>
              <h3 className="text-sm font-bold text-[#395886]">Berikan Argumenmu</h3>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 px-3 py-1">
              <AlertCircle className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">
                {attempts < 3 ? `${3 - attempts} percobaan` : 'Habis'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D5DEEF] bg-[#F8FAFF] p-4 mb-5">
            <p className="text-xs font-bold leading-relaxed text-[#395886]">{whyQuestion}</p>
          </div>

          <div className="space-y-2 mb-5">
            {reasonOptions?.map(option => {
              const isSelected = selectedReason === option.id;
              let cls = 'border-[#D5DEEF] hover:border-[#8B5CF6]/50';
              let bgCls = '';
              if (submitted) {
                if (option.isCorrect && (isCorrect || attempts >= 3)) { cls = 'border-[#10B981]'; bgCls = 'bg-[#10B981]/8'; }
                else if (isSelected && !isCorrect) { cls = 'border-red-400'; bgCls = 'bg-red-50'; }
              } else if (isSelected) { cls = 'border-[#8B5CF6]'; bgCls = 'bg-[#8B5CF6]/8'; }

              return (
                <label key={option.id} className={`flex items-start gap-3 rounded-xl border-2 p-3 transition-all ${cls} ${bgCls} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}>
                  <input type="radio" name="questioning" value={option.id} checked={isSelected}
                    onChange={() => !submitted && setSelectedReason(option.id)} disabled={submitted}
                    className="mt-0.5 accent-[#8B5CF6]" />
                  <span className="flex-1 text-[13px] font-medium leading-relaxed text-[#395886]">{option.text}</span>
                  {submitted && option.isCorrect && (isCorrect || attempts >= 3) && <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />}
                </label>
              );
            })}
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold text-[#395886]">Tuliskan alasan logismu:</label>
            <textarea value={justification} onChange={e => setJustification(e.target.value)} disabled={submitted} rows={4}
              className="w-full resize-none rounded-2xl border-2 border-[#D5DEEF] p-4 text-sm font-medium text-[#395886] outline-none transition-all focus:border-[#8B5CF6] disabled:bg-[#F0F3FA]"
              placeholder="Tuliskan alasan logismu di sini..." />
            <p className={`mt-1 text-[11px] ${justification.trim().length >= 30 ? 'text-[#10B981]' : 'text-[#395886]/40'}`}>
              {justification.trim().length} karakter (minimal 30)
            </p>
          </div>

          {error && <div className="mb-4 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">{error}</div>}

          {submitted && feedbackToShow && (
            <div className={`mb-5 rounded-xl border-2 p-4 ${isCorrect ? 'border-[#10B981]/20 bg-[#10B981]/10' : attempts < 3 ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]" /> : attempts < 3 ? <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" /> : <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />}
                <div>
                  <p className={`mb-1 text-[13px] font-bold ${isCorrect ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                    {isCorrect ? 'Analisis tepat' : attempts < 3 ? 'Analisis belum tepat' : 'Kunci analisis'}
                  </p>
                  <p className={`text-[13px] font-bold ${isCorrect ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>{feedbackToShow}</p>
                  {!isCorrect && attempts < 3 && (
                    <button onClick={handleRetry} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
                      <RotateCcw className="h-3.5 w-3.5" /> Coba analisis lagi
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {(!submitted || (attempts < 3 && !isCorrect)) ? (
            <button onClick={handleSubmit} disabled={!selectedReason || justification.trim().length < 30}
              className={`w-full rounded-xl py-3 text-sm font-bold transition-all shadow-sm ${selectedReason && justification.trim().length >= 30 ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]' : 'cursor-not-allowed bg-[#D5DEEF] text-[#395886]/40'}`}>
              Kirim Jawaban
            </button>
          ) : (
            <button onClick={handleContinue}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#628ECB] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#395886]">
              {isCorrect ? 'Lanjutkan' : 'Selesai dan lanjut'} <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export function QuestioningStage(props: QuestioningStageProps) {
  if (props.lessonId === '1') {
    return <QuestioningLesson1 {...props} />;
  }
  return <QuestioningOriginal {...props} />;
}
