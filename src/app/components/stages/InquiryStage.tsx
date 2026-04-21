import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, RotateCcw, BookOpen, GripVertical, Info, AlertCircle } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';

// ── Tipe data ─────────────────────────────────────────────────────────────────

interface ExplorationSection {
  id: string;
  title: string;
  content: string;
  example?: string;
}

interface Group {
  id: string;
  label: string;
  colorClass: 'blue' | 'green' | 'purple' | 'amber';
}

interface GroupItem {
  id: string;
  text: string;
  correctGroup: string;
}

interface InquiryStageProps {
  explorationSections?: ExplorationSection[];
  groups?: Group[];
  groupItems?: GroupItem[];
  question?: string;
  lessonId: string;
  stageIndex: number;
  onComplete: (answer: Record<string, string>) => void;
}

// ── Pembantu warna ────────────────────────────────────────────────────────────

const colorMap = {
  blue:   { border: 'border-[#628ECB]', bg: 'bg-[#628ECB]/8',  text: 'text-[#395886]',  badge: 'bg-[#628ECB] text-white' },
  green:  { border: 'border-[#10B981]', bg: 'bg-[#10B981]/8',  text: 'text-[#065F46]',  badge: 'bg-[#10B981] text-white' },
  purple: { border: 'border-[#8B5CF6]', bg: 'bg-[#8B5CF6]/8',  text: 'text-[#4C1D95]',  badge: 'bg-[#8B5CF6] text-white' },
  amber:  { border: 'border-[#F59E0B]', bg: 'bg-[#F59E0B]/8',  text: 'text-[#78350F]',  badge: 'bg-[#F59E0B] text-white' },
};

// ── Item seret dan lepas ──────────────────────────────────────────────────────

const DRAG_TYPE = 'GROUP_ITEM';

interface DraggableChipProps {
  item: GroupItem;
  placed: boolean;
  validated: boolean;
  isCorrect?: boolean;
}

function DraggableChip({ item, placed, validated, isCorrect }: DraggableChipProps) {
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: { id: item.id },
    canDrag: !placed || !validated,
    collect: (m) => ({ isDragging: m.isDragging() }),
  });

  let cls = 'bg-white border-[#D5DEEF] cursor-move hover:border-[#628ECB]/60 hover:shadow-sm';
  if (placed && validated) {
    cls = isCorrect
      ? 'bg-[#10B981]/10 border-[#10B981] cursor-default'
      : 'bg-red-50 border-red-400 cursor-move';
  } else if (placed) {
    cls = 'bg-[#628ECB]/8 border-[#628ECB]/40 cursor-move';
  }

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`flex items-center gap-2 px-3 py-2.5 border-2 rounded-xl text-sm text-[#395886] select-none transition-all ${cls} ${isDragging ? 'opacity-50' : ''}`}
    >
      {(!placed || !validated) && <GripVertical className="w-3.5 h-3.5 text-[#395886]/30 shrink-0" />}
      {placed && validated && (
        isCorrect
          ? <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
          : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
      )}
      <span className="leading-snug">{item.text}</span>
    </div>
  );
}

// ── Zona lepas (kelompok bucket) ──────────────────────────────────────────────

interface GroupBucketProps {
  group: Group;
  items: GroupItem[];
  allItems: GroupItem[];
  validated: boolean;
  onDrop: (groupId: string, itemId: string) => void;
}

function GroupBucket({ group, items, allItems, validated, onDrop }: GroupBucketProps) {
  const colors = colorMap[group.colorClass];

  const [{ isOver }, drop] = useDrop({
    accept: DRAG_TYPE,
    drop: (dragged: { id: string }) => onDrop(group.id, dragged.id),
    collect: (m) => ({ isOver: m.isOver() }),
  });

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`rounded-2xl border-2 p-4 min-h-[120px] transition-all ${
        isOver ? `${colors.border} ${colors.bg} shadow-md` : 'border-[#D5DEEF] bg-[#F8FAFF]'
      }`}
    >
      {/* Label Kelompok */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-3 ${colors.badge}`}>
        {group.label}
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-[#395886]/40 italic text-center py-3">Seret item ke sini</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const isCorrect = validated ? item.correctGroup === group.id : undefined;
            return (
              <DraggableChip
                key={item.id}
                item={item}
                placed
                validated={validated}
                isCorrect={isCorrect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Konten utama ──────────────────────────────────────────────────────────────

function InquiryStageContent({
  explorationSections,
  groups,
  groupItems,
  question,
  lessonId,
  stageIndex,
  onComplete,
}: InquiryStageProps) {
  const user = getCurrentUser();
  const initialProgress = getLessonProgress(user!.id, lessonId);
  
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [placement, setPlacement] = useState<Record<string, string>>({}); // itemId → groupId (id item → id kelompok)
  const [validated, setValidated] = useState(false);
  const [phase, setPhase] = useState<'explore' | 'group'>('explore');
  const [attempts, setAttempts] = useState(initialProgress.stageAttempts[`stage_${stageIndex}`] || 0);

  const safeGroups = groups ?? [];
  const safeItems = groupItems ?? [];

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDrop = (groupId: string, itemId: string) => {
    if (validated) return;
    setPlacement((prev) => ({ ...prev, [itemId]: groupId }));
  };

  const handleValidate = () => {
    const isCorrect = safeItems.every(item => placement[item.id] === item.correctGroup);
    const newAttempts = saveStageAttempt(user!.id, lessonId, stageIndex, isCorrect);
    setAttempts(newAttempts);
    setValidated(true);
  };

  const handleRetry = () => {
    const wrongItems = safeItems.filter(
      (item) => placement[item.id] !== item.correctGroup
    );
    const newPlacement = { ...placement };
    wrongItems.forEach((item) => delete newPlacement[item.id]);
    setPlacement(newPlacement);
    setValidated(false);
  };

  const handleComplete = () => {
    onComplete(placement);
  };

  // Item yang belum ditempatkan
  const unplacedItems = safeItems.filter((item) => !placement[item.id]);

  // Item per kelompok
  const itemsInGroup = (groupId: string) =>
    safeItems.filter((item) => placement[item.id] === groupId);

  // Skor
  const correctCount = validated
    ? safeItems.filter((item) => placement[item.id] === item.correctGroup).length
    : 0;
  const allCorrect = validated && correctCount === safeItems.length;

  const allPlaced = unplacedItems.length === 0;
  const progress = safeItems.length > 0 ? Object.keys(placement).length / safeItems.length : 0;
  
  const showExplanation = validated && (allCorrect || attempts >= 3);

  // ── Fase: Eksplorasi ──────────────────────────────────────────────

  if (phase === 'explore') {
    const allSectionsOpened =
      !explorationSections ||
      explorationSections.every((s) => openSections.has(s.id));

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/10">
                <BookOpen className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#10B981] mb-0.5">Eksplorasi Materi</p>
                <h3 className="text-base font-bold text-[#395886]">Klik setiap bagian untuk mempelajarinya</h3>
              </div>
            </div>
            {attempts > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-[#D5DEEF]">
                <RotateCcw className="w-3.5 h-3.5 text-[#395886]/50" />
                <span className="text-[10px] font-bold text-[#395886]/60 uppercase tracking-tight">
                  {attempts}x Percobaan
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {(explorationSections ?? []).map((section) => {
              const isOpen = openSections.has(section.id);
              return (
                <div
                  key={section.id}
                  className={`rounded-xl border-2 overflow-hidden transition-all ${
                    isOpen ? 'border-[#10B981]/40' : 'border-[#D5DEEF]'
                  }`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors ${
                      isOpen ? 'bg-[#10B981]/8' : 'bg-[#F8FAFF] hover:bg-[#F0F3FA]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                          isOpen ? 'bg-[#10B981]' : 'bg-[#D5DEEF]'
                        }`}
                      />
                      <span className={`text-sm font-semibold ${isOpen ? 'text-[#065F46]' : 'text-[#395886]'}`}>
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#395886]/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 py-4 border-t border-[#10B981]/20 bg-white">
                      <p className="text-sm text-[#395886]/80 leading-relaxed mb-3">{section.content}</p>
                      {section.example && (
                        <div className="bg-[#F0F3FA] rounded-lg px-4 py-3 border border-[#D5DEEF]">
                          <p className="text-xs font-bold text-[#628ECB] mb-1">Contoh / Analogi</p>
                          <p className="text-sm text-[#395886]/80 italic">{section.example}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-[#D5DEEF] flex items-center justify-between gap-4">
            <p className="text-xs text-[#395886]/50">
              {openSections.size} / {explorationSections?.length ?? 0} bagian dibuka
            </p>
            <button
              onClick={() => setPhase('group')}
              disabled={!allSectionsOpened && (explorationSections?.length ?? 0) > 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                allSectionsOpened || (explorationSections?.length ?? 0) === 0
                  ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-sm'
                  : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
              }`}
            >
              Lanjut ke Aktivitas Pengelompokan
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Fase: Pengelompokan ───────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPhase('explore')}
          className="flex items-center gap-1.5 text-sm text-[#628ECB] hover:text-[#395886] font-semibold transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Kembali ke materi
        </button>
        
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#628ECB]/5 border border-[#628ECB]/20">
          <AlertCircle className="w-3.5 h-3.5 text-[#628ECB]" />
          <span className="text-[10px] font-bold text-[#628ECB] uppercase tracking-wider">
            {attempts < 3 ? `${3 - attempts} Percobaan Tersisa` : 'Kesempatan Habis — Lihat Penjelasan'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-[#D5DEEF] shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#10B981] mb-1">Aktivitas Pengelompokan</p>
          <h3 className="text-base font-bold text-[#395886]">
            {question ?? 'Kelompokkan item-item berikut ke dalam kategori yang tepat'}
          </h3>
          <p className="text-sm text-[#395886]/60 mt-1">
            Seret setiap item ke kelompok yang sesuai
          </p>
        </div>

        {/* Bilah progres */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[#395886]/60 mb-1.5">
            <span>Progres penempatan</span>
            <span>{Object.keys(placement).length} / {safeItems.length} item</span>
          </div>
          <div className="h-2 w-full bg-[#D5DEEF] rounded-full overflow-hidden">
            <div
              className="h-2 bg-[#628ECB] rounded-full transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Kumpulan item yang belum ditempatkan */}
        {unplacedItems.length > 0 && !showExplanation && (
          <div className="mb-6 p-4 bg-[#F8FAFF] rounded-xl border-2 border-dashed border-[#D5DEEF]">
            <p className="text-xs font-bold text-[#395886]/60 mb-3 uppercase tracking-wide">
              Item tersedia ({unplacedItems.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {unplacedItems.map((item) => (
                <DraggableChip
                  key={item.id}
                  item={item}
                  placed={false}
                  validated={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Kelompok bucket */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {safeGroups.map((group) => (
            <GroupBucket
              key={group.id}
              group={group}
              items={itemsInGroup(group.id)}
              allItems={safeItems}
              validated={validated || attempts >= 3}
              onDrop={handleDrop}
            />
          ))}
        </div>

        {/* Hasil validasi */}
        {validated && (
          <div
            className={`rounded-xl p-4 mb-6 border-2 ${
              allCorrect
                ? 'bg-[#10B981]/8 border-[#10B981]/40'
                : attempts < 3
                ? 'bg-red-50 border-red-100'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {allCorrect ? (
                <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              ) : attempts < 3 ? (
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-bold mb-1 ${allCorrect ? 'text-[#10B981]' : attempts < 3 ? 'text-red-800' : 'text-amber-800'}`}>
                  {allCorrect
                    ? `Sempurna! Semua ${safeItems.length} item ditempatkan dengan benar.`
                    : attempts < 3
                    ? `Ups! Ada penempatan yang belum tepat (${correctCount}/${safeItems.length} benar). Kamu punya ${3 - attempts} kesempatan lagi.`
                    : `Kamu sudah mencoba 3 kali. Jangan khawatir! Pelajari kunci jawaban dan penjelasan di bawah untuk memahami materi ini.`}
                </p>
                {attempts < 3 && !allCorrect && (
                  <button
                    onClick={handleRetry}
                    className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Coba Perbaiki Jawaban
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pemetaan jawaban benar untuk yang salah */}
        {showExplanation && (
          <div className="mb-6 p-5 rounded-2xl bg-[#628ECB]/5 border-2 border-[#628ECB]/20 border-dashed">
            <p className="text-xs font-bold text-[#395886]/60 mb-4 uppercase tracking-widest text-center">Kunci Jawaban & Penjelasan</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {safeItems.map(item => {
                const group = safeGroups.find(g => g.id === item.correctGroup);
                const colors = colorMap[group?.colorClass || 'blue'];
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#D5DEEF] shadow-sm">
                    <span className="text-xs font-medium text-[#395886]">{item.text}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${colors.badge}`}>{group?.label}</span>
                  </div>
                );
              })}
            </div>
            {!allCorrect && (
              <p className="mt-4 text-[13px] text-[#395886]/70 text-center italic">
                Pelajari kembali kategori di atas untuk memperkuat pemahamanmu sebelum lanjut ke tahap berikutnya.
              </p>
            )}
          </div>
        )}

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row gap-3">
          {(!validated || (attempts < 3 && !allCorrect)) ? (
            <button
              onClick={handleValidate}
              disabled={!allPlaced}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                allPlaced
                  ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-sm'
                  : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'
              }`}
            >
              Periksa Pengelompokan
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#628ECB] text-white font-semibold text-sm hover:bg-[#395886] shadow-sm transition-all"
            >
              {allCorrect ? 'Lanjutkan ke Tahap Berikutnya' : 'Selesai & Lanjut'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Ekspor dengan penyedia DnD ────────────────────────────────────────────────

export function InquiryStage(props: InquiryStageProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <InquiryStageContent {...props} />
    </DndProvider>
  );
}
