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
        const a = answer as any;
        if (a.selectedOption || a.mcqData) {
          const data = a.mcqData || a;
          const opt = stage.options?.find((o: any) => o.id === data.selectedOption);
          return opt ? `Pilihan: "${opt.text.slice(0, 40)}..."` : 'Selesai (PG)';
        }
        if (a.essay1 || a.essay1Text) return 'Esai Selesai';
        if (a.phase === 'scramble') return 'Sedang Menyusun Cerita';
        if (a.phase === 'analogy') return 'Sedang Mengerjakan Analogi';
        return 'Selesai';
      }
      case 'inquiry': {
        const a = answer as any;
        if (a.type === 'lesson1_format' || a.reflection1 || a.reflection2) {
          return 'Selesai (Format Refleksi)';
        }
        if (a.flowData || a.groupData || a.matchingData) {
          return 'Dalam Aktivitas';
        }
        const matched = Object.keys(a).length;
        return `${matched} item selesai`;
      }
      case 'questioning': {
        const a = answer as { selectedAnswer?: number; isCorrect?: boolean; selectedId?: string };
        const correct = a.isCorrect ? 'Benar' : 'Salah';
        if (a.selectedId === 'pizza_simulation') return `${correct}: Simulasi Pizza`;
        const opt = stage.options?.[a.selectedAnswer ?? -1];
        return opt ? `${correct}: "${String(opt).slice(0, 35)}..."` : `${correct}`;
      }
      case 'learning-community': {
        const a = answer as any;
        if (a?.encapsulation && a?.decapsulation) {
          return `Selesai: Encap (${a.encapsulation.choice}) & Decap (${a.decapsulation.choice})`;
        }
        return 'Selesai';
      }
      case 'modeling':
        return 'Selesai';
      case 'reflection': {
        const a = answer as any;
        if (a.phase === 'map') return 'Sedang Membuat Peta Konsep';
        if (a.phase === 'essay' || a.essay) return 'Sedang Menulis Esai';
        const essayCount = Object.values(a.essays ?? {}).filter((v: any) => v.length > 0).length;
        return `${essayCount} esai selesai`;
      }
      case 'authentic-assessment': {
        const a = answer as any;
        if (a.initialChoice) return `Selesai: ${a.initialChoice}`;
        return 'Selesai';
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
        const a = answer as any;
        
        if (a.selectedOption || a.mcqData) {
          const data = a.mcqData || a;
          const opt = stage.options?.find((o: any) => o.id === data.selectedOption);
          return (
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-xs font-bold text-[#395886]/50 uppercase">Pilihan:</span>
                <p className="text-[#395886] mt-0.5">{opt?.text ?? data.selectedOption ?? '—'}</p>
              </div>
              {data.reason && (
                <div>
                  <span className="text-xs font-bold text-[#395886]/50 uppercase">Alasan:</span>
                  <p className="text-[#395886] mt-0.5 bg-[#F0F3FA] rounded-lg px-3 py-2 text-xs leading-relaxed">{data.reason}</p>
                </div>
              )}
            </div>
          );
        }

        if (a.essay1 || a.essay2 || a.essay1Text || a.scrambleData || a.analogyData) {
          return (
            <div className="space-y-3 text-sm">
              {(a.essay1 || a.essay1Text) && (
                <div className="bg-[#F0F3FA] rounded-lg p-2.5">
                   <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">Jawaban Esai 1</p>
                   <p className="text-[#395886] text-xs italic">"{a.essay1 || a.essay1Text}"</p>
                </div>
              )}
              {a.essay2 && (
                <div className="bg-[#F0F3FA] rounded-lg p-2.5">
                   <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">Jawaban Esai 2</p>
                   <p className="text-[#395886] text-xs italic">"{a.essay2}"</p>
                </div>
              )}
              {a.phase && (
                <p className="text-[10px] font-bold text-[#628ECB] uppercase">Posisi: {a.phase}</p>
              )}
            </div>
          );
        }

        return <p className="text-xs text-[#395886]/50 italic">Selesai (Format lain)</p>;
      }
      case 'inquiry': {
        const a = answer as any;
        if (a.type === 'lesson1_format' || a.reflection1 || a.reflection2) {
          return (
            <div className="space-y-3 text-sm">
               {(a.reflection1 || a.essays?.reflection1) && (
                 <div className="bg-[#F0F3FA] rounded-lg p-3">
                    <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">Refleksi 1</p>
                    <p className="text-[#395886] italic text-xs">"{a.reflection1 || a.essays?.reflection1}"</p>
                 </div>
               )}
               {(a.reflection2 || a.essays?.reflection2) && (
                 <div className="bg-[#F0F3FA] rounded-lg p-3">
                    <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">Refleksi 2</p>
                    <p className="text-[#395886] italic text-xs">"{a.reflection2 || a.essays?.reflection2}"</p>
                 </div>
               )}
               {a.activityStep && <p className="text-[10px] font-bold text-[#10B981] uppercase">Step: {a.activityStep}</p>}
            </div>
          );
        }
        if (a.flowData || a.groupData || a.matchingData) {
           return (
             <div className="space-y-1 text-xs">
                {a.flowData && <p className="text-[#395886]"><span className="font-bold">Flow:</span> {Object.keys(a.flowData.slots || {}).length} item</p>}
                {a.groupData && <p className="text-[#395886]"><span className="font-bold">Group:</span> {Object.keys(a.groupData.placement || {}).length} item</p>}
                {a.matchingData && <p className="text-[#395886]"><span className="font-bold">Match:</span> {Object.keys(a.matchingData.matches || {}).length} item</p>}
             </div>
           );
        }
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
        const a = answer as { selectedAnswer?: number; isCorrect?: boolean; justification?: string; selectedId?: string };
        const opt = stage.options?.[a.selectedAnswer ?? -1];
        return (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              {a.isCorrect ? <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
              <span className={a.isCorrect ? 'text-[#10B981]' : 'text-red-600'}>
                {a.isCorrect ? 'Berhasil' : 'Perlu Tinjauan'} — {a.selectedId === 'pizza_simulation' ? 'Simulasi Pizza' : (opt ? String(opt) : `Opsi ${(a.selectedAnswer ?? 0) + 1}`)}
              </span>
            </div>
            {a.justification && (
              <div className="bg-[#F0F3FA] rounded-lg p-3">
                <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">Argumentasi Logis</p>
                <p className="text-[#395886] italic">"{a.justification}"</p>
              </div>
            )}
          </div>
        );
      }
      case 'learning-community': {
        const a = answer as any;
        if (a?.encapsulation !== undefined && a?.decapsulation !== undefined) {
          return (
            <div className="space-y-3 text-sm">
              <div className="bg-[#F0F3FA] rounded-lg p-3">
                <p className="text-xs font-bold text-[#395886]/50 mb-1 uppercase">X.TCP.6 — Encapsulation</p>
                <p className="text-[#395886] font-bold">Pilihan: {a.encapsulation.choice}</p>
                <p className="text-[#395886] mt-1 italic leading-relaxed text-xs">"{a.encapsulation.arg}"</p>
              </div>
              <div className="bg-[#F0F3FA] rounded-lg p-3">
                <p className="text-xs font-bold text-[#395886]/50 mb-1 uppercase">X.TCP.7 — Decapsulation</p>
                <p className="text-[#395886] font-bold">Pilihan: {a.decapsulation.choice}</p>
                <p className="text-[#395886] mt-1 italic leading-relaxed text-xs">"{a.decapsulation.arg}"</p>
              </div>
              {a.ranking && (
                <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg p-3">
                   <p className="text-xs font-bold text-[#F59E0B] mb-1 uppercase">Hasil Voting Kelompok</p>
                   <div className="space-y-1">
                      {a.ranking.map((r: any, idx: number) => (
                        <p key={idx} className="text-[10px] font-medium text-[#395886]">
                          {idx + 1}. {r.name} ({r.voteCount} vote)
                        </p>
                      ))}
                   </div>
                </div>
              )}
            </div>
          );
        }
        return <p className="text-xs text-[#395886]/50 italic">Selesai Berkolaborasi</p>;
      }
      case 'modeling': {
        return (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
             <CheckCircle className="w-4 h-4 text-green-600" />
             <span className="text-xs font-bold text-green-700">Simulasi langkah-demi-langkah selesai disimak & dipraktikkan.</span>
          </div>
        );
      }
      case 'reflection': {
        const a = answer as any;
        const essayReflection = stage.essayReflection ?? {
          materialSummaryPrompt: 'Ringkasan Materi',
          easyPartPrompt: 'Bagian Termudah',
          hardPartPrompt: 'Bagian Tersulit',
        };

        if (a.phase === 'map' || a.nodes) {
          return (
            <div className="space-y-2 text-xs">
               <p className="font-bold text-orange-600 uppercase text-[10px]">Sedang Menyusun Peta Konsep</p>
               <p className="text-[#395886]">{a.nodes?.length || 0} Konsep, {a.connections?.length || 0} Koneksi</p>
            </div>
          );
        }

        if (a.phase === 'essay' || a.essay) {
          return (
            <div className="space-y-3 text-sm">
               <div className="bg-[#F0F3FA] rounded-lg p-3">
                  <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">Refleksi Akhir</p>
                  <p className="text-[#395886] leading-relaxed text-xs italic">"{a.essay}"</p>
               </div>
               {a.confidence && <p className="text-[10px] font-bold text-orange-600">Keyakinan: {a.confidence}/5</p>}
            </div>
          );
        }

        const criteria = stage.selfEvaluationCriteria ?? [];

        return (
          <div className="space-y-4 text-sm">
            <div className="space-y-3">
               <div className="bg-[#F0F3FA] rounded-lg p-3">
                  <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">{essayReflection.materialSummaryPrompt}</p>
                  <p className="text-[#395886] leading-relaxed italic">"{a.essays?.summary || '—'}"</p>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50/50 border border-green-100 rounded-lg p-3">
                     <p className="text-[10px] font-bold text-green-600/60 mb-1 uppercase">{essayReflection.easyPartPrompt}</p>
                     <p className="text-[#395886] leading-relaxed text-xs italic">"{a.essays?.easy || '—'}"</p>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                     <p className="text-[10px] font-bold text-red-600/60 mb-1 uppercase">{essayReflection.hardPartPrompt}</p>
                     <p className="text-[#395886] leading-relaxed text-xs italic">"{a.essays?.hard || '—'}"</p>
                  </div>
               </div>
            </div>

            {criteria.length > 0 && (
              <div className="bg-white border border-[#D5DEEF] rounded-xl overflow-hidden">
                 <div className="bg-gray-50 px-3 py-2 border-b border-[#D5DEEF]">
                    <p className="text-[10px] font-black uppercase text-[#395886]/60">Penilaian Diri (Skala 1-4)</p>
                 </div>
                 <div className="divide-y divide-[#D5DEEF]">
                    {criteria.map(c => (
                      <div key={c.id} className="px-3 py-2 flex items-center justify-between gap-4">
                         <span className="text-[11px] font-medium text-[#395886]">{c.label}</span>
                         <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-black text-xs ${
                           (a.selfEvaluation?.[c.id] || 0) >= 3 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                         }`}>
                            {a.selfEvaluation?.[c.id] || '—'}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        );
      }
      case 'authentic-assessment': {
        const a = answer as any;
        return (
          <div className="space-y-3 text-sm">
            <div className="bg-[#F0F3FA] rounded-lg p-3 border border-[#D5DEEF]">
              <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">Keputusan Diagnosis Awal</p>
              <p className="text-[#395886] font-bold">{a.initialChoice || '—'}</p>
              <p className="text-[#395886] mt-1 italic text-xs leading-relaxed">"{a.initialReason || '—'}"</p>
            </div>
            {a.followUpChoice && (
               <div className="bg-[#F0F3FA] rounded-lg p-3 border border-[#D5DEEF]">
                  <p className="text-[10px] font-bold text-[#395886]/50 mb-1 uppercase">Prioritas Tindak Lanjut</p>
                  <p className="text-[#395886] font-bold">{a.followUpChoice}</p>
                  <p className="text-[#395886] mt-1 italic text-xs leading-relaxed">"{a.followUpReason}"</p>
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
