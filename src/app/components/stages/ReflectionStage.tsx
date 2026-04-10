import { useState } from 'react';
import { ChevronRight, Lightbulb, BookOpen, Target, Puzzle } from 'lucide-react';

interface ReflectionStageProps {
  reflectionPrompts?: string[];
  question: string;
  options: string[];
  correctAnswer: number;
  onComplete: (answer: { 
    selectedAnswer: number; 
    reflections: Record<string, string>;
  }) => void;
}

export function ReflectionStage({
  reflectionPrompts,
  question,
  options,
  correctAnswer,
  onComplete,
}: ReflectionStageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const defaultPrompts = [
    'Apa konsep paling penting yang Anda pelajari hari ini?',
    'Bagaimana materi ini dapat diterapkan dalam situasi nyata?',
    'Apa yang masih membingungkan dan perlu dipelajari lebih lanjut?',
  ];

  const prompts = reflectionPrompts || defaultPrompts;

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      setError('Pilih salah satu kesimpulan');
      return;
    }

    // Check if all reflection prompts have been answered (minimum 20 chars each)
    for (let i = 0; i < prompts.length; i++) {
      const promptKey = `prompt_${i}`;
      if (!reflections[promptKey] || reflections[promptKey].trim().length < 20) {
        setError(`Jawab semua pertanyaan refleksi (minimal 20 karakter untuk setiap jawaban)`);
        return;
      }
    }

    onComplete({ selectedAnswer, reflections });
  };

  const handleReflectionChange = (promptIndex: number, value: string) => {
    setReflections(prev => ({
      ...prev,
      [`prompt_${promptIndex}`]: value
    }));
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Reflection Prompts Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-8 h-8 text-[#F59E0B]" />
          <h3 className="text-xl font-bold text-[#395886]">Jurnal Refleksi</h3>
        </div>

        <p className="text-[#395886]/70 mb-6">
          Renungkan pembelajaran Anda dengan menjawab pertanyaan-pertanyaan berikut dengan jujur dan mendalam:
        </p>

        <div className="space-y-6">
          {prompts.map((prompt, index) => {
            const icon = index === 0 ? BookOpen : index === 1 ? Target : Puzzle;
            const Icon = icon;
            const charCount = reflections[`prompt_${index}`]?.length || 0;

            return (
              <div key={index} className="bg-[#F0F3FA] rounded-lg p-6 border-2 border-[#D5DEEF]">
                <div className="flex items-start gap-3 mb-3">
                  <Icon className="w-6 h-6 text-[#628ECB] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="text-[#395886] font-semibold mb-3">{prompt}</h4>
                    <textarea
                      value={reflections[`prompt_${index}`] || ''}
                      onChange={(e) => handleReflectionChange(index, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB] min-h-[100px]"
                      placeholder="Tulis refleksi Anda di sini..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className={`text-sm ${
                        charCount >= 20 ? 'text-[#10B981]' : 'text-[#395886]/60'
                      }`}>
                        {charCount >= 20 ? '✓ ' : ''}{charCount} karakter (minimal 20)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conclusion Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
        <h3 className="text-xl font-bold text-[#395886] mb-4">Kesimpulan Pembelajaran</h3>
        <p className="text-lg text-[#395886] mb-6">{question}</p>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAnswer === index
                  ? 'border-[#628ECB] bg-[#628ECB]/10'
                  : 'border-[#D5DEEF] hover:border-[#628ECB]/50'
              }`}
            >
              <input
                type="radio"
                name="reflection"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => {
                  setSelectedAnswer(index);
                  setError('');
                }}
                className="mr-3"
              />
              <span className="text-[#395886]">{option}</span>
            </label>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

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