import React, { useState, useMemo } from 'react';
import { Search, Fingerprint, Lock, Globe, BookOpen, Cpu, LayoutPanelLeft } from 'lucide-react';

export function Ipv4Analyzer() {
  const [activeTab, setActiveTab] = useState<'theory' | 'sandbox'>('theory');
  const [ipInput, setIpInput] = useState('192.168.1.10');

  // --- LOGIKA ANALISIS IP INPUT ---
  const ipData = useMemo(() => {
    const parts = ipInput.split('.');
    if (parts.length !== 4) return null;
    
    const octets = parts.map(p => parseInt(p, 10));
    if (!octets.every(num => !isNaN(num) && num >= 0 && num <= 255)) return null;

    const o1 = octets[0];
    const o2 = octets[1];
    
    // Biner penuh 32-bit untuk visualisasi input
    const binaries = octets.map(num => num.toString(2).padStart(8, '0'));
    const firstOctetBinary = binaries[0];

    let ipClass = '';
    let networkOctets = 0;
    let bitIndicator = '';

    if (o1 >= 0 && o1 <= 127) {
      ipClass = 'A'; bitIndicator = firstOctetBinary.substring(0, 1); networkOctets = 1;
    } else if (o1 >= 128 && o1 <= 191) {
      ipClass = 'B'; bitIndicator = firstOctetBinary.substring(0, 2); networkOctets = 2;
    } else if (o1 >= 192 && o1 <= 223) {
      ipClass = 'C'; bitIndicator = firstOctetBinary.substring(0, 3); networkOctets = 3;
    } else if (o1 >= 224 && o1 <= 239) {
      ipClass = 'D'; bitIndicator = firstOctetBinary.substring(0, 4); networkOctets = 0;
    } else {
      ipClass = 'E'; bitIndicator = firstOctetBinary.substring(0, 4); networkOctets = 0;
    }

    let isPrivate = false;
    if (ipClass === 'A' && o1 === 10) isPrivate = true;
    if (ipClass === 'B' && o1 === 172 && (o2 >= 16 && o2 <= 31)) isPrivate = true;
    if (ipClass === 'C' && o1 === 192 && o2 === 168) isPrivate = true;

    return { octets, binaries, ipClass, networkOctets, isPrivate, bitIndicator };
  }, [ipInput]);

  // --- KOMPONEN KARTU TEORI (Bisa Dipakai Berulang) ---
  const TheoryCard = ({ className, bitRule, startIP, endIP, netCount, hostCount }: any) => (
    <div className="bg-white rounded-2xl p-5 border-2 border-[#D5DEEF] shadow-sm hover:border-[#628ECB] transition-all hover:shadow-md group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h5 className="font-black text-[#395886] text-xl mb-1">Kelas {className}</h5>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded inline-block">
            {startIP} - {endIP}
          </p>
        </div>
        <div className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-mono text-sm font-black border border-red-200">
          {bitRule}
        </div>
      </div>
      
      {/* Visualisasi Porsi Network vs Host */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(num => (
          <div key={num} className={`flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-black text-white transition-all shadow-sm ${
            num <= netCount ? 'bg-blue-500' : 'bg-orange-400'
          }`}>
            {num <= netCount ? 'NET' : 'HOST'}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full rounded-[2rem] border-2 border-[#D5DEEF] bg-white shadow-sm overflow-hidden font-sans">
      
      {/* Header Utama */}
      <div className="bg-gradient-to-r from-[#395886] to-[#628ECB] p-6 text-white flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <LayoutPanelLeft className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold">Laboratorium Interaktif IPv4</h3>
          <p className="text-sm font-medium text-blue-100 mt-1">
            Pelajari struktur baku tiap kelas IP, lalu buktikan dengan memasukkan kodemu sendiri!
          </p>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="px-6 pt-6">
        <div className="flex p-1.5 bg-[#F0F3FA] rounded-2xl">
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'theory' 
                ? 'bg-white text-[#395886] shadow-sm' 
                : 'text-[#395886]/50 hover:text-[#395886]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Buku Panduan Materi
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'sandbox' 
                ? 'bg-white text-[#10B981] shadow-sm' 
                : 'text-[#395886]/50 hover:text-[#10B981]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Sandbox (Uji IP)
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        
        {/* TAB 1: MATERI / TEORI VISUAL */}
        {activeTab === 'theory' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TheoryCard className="A" bitRule="0xxxxxxx" startIP="0.0.0.0" endIP="127.255.255.255" netCount={1} hostCount={3} />
              <TheoryCard className="B" bitRule="10xxxxxx" startIP="128.0.0.0" endIP="191.255.255.255" netCount={2} hostCount={2} />
              <TheoryCard className="C" bitRule="110xxxxx" startIP="192.0.0.0" endIP="223.255.255.255" netCount={3} hostCount={1} />
            </div>
            
            <div className="bg-[#F8FAFD] rounded-2xl p-5 border border-[#D5DEEF] flex items-start gap-4">
              <Fingerprint className="w-6 h-6 text-[#628ECB] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-[#395886] mb-1">Catatan Kelas Khusus</h5>
                <p className="text-sm font-medium text-[#395886]/70 leading-relaxed">
                  Kelas D (Multicast: diawali 1110) & Kelas E (Eksperimen: diawali 1111) tidak membagi porsinya menjadi Host dan Network standar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SANDBOX & ANALISIS */}
        {activeTab === 'sandbox' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
            
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                <Search className="w-6 h-6 text-[#10B981]/50" />
              </div>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                className="w-full bg-[#F8FAFD] border-2 border-[#D5DEEF] text-center text-[#395886] text-3xl font-black rounded-3xl focus:ring-4 focus:ring-[#10B981]/20 focus:border-[#10B981] py-5 pl-12 pr-6 transition-all shadow-inner"
                placeholder="Ketik IP di sini (contoh: 172.16.0.1)"
              />
            </div>

            {!ipData ? (
               <div className="text-center py-12 bg-red-50 text-red-500 rounded-3xl border-2 border-red-100 font-bold">
                 Format IP tidak valid! Pastikan menggunakan 4 blok angka (0-255).
               </div>
            ) : (
              <div className="space-y-6">
                
                {/* Hasil Analisis Biner & Porsi */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#D5DEEF] shadow-sm">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 text-center">Struktur Biner 32-Bit Input</h5>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    {ipData.octets.map((octet, idx) => {
                      const isNetwork = idx < ipData.networkOctets;
                      const isClassDeterminer = idx === 0;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group">
                          {/* Blok Desimal */}
                          <div className={`w-full py-4 text-center rounded-2xl border-2 mb-3 transition-all ${
                            ['A','B','C'].includes(ipData.ipClass) 
                              ? isNetwork ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-[0_4px_0_0_rgba(191,219,254,1)]' : 'bg-orange-50 border-orange-200 text-orange-700 shadow-[0_4px_0_0_rgba(254,215,170,1)]'
                              : 'bg-gray-50 border-gray-200 text-gray-700 shadow-[0_4px_0_0_rgba(229,231,235,1)]'
                          }`}>
                            <span className="text-3xl font-black">{octet}</span>
                          </div>
                          
                          {/* Label Net/Host */}
                          <span className={`text-xs font-black uppercase tracking-widest mb-3 ${
                            isNetwork ? 'text-blue-600' : 'text-orange-600'
                          }`}>
                            {['A','B','C'].includes(ipData.ipClass) ? (isNetwork ? 'Network' : 'Host') : 'Unknown'}
                          </span>

                          {/* Deretan Biner */}
                          <div className="font-mono text-sm md:text-base font-black tracking-widest text-gray-500 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
                            {isClassDeterminer ? (
                              <>
                                <span className="text-red-500 bg-red-100 px-1 rounded shadow-sm">{ipData.bitIndicator}</span>
                                {ipData.binaries[idx].substring(ipData.bitIndicator.length)}
                              </>
                            ) : (
                              ipData.binaries[idx]
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Kesimpulan Status */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 bg-[#F8FAFD] border-2 border-[#D5DEEF] rounded-3xl p-6 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Terdeteksi Sebagai</span>
                    <p className="text-4xl font-black text-[#395886]">Kelas {ipData.ipClass}</p>
                  </div>
                  
                  <div className={`flex-1 border-2 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                    ipData.isPrivate 
                      ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#065F46]' 
                      : 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#92400E]'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      {ipData.isPrivate ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                      <span className="text-xs font-black uppercase tracking-widest opacity-70">Jangkauan Akses</span>
                    </div>
                    <p className="text-2xl font-black">
                      {ipData.isPrivate ? 'IP Privat' : 'IP Publik'}
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}