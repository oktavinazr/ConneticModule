import React, { useState } from 'react';
import { Play, RotateCcw, ArrowDown, ArrowUp, ArrowRight, Monitor, CheckCircle2, Info, Activity } from 'lucide-react';

export function TcpIpInteractive() {
  // Step 0: Idle, Step 1-4: Encap PC A, Step 5: Physical, Step 6-9: Decap PC B, Step 10: Selesai
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 10) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
  };

  // --- DATA KONTEN PENJELASAN ---
  const getStepInfo = () => {
    switch (step) {
      case 1: return { title: 'Application Layer (PC A)', desc: 'Pengguna menekan tombol kirim email. Aplikasi menyediakan akses dan menyiapkan data mentah (Payload) yang akan dikirim.', task: 'Menghasilkan Data', action: 'Tambah' };
      case 2: return { title: 'Transport Layer (PC A)', desc: 'Data dipecah dan diberi TCP Header. Terdapat Port dan Sequence Number untuk error recovery dan penyusunan ulang nanti.', task: 'Segmentasi & Port', action: 'Tambah' };
      case 3: return { title: 'Network Layer (PC A)', desc: 'Segmen diberi IP Header yang berisi alamat IP Sumber (PC A) dan IP Tujuan (PC B) agar router tahu arah pengirimannya.', task: 'Pengalamatan IP', action: 'Tambah' };
      case 4: return { title: 'Data Link Layer (PC A)', desc: 'Paket dibungkus menjadi Frame. Diberi MAC Address dan FCS (Frame Check Sequence) untuk mendeteksi error di media fisik.', task: 'MAC Address & Cek Error', action: 'Tambah' };
      case 5: return { title: 'Physical Layer (Media Transmisi)', desc: 'Frame diubah menjadi sinyal (listrik/cahaya/radio) dan dialirkan melalui kabel atau Wi-Fi menuju PC tujuan.', task: 'Transmisi Sinyal', action: 'Konversi' };
      case 6: return { title: 'Data Link Layer (PC B)', desc: 'PC B menerima sinyal dan mengembalikannya jadi Frame. MAC Address dan FCS dicek. Jika aman, header Ethernet dibuang.', task: 'Verifikasi MAC & FCS', action: 'Buang' };
      case 7: return { title: 'Network Layer (PC B)', desc: 'Mengecek IP Header. "Apakah IP Tujuan ini milikku?" Jika ya, paket diterima dan IP Header dibuang.', task: 'Verifikasi IP', action: 'Buang' };
      case 8: return { title: 'Transport Layer (PC B)', desc: 'Mengecek Port (Oh, ini untuk aplikasi Email!). Pecahan data disusun ulang berdasarkan Sequence Number. TCP header dibuang.', task: 'Susun Segmen & Port', action: 'Buang' };
      case 9: return { title: 'Application Layer (PC B)', desc: 'Data utuh disajikan ke aplikasi. Pengguna di PC B sekarang bisa membaca email tersebut di layarnya.', task: 'Penyajian Data', action: 'Buang' };
      default: return null;
    }
  };

  // --- RENDER VISUALISASI PAKET (PDU) ---
  const renderPdu = () => {
    if (step === 0 || step === 10) return null;
    
    if (step === 5) {
      return (
        <div className="flex animate-pulse items-center gap-1 overflow-hidden rounded-lg bg-gray-900 px-4 py-2 text-green-400 font-mono text-sm tracking-[0.3em] shadow-inner">
          010110010110100101110...
        </div>
      );
    }

    const showEth = step === 4 || step === 6;
    const showIp = step >= 3 && step <= 7;
    const showTcp = step >= 2 && step <= 8;
    const showData = step >= 1 && step <= 9;

    return (
      <div className="flex items-center gap-1.5 font-black text-white text-xs sm:text-sm">
        {showEth && <div className="animate-in fade-in zoom-in rounded bg-[#F59E0B] px-3 py-1.5 shadow-sm">ETH</div>}
        {showIp && <div className="animate-in fade-in zoom-in rounded bg-[#10B981] px-3 py-1.5 shadow-sm">IP</div>}
        {showTcp && <div className="animate-in fade-in zoom-in rounded bg-[#628ECB] px-3 py-1.5 shadow-sm">TCP</div>}
        {showData && <div className="animate-in fade-in zoom-in rounded bg-[#8B5CF6] px-5 py-1.5 shadow-md">DATA</div>}
        {showEth && <div className="animate-in fade-in zoom-in rounded bg-[#F59E0B] px-3 py-1.5 shadow-sm">FCS</div>}
      </div>
    );
  };

  // --- HELPER KOTAK LAYER ---
  const LayerBox = ({ name, active, type }: { name: string, active: boolean, type: 'encap' | 'decap' }) => (
    <div className={`relative flex w-full justify-center rounded-xl border-2 py-3 font-bold transition-all duration-500 ${
      active ? 'border-[#628ECB] bg-[#628ECB] text-white shadow-lg scale-110 z-10' : 'border-[#D5DEEF] bg-white text-[#395886]/60 scale-100'
    }`}>
      {name}
    </div>
  );

  const info = getStepInfo();

  return (
    <div className="w-full rounded-[2rem] border-2 border-[#D5DEEF] bg-white shadow-sm overflow-hidden font-sans">
      
      <div className="bg-[#F8FAFD] p-6 border-b border-[#D5DEEF]">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2.5 w-2.5 rounded-full bg-[#628ECB] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#628ECB]">Simulasi Transmisi Data</span>
        </div>
        <h3 className="text-xl font-extrabold text-[#395886]">Konsep Transmisi TCP/IP (U-Shape)</h3>
      </div>

      <div className="grid lg:grid-cols-12 items-start">
        
        {/* KOLOM KIRI: DIAGRAM U-SHAPE (Berdasarkan Gambar 6.3) */}
        <div className="lg:col-span-7 p-6 md:p-8 bg-white border-r border-[#D5DEEF] flex flex-col items-center">
          
          {/* Header PC */}
          <div className="flex w-full max-w-sm justify-between mb-6">
            <div className={`flex flex-col items-center transition-opacity ${step >= 1 && step <= 4 ? 'opacity-100' : 'opacity-40'}`}>
              <Monitor className="w-12 h-12 text-[#395886] mb-2" />
              <span className="font-black text-[#395886]">PC A</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pengirim</span>
            </div>
            <div className={`flex flex-col items-center transition-opacity ${step >= 6 && step <= 9 ? 'opacity-100' : 'opacity-40'}`}>
              <Monitor className="w-12 h-12 text-[#395886] mb-2" />
              <span className="font-black text-[#395886]">PC B</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Penerima</span>
            </div>
          </div>

          {/* Kolom Layer Vertikal */}
          <div className="flex w-full max-w-sm justify-between relative">
            
            {/* Sisi PC A (Enkapsulasi) */}
            <div className="flex flex-col items-center gap-2 w-[40%]">
              <LayerBox name="Application" active={step === 1} type="encap" />
              <ArrowDown className={`w-5 h-5 transition-colors ${step > 1 ? 'text-[#628ECB]' : 'text-[#D5DEEF]'}`} />
              
              <LayerBox name="Transport" active={step === 2} type="encap" />
              <ArrowDown className={`w-5 h-5 transition-colors ${step > 2 ? 'text-[#628ECB]' : 'text-[#D5DEEF]'}`} />
              
              <LayerBox name="Network" active={step === 3} type="encap" />
              <ArrowDown className={`w-5 h-5 transition-colors ${step > 3 ? 'text-[#628ECB]' : 'text-[#D5DEEF]'}`} />
              
              <LayerBox name="Data Link" active={step === 4} type="encap" />
              <ArrowDown className={`w-5 h-5 transition-colors ${step > 4 ? 'text-[#628ECB]' : 'text-[#D5DEEF]'}`} />
            </div>

            {/* Sisi PC B (Dekapsulasi) */}
            <div className="flex flex-col items-center gap-2 w-[40%]">
              <LayerBox name="Application" active={step === 9} type="decap" />
              <ArrowUp className={`w-5 h-5 transition-colors ${step > 8 ? 'text-[#628ECB]' : 'text-[#D5DEEF]'}`} />
              
              <LayerBox name="Transport" active={step === 8} type="decap" />
              <ArrowUp className={`w-5 h-5 transition-colors ${step > 7 ? 'text-[#628ECB]' : 'text-[#D5DEEF]'}`} />
              
              <LayerBox name="Network" active={step === 7} type="decap" />
              <ArrowUp className={`w-5 h-5 transition-colors ${step > 6 ? 'text-[#628ECB]' : 'text-[#D5DEEF]'}`} />
              
              <LayerBox name="Data Link" active={step === 6} type="decap" />
              <ArrowUp className={`w-5 h-5 transition-colors ${step > 5 ? 'text-[#628ECB]' : 'text-[#D5DEEF]'}`} />
            </div>

          </div>

          {/* Layer Fisik (Menyambungkan bawah) */}
          <div className="w-full max-w-sm mt-2">
            <div className={`w-full rounded-xl border-2 py-4 text-center font-black uppercase tracking-widest transition-all duration-500 ${
              step === 5 ? 'border-[#10B981] bg-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105' : 'border-[#D5DEEF] bg-[#F0F3FA] text-[#395886]/60'
            }`}>
              <Activity className="w-5 h-5 inline-block mr-2 -mt-1" />
              Physical
            </div>
          </div>

        </div>

        {/* KOLOM KANAN: KONTROL & PENJELASAN */}
        <div className="lg:col-span-5 bg-[#F8FAFD] p-6 md:p-8 flex flex-col h-full justify-center">
          
          {step === 0 && (
            <div className="text-center animate-in fade-in">
              <Info className="w-16 h-16 text-[#628ECB] mx-auto mb-4 opacity-50" />
              <h4 className="text-xl font-black text-[#395886] mb-2">Mulai Simulasi U-Shape</h4>
              <p className="text-sm font-medium text-[#395886]/70 mb-8 leading-relaxed">
                Tekan tombol di bawah untuk melihat proses data dibungkus dari PC A (Enkapsulasi), berjalan lewat kabel fisik, lalu dibuka bungkusnya di PC B (Dekapsulasi).
              </p>
              <button onClick={nextStep} className="w-full py-4 rounded-2xl bg-[#628ECB] text-white font-black shadow-lg shadow-[#628ECB]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-white" /> Mulai Simulasi
              </button>
            </div>
          )}

          {step > 0 && step < 10 && info && (
            <div className="animate-in slide-in-from-right-4 duration-500 flex flex-col h-full">
              
              <div className="flex items-center justify-between mb-4">
                 <span className="inline-block rounded-full bg-white border border-[#D5DEEF] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#395886]">
                   Langkah {step} dari 9
                 </span>
                 <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                   step <= 4 ? 'bg-blue-100 text-blue-600' : step === 5 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                 }`}>
                   {step <= 4 ? 'ENKAPSULASI' : step === 5 ? 'TRANSMISI' : 'DEKAPSULASI'}
                 </span>
              </div>

              <h4 className="text-2xl font-black text-[#395886] mb-3">{info.title}</h4>
              <p className="text-sm font-medium text-[#395886]/80 leading-relaxed mb-6 bg-white p-4 rounded-xl border border-[#D5DEEF] shadow-sm">
                {info.desc}
              </p>

              {/* Status PDU Interaktif */}
              <div className="mb-8">
                <span className="block text-[10px] font-black text-[#395886]/50 uppercase tracking-widest mb-2">Bentuk Data Saat Ini (PDU)</span>
                <div className="w-full bg-[#E5E9F2] rounded-xl p-3 flex justify-center min-h-[60px] items-center border border-[#D5DEEF] overflow-x-auto">
                   {renderPdu()}
                </div>
              </div>

              <div className="mt-auto">
                <button onClick={nextStep} className="w-full py-4 rounded-2xl bg-[#10B981] text-white font-black shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  Lanjut ke Layer Berikutnya <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}

          {step === 10 && (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#10B981]/20">
                <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
              </div>
              <h4 className="text-2xl font-black text-[#395886] mb-2">Transmisi Berhasil!</h4>
              <p className="text-sm font-medium text-[#395886]/70 mb-8">
                Data telah berhasil melintasi 5 Layer Model TCP/IP (Update) dari PC A ke PC B dengan utuh.
              </p>
              <button onClick={reset} className="w-full py-4 rounded-2xl bg-white border-2 border-[#D5DEEF] text-[#395886] font-black hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" /> Ulangi Simulasi
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}