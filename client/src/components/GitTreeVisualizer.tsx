import React, { useState } from 'react';
import { GitBranch, GitCommit, GitMerge, Clock, CheckCircle2 } from 'lucide-react';
import { playCyberBeep } from '../utils/audio';

interface MilestoneCommit {
  hash: string;
  branch: 'main' | 'systems' | 'ai' | 'security';
  time: string;
  tag?: string;
  message: string;
  author: string;
  details: string;
  status: 'completed' | 'current' | 'upcoming';
}

const MILESTONES: MilestoneCommit[] = [
  {
    hash: 'c0ffee1',
    branch: 'main',
    time: 'Day 1 · 09:00 AM',
    tag: 'v1.0-checkin',
    message: 'init: hacker badge pickup & network bootstrap',
    author: 'alex.ops',
    details: 'Physical check-in at venue, verification of RFID badges, high-speed fiber setup, and team setup lounges open.',
    status: 'completed',
  },
  {
    hash: 'd34db33',
    branch: 'main',
    time: 'Day 1 · 11:00 AM',
    tag: 'v1.1-keynote',
    message: 'event: opening keynote & secret challenge reveal',
    author: 'director.io',
    details: 'Keynote speakers, release of secret API keys, track problem statements disclosed, and official clock armed.',
    status: 'completed',
  },
  {
    hash: '42b9e10',
    branch: 'systems',
    time: 'Day 1 · 12:00 PM',
    message: 'feat(kernel): low-level memory benchmarks unlocked',
    author: 'kernel_master',
    details: 'Track 1 participants start bare-metal programming, custom allocators, and embedded hardware testing.',
    status: 'completed',
  },
  {
    hash: '7a11c0d',
    branch: 'ai',
    time: 'Day 1 · 04:00 PM',
    message: 'feat(neural): local LLM cluster inference online',
    author: 'neuro_hacker',
    details: 'Access granted to high-performance GPU cluster for agent training, embeddings, and fine-tuning experiments.',
    status: 'completed',
  },
  {
    hash: 'f00ba42',
    branch: 'main',
    time: 'Day 2 · 12:00 AM',
    tag: 'v1.2-midnight',
    message: 'refactor: midnight ramen, red bull & lightning ctf',
    author: 'midnight_ramen',
    details: 'Midnight sustenance, surprise mini CTF sidequest with exclusive physical mechanical keyboard switch prizes.',
    status: 'completed',
  },
  {
    hash: 'e892d11',
    branch: 'security',
    time: 'Day 2 · 04:00 AM',
    message: 'audit(sec): cryptographic zero-knowledge testnet launch',
    author: 'cypher_phantom',
    details: 'Verification phase for cryptographic circuits, smart contracts, and distributed security harnesses.',
    status: 'current',
  },
  {
    hash: '90fa412',
    branch: 'main',
    time: 'Day 2 · 10:00 AM',
    tag: 'v1.3-freeze-warn',
    message: 'warning: 2-hour pre-commit freeze announcement',
    author: 'lead_judge',
    details: 'Judges circulate for preliminary architecture walkthroughs. Teams run final CI/CD regression tests.',
    status: 'upcoming',
  },
  {
    hash: '0000000',
    branch: 'main',
    time: 'Day 2 · 12:00 PM',
    tag: 'v2.0-THE-LAST-COMMIT',
    message: 'release: THE LAST COMMIT · strict repo freeze',
    author: 'git_daemon',
    details: 'All push access to git remotes revoked. Repositories locked for evaluation. Demos loaded onto judging rigs.',
    status: 'upcoming',
  },
  {
    hash: 'f1na199',
    branch: 'main',
    time: 'Day 2 · 03:00 PM',
    tag: 'v2.1-podium',
    message: 'merge: mainstage final pitches & $25,000 awards',
    author: 'jury_council',
    details: 'Top 8 finalist teams pitch live on the main auditorium stage before judges and venture partners.',
    status: 'upcoming',
  },
];

export const GitTreeVisualizer: React.FC = () => {
  const [selectedCommit, setSelectedCommit] = useState<MilestoneCommit>(MILESTONES[5]);

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-cyan-500/30 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            Git Commit History & Roadmap
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
            48-Hour Milestone Timeline
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> main (release)
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> track/systems
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span> track/ai
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Commits List / Tree */}
        <div className="lg:col-span-7 space-y-2.5 max-h-[460px] overflow-y-auto pr-2">
          {MILESTONES.map((commit) => {
            const isSelected = selectedCommit.hash === commit.hash;
            const branchColor =
              commit.branch === 'main'
                ? 'border-emerald-500 text-emerald-400'
                : commit.branch === 'systems'
                ? 'border-cyan-500 text-cyan-400'
                : commit.branch === 'ai'
                ? 'border-purple-500 text-purple-400'
                : 'border-amber-500 text-amber-400';

            return (
              <div
                key={commit.hash}
                onClick={() => {
                  playCyberBeep(750, 0.04);
                  setSelectedCommit(commit);
                }}
                className={`group cursor-pointer rounded-xl p-3.5 border transition-all duration-200 flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-[#101726] border-cyan-400 shadow-md shadow-cyan-950/50'
                    : 'bg-[#0d131f]/70 border-slate-800 hover:border-slate-700 hover:bg-[#0f1724]'
                }`}
              >
                {/* Node icon with connecting line indication */}
                <div className="flex flex-col items-center pt-0.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border font-mono text-xs font-bold ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700'
                    }`}
                  >
                    {commit.hash.substring(0, 3)}
                  </div>
                </div>

                {/* Commit info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {commit.time}
                    </span>
                    {commit.tag && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {commit.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                    {commit.message}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                    <span>@{commit.author}</span>
                    <span>•</span>
                    <span className={`capitalize ${branchColor}`}>{commit.branch}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Commit Detail Card */}
        <div className="lg:col-span-5 bg-[#0c121e] rounded-xl border border-cyan-500/30 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                COMMIT INSPECTOR
              </span>
              <span className="text-xs font-mono text-slate-400">
                SHA: <span className="text-cyan-300 font-bold">{selectedCommit.hash}</span>
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-xs font-mono text-slate-400">Timestamp:</span>
                <p className="text-slate-100 font-medium text-sm mt-0.5">{selectedCommit.time}</p>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400">Commit Message:</span>
                <p className="text-emerald-400 font-mono text-sm font-semibold mt-0.5 bg-[#080d16] p-2.5 rounded-lg border border-slate-800">
                  {selectedCommit.message}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400">Phase Overview:</span>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">{selectedCommit.details}</p>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400">Phase Status:</span>
                <div className="mt-1 flex items-center gap-2">
                  {selectedCommit.status === 'completed' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> STAGED & COMPLETED
                    </span>
                  )}
                  {selectedCommit.status === 'current' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> ACTIVE RUNTIME PHASE
                    </span>
                  )}
                  {selectedCommit.status === 'upcoming' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
                      SCHEDULED MERGE
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <GitMerge className="w-3.5 h-3.5 text-cyan-400" /> branch: {selectedCommit.branch}
            </span>
            <span>committer: {selectedCommit.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
