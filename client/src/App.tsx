import { useState, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Trophy,
  Cpu,
  Brain,
  Globe,
  Shield,
  Volume2,
  VolumeX,
  Lock,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle,
  Award,
  Zap,
  Radio
} from 'lucide-react';
import { CyberBackground } from './components/CyberBackground';
import { CyberTerminal } from './components/CyberTerminal';
import { GitTreeVisualizer } from './components/GitTreeVisualizer';
import { RegistrationModal } from './components/RegistrationModal';
import { CyberTicketModal } from './components/CyberTicketModal';
import { AdminPortal } from './components/AdminPortal';
import { toggleSound, playCyberBeep } from './utils/audio';

export function App() {
  const [soundOn, setSoundOn] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<any>(null);

  // Live Stats from Node.js backend
  const [stats, setStats] = useState({
    registeredTeams: 8,
    totalHackers: 17,
    collegesRepresented: 7,
    prizePoolUSD: 25000,
    maxCapacity: 300,
  });

  // Countdown to Hackathon Deadline
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Fetch live stats from backend
  useEffect(() => {
    fetch('/api/public-stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.log('Stats fetch:', err));

    // Countdown interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleOpenRegister = () => {
    playCyberBeep(850, 0.08);
    setIsRegisterOpen(true);
  };

  const handleOpenAdmin = () => {
    playCyberBeep(700, 0.08);
    setIsAdminOpen(true);
  };

  const handleRegistrationSuccess = (ticket: any) => {
    setIsRegisterOpen(false);
    setCurrentTicket(ticket);
    // Refresh stats
    fetch('/api/public-stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
      })
      .catch(() => {});
  };

  const TRACKS_DETAIL = [
    {
      id: 'kernel-panic',
      title: 'Kernel Panic',
      subtitle: 'Systems & Low-Level Runtimes',
      icon: Cpu,
      badge: 'HARDCORE SYSTEMS',
      accent: 'emerald',
      description:
        'Build at the hardware boundary. Design custom memory allocators, microkernels in Rust/Zig, zero-copy networking engines, or embedded telemetry drivers.',
      challenge: 'Benchmark: Sub-millisecond latency under 100,000 concurrent memory operations.',
      tags: ['Rust', 'Zig', 'C++', 'WASM', 'Linux eBPF', 'Bare-Metal'],
    },
    {
      id: 'neural-breach',
      title: 'Neural Breach',
      subtitle: 'Autonomous AI & LLM Systems',
      icon: Brain,
      badge: 'AUTONOMOUS AGENTS',
      accent: 'cyan',
      description:
        'Move beyond simple chatbots. Build self-directed multi-agent clusters, local edge inference pipelines, neuro-symbolic reasoning frameworks, or autonomous code healers.',
      challenge: 'Multi-agent consensus achieving 95%+ precision on adversarial code debugging.',
      tags: ['Local LLMs', 'PyTorch', 'Agentic Workflows', 'Ollama', 'Vector DBs'],
    },
    {
      id: 'zero-day-web',
      title: 'Zero-Day Web',
      subtitle: 'Distributed Systems & Web3',
      icon: Globe,
      badge: 'DISTRIBUTED ARCHITECTURE',
      accent: 'purple',
      description:
        'Engineer censorship-resistant, decentralized software. Craft peer-to-peer collaborative CRDTs, ephemeral git hosts over WebRTC, or distributed state synchronization.',
      challenge: 'Partition tolerance with instant conflict-free peer convergence.',
      tags: ['WebRTC', 'CRDTs', 'P2P', 'Node.js', 'Distributed State', 'libp2p'],
    },
    {
      id: 'cyber-fortress',
      title: 'Cyber Fortress',
      subtitle: 'Cryptography & Cyber Defense',
      icon: Shield,
      badge: 'SECURITY & CRYPTO',
      accent: 'amber',
      description:
        'Defend the terminal. Construct zero-knowledge identity circuits, hardware enclave attestation bridges, cryptographic audit ledgers, or automated binary fuzzers.',
      challenge: 'Provable integrity with zero private payload disclosure.',
      tags: ['ZK-SNARKs', 'Circom', 'TEE Enclaves', 'Cryptography', 'DevSecOps'],
    },
  ];

  const FAQS = [
    {
      q: 'Who can register for The Last Commit?',
      a: 'Any university student (1st year, 2nd year, 3rd year, 4th year, and postgraduate scholars) can participate. We welcome beginners through hardcore systems veterans.',
    },
    {
      q: 'What is the team size limit?',
      a: 'You can participate as an individual (Solo Hacker) or form a team of up to 4 members. You can also specify team members during registration or form teams during the opening mixer.',
    },
    {
      q: 'What happens at 00:00:00 (The Last Commit)?',
      a: 'At the exact 48-hour cutoff, all push access to repository remotes is permanently frozen. Only commits with timestamps verified before the freeze will be evaluated by the jury.',
    },
    {
      q: 'Are hardware and food provided?',
      a: 'Yes! High-speed Gigabit WiFi, power strips, 24/7 Red Bull & coffee lounges, catered meals (with Vegetarian, Vegan, Jain, and Halal options), midnight ramen, and hardware lab gear are fully provided.',
    },
    {
      q: 'Who retains the intellectual property (IP) of projects?',
      a: 'You do! 100% of all code, intellectual property, and projects created during The Last Commit belong entirely to you and your team.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 relative selection:bg-cyan-400 selection:text-black">
      {/* Animated Canvas Git Constellation */}
      <CyberBackground />

      {/* Cyber Grid Lines Background Overlay */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40 z-0"></div>

      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#07090e]/85 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <GitCommit className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-white text-base sm:text-lg font-mono">
                  THE LAST COMMIT
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  48H COMMITS
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider hidden sm:block">
                GLOBAL HACKATHON · NODE.JS + TS POWERED
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">ROADMAP</a>
            <a href="#terminal" className="hover:text-cyan-400 transition-colors">TERMINAL</a>
            <a href="#tracks" className="hover:text-cyan-400 transition-colors">TRACKS</a>
            <a href="#prizes" className="hover:text-cyan-400 transition-colors">PRIZES</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Mute Cyber Audio' : 'Unmute Cyber Audio'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Admin Command Center Button */}
            <button
              onClick={handleOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-[#0e1626] hover:bg-[#131d33] text-amber-400 text-xs font-mono border border-amber-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Organizer Portal & Analytics"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ORGANIZERS</span>
            </button>

            {/* Register CTA */}
            <button
              onClick={handleOpenRegister}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold font-mono text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>REGISTER</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        {/* HERO SECTION */}
        <section className="text-center pt-8 sm:pt-14 pb-8 space-y-8">
          {/* Beacon Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>REGISTRATION LIVE · T-MINUS TO THE MERGE FREEZE</span>
          </div>

          {/* Main Glitch Title */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase font-mono">
              THE LAST <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 neon-text-cyan">COMMIT</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-light leading-relaxed">
              48 Hours. 00:00:00 Cutoff. Push your code before the repository freezes forever.
            </p>
          </div>

          {/* COUNTDOWN TIMER CARDS */}
          <div className="max-w-xl mx-auto">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 p-3 rounded-2xl bg-[#090d16]/90 border border-cyan-500/30 backdrop-blur-md shadow-2xl">
              <div className="p-3 sm:p-4 rounded-xl bg-[#0e1626] border border-cyan-500/20">
                <div className="text-2xl sm:text-4xl font-extrabold font-mono text-cyan-300">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase">DAYS</div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#0e1626] border border-cyan-500/20">
                <div className="text-2xl sm:text-4xl font-extrabold font-mono text-cyan-300">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase">HOURS</div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#0e1626] border border-cyan-500/20">
                <div className="text-2xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase">MINUTES</div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#0e1626] border border-cyan-500/20">
                <div className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase">SECONDS</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleOpenRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold font-mono text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>INITIALIZE REGISTRATION</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#terminal"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#0d1424] hover:bg-[#121c33] text-slate-200 font-mono text-sm sm:text-base border border-cyan-500/30 flex items-center justify-center gap-2 transition-colors"
            >
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              <span>TRY BASH CLI</span>
            </a>
          </div>

          {/* Real-time Ticker Metrics from Backend */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>
                <strong className="text-white">{stats.totalHackers}</strong> Hackers Enlisted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>
                <strong className="text-white">{stats.collegesRepresented}</strong> Universities
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>
                <strong className="text-white">${stats.prizePoolUSD.toLocaleString()}</strong> Bounty Pool
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE BASH TERMINAL */}
        <section id="terminal" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-cyan-400 tracking-wider flex items-center gap-1.5 uppercase">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Interactive CLI Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Developer Command Line Interface
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-sm">
              Execute live commands, query real-time event status, or trigger quick registration protocols directly.
            </p>
          </div>

          <CyberTerminal onOpenRegister={handleOpenRegister} onOpenAdmin={handleOpenAdmin} />
        </section>

        {/* SECTION: ROADMAP & GIT COMMIT GRAPH */}
        <section id="about" className="space-y-4">
          <GitTreeVisualizer />
        </section>

        {/* SECTION: TRACKS & CHALLENGES */}
        <section id="tracks" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              CHOOSE YOUR ARENA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The 4 Core Engineering Tracks
            </h2>
            <p className="text-sm text-slate-400">
              Pick your battleground. Every track features dedicated mentor panels, industry benchmarks, and exclusive track bounties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRACKS_DETAIL.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className="rounded-2xl bg-[#090d16] border border-cyan-500/30 p-6 sm:p-7 hover:border-cyan-400 transition-all duration-300 shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {track.title}
                          </h3>
                          <span className="text-xs font-mono text-slate-400">{track.subtitle}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                        {track.badge}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {track.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#0e1626] border border-slate-800 text-xs font-mono text-emerald-400 mb-4">
                      <span className="text-slate-400 block text-[10px]">TARGET CRITERIA:</span>
                      {track.challenge}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                      {track.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={handleOpenRegister}
                      className="mt-5 w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/40 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>ENLIST IN THIS TRACK</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: PRIZES & BOUNTIES */}
        <section id="prizes" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-amber-400 tracking-wider uppercase">
              $25,000 USD REWARD POOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Championship Honors &amp; Bounties
            </h2>
            <p className="text-sm text-slate-400">
              High stakes for exceptional craft. In addition to cash prizes, winners receive venture accelerator interviews, cloud grants, and physical trophies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* 2nd Place */}
            <div className="rounded-2xl bg-[#090d16] border border-cyan-500/30 p-6 flex flex-col justify-between order-2 md:order-1">
              <div>
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 w-fit mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-slate-400">2ND PLACE</span>
                <h3 className="text-2xl font-bold text-white mt-1">Cyber Runner-Up</h3>
                <div className="text-3xl font-extrabold font-mono text-cyan-300 mt-2">
                  $6,000 <span className="text-sm text-slate-400 font-normal">USD</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> $10,000 Cloud Compute Grants
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Fast-track Series Seed Pitch
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Silver Engraved Keyboards
                  </li>
                </ul>
              </div>
            </div>

            {/* 1st Place - Grand Master */}
            <div className="rounded-2xl bg-gradient-to-b from-[#111c30] to-[#090d16] border-2 border-amber-400/80 p-7 flex flex-col justify-between relative shadow-2xl shadow-amber-500/20 order-1 md:order-2 scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold font-mono text-xs shadow-md">
                GRAND MASTER CHAMPION
              </div>

              <div>
                <div className="p-3.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/50 w-fit mb-4 mt-2">
                  <Trophy className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono text-amber-400">1ST PLACE OVERALL</span>
                <h3 className="text-3xl font-extrabold text-white mt-1">Apex Commit</h3>
                <div className="text-4xl font-black font-mono text-amber-400 mt-2">
                  $10,000 <span className="text-sm text-slate-400 font-normal">USD</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-slate-200 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" /> $25,000 Cloud Compute &amp; GPU cluster
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" /> Direct Partner Interview with VC
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" /> Custom Titanium Mechanical Keyboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" /> The Last Commit Championship Cup
                  </li>
                </ul>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="rounded-2xl bg-[#090d16] border border-cyan-500/30 p-6 flex flex-col justify-between order-3">
              <div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 w-fit mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-slate-400">3RD PLACE</span>
                <h3 className="text-2xl font-bold text-white mt-1">Bronze Hacker</h3>
                <div className="text-3xl font-extrabold font-mono text-purple-300 mt-2">
                  $3,000 <span className="text-sm text-slate-400 font-normal">USD</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" /> $5,000 Cloud Hosting Credits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Hardware Dev Swag Vault
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" /> VIP Community Mentor Access
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Track Category Bounties */}
          <div className="p-6 rounded-2xl bg-[#0c121e] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">
                  Track-Specific Bounties: $6,000 Total ($1,500 Per Track)
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Best Kernel Mod · Most Devastating Agent · Deepest ZK Circuit · Cleanest P2P Protocol
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenRegister}
              className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 shrink-0 transition-colors"
            >
              COMPETE FOR BOUNTIES
            </button>
          </div>
        </section>

        {/* SECTION: SPONSORS & ECOSYSTEM */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              SUPPORTED BY INDUSTRY TITANS
            </span>
            <h3 className="text-xl font-bold text-white">Ecosystem Partners &amp; Cloud Sponsors</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Vercel / Next.js', tier: 'Obsidian Cloud' },
              { name: 'Anthropic / Claude', tier: 'AI Infrastructure' },
              { name: 'Supabase', tier: 'Open Source DB' },
              { name: 'GitHub Universe', tier: 'Git Ecosystem' },
            ].map((sponsor) => (
              <div
                key={sponsor.name}
                className="p-5 rounded-xl bg-[#090d16] border border-slate-800/80 hover:border-cyan-500/40 flex flex-col items-center justify-center text-center transition-all group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-300 text-sm tracking-wide">
                  {sponsor.name}
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase">
                  {sponsor.tier}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: FAQ ACCORDION */}
        <section id="faq" className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              CLARIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-[#090d16] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => {
                      playCyberBeep(650, 0.03);
                      setActiveFaq(isOpen ? null : idx);
                    }}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-cyan-300"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-12 pb-8 border-t border-slate-800 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>THE LAST COMMIT · 2026 EDITION</span>
            <span>•</span>
            <span className="text-cyan-400">STATUS: REPOSITORY ACTIVE</span>
          </div>

          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Built with Node.js &amp; TypeScript. Featuring authentic database registration, QR code badge generator, and organizer intelligence portal.
          </p>

          <div className="pt-2 flex justify-center items-center gap-4 text-xs font-mono text-slate-400">
            <button onClick={handleOpenRegister} className="hover:text-cyan-300">
              [ Register ]
            </button>
            <button onClick={handleOpenAdmin} className="hover:text-amber-300">
              [ Organizer Login ]
            </button>
            <a href="#terminal" className="hover:text-cyan-300">
              [ Terminal ]
            </a>
          </div>
        </footer>
      </main>

      {/* REGISTRATION MODAL */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />

      {/* CYBER TICKET MODAL */}
      <CyberTicketModal
        ticket={currentTicket}
        onClose={() => setCurrentTicket(null)}
      />

      {/* ORGANIZER ADMIN PORTAL */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onViewTicket={(ticket) => setCurrentTicket(ticket)}
      />
    </div>
  );
}

export default App;
