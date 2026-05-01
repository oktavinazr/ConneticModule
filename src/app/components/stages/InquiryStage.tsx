import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronRight, CheckCircle, XCircle, RotateCcw, BookOpen,
  GripVertical, Info, AlertCircle, Layers, Tag, ArrowRight, PenLine,
  Link as LinkIcon, ArrowDown,
} from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ExplorationSection { id: string; title: string; content: string; example?: string }
interface Group { id: string; label: string; colorClass: 'blue' | 'green' | 'purple' | 'amber' }
interface GroupItem { id: string; text: string; correctGroup: string }
interface FlowItem { id: string; text: string; correctOrder: number; description?: string; colorClass?: string }
interface LabelingSlot { id: string; label: string; description: string }
interface LabelingLabel { id: string; text: string; correctSlot: string }
interface MatchingPair { left: string; right: string }

interface InquiryStageProps {
  explorationSections?: ExplorationSection[];
  groups?: Group[];
  groupItems?: GroupItem[];
  question?: string;
  flowItems?: FlowItem[];
  flowInstruction?: string;
  labelingSlots?: LabelingSlot[];
  labelingLabels?: LabelingLabel[];
  matchingPairs?: MatchingPair[];
  inquiryReflection1?: string;
  inquiryReflection2?: string;
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: Record<string, string>) => void;
  isCompleted?: boolean;
}

// ── Color maps ─────────────────────────────────────────────────────────────────

const colorMap = {
  blue:   { border: 'border-[#628ECB]', bg: 'bg-[#628ECB]/8', badge: 'bg-[#628ECB] text-white', light: 'bg-[#628ECB]/15 text-[#395886]' },
  green:  { border: 'border-[#10B981]', bg: 'bg-[#10B981]/8', badge: 'bg-[#10B981] text-white', light: 'bg-[#10B981]/15 text-[#065F46]' },
  purple: { border: 'border-[#8B5CF6]', bg: 'bg-[#8B5CF6]/8', badge: 'bg-[#8B5CF6] text-white', light: 'bg-[#8B5CF6]/15 text-[#4C1D95]' },
  amber:  { border: 'border-[#F59E0B]', bg: 'bg-[#F59E0B]/8', badge: 'bg-[#F59E0B] text-white', light: 'bg-[#F59E0B]/15 text-[#78350F]' },
  pink:   { border: 'border-[#EC4899]', bg: 'bg-[#EC4899]/8', badge: 'bg-[#EC4899] text-white', light: 'bg-[#EC4899]/15 text-[#831843]' },
  indigo: { border: 'border-[#6366F1]', bg: 'bg-[#6366F1]/8', badge: 'bg-[#6366F1] text-white', light: 'bg-[#6366F1]/15 text-[#312E81]' },
};
type ColorKey = keyof typeof colorMap;

const flowLayerColors: Record<string, { gradient: string; borderB: string }> = {
  purple: { gradient: 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]', borderB: 'border-b-[#6D28D9]' },
  blue:   { gradient: 'bg-gradient-to-r from-[#628ECB] to-[#395886]', borderB: 'border-b-[#1E3A5F]' },
  green:  { gradient: 'bg-gradient-to-r from-[#10B981] to-[#059669]', borderB: 'border-b-[#047857]' },
  amber:  { gradient: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]', borderB: 'border-b-[#B45309]' },
  pink:   { gradient: 'bg-gradient-to-r from-[#EC4899] to-[#DB2777]', borderB: 'border-b-[#9D174D]' },
};

// ── Grouping DnD ───────────────────────────────────────────────────────────────

const DRAG_GROUP = 'GROUP_ITEM';

function DraggableChip({ item, placed, validated, isCorrect }: { item: GroupItem; placed: boolean; validated: boolean; isCorrect?: boolean }) {
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_GROUP,
    item: { id: item.id },
    canDrag: !placed || !validated,
    collect: (m) => ({ isDragging: m.isDragging() }),
  });
  let cls = 'bg-white border-[#D5DEEF] cursor-move hover:border-[#628ECB]/60 hover:shadow-sm';
  if (placed && validated) cls = isCorrect ? 'bg-[#10B981]/10 border-[#10B981] cursor-default' : 'bg-red-50 border-red-400 cursor-move';
  else if (placed) cls = 'bg-[#628ECB]/8 border-[#628ECB]/40 cursor-move';
  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} className={`flex items-center gap-2 px-3 py-2.5 border-2 rounded-xl text-sm text-[#395886] select-none transition-all ${cls} ${isDragging ? 'opacity-50' : ''}`}>
      {(!placed || !validated) && <GripVertical className="w-3.5 h-3.5 text-[#395886]/30 shrink-0" />}
      {placed && validated && (isCorrect ? <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />)}
      <span className="leading-snug">{item.text}</span>
    </div>
  );
}

function GroupBucket({ group, items, validated, onDrop }: { group: Group; items: GroupItem[]; validated: boolean; onDrop: (groupId: string, itemId: string) => void }) {
  const colors = colorMap[group.colorClass as ColorKey];
  const [{ isOver }, drop] = useDrop({
    accept: DRAG_GROUP,
    drop: (dragged: { id: string }) => onDrop(group.id, dragged.id),
    collect: (m) => ({ isOver: m.isOver() }),
  });
  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`rounded-2xl border-2 p-4 min-h-[120px] transition-all ${isOver ? `${colors.border} ${colors.bg} shadow-md` : 'border-[#D5DEEF] bg-[#F8FAFF]'}`}>
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-3 ${colors.badge}`}>{group.label}</div>
      {items.length === 0 ? <p className="text-xs text-[#395886]/40 italic text-center py-3">Seret item ke sini</p>
        : <div className="space-y-2">{items.map(item => <DraggableChip key={item.id} item={item} placed validated={validated} isCorrect={validated ? item.correctGroup === group.id : undefined} />)}</div>}
    </div>
  );
}

// ── NEW: Drag & Drop Layer Sorter (X.TCP.3) ────────────────────────────────────

const DRAG_LAYER = 'LAYER_SORT_CARD';

function DraggableFlowCard({ item }: { item: FlowItem }) {
  const colors = flowLayerColors[(item.colorClass as keyof typeof flowLayerColors) || 'blue'];
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_LAYER,
    item: { id: item.id },
    collect: m => ({ isDragging: m.isDragging() }),
  });
  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-b-4 text-white font-bold text-sm select-none transition-all
        ${colors.gradient} ${colors.borderB}
        ${isDragging ? 'opacity-30 scale-90 cursor-grabbing' : 'cursor-grab hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl'}`}
    >
      <GripVertical className="w-4 h-4 opacity-60 shrink-0" />
      <span className="tracking-tight">{item.text}</span>
    </div>
  );
}

function FlowDropSlot({ position, placedItem, validated, isCorrect, onDrop }: {
  position: number; placedItem?: FlowItem; validated: boolean; isCorrect?: boolean;
  onDrop: (pos: number, id: string) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: DRAG_LAYER,
    drop: (d: { id: string }) => onDrop(position, d.id),
    collect: m => ({ isOver: m.isOver() }),
  });
  const colors = placedItem ? flowLayerColors[(placedItem.colorClass as keyof typeof flowLayerColors) || 'blue'] : null;
  const posLabel = position === 1 ? 'Paling Atas (dekat pengguna)' : position === 5 ? 'Paling Bawah (transmisi fisik)' : null;

  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className="flex items-stretch gap-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-all duration-300
        ${validated
          ? isCorrect ? 'bg-[#10B981] text-white ring-2 ring-[#10B981]/30 shadow-md' : 'bg-red-400 text-white ring-2 ring-red-400/30'
          : placedItem ? 'bg-[#628ECB] text-white shadow-sm' : 'bg-[#EEF2FF] text-[#395886]/30 border-2 border-dashed border-[#D5DEEF]'}`}
      >
        {position}
      </div>
      <div className={`flex-1 rounded-2xl border-2 transition-all duration-300 min-h-[52px]
        ${isOver ? 'border-[#628ECB] bg-[#628ECB]/8 shadow-md scale-[1.01]' :
          placedItem ? 'border-transparent' : 'border-dashed border-[#D5DEEF] bg-[#F8FAFF]'}`}
      >
        {placedItem && colors ? (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl h-full ${colors.gradient} text-white border-b-4 ${colors.borderB} shadow-sm`}>
            <span className="font-bold text-sm flex-1 tracking-tight">{placedItem.text}</span>
            {placedItem.description && <span className="text-xs opacity-70 hidden md:block">{placedItem.description}</span>}
            {validated && (isCorrect ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />)}
          </div>
        ) : (
          <div className={`flex items-center justify-center h-full text-xs font-bold transition-colors py-3
            ${isOver ? 'text-[#628ECB]' : 'text-[#395886]/20'}`}
          >
            {isOver ? '↓ Lepaskan di sini!' : (posLabel ?? `Seret layer ke posisi ${position}`)}
          </div>
        )}
      </div>
    </div>
  );
}

function DragDropLayerSorter({ flowItems, flowInstruction, lessonId, stageIndex, onComplete }: {
  flowItems: FlowItem[]; flowInstruction?: string; lessonId: string; stageIndex: number; onComplete: () => void;
}) {
  const user = getCurrentUser();
  const [slots, setSlots] = useState<Record<number, string>>({});
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [shuffledPool] = useState<FlowItem[]>(() => {
    const arr = [...flowItems];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then(p =>
      setAttempts(p.stageAttempts[`stage_${stageIndex}_flow`] || 0)
    );
  }, []);

  const handleDrop = (pos: number, id: string) => {
    if (validated) return;
    setSlots(prev => {
      const next = { ...prev };
      (Object.keys(next) as unknown as number[]).forEach(k => { if (next[Number(k)] === id) delete next[Number(k)]; });
      next[pos] = id;
      return next;
    });
  };

  const placedIds = new Set(Object.values(slots));
  const unplacedItems = shuffledPool.filter(it => !placedIds.has(it.id));
  const placedCount = placedIds.size;
  const allPlaced = placedCount === flowItems.length;

  const isCorrectOrder = allPlaced && flowItems.every(item => {
    const pos = Number(Object.keys(slots).find(k => slots[Number(k)] === item.id));
    return pos === item.correctOrder;
  });

  const handleValidate = async () => {
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, isCorrectOrder, `stage_${stageIndex}_flow`);
    setAttempts(newA);
    setValidated(true);
  };

  const handleRetry = () => { setValidated(false); setSlots({}); };
  const isDone = validated && (isCorrectOrder || attempts >= 3);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-2xl border-2 border-[#10B981]/25 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#10B981]/10 to-[#628ECB]/5 border-b border-[#10B981]/15">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/15">
            <Layers className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#10B981]">X.TCP.3 — The Layer Sorting</p>
            <h3 className="text-sm font-bold text-[#395886]">Susun Urutan Lapisan TCP/IP dengan Drag & Drop</h3>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold
            ${attempts >= 3 ? 'border-red-200 bg-red-50 text-red-500' : 'border-[#10B981]/20 bg-white text-[#10B981]'}`}>
            <AlertCircle className="w-3 h-3" />
            {attempts >= 3 ? 'Percobaan habis' : `${3 - attempts} percobaan`}
          </div>
        </div>
        <div className="px-5 py-3 bg-gradient-to-br from-[#10B981]/4 to-transparent">
          <p className="text-sm text-[#395886]/75 leading-relaxed">{flowInstruction ?? 'Susun lapisan TCP/IP dari atas ke bawah sesuai proses encapsulation!'}</p>
          <p className="text-xs text-[#10B981] font-semibold mt-1.5">💡 Seret kartu layer dari kotak di atas ke slot bernomor yang sesuai.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5 sm:p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#395886]/60 font-semibold">Layer yang sudah diletakkan</span>
            <span className={`text-sm font-black ${allPlaced ? 'text-[#10B981]' : 'text-[#628ECB]'}`}>{placedCount} / {flowItems.length}</span>
          </div>
          <div className="h-3 bg-[#EEF2FF] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-3 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(placedCount / flowItems.length) * 100}%`,
                background: allPlaced ? 'linear-gradient(90deg,#10B981,#059669)' : 'linear-gradient(90deg,#628ECB,#8B5CF6)',
              }}
            />
          </div>
        </div>

        {/* Card pool */}
        {unplacedItems.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-br from-[#F8FAFF] to-[#EEF2FF] rounded-2xl border-2 border-dashed border-[#D5DEEF]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#395886]/50 mb-3 flex items-center gap-2">
              <GripVertical className="w-3 h-3" /> Kartu Layer ({unplacedItems.length} tersisa) — Seret ke slot di bawah
            </p>
            <div className="flex flex-wrap gap-2.5">
              {unplacedItems.map(it => <DraggableFlowCard key={it.id} item={it} />)}
            </div>
          </div>
        )}

        {/* Stack builder */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D5DEEF]" />
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#395886]/30">Urutan Encapsulation</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D5DEEF]" />
          </div>
          <div className="space-y-1.5">
            {flowItems.map((item, idx) => {
              const pos = idx + 1;
              const placedId = slots[pos];
              const placedItem = flowItems.find(f => f.id === placedId);
              const correct = validated && placedItem?.correctOrder === pos;
              return (
                <React.Fragment key={pos}>
                  <FlowDropSlot position={pos} placedItem={placedItem} validated={validated} isCorrect={correct} onDrop={handleDrop} />
                  {idx < flowItems.length - 1 && (
                    <div className="flex justify-start pl-[56px]">
                      <ArrowDown className="w-3.5 h-3.5 text-[#D5DEEF]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {validated && (
          <div className={`mb-4 p-4 rounded-xl border-2 ${
            isCorrectOrder ? 'bg-[#ECFDF5] border-[#10B981]/30' :
            attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              {isCorrectOrder ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" /> :
                attempts < 3 ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> :
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              <div>
                <p className={`text-sm font-bold ${isCorrectOrder ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                  {isCorrectOrder ? 'Sempurna! Kamu berhasil menyusun lapisan TCP/IP dengan benar.' :
                    attempts < 3 ? `Urutan belum tepat. Masih ada ${3 - attempts} percobaan tersisa!` :
                    'Urutan benar: Application → Transport → Internet → Data Link → Physical'}
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
          <button onClick={handleValidate} disabled={!allPlaced}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${allPlaced
              ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-md shadow-[#10B981]/20 active:scale-[0.98]'
              : 'bg-[#EEF2FF] text-[#395886]/30 cursor-not-allowed'}`}
          >
            {allPlaced ? 'Periksa Susunan Layer' : `Letakkan ${flowItems.length - placedCount} layer lagi...`}
          </button>
        ) : isDone ? (
          <button onClick={onComplete}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#628ECB] to-[#8B5CF6] text-white font-bold text-sm hover:from-[#395886] hover:to-[#7C3AED] shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <PenLine className="w-4 h-4" /> Lanjut ke Refleksi
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ── Inline Reflection Box ──────────────────────────────────────────────────────

function InlineReflectionBox({ prompt, label = 'Refleksi Pemahaman', onDone }: {
  prompt: string; label?: string; onDone: (essay: string) => void;
}) {
  const [essay, setEssay] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className="max-w-4xl mx-auto bg-white rounded-2xl border-2 border-[#628ECB]/20 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#628ECB]/10 to-[#8B5CF6]/5 border-b border-[#628ECB]/15">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#628ECB]/15">
          <PenLine className="w-5 h-5 text-[#628ECB]" />
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#628ECB]">{label}</p>
          <p className="text-sm font-bold text-[#395886]">Tuliskan pemahamanmu sebelum melanjutkan</p>
        </div>
        {submitted && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Tersimpan
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-sm font-medium text-[#395886] leading-relaxed mb-4">{prompt}</p>
        <textarea
          value={essay}
          onChange={e => setEssay(e.target.value)}
          disabled={submitted}
          rows={4}
          className={`w-full p-4 rounded-xl border-2 outline-none transition-all text-sm leading-relaxed resize-none
            ${submitted ? 'border-[#10B981]/30 bg-[#ECFDF5] text-[#065F46]'
              : 'border-[#D5DEEF] bg-[#F8FAFF] focus:bg-white focus:border-[#628ECB]'}`}
          placeholder="Tuliskan refleksimu di sini... (minimal 30 karakter)"
        />
        <div className="flex items-center justify-between mt-3">
          <span className={`text-[10px] font-bold ${essay.length >= 30 ? 'text-[#10B981]' : 'text-[#395886]/40'}`}>
            {essay.length} karakter{essay.length > 0 && essay.length < 30 ? ` (${30 - essay.length} lagi)` : ''}{essay.length >= 30 ? ' ✓' : ''}
          </span>
          {submitted ? (
            <span className="text-xs font-bold text-[#10B981]">Refleksi berhasil disimpan</span>
          ) : (
            <button
              onClick={() => { setSubmitted(true); onDone(essay); }}
              disabled={essay.length < 30}
              className={`px-5 py-2 rounded-xl font-bold text-xs transition-all ${
                essay.length >= 30 ? 'bg-[#628ECB] text-white hover:bg-[#395886] shadow-sm active:scale-[0.97]'
                  : 'bg-[#EEF2FF] text-[#395886]/30 cursor-not-allowed'}`}
            >
              Kirim & Lanjutkan →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Labeling DnD ───────────────────────────────────────────────────────────────

const DRAG_LABEL = 'LABEL_ITEM';

function LabelChip({ label, placed, validated, isCorrect }: { label: LabelingLabel; placed: boolean; validated: boolean; isCorrect?: boolean }) {
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_LABEL, item: { id: label.id }, canDrag: !placed || !validated,
    collect: (m) => ({ isDragging: m.isDragging() }),
  });
  let cls = 'bg-[#628ECB] text-white cursor-move hover:bg-[#395886] shadow-sm';
  if (placed && validated) cls = isCorrect ? 'bg-[#10B981] text-white cursor-default' : 'bg-red-500 text-white cursor-move';
  else if (placed) cls = 'bg-[#8B5CF6] text-white cursor-move';
  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold select-none transition-all ${cls} ${isDragging ? 'opacity-50' : ''}`}>
      {(!placed || !validated) && <GripVertical className="w-3 h-3 shrink-0" />}
      {placed && validated && (isCorrect ? <CheckCircle className="w-3 h-3 shrink-0" /> : <XCircle className="w-3 h-3 shrink-0" />)}
      {label.text}
    </div>
  );
}

function LabelSlot({ slot, label, validated, isCorrect, onDrop }: {
  slot: LabelingSlot; label?: LabelingLabel; validated: boolean; isCorrect?: boolean;
  onDrop: (slotId: string, labelId: string) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: DRAG_LABEL, drop: (dragged: { id: string }) => onDrop(slot.id, dragged.id),
    collect: (m) => ({ isOver: m.isOver() }),
  });
  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`rounded-xl border-2 p-3 transition-all ${isOver ? 'border-[#628ECB] bg-[#628ECB]/8 shadow-md' : 'border-[#D5DEEF] bg-[#F8FAFF]'}`}>
      <div className="mb-2 min-h-[30px] flex items-center">
        {label ? <LabelChip label={label} placed validated={validated} isCorrect={isCorrect} /> :
          <div className="px-3 py-1.5 rounded-xl border-2 border-dashed border-[#D5DEEF] text-xs text-[#395886]/30 font-medium">Seret label ke sini...</div>}
      </div>
      <div className="pt-2 border-t border-[#D5DEEF]">
        {validated && slot.label ? <p className="text-[10px] font-black text-[#10B981]">{slot.label}</p>
          : <p className="text-[10px] font-bold text-[#395886]/50 uppercase tracking-wide">Slot {slot.id.replace('ls', '')}</p>}
        <p className="text-[11px] text-[#395886]/60 leading-relaxed mt-0.5">{slot.description}</p>
      </div>
    </div>
  );
}

function LabelingContent({ labelingSlots, labelingLabels, lessonId, stageIndex, onComplete }: {
  labelingSlots: LabelingSlot[]; labelingLabels: LabelingLabel[]; lessonId: string; stageIndex: number;
  onComplete: (ans: Record<string, string>) => void;
}) {
  const user = getCurrentUser();
  const [placement, setPlacement] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then((p) => setAttempts(p.stageAttempts[`stage_${stageIndex}_label`] || 0));
  }, []);

  const handleDrop = (slotId: string, labelId: string) => {
    if (validated) return;
    setPlacement(prev => { const next = { ...prev }; const old = Object.keys(next).find(k => next[k] === labelId); if (old) delete next[old]; next[slotId] = labelId; return next; });
  };

  const allPlaced = labelingSlots.every(s => placement[s.id]);
  const correctCount = validated ? labelingSlots.filter(s => { const lbl = labelingLabels.find(l => l.id === placement[s.id]); return lbl?.correctSlot === s.id; }).length : 0;
  const allCorrect = validated && correctCount === labelingSlots.length;
  const showExplanation = validated && (allCorrect || attempts >= 3);

  const handleValidate = async () => {
    const isCorrect = labelingSlots.every(s => { const lbl = labelingLabels.find(l => l.id === placement[s.id]); return lbl?.correctSlot === s.id; });
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, isCorrect, `stage_${stageIndex}_label`);
    setAttempts(newA); setValidated(true);
  };

  const handleRetry = () => {
    const wrongSlots = labelingSlots.filter(s => { const lbl = labelingLabels.find(l => l.id === placement[s.id]); return lbl?.correctSlot !== s.id; });
    const next = { ...placement }; wrongSlots.forEach(s => delete next[s.id]); setPlacement(next); setValidated(false);
  };

  const unplacedLabels = labelingLabels.filter(l => !Object.values(placement).includes(l.id));

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl border-2 border-[#8B5CF6]/20 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#8B5CF6]/8 border-b border-[#8B5CF6]/20">
          <Tag className="w-4 h-4 text-[#8B5CF6]" />
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Aktivitas 3 — Drag-and-Drop Labeling (X.TCP.4)</p>
            <h3 className="text-sm font-bold text-[#395886]">Beri Label Komponen TCP Header</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#8B5CF6]/20">
            <AlertCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-[10px] font-bold text-[#8B5CF6]">{attempts < 3 ? `${3 - attempts} percobaan` : 'Habis'}</span>
          </div>
        </div>
        <div className="px-5 py-4 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent">
          <p className="text-sm text-[#395886]/80">Seret label nama field dari panel bawah ke slot TCP Header yang sesuai berdasarkan deskripsinya!</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-5">
        <div className="mb-4 p-3 rounded-xl bg-gray-900 text-center">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">TCP Header (20 bytes minimum)</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {labelingSlots.map(slot => {
            const placedLabelId = placement[slot.id];
            const label = labelingLabels.find(l => l.id === placedLabelId);
            const isCorrect = validated && label?.correctSlot === slot.id;
            return <LabelSlot key={slot.id} slot={slot} label={label} validated={validated || attempts >= 3} isCorrect={isCorrect} onDrop={handleDrop} />;
          })}
        </div>
        {unplacedLabels.length > 0 && !showExplanation && (
          <div className="mb-5 p-4 bg-[#F8FAFF] rounded-xl border-2 border-dashed border-[#D5DEEF]">
            <p className="text-xs font-bold text-[#395886]/60 mb-3 uppercase tracking-wide">Label tersedia ({unplacedLabels.length})</p>
            <div className="flex flex-wrap gap-2">{unplacedLabels.map(l => <LabelChip key={l.id} label={l} placed={false} validated={false} />)}</div>
          </div>
        )}
        {showExplanation && (
          <div className="mb-5 p-4 rounded-2xl bg-[#628ECB]/5 border-2 border-[#628ECB]/20 border-dashed">
            <p className="text-xs font-bold text-center text-[#395886]/60 mb-3 uppercase tracking-widest">Kunci Jawaban TCP Header</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {labelingSlots.map(slot => {
                const correctLabel = labelingLabels.find(l => l.correctSlot === slot.id);
                return (
                  <div key={slot.id} className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-[#D5DEEF]">
                    <span className="text-[10px] font-black text-[#10B981] px-2 py-1 bg-[#10B981]/10 rounded-lg shrink-0">{correctLabel?.text}</span>
                    <span className="text-[11px] text-[#395886]/70">{slot.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {validated && (
          <div className={`mb-5 p-4 rounded-xl border-2 ${allCorrect ? 'bg-[#10B981]/8 border-[#10B981]/40' : attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {allCorrect ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" /> : attempts < 3 ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> : <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              <div>
                <p className={`text-sm font-bold ${allCorrect ? 'text-[#10B981]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                  {allCorrect ? `Sempurna! Semua ${labelingSlots.length} field TCP Header dilabeli dengan benar.` :
                    attempts < 3 ? `${correctCount}/${labelingSlots.length} label benar. Punya ${3 - attempts} kesempatan lagi!` :
                    'Pelajari kunci jawaban di atas untuk memahami komponen TCP Header.'}
                </p>
                {!allCorrect && attempts < 3 && (
                  <button onClick={handleRetry} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
                    <RotateCcw className="w-3.5 h-3.5" /> Perbaiki Label
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {(!validated || (!allCorrect && attempts < 3)) ? (
          <button onClick={handleValidate} disabled={!allPlaced}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${allPlaced ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-sm' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
            Periksa Pelabelan
          </button>
        ) : (
          <button onClick={() => onComplete(placement)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-bold text-sm hover:bg-[#395886] shadow-sm transition-all">
            {allCorrect ? 'Lanjutkan ke Tahap Berikutnya' : 'Selesai & Lanjut'} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function LabelingPhase(props: { labelingSlots: LabelingSlot[]; labelingLabels: LabelingLabel[]; lessonId: string; stageIndex: number; onComplete: (ans: Record<string, string>) => void }) {
  return <LabelingContent {...props} />;
}

// ── Reflection Phase (for non-lesson-1 flows) ─────────────────────────────────

function ReflectionPhase({ prompt, onComplete }: { prompt: string; onComplete: (essay: string) => void }) {
  const [essay, setEssay] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border-2 border-[#628ECB]/20 shadow-sm p-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#628ECB]/10 text-[#628ECB]">
          <PenLine className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#628ECB] mb-1">Refleksi Pemahaman</p>
          <p className="text-sm font-bold text-[#395886] leading-relaxed">{prompt}</p>
        </div>
      </div>
      <div className="bg-white rounded-[2rem] border-2 border-[#D5DEEF] shadow-sm p-6">
        <textarea value={essay} onChange={(e) => setEssay(e.target.value)} disabled={submitted} rows={5}
          className="w-full p-5 rounded-2xl border-2 border-[#D5DEEF] bg-[#F8FAFF] focus:bg-white focus:border-[#628ECB] outline-none transition-all text-sm font-medium leading-relaxed"
          placeholder="Tuliskan pemahamanmu di sini..." />
        <div className="mt-2 flex justify-end">
          <span className={`text-[10px] font-bold ${essay.length >= 30 ? 'text-[#10B981]' : 'text-[#395886]/40'}`}>{essay.length} / 30 karakter</span>
        </div>
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} disabled={essay.length < 30}
            className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all ${essay.length >= 30 ? 'bg-[#628ECB] text-white hover:bg-[#395886] shadow-md' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
            Kirim Refleksi
          </button>
        ) : (
          <button onClick={() => onComplete(essay)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] text-white font-bold text-sm hover:bg-[#059669] shadow-md transition-all">
            Lanjutkan <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Matching Phase (with shuffleRight & completeLabel support) ─────────────────

function MatchingPhase({ pairs, lessonId, stageIndex, onComplete, shuffleRight, completeLabel }: {
  pairs: MatchingPair[]; lessonId: string; stageIndex: number;
  onComplete: (matches: Record<string, string>) => void;
  shuffleRight?: boolean; completeLabel?: string;
}) {
  const user = getCurrentUser();
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [, forceUpdate] = useState({});

  const [displayedRights] = useState<string[]>(() => {
    const rights = pairs.map(p => p.right);
    if (shuffleRight) {
      for (let i = rights.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rights[i], rights[j]] = [rights[j], rights[i]];
      }
    }
    return rights;
  });

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then((p) => setAttempts(p.stageAttempts[`stage_${stageIndex}_matching`] || 0));
  }, []);

  useEffect(() => {
    const handler = () => forceUpdate({});
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLeftClick = (left: string) => {
    if (validated) return;
    setSelectedLeft(prev => prev === left ? null : left);
  };

  const handleRightClick = (right: string) => {
    if (validated || !selectedLeft) return;
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
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, ok, `stage_${stageIndex}_matching`);
    setAttempts(newA); setValidated(true);
  };

  const handleRetry = () => { setValidated(false); setMatches({}); setSelectedLeft(null); };

  const correctCount = pairs.filter(p => matches[p.left] === p.right).length;
  const allCorrect = validated && correctCount === pairs.length;
  const showExpl = validated && (allCorrect || attempts >= 3);
  const allMatched = Object.keys(matches).length === pairs.length;

  const renderLines = () => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const lines = showExpl
      ? pairs.map(p => ({ left: p.left, right: p.right, ok: true }))
      : Object.entries(matches).map(([left, right]) => ({
          left, right, ok: validated ? pairs.find(p => p.left === left)?.right === right : undefined,
        }));
    return lines.map(({ left, right, ok }) => {
      const lEl = leftRefs.current[left]; const rEl = rightRefs.current[right];
      if (!lEl || !rEl) return null;
      const lR = lEl.getBoundingClientRect(), rR = rEl.getBoundingClientRect();
      const x1 = lR.right - rect.left, y1 = lR.top + lR.height / 2 - rect.top;
      const x2 = rR.left - rect.left, y2 = rR.top + rR.height / 2 - rect.top;
      const color = showExpl ? '#10B981' : ok === false ? '#EF4444' : '#628ECB';
      return <line key={`${left}-${right}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeDasharray={validated ? '' : '5,5'} className="transition-all duration-500" />;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border-2 border-[#628ECB]/20 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#628ECB]/8 border-b border-[#628ECB]/20">
          <LinkIcon className="w-4 h-4 text-[#628ECB]" />
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#628ECB]">X.TCP.4 — Matching Layer Functions</p>
            <h3 className="text-sm font-bold text-[#395886]">Pasangkan Layer dengan Fungsinya</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#628ECB]/20">
            <AlertCircle className="w-3.5 h-3.5 text-[#628ECB]" />
            <span className="text-[10px] font-bold text-[#628ECB]">{attempts < 3 ? `${3 - attempts} percobaan` : 'Habis'}</span>
          </div>
        </div>
        <div className="px-5 py-4 bg-gradient-to-br from-[#628ECB]/5 to-transparent">
          <p className="text-sm text-[#395886]/80 leading-relaxed">Klik satu item di kiri, lalu klik penjelasannya di kanan untuk menghubungkannya.</p>
          {shuffleRight && <p className="text-xs text-[#F59E0B] font-semibold mt-1">⚡ Fungsi-fungsi ditampilkan dalam urutan acak — analisis dengan cermat!</p>}
        </div>
      </div>

      <div className="relative bg-white rounded-3xl border-2 border-[#D5DEEF] shadow-sm p-8" ref={containerRef}>
        <svg className="absolute inset-0 pointer-events-none z-0" style={{ width: '100%', height: '100%' }}>{renderLines()}</svg>
        <div className="grid grid-cols-2 gap-20 relative z-10">
          <div className="space-y-4">
            {pairs.map(p => (
              <button key={p.left} ref={el => { leftRefs.current[p.left] = el; }} onClick={() => handleLeftClick(p.left)} disabled={validated}
                className={`w-full text-left p-4 rounded-2xl border-2 text-xs font-bold transition-all ${
                  selectedLeft === p.left ? 'border-[#F59E0B] bg-[#F59E0B]/10 shadow-md scale-105' :
                  !!matches[p.left] || showExpl ? 'border-[#628ECB] bg-white' : 'border-[#D5DEEF] bg-white hover:border-[#628ECB]/50'}`}
              >{p.left}</button>
            ))}
          </div>
          <div className="space-y-4">
            {displayedRights.map((right, idx) => (
              <button key={idx} ref={el => { rightRefs.current[right] = el; }} onClick={() => handleRightClick(right)} disabled={validated}
                className={`w-full text-left p-4 rounded-2xl border-2 text-xs font-bold transition-all ${
                  Object.values(matches).includes(right) || showExpl ? 'border-[#628ECB] bg-white' : 'border-[#D5DEEF] bg-white hover:border-[#628ECB]/50'}`}
              >{right}</button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {validated && (
            <div className={`mb-6 p-5 rounded-2xl border-2 ${allCorrect ? 'bg-[#10B981]/10 border-[#10B981]/20' : attempts < 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-start gap-4">
                {allCorrect ? <CheckCircle className="w-6 h-6 text-[#10B981] shrink-0" /> :
                  attempts < 3 ? <XCircle className="w-6 h-6 text-red-500 shrink-0" /> :
                  <Info className="w-6 h-6 text-amber-600 shrink-0" />}
                <div>
                  <p className={`text-sm font-bold mb-1 ${allCorrect ? 'text-[#065F46]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                    {allCorrect ? 'Semua pasangan tepat! Kamu memahami fungsi setiap lapisan TCP/IP.' :
                      attempts < 3 ? `Ada ${pairs.length - correctCount} pasangan belum tepat. Kamu punya ${3 - attempts} kesempatan lagi.` :
                      'Pelajari kunci jawaban yang ditandai dengan garis hijau.'}
                  </p>
                  {!allCorrect && attempts < 3 && (
                    <button onClick={handleRetry} className="mt-3 flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700">
                      <RotateCcw className="w-4 h-4" /> Coba Lagi
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!validated || (!allCorrect && attempts < 3) ? (
            <button onClick={handleValidate} disabled={!allMatched}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${allMatched ? 'bg-[#628ECB] text-white hover:bg-[#395886] shadow-[#628ECB]/20' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
              Periksa Pasangan
            </button>
          ) : (
            <button onClick={() => onComplete(matches)}
              className="w-full py-4 rounded-2xl bg-[#10B981] text-white font-black text-sm hover:bg-[#059669] shadow-lg shadow-[#10B981]/20 transition-all flex items-center justify-center gap-2">
              {completeLabel ?? 'Lanjutkan ke Review Materi'} <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Explore Phase ──────────────────────────────────────────────────────────────

function ExplorePhase({ explorationSections, onNext }: { explorationSections: ExplorationSection[]; onNext: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setActiveId(prev => prev === id ? null : id);
    setOpenedIds(prev => { const next = new Set(prev); next.add(id); return next; });
  };

  const allOpened = explorationSections.every(s => openedIds.has(s.id));
  const layerColors = [
    'bg-[#8B5CF6] border-[#7C3AED]', 'bg-[#628ECB] border-[#395886]',
    'bg-[#10B981] border-[#059669]', 'bg-[#F59E0B] border-[#D97706]', 'bg-[#EC4899] border-[#DB2777]',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-[2rem] border-2 border-[#D5DEEF] shadow-sm p-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/10">
            <Layers className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] mb-1">Aktivitas 1 — Eksplorasi Berlapis</p>
            <h3 className="text-xl font-bold text-[#395886]">Pahami Struktur 5 Lapisan TCP/IP</h3>
          </div>
        </div>
        <div className="space-y-3 mb-10">
          {explorationSections.map((section, idx) => {
            const isOpen = activeId === section.id;
            const hasOpened = openedIds.has(section.id);
            const colorClass = layerColors[idx % layerColors.length];
            return (
              <div key={section.id} className={`transition-all duration-500 ease-out ${isOpen ? 'scale-[1.02] z-10' : 'scale-100'}`}>
                <button onClick={() => handleToggle(section.id)}
                  className={`w-full text-left rounded-2xl border-b-4 transition-all overflow-hidden ${colorClass} ${isOpen ? 'shadow-xl -translate-y-1' : 'opacity-90 hover:opacity-100 hover:-translate-y-0.5 shadow-md'}`}>
                  <div className="flex items-center justify-between px-6 py-4 text-white">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white font-black text-sm">
                        {explorationSections.length - idx}
                      </div>
                      <span className="text-base font-black tracking-tight">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {hasOpened && !isOpen && <CheckCircle className="w-4 h-4 text-white/60" />}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {isOpen && (
                    <div className="bg-white mx-1 mb-1 rounded-xl p-6 animate-in slide-in-from-top-4 duration-500">
                      <p className="text-sm text-[#395886]/80 leading-relaxed font-medium mb-4">{section.content}</p>
                      {section.example && (
                        <div className="bg-[#F8FAFF] rounded-xl p-4 border border-[#D5DEEF] flex gap-3">
                          <Info className="w-5 h-5 text-[#628ECB] shrink-0" />
                          <p className="text-sm text-[#395886]/70 italic leading-relaxed">{section.example}</p>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
        <div className="pt-8 border-t border-[#D5DEEF] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {explorationSections.map((s) => (
                <div key={s.id} className={`w-3 h-3 rounded-full border-2 border-white ring-1 ring-gray-100 ${openedIds.has(s.id) ? 'bg-[#10B981]' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-xs font-bold text-[#395886]/50 uppercase tracking-widest">{openedIds.size} / {explorationSections.length} Lapisan Terbuka</p>
          </div>
          <button onClick={onNext} disabled={!allOpened}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${allOpened ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-lg shadow-[#10B981]/20' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
            Lanjut ke Layer Sorting <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Grouping Phase ─────────────────────────────────────────────────────────────

function GroupingContent({ groups, groupItems, question, lessonId, stageIndex, onComplete }: {
  groups: Group[]; groupItems: GroupItem[]; question?: string; lessonId: string; stageIndex: number;
  onComplete: (ans: Record<string, string>) => void;
}) {
  const user = getCurrentUser();
  const [placement, setPlacement] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    getLessonProgress(user!.id, lessonId).then((p) => setAttempts(p.stageAttempts[`stage_${stageIndex}`] || 0));
  }, []);

  const unplaced = groupItems.filter(it => !placement[it.id]);
  const allPlaced = unplaced.length === 0;
  const correctCount = validated ? groupItems.filter(it => placement[it.id] === it.correctGroup).length : 0;
  const allCorrect = validated && correctCount === groupItems.length;
  const showExplanation = validated && (allCorrect || attempts >= 3);
  const progress = groupItems.length > 0 ? Object.keys(placement).length / groupItems.length : 0;

  const handleDrop = (gid: string, iid: string) => { if (validated) return; setPlacement(prev => ({ ...prev, [iid]: gid })); };

  const handleValidate = async () => {
    const ok = groupItems.every(it => placement[it.id] === it.correctGroup);
    const newA = await saveStageAttempt(user!.id, lessonId, stageIndex, ok);
    setAttempts(newA); setValidated(true);
  };

  const handleRetry = () => {
    const wrong = groupItems.filter(it => placement[it.id] !== it.correctGroup);
    const next = { ...placement }; wrong.forEach(it => delete next[it.id]); setPlacement(next); setValidated(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-[#395886]/60 uppercase tracking-widest">Aktivitas Pengelompokan</p>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#628ECB]/5 border border-[#628ECB]/20">
          <AlertCircle className="w-3.5 h-3.5 text-[#628ECB]" />
          <span className="text-[10px] font-bold text-[#628ECB] uppercase tracking-wider">{attempts < 3 ? `${3 - attempts} Percobaan Tersisa` : 'Kesempatan Habis'}</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-6 sm:p-8">
        <div className="mb-6"><h3 className="text-base font-bold text-[#395886]">{question ?? 'Kelompokkan item-item berikut ke dalam kategori yang tepat'}</h3></div>
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[#395886]/60 mb-1.5"><span>Progres</span><span>{Object.keys(placement).length}/{groupItems.length}</span></div>
          <div className="h-2 w-full bg-[#D5DEEF] rounded-full overflow-hidden"><div className="h-2 bg-[#628ECB] rounded-full transition-all" style={{ width: `${progress * 100}%` }} /></div>
        </div>
        {unplaced.length > 0 && !showExplanation && (
          <div className="mb-6 p-4 bg-[#F8FAFF] rounded-xl border-2 border-dashed border-[#D5DEEF]">
            <p className="text-xs font-bold text-[#395886]/60 mb-3 uppercase tracking-wide">Item tersedia ({unplaced.length})</p>
            <div className="flex flex-wrap gap-2">{unplaced.map(it => <DraggableChip key={it.id} item={it} placed={false} validated={false} />)}</div>
          </div>
        )}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {groups.map(g => <GroupBucket key={g.id} group={g} items={groupItems.filter(it => placement[it.id] === g.id)} validated={validated || attempts >= 3} onDrop={handleDrop} />)}
        </div>
        {showExplanation && (
          <div className="mb-6 p-5 rounded-2xl bg-[#628ECB]/5 border-2 border-[#628ECB]/20 border-dashed">
            <p className="text-xs font-bold text-[#395886]/60 mb-4 uppercase tracking-widest text-center">Kunci Jawaban</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {groupItems.map(item => {
                const group = groups.find(g => g.id === item.correctGroup);
                const colors = colorMap[group?.colorClass as ColorKey || 'blue'];
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#D5DEEF] shadow-sm">
                    <span className="text-xs font-medium text-[#395886]">{item.text}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${colors.badge}`}>{group?.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {validated && (
          <div className={`mb-6 p-4 rounded-xl border-2 ${allCorrect ? 'bg-[#10B981]/8 border-[#10B981]/40' : attempts < 3 ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {allCorrect ? <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" /> : attempts < 3 ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> : <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              <div>
                <p className={`text-sm font-bold mb-1 ${allCorrect ? 'text-[#10B981]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                  {allCorrect ? `Sempurna! Semua ${groupItems.length} item benar.` : attempts < 3 ? `Ada penempatan belum tepat (${correctCount}/${groupItems.length}). Punya ${3 - attempts} kesempatan.` : 'Pelajari kunci jawaban untuk memahami materi.'}
                </p>
                {!allCorrect && attempts < 3 && (
                  <button onClick={handleRetry} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"><RotateCcw className="w-3.5 h-3.5" /> Coba Perbaiki</button>
                )}
              </div>
            </div>
          </div>
        )}
        {(!validated || (!allCorrect && attempts < 3)) ? (
          <button onClick={handleValidate} disabled={!allPlaced}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${allPlaced ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-sm' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}>
            Periksa Pengelompokan
          </button>
        ) : (
          <button onClick={() => onComplete(placement)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-semibold text-sm hover:bg-[#395886] shadow-sm transition-all">
            {allCorrect ? 'Lanjutkan ke Tahap Berikutnya' : 'Selesai & Lanjut'} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Lesson 1 Single-Page Inquiry ───────────────────────────────────────────────

function InquiryLesson1Page(props: InquiryStageProps) {
  const { explorationSections, flowItems, flowInstruction, matchingPairs,
    inquiryReflection1, inquiryReflection2, lessonId, stageIndex, onComplete, isCompleted } = props;

  const [exploreComplete, setExploreComplete] = useState(false);
  const [sortingComplete, setSortingComplete] = useState(false);
  const [reflection1Done, setReflection1Done] = useState(false);
  const [matchingComplete, setMatchingComplete] = useState(false);
  const [reflection2Done, setReflection2Done] = useState(false);

  const sortingRef = useRef<HTMLDivElement>(null);
  const matchingRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (exploreComplete) {
      const t = setTimeout(() => sortingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      return () => clearTimeout(t);
    }
  }, [exploreComplete]);

  useEffect(() => {
    if (reflection1Done) {
      const t = setTimeout(() => matchingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      return () => clearTimeout(t);
    }
  }, [reflection1Done]);

  useEffect(() => {
    if (reflection2Done) {
      const t = setTimeout(() => doneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
      return () => clearTimeout(t);
    }
  }, [reflection2Done]);

  if (isCompleted) {
    return (
      <div className="flex justify-center py-8">
        <button onClick={() => onComplete({})}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#10B981] text-white font-black text-sm hover:bg-[#059669] transition-all shadow-xl shadow-[#10B981]/20 active:scale-95">
          Lanjut ke Tahap Berikutnya <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Section 1: Explore */}
      <ExplorePhase explorationSections={explorationSections ?? []} onNext={() => setExploreComplete(true)} />

      {/* Section 2: X.TCP.3 + Inline Reflection 1 */}
      {exploreComplete && (
        <div ref={sortingRef} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-[#D5DEEF] to-transparent" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
              <Layers className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">X.TCP.3 — Layer Sorting</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-[#D5DEEF] to-transparent" />
          </div>

          <DragDropLayerSorter
            flowItems={flowItems ?? []}
            flowInstruction={flowInstruction}
            lessonId={lessonId}
            stageIndex={stageIndex}
            onComplete={() => setSortingComplete(true)}
          />

          {sortingComplete && !reflection1Done && (
            <InlineReflectionBox
              label="Refleksi 1 — Layer Sorting (X.TCP.3)"
              prompt={inquiryReflection1 ?? 'Jelaskan pemahamanmu tentang urutan 5 lapisan TCP/IP. Mengapa data harus melewati urutan tersebut dari atas ke bawah saat dikirim?'}
              onDone={() => setReflection1Done(true)}
            />
          )}

          {reflection1Done && (
            <div className="max-w-4xl mx-auto flex items-center gap-3 p-3 rounded-xl bg-[#10B981]/8 border border-[#10B981]/20">
              <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
              <p className="text-xs font-bold text-[#065F46]">X.TCP.3 & Refleksi 1 selesai — lanjut ke aktivitas berikutnya ↓</p>
            </div>
          )}
        </div>
      )}

      {/* Section 3: X.TCP.4 + Inline Reflection 2 */}
      {reflection1Done && (
        <div ref={matchingRef} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-[#D5DEEF] to-transparent" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#628ECB]/10 border border-[#628ECB]/20">
              <LinkIcon className="w-3.5 h-3.5 text-[#628ECB]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#628ECB]">X.TCP.4 — Matching Layer Functions</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-[#D5DEEF] to-transparent" />
          </div>

          <MatchingPhase
            pairs={matchingPairs ?? []}
            lessonId={lessonId}
            stageIndex={stageIndex}
            shuffleRight
            completeLabel="Lanjut ke Refleksi ↓"
            onComplete={() => setMatchingComplete(true)}
          />

          {matchingComplete && !reflection2Done && (
            <InlineReflectionBox
              label="Refleksi 2 — Fungsi Layer (X.TCP.4)"
              prompt={inquiryReflection2 ?? 'Jelaskan fungsi tiap layer TCP/IP dengan bahasamu sendiri! Bagaimana setiap layer bekerja sama untuk memastikan data sampai ke tujuan?'}
              onDone={() => setReflection2Done(true)}
            />
          )}
        </div>
      )}

      {/* Completion */}
      {reflection2Done && (
        <div ref={doneRef} className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#10B981]/10 to-[#628ECB]/5 rounded-3xl border-2 border-[#10B981]/20 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#10B981]/15 mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#10B981]" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-[#10B981] mb-2">Tahap Inquiry Selesai</p>
            <h3 className="text-xl font-bold text-[#395886] mb-2">Semua aktivitas berhasil diselesaikan!</h3>
            <p className="text-sm text-[#395886]/70 mb-6 max-w-md mx-auto">
              Kamu telah mengeksplorasi lapisan TCP/IP, menyusun urutannya, memasangkan fungsinya, dan merefleksikan pemahaman dalam satu alur yang runtut.
            </p>
            <button onClick={() => onComplete({})}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black text-sm hover:from-[#059669] hover:to-[#047857] transition-all shadow-xl shadow-[#10B981]/20 active:scale-95 group">
              Lanjut ke Tahap Questioning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main InquiryStage ──────────────────────────────────────────────────────────

function InquiryStageContent(props: InquiryStageProps) {
  const { explorationSections, groups, groupItems, question, flowItems, flowInstruction,
    labelingSlots, labelingLabels, matchingPairs, inquiryReflection1, inquiryReflection2,
    lessonId, stageIndex, onComplete, isCompleted } = props;

  // Lesson 1 uses new single-page layout
  if (lessonId === '1') {
    return <InquiryLesson1Page {...props} />;
  }

  // Other lessons: original phase-based flow
  const hasFlow = (flowItems?.length ?? 0) > 0;
  const hasLabeling = (labelingSlots?.length ?? 0) > 0 && (labelingLabels?.length ?? 0) > 0;
  const hasGroups = (groups?.length ?? 0) > 0 && (groupItems?.length ?? 0) > 0;
  const hasMatching = (matchingPairs?.length ?? 0) > 0;

  const [phase, setPhase] = useState<'explore' | 'flow' | 'reflection1' | 'matching' | 'review' | 'reflection2' | 'labeling' | 'group'>('explore');
  const [flowDone, setFlowDone] = useState(false);

  const handleExploreNext = () => {
    if (hasFlow) setPhase('flow');
    else if (hasLabeling) setPhase('labeling');
    else if (hasGroups) setPhase('group');
    else onComplete({});
  };

  const SkipButton = ({ targetPhase, nextLabel }: { targetPhase?: 'flow' | 'reflection1' | 'matching' | 'review' | 'reflection2' | 'labeling' | 'group' | 'complete'; nextLabel: string }) => {
    if (!isCompleted) return null;
    return (
      <div className="flex justify-center my-6">
        <button onClick={() => { if (targetPhase === 'complete') onComplete({}); else if (targetPhase) setPhase(targetPhase); }}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#10B981] text-white font-black text-sm hover:bg-[#059669] transition-all shadow-xl shadow-[#10B981]/20 active:scale-95">
          {nextLabel} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (phase === 'explore') {
    return (
      <div className="space-y-6">
        <ExplorePhase explorationSections={explorationSections ?? []} onNext={handleExploreNext} />
        <SkipButton targetPhase={hasFlow ? 'flow' : hasLabeling ? 'labeling' : hasGroups ? 'group' : 'complete'} nextLabel="Lanjutkan" />
      </div>
    );
  }

  if (phase === 'flow' && hasFlow) {
    return (
      <div className="space-y-4">
        <button onClick={() => setPhase('explore')} className="flex items-center gap-1.5 text-sm text-[#10B981] hover:text-[#065F46] font-semibold">
          <BookOpen className="w-4 h-4" /> Kembali ke materi
        </button>
        <DragDropLayerSorter
          flowItems={flowItems!}
          flowInstruction={flowInstruction}
          lessonId={lessonId}
          stageIndex={stageIndex}
          onComplete={() => { setFlowDone(true); if (hasLabeling) setPhase('labeling'); else onComplete({}); }}
        />
        <SkipButton targetPhase={hasLabeling ? 'labeling' : hasGroups ? 'group' : 'complete'} nextLabel="Lanjutkan" />
      </div>
    );
  }

  if (phase === 'labeling' && hasLabeling) {
    return (
      <div className="space-y-4">
        {flowDone && (
          <button onClick={() => setPhase('flow')} className="flex items-center gap-1.5 text-sm text-[#8B5CF6] hover:text-[#7C3AED] font-semibold">
            <Layers className="w-4 h-4" /> Kembali ke Flow Builder
          </button>
        )}
        <LabelingPhase labelingSlots={labelingSlots!} labelingLabels={labelingLabels!} lessonId={lessonId} stageIndex={stageIndex} onComplete={onComplete} />
        <SkipButton targetPhase={hasGroups ? 'group' : 'complete'} nextLabel={hasGroups ? 'Lanjut ke Grouping' : 'Selesaikan Tahap Ini'} />
      </div>
    );
  }

  if (phase === 'group' && hasGroups) {
    return (
      <div className="space-y-4">
        <button onClick={() => setPhase('explore')} className="flex items-center gap-1.5 text-sm text-[#628ECB] hover:text-[#395886] font-semibold">
          <BookOpen className="w-4 h-4" /> Kembali ke materi
        </button>
        <GroupingContent groups={groups!} groupItems={groupItems!} question={question} lessonId={lessonId} stageIndex={stageIndex} onComplete={onComplete} />
        <SkipButton targetPhase="complete" nextLabel="Selesaikan Tahap Ini" />
      </div>
    );
  }

  if (phase === 'reflection1') {
    return (
      <div className="space-y-4">
        <ReflectionPhase prompt={inquiryReflection1 ?? 'Jelaskan kembali pemahamanmu.'} onComplete={() => setPhase(hasMatching ? 'matching' : 'review')} />
        <SkipButton targetPhase={hasMatching ? 'matching' : 'complete'} nextLabel="Lanjutkan" />
      </div>
    );
  }

  if (phase === 'matching' && hasMatching) {
    return (
      <div className="space-y-4">
        <SkipButton targetPhase="review" nextLabel="Lanjut ke Review" />
        <MatchingPhase pairs={matchingPairs!} lessonId={lessonId} stageIndex={stageIndex} onComplete={() => setPhase('review')} />
        <SkipButton targetPhase="review" nextLabel="Lanjut ke Review" />
      </div>
    );
  }

  if (phase === 'review') {
    return (
      <div className="space-y-6">
        <SkipButton targetPhase="reflection2" nextLabel="Lanjut ke Refleksi" />
        <ExplorePhase explorationSections={explorationSections ?? []} onNext={() => setPhase('reflection2')} />
        <SkipButton targetPhase="reflection2" nextLabel="Lanjut ke Refleksi" />
      </div>
    );
  }

  if (phase === 'reflection2') {
    return (
      <div className="space-y-4">
        <SkipButton targetPhase="complete" nextLabel="Selesaikan Tahap Ini" />
        <ReflectionPhase prompt={inquiryReflection2 ?? 'Jelaskan fungsi tiap layer dengan bahasamu sendiri.'} onComplete={() => onComplete({})} />
        <SkipButton targetPhase="complete" nextLabel="Selesaikan Tahap Ini" />
      </div>
    );
  }

  return null;
}

export function InquiryStage(props: InquiryStageProps) {
  return <InquiryStageContent {...props} />;
}
