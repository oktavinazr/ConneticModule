import { useState } from 'react';
import { ChevronRight, GripVertical, User, Users as UsersIcon } from 'lucide-react';

interface PracticeInstructions {
  forTeacher: string[];
  forStudent: string[];
}

interface ModelingStageProps {
  practiceInstructions?: PracticeInstructions;
  question: string;
  items: Array<{ id: string; text: string; order: number }>;
  onComplete: (answer: string[]) => void;
}

export function ModelingStage({ practiceInstructions, question, items, onComplete }: ModelingStageProps) {
  const [orderedItems, setOrderedItems] = useState(() => {
    return [...items].sort(() => Math.random() - 0.5);
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...orderedItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setOrderedItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    const order = orderedItems.map((item) => item.id);
    onComplete(order);
  };

  if (showInstructions && practiceInstructions) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Teacher Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-8 h-8 text-[#F59E0B]" />
            <h3 className="text-xl font-bold text-[#395886]">Panduan untuk Guru</h3>
          </div>
          <div className="bg-[#F59E0B]/10 border-2 border-[#F59E0B]/30 rounded-lg p-4">
            <h4 className="text-[#395886] font-semibold mb-3">Demonstrasikan langkah-langkah berikut:</h4>
            <ol className="space-y-2">
              {practiceInstructions.forTeacher.map((instruction, index) => (
                <li key={index} className="text-[#395886] text-sm flex items-start gap-2">
                  <span className="font-semibold min-w-[24px]">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Student Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
          <div className="flex items-center gap-3 mb-4">
            <UsersIcon className="w-8 h-8 text-[#10B981]" />
            <h3 className="text-xl font-bold text-[#395886]">Panduan untuk Siswa</h3>
          </div>
          <div className="bg-[#10B981]/10 border-2 border-[#10B981]/30 rounded-lg p-4 mb-4">
            <h4 className="text-[#395886] font-semibold mb-3">Perhatikan dan praktikkan:</h4>
            <ol className="space-y-2">
              {practiceInstructions.forStudent.map((instruction, index) => (
                <li key={index} className="text-[#395886] text-sm flex items-start gap-2">
                  <span className="font-semibold min-w-[24px]">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
          
          <button
            onClick={() => setShowInstructions(false)}
            className="w-full bg-[#628ECB] text-white py-3 rounded-lg hover:bg-[#395886] transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            Mulai Praktik
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
        <h3 className="text-xl font-bold text-[#395886] mb-4">Praktik: Mengurutkan Langkah</h3>
        <p className="text-[#395886]/70 mb-6">{question}</p>

        {practiceInstructions && (
          <button
            onClick={() => setShowInstructions(true)}
            className="mb-6 text-[#628ECB] hover:text-[#395886] flex items-center gap-2 text-sm"
          >
            <User className="w-4 h-4" />
            Lihat kembali panduan praktik
          </button>
        )}

        <div className="mb-6">
          <div className="bg-[#628ECB]/10 border-2 border-[#628ECB]/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-[#395886]">
              💡 Tips: Tarik dan lepas setiap item untuk mengurutkannya sesuai langkah yang benar
            </p>
          </div>

          <div className="space-y-3">
            {orderedItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-4 bg-white border-2 rounded-lg cursor-move transition-all ${
                  draggedIndex === index
                    ? 'border-[#628ECB] shadow-lg scale-105'
                    : 'border-[#D5DEEF] hover:border-[#628ECB]/50'
                }`}
              >
                <div className="flex items-center gap-2 text-gray-400">
                  <GripVertical className="w-5 h-5" />
                  <span className="text-lg min-w-[30px] text-center bg-[#628ECB]/10 text-[#628ECB] px-3 py-1 rounded border border-[#628ECB]">
                    {index + 1}
                  </span>
                </div>
                <p className="flex-1 text-[#395886]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#628ECB] text-white py-3 rounded-lg hover:bg-[#395886] transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          Lanjutkan
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}