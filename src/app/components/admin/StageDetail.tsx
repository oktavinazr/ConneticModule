import React from 'react';
import {
  CheckCircle,
  HelpCircle,
  Lightbulb,
  MonitorPlay,
  Search,
  Users,
  Video,
  FileText,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { type Stage } from '../../data/lessons';

export const CTL_META: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  constructivism: {
    label: 'Constructivism',
    icon: <Video className="w-4 h-4" />,
    bg: 'bg-[#628ECB]/10',
    text: 'text-[#628ECB]',
    border: 'border-[#628ECB]/25',
  },
  inquiry: {
    label: 'Inquiry',
    icon: <Search className="w-4 h-4" />,
    bg: 'bg-[#10B981]/10',
    text: 'text-[#10B981]',
    border: 'border-[#10B981]/25',
  },
  questioning: {
    label: 'Questioning',
    icon: <HelpCircle className="w-4 h-4" />,
    bg: 'bg-[#8B5CF6]/10',
    text: 'text-[#8B5CF6]',
    border: 'border-[#8B5CF6]/25',
  },
  'learning-community': {
    label: 'Learning Community',
    icon: <Users className="w-4 h-4" />,
    bg: 'bg-[#F59E0B]/10',
    text: 'text-[#F59E0B]',
    border: 'border-[#F59E0B]/25',
  },
  modeling: {
    label: 'Modeling',
    icon: <MonitorPlay className="w-4 h-4" />,
    bg: 'bg-[#EC4899]/10',
    text: 'text-[#EC4899]',
    border: 'border-[#EC4899]/25',
  },
  reflection: {
    label: 'Reflection',
    icon: <Lightbulb className="w-4 h-4" />,
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  'authentic-assessment': {
    label: 'Authentic Assessment',
    icon: <FileText className="w-4 h-4" />,
    bg: 'bg-[#6366F1]/10',
    text: 'text-[#6366F1]',
    border: 'border-[#6366F1]/25',
  },
};

export function getStageAnswerSummary(stage: Stage, answer: any): string {
  if (!answer) return '—';
  try {
    switch (stage.type) {
      case 'constructivism': {
        const a = answer as { selectedOption?: string };
        const opt = stage.options?.find((o: any) => o.id === a.selectedOption);
        return opt ? `Pilihan: "${opt.text.slice(0, 40)}..."` : '—';
      }
      case 'inquiry': {
        const matched = Object.keys(answer as Record<string, string>).length;
        const total = stage.groupItems?.length ?? 0;
        return `${matched}/${total} pasangan cocok`;
      }
      case 'questioning': {
        const a = answer as { selectedAnswer?: number; isCorrect?: boolean };
        const correct = a.isCorrect ? 'Benar' : 'Salah';
        const opt = stage.options?.[a.selectedAnswer ?? -1];
        return opt ? `${correct}: "${String(opt).slice(0, 35)}..."` : `${correct}`;
      }
      case 'learning-community': {
        const a = answer as { stance?: string };
        const opt = stage.options?.find((o: any) => o.id === a.stance);
        return opt ? `Sikap: ${opt.text}` : '—';
      }
      case 'modeling':
        return Array.isArray(answer) ? `${answer.length} item diurutkan` : '—';
      case 'reflection': {
        const a = answer as { reflections?: Record<string, string> };
        const reflCount = Object.values(a.reflections ?? {}).filter((r) => r.trim().length > 0).length;
        return `${reflCount} refleksi diisi`;
      }
      case 'authentic-assessment': {
        const a = answer as { essay?: string; selectedAnswer?: number };
        if (a.essay) return `Esai: "${a.essay.slice(0, 40)}..."`;
        if (a.selectedAnswer !== undefined) return `Opsi ke-${a.selectedAnswer + 1}`;
        return '—';
      }
      default:
        return '—';
    }
  } catch {
    return '—';
  }
}

export function StageAnswerDetail({ stage, answer }: { stage: Stage; answer: any }) {
  if (!answer) return <p className="text-xs text-[#395886]/50 italic">Belum dikerjakan</p>;
  try {
    switch (stage.type) {
      case 'constructivism': {
        const a = answer as { selectedOption?: string; reason?: string };
        const opt = stage.options?.find((o: any) => o.id === a.selectedOption);
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Pilihan:</span>
              <p className="text-[#395886] mt-0.5">{opt?.text ?? a.selectedOption ?? '—'}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Alasan:</span>
              <p className="text-[#395886] mt-0.5 bg-[#F0F3FA] rounded-lg px-3 py-2 text-sm leading-relaxed">{a.reason ?? '—'}</p>
            </div>
          </div>
        );
      }
      case 'inquiry': {
        const pairs = answer as Record<string, string>;
        return (
          <div className="space-y-1.5">
            {Object.entries(pairs).map(([left, right], i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="bg-[#628ECB]/10 text-[#628ECB] px-2 py-1 rounded font-medium flex-1 truncate">{left}</span>
                <ChevronRight className="w-3 h-3 text-[#395886]/40 shrink-0" />
                <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded font-medium flex-1 truncate">{right}</span>
              </div>
            ))}
          </div>
        );
      }
      case 'questioning': {
        const a = answer as { selectedAnswer?: number; isCorrect?: boolean };
        const opt = stage.options?.[a.selectedAnswer ?? -1];
        return (
          <div className="flex items-center gap-2 text-sm">
            {a.isCorrect ? <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
            <span className={a.isCorrect ? 'text-[#10B981]' : 'text-red-600'}>
              {a.isCorrect ? 'Benar' : 'Salah'} — {opt ? String(opt) : `Opsi ${(a.selectedAnswer ?? 0) + 1}`}
            </span>
          </div>
        );
      }
      case 'learning-community': {
        const a = answer as any;
        // New lesson 1 format with encapsulation/decapsulation
        if (a?.encapsulation !== undefined || a?.decapsulation !== undefined || a?.simulationViewed !== undefined) {
          return (
            <div className="space-y-3 text-sm">
              {a.simulationViewed && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#10B981]/8 border border-[#10B981]/20">
                  <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs font-bold text-[#10B981]">Visualisasi TCP/IP telah disimak</span>
                </div>
              )}
              {a.encapsulation && (
                <div className="bg-[#F0F3FA] rounded-lg p-3">
                  <p className="text-xs font-bold text-[#395886]/50 mb-1 uppercase">X.TCP.6 — Encapsulation</p>
                  <p className="text-[#395886]">
                    {a.encapsulation.correct ? '✓ Urutan encapsulation benar' : 'Urutan perlu ditinjau'}
                    {a.encapsulation.groupSeen ? ' · Jawaban kelompok telah dibandingkan' : ''}
                  </p>
                </div>
              )}
              {a.decapsulation && (
                <div className="bg-[#F0F3FA] rounded-lg p-3">
                  <p className="text-xs font-bold text-[#395886]/50 mb-1 uppercase">X.TCP.7 — Decapsulation</p>
                  <p className="text-[#395886]">
                    {a.decapsulation.correct ? '✓ Urutan decapsulation benar' : 'Urutan perlu ditinjau'}
                    {a.decapsulation.analysesSeen ? ' · Analisis teman telah divalidasi' : ''}
                  </p>
                </div>
              )}
            </div>
          );
        }
        // Legacy format
        const opt = stage.options?.find((o: any) => o.id === a.stance);
        return (
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Sikap:</span>
              <p className="text-[#395886] mt-0.5 font-medium">{opt?.text ?? a.stance ?? '—'}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-[#395886]/50 uppercase">Alasan:</span>
              <p className="text-[#395886] mt-0.5 bg-[#F0F3FA] rounded-lg px-3 py-2 leading-relaxed">{a.reason ?? '—'}</p>
            </div>
          </div>
        );
      }
      case 'modeling': {
        const ids = answer as string[];
        return (
          <div className="space-y-1.5">
            {ids.map((id, i) => {
              const item = stage.items?.find((it: any) => it.id === id);
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#628ECB]/10 text-[#628ECB] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                  <span className="text-[#395886]">{item?.text ?? id}</span>
                </div>
              );
            })}
          </div>
        );
      }
      case 'reflection': {
        const a = answer as { selectedAnswer?: number; reflections?: Record<string, string> };
        const opt = stage.options?.[a.selectedAnswer ?? -1];
        const prompts = stage.reflectionPrompts ?? ['Konsep penting?', 'Penerapan nyata?', 'Yang masih membingungkan?'];
        return (
          <div className="space-y-3 text-sm">
            <div className="space-y-2">
              {prompts.map((prompt, i) => {
                const val = a.reflections?.[`prompt_${i}`] ?? '';
                return (
                  <div key={i} className="bg-[#F0F3FA] rounded-lg p-3">
                    <p className="text-xs font-bold text-[#395886]/50 mb-1">{prompt}</p>
                    <p className="text-[#395886] leading-relaxed">{val || <span className="italic text-[#395886]/40">Belum diisi</span>}</p>
                  </div>
                );
              })}
            </div>
            {opt && (
              <div>
                <span className="text-xs font-bold text-[#395886]/50 uppercase">Kesimpulan:</span>
                <p className="text-[#395886] mt-0.5 font-medium">{String(opt)}</p>
              </div>
            )}
          </div>
        );
      }
      case 'authentic-assessment': {
        const a = answer as { essay?: string; selectedAnswer?: number; isCorrect?: boolean };
        return (
          <div className="space-y-2 text-sm">
            {a.selectedAnswer !== undefined && (
              <div className="flex items-center gap-2">
                {a.isCorrect ? <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                <span className={a.isCorrect ? 'text-[#10B981]' : 'text-red-600'}>
                  {a.isCorrect ? 'Solusi Tepat' : 'Pertimbangkan kembali'} —{' '}
                  {stage.options?.[a.selectedAnswer] ? String(stage.options[a.selectedAnswer]) : `Opsi ${a.selectedAnswer + 1}`}
                </span>
              </div>
            )}
            {a.essay && (
              <div>
                <span className="text-xs font-bold text-[#395886]/50 uppercase">Jawaban Esai:</span>
                <p className="text-[#395886] mt-0.5 bg-[#F0F3FA] rounded-lg px-3 py-2 leading-relaxed">{a.essay}</p>
              </div>
            )}
          </div>
        );
      }
      default:
        return <p className="text-xs text-[#395886]/50">{JSON.stringify(answer)}</p>;
    }
  } catch {
    return <p className="text-xs text-[#395886]/50 italic">Data tidak terbaca</p>;
  }
}
