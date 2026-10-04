import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Check, Copy, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { playCyberBeep, playSuccessChime } from '../utils/audio';

interface TicketData {
  ticketCode: string;
  fullName: string;
  email: string;
  college: string;
  track: string;
  registrationType: string;
  teamName?: string | null;
  tshirtSize?: string;
  createdAt: string;
}

interface CyberTicketModalProps {
  ticket: TicketData | null;
  onClose: () => void;
}

export const CyberTicketModal: React.FC<CyberTicketModalProps> = ({ ticket, onClose }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ticket) return;

    playSuccessChime();

    if (qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        JSON.stringify({
          ticket: ticket.ticketCode,
          name: ticket.fullName,
          track: ticket.track,
          org: 'The Last Commit 2026'
        }),
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#00f0ff',
            light: '#0a0e17'
          }
        },
        (err) => {
          if (err) console.error('QR code generation error:', err);
        }
      );
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.ticketCode);
    playCyberBeep(900, 0.05);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#090d16] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/70">
        {/* Header Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500"></div>

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              CONFIRMED HACKER PASS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Registration Successful!
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Your official boarding pass for <span className="text-cyan-400 font-semibold">The Last Commit</span> has been minted.
            </p>
          </div>

          {/* Holographic Boarding Pass */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0e1626] to-[#070b13] border border-cyan-500/30 p-5 sm:p-6 shadow-inner overflow-hidden">
            {/* Ambient watermarks */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  OFFICIAL ATTENDEE CREDENTIAL
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  THE LAST COMMIT 2026
                </h3>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[10px] font-mono text-slate-400">TICKET IDENTIFIER</span>
                <div className="font-mono text-sm font-bold text-cyan-300">
                  {ticket.ticketCode}
                </div>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-5 items-center">
              <div className="sm:col-span-8 space-y-3">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">PARTICIPANT NAME</span>
                  <div className="text-base font-semibold text-white">{ticket.fullName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400">INSTITUTION</span>
                    <div className="text-xs font-medium text-slate-200 truncate">{ticket.college}</div>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400">TYPE</span>
                    <div className="text-xs font-medium text-slate-200 capitalize">
                      {ticket.registrationType === 'team' ? `Team (${ticket.teamName || 'Squad'})` : 'Solo Hacker'}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400">SELECTED TRACK</span>
                  <div className="text-xs font-semibold text-emerald-400">{ticket.track}</div>
                </div>
              </div>

              {/* QR Code Canvas */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-[#080d16] border border-cyan-500/20">
                <canvas ref={qrCanvasRef} className="rounded-lg shadow-sm" />
                <span className="text-[9px] font-mono text-cyan-400/80 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED PASS
                </span>
              </div>
            </div>

            {/* Barcode visual decoration */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-1 opacity-70">
                <div className="w-1 h-5 bg-cyan-400"></div>
                <div className="w-2 h-5 bg-cyan-400"></div>
                <div className="w-0.5 h-5 bg-cyan-400"></div>
                <div className="w-1.5 h-5 bg-cyan-400"></div>
                <div className="w-3 h-5 bg-cyan-400"></div>
                <div className="w-1 h-5 bg-cyan-400"></div>
                <div className="w-2 h-5 bg-cyan-400"></div>
                <div className="w-0.5 h-5 bg-cyan-400"></div>
                <div className="w-2.5 h-5 bg-cyan-400"></div>
                <div className="w-1 h-5 bg-cyan-400"></div>
                <div className="w-2 h-5 bg-cyan-400"></div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                T-MINUS 00:00:00 · VENUE CHECK-IN REQUIRED
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleCopy}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs sm:text-sm font-semibold border border-cyan-500/40 flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'CODE COPIED!' : 'COPY TICKET CODE'}</span>
            </button>

            <button
              onClick={() => {
                playCyberBeep(800, 0.05);
                window.print();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>SAVE / PRINT PASS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
