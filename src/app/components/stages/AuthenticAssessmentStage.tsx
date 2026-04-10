import { useState } from 'react';
import { ChevronRight, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthenticAssessmentStageProps {
  question: string;
  options?: string[];
  correctAnswer?: number;
  feedback?: Record<string, string>;
  onComplete: (answer: { 
    essay?: string; 
    selectedAnswer?: number; 
    isCorrect?: boolean;
  }) => void;
}

export function AuthenticAssessmentStage({
  question,
  options,
  correctAnswer,
  feedback,
  onComplete,
}: AuthenticAssessmentStageProps) {
  const [essay, setEssay] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Check if this is essay-type (no options) or multiple choice
  const isEssayType = !options || options.length === 0;

  const handleSubmit = () => {
    if (isEssayType) {
      // Essay type validation
      if (essay.trim().length < 100) {
        setError('Jawaban esai minimal 100 karakter untuk menjelaskan secara detail');
        return;
      }
      setSubmitted(true);
      setError('');
    } else {
      // Multiple choice with essay validation
      if (selectedAnswer === null) {
        setError('Pilih salah satu solusi');
        return;
      }
      if (essay.trim().length < 50) {
        setError('Jelaskan jawaban Anda minimal 50 karakter');
        return;
      }
      setSubmitted(true);
      setError('');
    }
  };

  const handleContinue = () => {
    if (isEssayType) {
      onComplete({ essay });
    } else if (selectedAnswer !== null) {
      onComplete({
        selectedAnswer,
        isCorrect: selectedAnswer === correctAnswer,
        essay,
      });
    }
  };

  const isCorrect = selectedAnswer === correctAnswer;

  // Split question into parts if it contains numbered points
  const questionParts = question.split(/\d+\.\s/).filter(part => part.trim());
  const hasNumberedPoints = questionParts.length > 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[#8B5CF6]" />
          <h3 className="text-xl font-bold text-[#395886]">Studi Kasus - Authentic Assessment</h3>
        </div>

        {/* Case Study Section */}
        <div className="bg-[#8B5CF6]/10 border-l-4 border-[#8B5CF6] p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-[#8B5CF6] flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="text-[#395886] font-semibold mb-3">Kasus:</h4>
              {hasNumberedPoints ? (
                <>
                  <p className="text-[#395886] mb-3">{questionParts[0]}</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    {questionParts.slice(1).map((part, index) => (
                      <li key={index} className="text-[#395886]">
                        {part}
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <p className="text-[#395886] whitespace-pre-line">{question}</p>
              )}
            </div>
          </div>
        </div>

        {/* Multiple Choice Options (if available) */}
        {!isEssayType && options && (
          <div className="mb-6">
            <h4 className="text-[#395886] font-semibold mb-3">Pilih solusi/protokol yang tepat:</h4>
            <div className="space-y-3">
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
                      name="assessment"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => !submitted && setSelectedAnswer(index)}
                      disabled={submitted}
                      className="mt-1"
                    />
                    <span className="text-[#395886] flex-1">{option}</span>
                    {submitted && index === correctAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Essay Answer Section */}
        <div className="mb-6">
          <label className="block text-[#395886] font-semibold mb-3">
            {isEssayType ? (
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#628ECB]" />
                Jawaban Esai - Jelaskan secara detail:
              </span>
            ) : (
              'Jelaskan analisis Anda terhadap kasus ini:'
            )}
          </label>
          
          <div className="bg-[#F0F3FA] rounded-lg p-4 mb-3 border-2 border-[#D5DEEF]">
            <h5 className="text-sm text-[#395886] font-semibold mb-2">Panduan menjawab:</h5>
            <ul className="text-sm text-[#395886]/70 space-y-1">
              <li>• Jelaskan mengapa solusi/protokol tersebut tepat untuk kasus ini</li>
              <li>• Berikan argumentasi teknis yang mendukung</li>
              <li>• Pertimbangkan kelebihan dan kekurangan dari solusi yang dipilih</li>
              {isEssayType && <li>• Jika ada, berikan alternatif solusi lain</li>}
            </ul>
          </div>

          <textarea
            value={essay}
            onChange={(e) => {
              setEssay(e.target.value);
              setError('');
            }}
            disabled={submitted}
            className="w-full px-4 py-3 border-2 border-[#D5DEEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#628ECB] focus:border-[#628ECB] min-h-[200px] disabled:bg-gray-100"
            placeholder={
              isEssayType
                ? 'Jelaskan jawaban Anda secara detail dengan argumentasi yang kuat...'
                : 'Jelaskan mengapa solusi tersebut tepat untuk kasus ini...'
            }
          />
          <div className="flex justify-between items-center mt-2">
            <p className={`text-sm ${
              essay.length >= (isEssayType ? 100 : 50) ? 'text-[#10B981]' : 'text-[#395886]/60'
            }`}>
              {essay.length >= (isEssayType ? 100 : 50) ? '✓ ' : ''}
              {essay.length} karakter (minimal {isEssayType ? 100 : 50})
            </p>
            <p className="text-xs text-[#395886]/50">
              Target: 200-500 karakter untuk jawaban yang komprehensif
            </p>
          </div>
        </div>

        {/* Feedback after submission */}
        {submitted && !isEssayType && feedback && (
          <div
            className={`p-4 rounded-lg mb-6 border-2 ${
              isCorrect
                ? 'bg-[#10B981]/10 border-[#10B981]'
                : 'bg-[#F59E0B]/10 border-[#F59E0B]'
            }`}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                isCorrect ? 'text-[#10B981]' : 'text-[#F59E0B]'
              }`} />
              <div>
                <h4 className={`font-semibold mb-2 ${
                  isCorrect ? 'text-[#10B981]' : 'text-[#F59E0B]'
                }`}>
                  {isCorrect ? 'Solusi Tepat!' : 'Pertimbangkan Hal Ini:'}
                </h4>
                <p className={`${
                  isCorrect ? 'text-[#10B981]' : 'text-[#F59E0B]'
                }`}>
                  {isCorrect ? feedback.correct : feedback.incorrect}
                </p>
              </div>
            </div>
          </div>
        )}

        {submitted && isEssayType && (
          <div className="bg-[#628ECB]/10 border-2 border-[#628ECB] rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#628ECB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#395886] font-semibold mb-2">Jawaban Anda Telah Tersimpan</h4>
                <p className="text-[#395886]/70 text-sm">
                  Jawaban esai Anda akan dievaluasi oleh guru untuk memberikan feedback yang lebih mendalam.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-[#628ECB] text-white py-3 rounded-lg hover:bg-[#395886] transition-colors shadow-md"
          >
            Submit Jawaban
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full bg-[#628ECB] text-white py-3 rounded-lg hover:bg-[#395886] transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            Selesaikan Tahap Ini
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}