import { useState } from 'react';
import { ChevronRight, CheckCircle, XCircle, Image as ImageIcon, ZoomIn } from 'lucide-react';

interface QuestioningStageProps {
  imageUrl?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  feedback: Record<string, string>;
  onComplete: (answer: { selectedAnswer: number; isCorrect: boolean }) => void;
}

export function QuestioningStage({
  imageUrl,
  question,
  options,
  correctAnswer,
  feedback,
  onComplete,
}: QuestioningStageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setSubmitted(true);
    }
  };

  const handleContinue = () => {
    if (selectedAnswer !== null) {
      onComplete({ selectedAnswer, isCorrect: selectedAnswer === correctAnswer });
    }
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Image Section */}
      {imageUrl && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D5DEEF]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-[#628ECB]" />
              <h3 className="text-xl font-bold text-[#395886]">Gambar Analisis</h3>
            </div>
            <button
              onClick={() => setImageZoomed(!imageZoomed)}
              className="flex items-center gap-2 text-[#628ECB] hover:text-[#395886] px-3 py-2 rounded-lg hover:bg-[#628ECB]/10 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
              {imageZoomed ? 'Perkecil' : 'Perbesar'}
            </button>
          </div>
          <p className="text-[#395886]/70 mb-4">
            Perhatikan gambar berikut dengan cermat untuk menjawab pertanyaan
          </p>
          
          <div 
            className={`relative rounded-lg overflow-hidden bg-[#F0F3FA] transition-all cursor-pointer ${
              imageZoomed ? 'max-w-full' : 'max-w-2xl mx-auto'
            }`}
            onClick={() => setImageZoomed(!imageZoomed)}
          >
            <img
              src={imageUrl}
              alt="Gambar Analisis"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Question Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
        <h3 className="text-xl font-bold text-[#395886] mb-4">Analisis</h3>
        <p className="text-lg text-[#395886] mb-6">{question}</p>

        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                submitted
                  ? index === correctAnswer
                    ? 'border-[#10B981] bg-[#10B981]/10'
                    : index === selectedAnswer
                    ? 'border-red-500 bg-red-50'
                    : 'border-[#D5DEEF]'
                  : selectedAnswer === index
                  ? 'border-[#628ECB] bg-[#628ECB]/10'
                  : 'border-[#D5DEEF] hover:border-[#628ECB]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="questioning"
                  value={index}
                  checked={selectedAnswer === index}
                  onChange={() => !submitted && setSelectedAnswer(index)}
                  disabled={submitted}
                  className="mt-1"
                />
                <span className="text-[#395886] flex-1">{option}</span>
                {submitted && index === correctAnswer && (
                  <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                )}
                {submitted && index === selectedAnswer && index !== correctAnswer && (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}
              </div>
            </label>
          ))}
        </div>

        {submitted && (
          <div
            className={`p-4 rounded-lg mb-6 border-2 ${
              isCorrect
                ? 'bg-[#10B981]/10 border-[#10B981]'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4
                  className={`font-semibold mb-2 ${
                    isCorrect ? 'text-[#10B981]' : 'text-red-900'
                  }`}
                >
                  {isCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}
                </h4>
                <p
                  className={`${
                    isCorrect ? 'text-[#10B981]' : 'text-red-800'
                  }`}
                >
                  {isCorrect ? feedback.correct : feedback.incorrect}
                </p>
              </div>
            </div>
          </div>
        )}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md ${
              selectedAnswer !== null
                ? 'bg-[#628ECB] text-white hover:bg-[#395886]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full bg-[#628ECB] text-white py-3 rounded-lg hover:bg-[#395886] transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            Lanjutkan
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}