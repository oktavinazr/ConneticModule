import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { BookOpen, ChevronLeft, CheckCircle, XCircle, Award, Clock } from 'lucide-react';
import { TestQuestion } from '../data/lessons';

interface TestPageProps {
  title: string;
  description: string;
  questions: TestQuestion[];
  onComplete: (score: number, answers: number[]) => void;
  backPath: string;
  showResults?: boolean;
  existingAnswers?: number[];
  existingScore?: number;
  duration?: number; // Duration in minutes (optional)
  isLessonPretest?: boolean; // Flag to indicate if this is a lesson pretest
}

export function TestPage({
  title,
  description,
  questions,
  onComplete,
  backPath,
  showResults: initialShowResults,
  existingAnswers,
  existingScore,
  duration,
  isLessonPretest,
}: TestPageProps) {
  const navigate = useNavigate();
  const [started, setStarted] = useState(!!existingAnswers && existingAnswers.length > 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(existingAnswers || []);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(initialShowResults || false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    duration && !initialShowResults ? duration * 60 : null
  ); // Convert minutes to seconds

  const currentQuestion = questions[currentQuestionIndex];

  const handleTimeUp = useCallback(() => {
    // Calculate score with current answers
    const score = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
    
    // Save results
    onComplete(score, answers);
    setShowResults(true);
  }, [answers, questions, onComplete]);

  // Timer effect
  useEffect(() => {
    if (started && !showResults && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [started, showResults, timeRemaining]);

  // Check if time is up
  useEffect(() => {
    if (started && !showResults && timeRemaining === 0 && duration) {
      handleTimeUp();
    }
  }, [timeRemaining, started, showResults, handleTimeUp, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate score
      const score = newAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;

      // Save results
      onComplete(score, newAnswers);
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return existingScore !== undefined
      ? existingScore
      : answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#F0F3FA]">
        <header className="bg-white shadow-sm border-b border-[#D5DEEF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to={backPath} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#628ECB] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-[#395886]">CONNETIC Module</span>
              </Link>
              <Link
                to={backPath}
                className="flex items-center gap-2 text-[#395886] hover:text-[#628ECB] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Kembali
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8 border-2 border-[#D5DEEF]">
            <Award className="w-20 h-20 text-[#F59E0B] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#395886] mb-4">{title} Selesai!</h1>
            <div className="text-6xl font-bold text-[#628ECB] mb-4">
              {score}/{questions.length}
            </div>
            <p className="text-2xl text-[#395886] mb-6">Nilai: {percentage}%</p>

            <div className="inline-block px-6 py-3 rounded-lg mb-6 text-lg">
              {percentage >= 80 ? (
                <span className="text-[#10B981] bg-[#10B981]/10 px-4 py-2 rounded-lg border-2 border-[#10B981]">
                  🎉 Sangat Baik! Anda siap melanjutkan pembelajaran
                </span>
              ) : percentage >= 60 ? (
                <span className="text-[#628ECB] bg-[#628ECB]/10 px-4 py-2 rounded-lg border-2 border-[#628ECB]">
                  👍 Baik! Tetap semangat dalam pembelajaran
                </span>
              ) : (
                <span className="text-[#F59E0B] bg-[#F59E0B]/10 px-4 py-2 rounded-lg border-2 border-[#F59E0B]">
                  💪 Terus belajar! Jangan menyerah
                </span>
              )}
            </div>
          </div>

          {/* Answer Review */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-[#D5DEEF]">
            <h2 className="text-2xl font-bold text-[#395886] mb-6">Review Jawaban</h2>
            <div className="space-y-6">
              {questions.map((q, index) => {
                const isCorrect = answers[index] === q.correctAnswer;
                return (
                  <div key={index} className="border-b border-[#D5DEEF] pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-[#395886] font-semibold mb-2">
                          {index + 1}. {q.question}
                        </h4>
                        <div className="space-y-2">
                          {q.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg ${
                                optIndex === q.correctAnswer
                                  ? 'bg-[#10B981]/10 border-2 border-[#10B981]'
                                  : optIndex === answers[index] && !isCorrect
                                  ? 'bg-red-50 border-2 border-red-300'
                                  : 'bg-[#F0F3FA]'
                              }`}
                            >
                              <span className="text-[#395886]">{option}</span>
                              {optIndex === q.correctAnswer && (
                                <span className="ml-2 text-[#10B981] text-sm font-semibold">✓ Jawaban Benar</span>
                              )}
                              {optIndex === answers[index] && !isCorrect && (
                                <span className="ml-2 text-red-700 text-sm font-semibold">✗ Jawaban Anda</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <Link
              to={backPath}
              className="inline-block bg-[#628ECB] text-white px-8 py-3 rounded-lg hover:bg-[#395886] transition-colors shadow-md"
            >
              {isLessonPretest ? 'Lanjutkan ke Tahapan CTL' : 'Kembali ke Dashboard'}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F3FA]">
      <header className="bg-white shadow-sm border-b border-[#D5DEEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to={backPath} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#628ECB] rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#395886]">CONNETIC Module</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Intro */}
      {!started && currentQuestionIndex === 0 && answers.length === 0 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-[#D5DEEF]">
            <h1 className="text-3xl font-bold text-[#395886] mb-4">{title}</h1>
            <p className="text-lg text-[#395886]/70 mb-6">{description}</p>
            <div className="bg-[#628ECB]/10 border-2 border-[#628ECB]/30 rounded-lg p-4 mb-6">
              <p className="text-[#395886] mb-2">
                <strong>Jumlah Soal:</strong> {questions.length} soal pilihan ganda
              </p>
              {duration && (
                <p className="text-[#395886]">
                  <strong>Waktu:</strong> {duration} menit
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setStarted(true);
              }}
              className="bg-[#628ECB] text-white px-8 py-3 rounded-lg hover:bg-[#395886] transition-colors shadow-md"
            >
              Mulai {title}
            </button>
          </div>
        </div>
      )}

      {/* Questions */}
      {started && (
        <>
          <div className="bg-white border-b border-[#D5DEEF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-[#395886]">{title}</h2>
                <div className="flex items-center gap-4">
                  {timeRemaining !== null && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                      timeRemaining <= 60 ? 'bg-red-50 text-red-700 border-red-300' : 
                      timeRemaining <= 180 ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30' : 
                      'bg-[#628ECB]/10 text-[#628ECB] border-[#628ECB]/30'
                    }`}>
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">{formatTime(timeRemaining)}</span>
                    </div>
                  )}
                  <span className="text-[#628ECB] font-semibold">
                    Soal {currentQuestionIndex + 1} dari {questions.length}
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#D5DEEF] rounded-full h-2">
                <div
                  className="bg-[#628ECB] h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Time Warning */}
            {timeRemaining !== null && timeRemaining <= 60 && timeRemaining > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 animate-pulse">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-red-700" />
                  <div>
                    <h4 className="text-red-900 font-semibold mb-1">Waktu Hampir Habis!</h4>
                    <p className="text-red-700 text-sm">
                      Anda hanya memiliki waktu kurang dari 1 menit lagi. Segera selesaikan!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#D5DEEF]">
              <div className="mb-6">
                <span className="inline-block bg-[#628ECB]/10 text-[#628ECB] px-3 py-1 rounded-full text-sm mb-4 border border-[#628ECB]">
                  Soal {currentQuestionIndex + 1}
                </span>
                <h3 className="text-xl text-[#395886] font-semibold">{currentQuestion.question}</h3>
              </div>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
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
                      name={`question-${currentQuestionIndex}`}
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => setSelectedAnswer(index)}
                      className="mr-3"
                    />
                    <span className="text-[#395886]">{option}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className={`w-full py-3 rounded-lg transition-colors shadow-md ${
                  selectedAnswer !== null
                    ? 'bg-[#628ECB] text-white hover:bg-[#395886]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Lanjut' : 'Selesai'}
              </button>
            </div>
          </main>
        </>
      )}
    </div>
  );
}