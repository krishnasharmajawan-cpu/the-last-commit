import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles } from 'lucide-react';
import { playTerminalKeystroke, playCyberBeep } from '../utils/audio';

interface CyberTerminalProps {
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

export const CyberTerminal: React.FC<CyberTerminalProps> = ({ onOpenRegister, onOpenAdmin }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'tlc --version',
      output: (
        <div className="text-emerald-400 font-mono text-xs sm:text-sm">
          <span>The Last Commit v2.4.0 [Environment: Production]</span>
          <br />
          <span className="text-slate-400">Type <span className="text-cyan-400 font-bold">help</span> or click suggested commands below.</span>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmdText: string) => {
    const rawCmd = cmdText.trim();
    if (!rawCmd) return;

    playTerminalKeystroke();
    const cmd = rawCmd.toLowerCase();
    let response: React.ReactNode = null;

    if (cmd === 'help') {
      response = (
        <div className="space-y-1 text-slate-300 text-xs sm:text-sm">
          <div><span className="text-cyan-400 font-semibold">register</span> - Open registration modal</div>
          <div><span className="text-cyan-400 font-semibold">tracks</span> - Display the 4 core hackathon challenges</div>
          <div><span className="text-cyan-400 font-semibold">prizes</span> - Breakdown of the $25,000+ prize pool</div>
          <div><span className="text-cyan-400 font-semibold">schedule</span> - 48-hour timeline & milestones</div>
          <div><span className="text-cyan-400 font-semibold">stats</span> - Fetch live event registrations from backend</div>
          <div><span className="text-cyan-400 font-semibold">admin</span> - Access Hackathon Organizer Command Center</div>
          <div><span className="text-cyan-400 font-semibold">git status</span> - Check repository health before the last commit</div>
          <div><span className="text-cyan-400 font-semibold">clear</span> - Clear terminal output</div>
        </div>
      );
    } else if (cmd === 'register') {
      playCyberBeep(900, 0.1);
      onOpenRegister();
      response = <div className="text-emerald-400">🚀 Initiating participant registration protocol...</div>;
    } else if (cmd === 'admin') {
      playCyberBeep(700, 0.1);
      onOpenAdmin();
      response = <div className="text-amber-400">🔐 Opening Organizer Command Center...</div>;
    } else if (cmd === 'tracks') {
      response = (
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="text-emerald-400 font-bold">1. Kernel Panic:</div>
          <div className="text-slate-400 ml-3">Systems, Low-Level Runtimes, Custom Kernels & Rust/C Embedded.</div>
          <div className="text-cyan-400 font-bold">2. Neural Breach:</div>
          <div className="text-slate-400 ml-3">Autonomous Agents, Local LLM Inference, Neuro-symbolic Reasoning.</div>
          <div className="text-purple-400 font-bold">3. Zero-Day Web:</div>
          <div className="text-slate-400 ml-3">Distributed Protocols, Real-Time P2P, CRDTs & Next-Gen Full-Stack.</div>
          <div className="text-amber-400 font-bold">4. Cyber Fortress:</div>
          <div className="text-slate-400 ml-3">Zero-Knowledge Proofs, Binary Exploitation & DevSecOps.</div>
        </div>
      );
    } else if (cmd === 'prizes') {
      response = (
        <div className="space-y-1 text-xs sm:text-sm text-slate-300">
          <div className="text-amber-400 font-bold">🏆 1st Place (Grand Master): $10,000 USD + VC Pitch fast-track</div>
          <div className="text-cyan-300 font-bold">🥈 2nd Place (Cyber Runner-up): $6,000 USD + Cloud Credits</div>
          <div className="text-orange-400 font-bold">🥉 3rd Place (Bronze Hacker): $3,000 USD + Swag Vault</div>
          <div className="text-purple-300 font-bold">✨ Track Special Bounties: $6,000 USD ($1,500 per track)</div>
        </div>
      );
    } else if (cmd === 'stats') {
      try {
        const res = await fetch('/api/public-stats');
        const data = await res.json();
        if (data.success) {
          response = (
            <div className="text-xs sm:text-sm space-y-1 text-slate-300">
              <div className="text-emerald-400 font-semibold">⚡ LIVE BACKEND STATS:</div>
              <div>Registered Teams / Hackers: <span className="text-cyan-300 font-mono font-bold">{data.stats.registeredTeams} teams / {data.stats.totalHackers} hackers</span></div>
              <div>Colleges Represented: <span className="text-emerald-300 font-mono font-bold">{data.stats.collegesRepresented} institutions</span></div>
              <div>Capacity Limit: <span className="text-amber-300 font-mono font-bold">300 participants</span></div>
            </div>
          );
        } else {
          response = <div className="text-rose-400">Failed to fetch backend metrics.</div>;
        }
      } catch {
        response = <div className="text-rose-400">Backend connectivity error.</div>;
      }
    } else if (cmd === 'git status' || cmd === 'status') {
      response = (
        <div className="text-xs sm:text-sm font-mono text-slate-300 space-y-1">
          <div>On branch <span className="text-cyan-400">master</span></div>
          <div>Your branch is ahead of 'origin/main' by 42 commits.</div>
          <div className="text-emerald-400">Changes to be committed:</div>
          <div className="ml-4 text-emerald-300 font-mono">new file: hackathon_championship_solution.ts</div>
          <div className="text-amber-400">WARNING: 00:00:00 Deadline approaching fast!</div>
        </div>
      );
    } else if (cmd === 'schedule') {
      response = (
        <div className="text-xs sm:text-sm font-mono text-slate-300 space-y-1">
          <div><span className="text-cyan-400">09:00 AM</span> - Venue Doors Open & Check-In Badging</div>
          <div><span className="text-cyan-400">11:00 AM</span> - Keynote & Hackathon Kickoff</div>
          <div><span className="text-emerald-400">12:00 PM</span> - 48-Hour Timer Starts (Hacking Begins)</div>
          <div><span className="text-purple-400">12:00 AM</span> - Midnight Ramen & Lightning CTF</div>
          <div><span className="text-rose-400 font-bold">12:00 PM (+2d)</span> - THE LAST COMMIT (Code Freeze!)</div>
          <div><span className="text-amber-400">03:00 PM</span> - Live Pitches & Awards</div>
        </div>
      );
    } else if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (cmd.includes('sudo') || cmd.includes('winner')) {
      response = (
        <div className="text-xs sm:text-sm text-rose-400 font-mono">
          [PERMISSION DENIED] User is not in the sudoers file. Victory must be earned in git history!
        </div>
      );
    } else {
      response = (
        <div className="text-xs sm:text-sm text-slate-400">
          Command not recognized: &apos;{rawCmd}&apos;. Type <span className="text-cyan-400 font-semibold">help</span> to view available instructions.
        </div>
      );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: rawCmd,
        output: response,
      },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    }
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#090d16]/95 backdrop-blur-md shadow-2xl shadow-cyan-950/40 scanlines">
      {/* Terminal Title Bar */}
      <div className="bg-[#0f1624] px-4 py-3 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            guest@the-last-commit:~ (zsh)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            NODE.JS TS API CONNECTED
          </span>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm max-h-72 overflow-y-auto space-y-3">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="text-slate-500 select-none">$&gt;</span>
              <span className="font-semibold text-slate-100">{item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="px-4 py-3 bg-[#0d1421] border-t border-cyan-500/20 flex items-center gap-2">
        <span className="font-mono text-emerald-400 text-sm select-none">$&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command ('help', 'register', 'prizes', 'stats', 'tracks')..."
          className="flex-1 bg-transparent text-slate-100 font-mono text-xs sm:text-sm focus:outline-none placeholder-slate-600"
        />
        <button
          onClick={() => handleCommand(inputVal)}
          className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1 border border-cyan-500/30 transition-colors"
        >
          <CornerDownLeft className="w-3 h-3" />
          <span>EXEC</span>
        </button>
      </div>

      {/* Quick click command chips */}
      <div className="px-4 py-2 bg-[#090d16] border-t border-slate-800/80 flex flex-wrap gap-1.5 items-center">
        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Quick:
        </span>
        {['help', 'register', 'tracks', 'prizes', 'schedule', 'stats', 'admin', 'clear'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 border border-slate-700/50 hover:border-cyan-500/40 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
