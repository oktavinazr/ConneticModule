import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PenLine, 
  CheckCircle, 
  ChevronRight, 
  Lightbulb, 
  RotateCcw, 
  Plus, 
  ArrowRight,
  Target,
  Users,
  Brain,
  MessageSquare,
  AlertCircle,
  XCircle,
  GripVertical
} from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { getLessonProgress, saveStageAttempt } from '../../utils/progress';
import { useActivityTracker } from '../../hooks/useActivityTracker';

// -- Types ----------------------------------------------------------------------

interface ConceptNode { id: string; text: string; x: number; y: number }
interface Connection { from: string; to: string; label: string }

interface ReflectionStageProps {
  lessonId: string;
  stageIndex: number;
  moduleId: string; // e.g., 'X.TCP.8'
  onComplete: (answer: any) => void;
  isCompleted?: boolean;
  essayReflection?: {
    materialSummaryPrompt: string;
    easyPartPrompt: string;
    hardPartPrompt: string;
  };
  selfEvaluationCriteria?: Array<{ id: string; text: string }>;
}

const CONNECTION_LABELS = ['Berhubungan dengan', 'Menghasilkan', 'Membutuhkan', 'Bagian dari', 'Mengontrol'];

// -- Shared UI Components (Constructivism Theme) -------------------------------

function R_EssayBox({
  prompt, objectiveLabel, submitLabel, onSubmit, minWords = 15,
}: {
  prompt: string; objectiveLabel: string; submitLabel: string; onSubmit: (text: string) => void; minWords?: number;
}) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const ready = wordCount >= minWords;

  return (
    <div className="mt-5 p-6 rounded-[2rem] bg-gradient-to-br from-[#628ECB]/5 to-[#395886]/5 border-2 border-[#628ECB]/20 shadow-inner text-left">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-[#628ECB]/10 text-[#628ECB]">
          <PenLine className="w-4 h-4" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#628ECB]/60">Refleksi Mandiri — {objectiveLabel}</p>
      </div>
      <p className="text-sm font-bold text-[#395886] leading-relaxed mb-4">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={submitted}
        rows={4}
        className="w-full px-5 py-4 border-2 border-[#D5DEEF] rounded-2xl text-sm text-[#395886] focus:outline-none focus:ring-4 focus:ring-[#628ECB]/10 focus:border-[#628ECB] transition-all bg-white/80 backdrop-blur-sm resize-none disabled:bg-[#F0F3FA]/50"
        placeholder="Tuliskan refleksimu di sini..."
      />
      <div className="flex items-center justify-between mt-3 mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-24 rounded-full bg-[#D5DEEF] overflow-hidden`}>
             <div className={`h-full transition-all duration-500 ${ready ? 'bg-[#10B981]' : 'bg-[#628ECB]'}`} style={{ width: `${Math.min(100, (wordCount / minWords) * 100)}%` }} />
          </div>
          <p className={`text-[11px] font-black uppercase tracking-tighter ${ready ? 'text-[#10B981]' : 'text-[#395886]/40'}`}>
            {wordCount} / {minWords} Kata
          </p>
        </div>
        {submitted && (
          <span className="flex items-center gap-1.5 text-xs font-black text-[#10B981] uppercase tracking-widest">
            <CheckCircle className="w-4 h-4" /> Tersimpan
          </span>
        )}
      </div>
      {!submitted && (
        <button
          onClick={() => { if (ready) { setSubmitted(true); onSubmit(text.trim()); } }}
          disabled={!ready}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 ${ready ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-green-200' : 'bg-[#D5DEEF] text-[#395886]/40 cursor-not-allowed'}`}
        >
          {submitLabel}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// -- Concept Map Builder --------------------------------------------------------

function ConceptMapBuilder({ lessonId, stageIndex, onNext, initialData }: { lessonId: string; stageIndex: number; onNext: (data: any) => void; initialData?: any }) {
  const tracker = useActivityTracker({
    lessonId,
    stageIndex,
    stageType: 'reflection',
  });
  const [nodes, setNodes] = useState<ConceptNode[]>(initialData?.nodes || []);
  const [connections, setConnections] = useState<Connection[]>(initialData?.connections || []);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(initialData?.selectedFrom || null);

  useEffect(() => {
    if (initialData?.nodes) setNodes(initialData.nodes);
    if (initialData?.connections) setConnections(initialData.connections);
    if (initialData?.selectedFrom) setSelectedFrom(initialData.selectedFrom);
  }, [initialData]);

  useEffect(() => {
    void tracker.saveSnapshot(
      { phase: 'map', nodes, connections, selectedFrom },
      { progressPercent: nodes.length === 0 ? 5 : Math.min(60, 10 + nodes.length * 10 + connections.length * 8) },
    );
  }, [connections, nodes, selectedFrom, tracker]);

  const addNode = (text: string) => {
    const newNode: ConceptNode = { id: Math.random().toString(36).substr(2, 9), text, x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 };
    setNodes([...nodes, newNode]);
    void tracker.trackEvent('concept_node_added', { text });
  };

  const onNodeClick = (id: string) => {
    if (!selectedFrom) {
      setSelectedFrom(id);
    } else {
      if (selectedFrom !== id) {
        setConnections([...connections, { from: selectedFrom, to: id, label: CONNECTION_LABELS[0] }]);
        void tracker.trackEvent('concept_connection_added', { from: selectedFrom, to: id });
      }
      setSelectedFrom(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2rem] border-2 border-[#D5DEEF] p-8 shadow-sm text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-[#628ECB]/10 flex items-center justify-center text-[#628ECB] shadow-inner"><Brain className="w-7 h-7" /></div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#628ECB]">Aktivitas X.TCP.8</p>
            <h3 className="text-2xl font-black text-[#395886] tracking-tight">Peta Konsep Akhir</h3>
          </div>
        </div>
        <p className="text-sm font-bold text-[#395886]/50 mb-8 max-w-md mx-auto italic">"Hubungkan konsep-konsep kunci yang telah kamu pelajari hari ini (TCP, IP, Layer, Enkapsulasi, dll) untuk menunjukkan pemahamanmu."</p>
        
        <div className="bg-[#F8FAFD] rounded-[2rem] border-2 border-dashed border-[#D5DEEF] p-8 min-h-[400px] relative overflow-hidden shadow-inner mb-8">
           {nodes.map(n => (
             <div key={n.id} onClick={() => onNodeClick(n.id)} className={`absolute px-5 py-3 rounded-2xl border-2 font-black text-xs cursor-pointer transition-all ${selectedFrom === n.id ? 'bg-[#10B981] border-[#10B981] text-white shadow-lg scale-110' : 'bg-white border-[#628ECB] text-[#395886] hover:shadow-md'}`} style={{ left: n.x, top: n.y }}>{n.text}</div>
           ))}
           {connections.map((c, i) => {
              const f = nodes.find(n => n.id === c.from), t = nodes.find(n => n.id === c.to);
              if (!f || !t) return null;
              return <svg key={i} className="absolute inset-0 w-full h-full pointer-events-none"><line x1={f.x + 40} y1={f.y + 20} x2={t.x + 40} y2={t.y + 20} stroke="#628ECB" strokeWidth="2" strokeDasharray="4" /></svg>
           })}
           {nodes.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-[#395886]/20 font-black uppercase tracking-widest">Klik tombol di bawah untuk menambah konsep</div>}
        </div>

        <div className="flex gap-2 justify-center mb-8">
           <button onClick={() => addNode(prompt('Masukkan Konsep:') || '')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#628ECB] text-white font-black text-sm shadow-lg active:scale-95 transition-all"><Plus className="w-5 h-5" /> Tambah Konsep</button>
        </div>

        <button onClick={() => onNext({ nodes, connections })} disabled={nodes.length < 3} className="w-full py-4 rounded-[1.5rem] bg-[#395886] text-white font-black text-sm shadow-xl active:scale-95 transition-all disabled:bg-[#D5DEEF]">Selesaikan Peta & Lanjut <ChevronRight className="w-4 h-4 inline ml-1" /></button>
      </div>
    </div>
  );
}

// -- Essay Phase ---------------------------------------------------------------

function EssayPhase({ lessonId, stageIndex, mapData, onDone, initialData }: { lessonId: string; stageIndex: number; mapData: any; onDone: (data: any) => void; initialData?: any }) {
  const [confidence, setConfidence] = useState(initialData?.confidence || 3);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-500 text-center">
      <div className="bg-white rounded-[2.5rem] border-2 border-[#D5DEEF] p-8 md:p-10 shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-[#628ECB]/10 flex items-center justify-center text-[#628ECB] shadow-inner"><PenLine className="w-7 h-7" /></div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#628ECB]">Refleksi Akhir</p>
            <h3 className="text-2xl font-black text-[#395886] tracking-tight">Kesimpulan Belajar Hari Ini</h3>
          </div>
        </div>
        
        <div className="space-y-6 mb-10 text-left">
           <p className="text-xs font-black uppercase tracking-widest text-[#395886]/40 ml-1">Tingkat Keyakinan Pemahaman</p>
           <div className="flex items-center justify-between gap-2">
              {[1,2,3,4,5].map(v => (
                <button key={v} onClick={() => setConfidence(v)} className={`flex-1 py-4 rounded-2xl border-2 font-black text-sm transition-all ${confidence === v ? 'bg-[#10B981] border-[#10B981] text-white shadow-lg shadow-[#10B981]/20' : 'bg-white border-[#D5DEEF] text-[#395886]/30 hover:border-[#628ECB]/30'}`}>{v}</button>
              ))}
           </div>
           <div className="flex justify-between px-1 text-[10px] font-black text-[#395886]/30 uppercase tracking-tighter">
              <span>Kurang Yakin</span>
              <span>Sangat Yakin</span>
           </div>
        </div>

        <R_EssayBox 
           objectiveLabel="Kesimpulan Unit"
           prompt="Setelah melewati seluruh tahapan belajar hari ini, bagaimana kamu menyimpulkan peran protokol TCP/IP dalam menjaga keutuhan data di internet?"
           submitLabel="Selesaikan Seluruh Pertemuan"
           minWords={40}
           onSubmit={(essay) => onDone({ essay, confidence })}
        />
      </div>
    </div>
  );
}

// -- Root component ------------------------------------------------------------

export function ReflectionStage({ lessonId, stageIndex, onComplete, isCompleted }: ReflectionStageProps) {
  const tracker = useActivityTracker({
    lessonId,
    stageIndex,
    stageType: 'reflection',
  });
  const [phase, setPhase] = useState<'map' | 'essay'>(isCompleted ? 'essay' : 'map');
  const [mapData, setMapData] = useState<any>(null);
  const [essayData, setEssayData] = useState<any>(null);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (!tracker.isLoading && tracker.session?.latestSnapshot && !isRestored) {
      const snap = tracker.session.latestSnapshot;
      if (snap.phase) setPhase(snap.phase);
      if (snap.mapData) setMapData(snap.mapData);
      if (snap.nodes) setMapData({ nodes: snap.nodes, connections: snap.connections });
      if (snap.essay || snap.confidence) setEssayData({ essay: snap.essay, confidence: snap.confidence });
      setIsRestored(true);
    } else if (!tracker.isLoading) {
      setIsRestored(true);
    }
  }, [tracker.isLoading, tracker.session, isRestored]);

  if (tracker.isLoading || !isRestored) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-bold text-[#395886]">Memuat progres...</p>
    </div>
  );

  if (phase === 'map') return <ConceptMapBuilder lessonId={lessonId} stageIndex={stageIndex} initialData={mapData} onNext={(data) => { setMapData(data); void tracker.trackEvent('reflection_map_completed', { nodeCount: data?.nodes?.length ?? 0, connectionCount: data?.connections?.length ?? 0 }, { progressPercent: 70 }); setPhase('essay'); }} />;
  if (phase === 'essay') return <EssayPhase lessonId={lessonId} stageIndex={stageIndex} mapData={mapData} initialData={essayData} onDone={(data) => { const finalAnswer = { ...data, mapData, summary: data.essay }; void tracker.complete(finalAnswer, { phase: 'completed', finalAnswer }); onComplete(finalAnswer); }} />;
  return null;
}
