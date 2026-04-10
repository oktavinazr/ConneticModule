import { useState } from 'react';
import { ChevronRight, BookOpen, GripVertical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Material {
  title: string;
  content: string[];
  examples?: string[];
}

interface InquiryStageProps {
  material?: Material;
  question: string;
  pairs: Array<{ left: string; right: string }>;
  onComplete: (answer: Record<string, string>) => void;
}

const ItemType = 'MATCH_ITEM';

interface DraggableItemProps {
  text: string;
  isMatched: boolean;
}

function DraggableItem({ text, isMatched }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { text },
    canDrag: !isMatched,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-4 rounded-lg border-2 transition-all ${
        isMatched
          ? 'bg-gray-100 border-gray-300 opacity-50'
          : isDragging
          ? 'bg-[#628ECB]/10 border-[#628ECB] opacity-70'
          : 'bg-white border-[#D5DEEF] hover:border-[#628ECB] cursor-move'
      }`}
    >
      <div className="flex items-center gap-2">
        {!isMatched && <GripVertical className="w-4 h-4 text-gray-400" />}
        <span className="text-[#395886]">{text}</span>
      </div>
    </div>
  );
}

interface DropZoneProps {
  leftItem: string;
  matchedItem: string | null;
  onDrop: (left: string, right: string) => void;
}

function DropZone({ leftItem, matchedItem, onDrop }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { text: string }) => onDrop(leftItem, item.text),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`p-4 rounded-lg border-2 transition-all min-h-[80px] ${
        matchedItem
          ? 'bg-[#10B981]/10 border-[#10B981]'
          : isOver
          ? 'bg-[#628ECB]/10 border-[#628ECB] border-dashed'
          : 'bg-[#F0F3FA] border-[#D5DEEF] border-dashed'
      }`}
    >
      <div className="text-[#395886] mb-2 font-semibold">{leftItem}</div>
      {matchedItem ? (
        <div className="text-sm text-[#10B981] flex items-start gap-2 bg-white p-2 rounded border border-[#10B981]">
          <span>✓ {matchedItem}</span>
        </div>
      ) : (
        <div className="text-sm text-[#395886]/60 italic">
          Tarik item ke sini
        </div>
      )}
    </div>
  );
}

function InquiryStageContent({ material, question, pairs, onComplete }: InquiryStageProps) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showMaterial, setShowMaterial] = useState(!!material);
  const [materialRead, setMaterialRead] = useState(!material);

  const handleDrop = (left: string, right: string) => {
    setMatches((prev) => ({ ...prev, [left]: right }));
  };

  const handleSubmit = () => {
    if (Object.keys(matches).length === pairs.length) {
      onComplete(matches);
    }
  };

  const isComplete = Object.keys(matches).length === pairs.length;
  const matchedRights = Object.values(matches);

  if (showMaterial && material) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-[#628ECB]" />
            <h3 className="text-xl font-bold text-[#395886]">{material.title}</h3>
          </div>

          <div className="space-y-4 mb-6">
            {material.content.map((paragraph, index) => (
              <p key={index} className="text-[#395886]/80 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {material.examples && material.examples.length > 0 && (
            <div className="bg-[#628ECB]/10 border-2 border-[#628ECB]/30 rounded-lg p-4 mb-6">
              <h4 className="text-[#395886] font-semibold mb-3">Contoh:</h4>
              <div className="space-y-2">
                {material.examples.map((example, index) => (
                  <p key={index} className="text-[#395886] text-sm">
                    • {example}
                  </p>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setShowMaterial(false);
              setMaterialRead(true);
            }}
            className="w-full bg-[#628ECB] text-white py-3 rounded-lg hover:bg-[#395886] transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            Lanjut ke Aktivitas Matching
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
        <h3 className="text-xl font-bold text-[#395886] mb-4">Eksplorasi: Drag & Drop Matching</h3>
        <p className="text-[#395886]/70 mb-6">{question}</p>

        {material && (
          <button
            onClick={() => setShowMaterial(true)}
            className="mb-6 text-[#628ECB] hover:text-[#395886] flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Buka kembali materi
          </button>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-6">
          {/* Left Column - Drop Zones */}
          <div className="space-y-3">
            <h4 className="text-[#395886] mb-3 font-semibold">
              Pasangkan ke karakteristik
            </h4>
            {pairs.map((pair) => (
              <DropZone
                key={pair.left}
                leftItem={pair.left}
                matchedItem={matches[pair.left] || null}
                onDrop={handleDrop}
              />
            ))}
          </div>

          {/* Right Column - Draggable Items */}
          <div className="space-y-3">
            <h4 className="text-[#395886] mb-3 font-semibold">
              Fungsi/Deskripsi (Tarik ke kiri)
            </h4>
            {pairs.map((pair) => {
              const isMatched = matchedRights.includes(pair.right);
              return (
                <DraggableItem
                  key={pair.right}
                  text={pair.right}
                  isMatched={isMatched}
                />
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#395886]/70">Progress</span>
            <span className="text-sm text-[#628ECB] font-semibold">
              {Object.keys(matches).length} / {pairs.length} terpasang
            </span>
          </div>
          <div className="w-full bg-[#D5DEEF] rounded-full h-2">
            <div
              className="bg-[#628ECB] h-2 rounded-full transition-all"
              style={{
                width: `${(Object.keys(matches).length / pairs.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md ${
            isComplete
              ? 'bg-[#628ECB] text-white hover:bg-[#395886]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Lanjutkan
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function InquiryStage(props: InquiryStageProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <InquiryStageContent {...props} />
    </DndProvider>
  );
}