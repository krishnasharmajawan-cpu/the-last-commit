import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Cpu,
  Brain,
  Globe,
  Shield,
  Users,
  User,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Code
} from 'lucide-react';
import { playCyberBeep } from '../utils/audio';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ticket: any) => void;
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

const TRACKS = [
  {
    id: 'Kernel Panic (Systems & Low-Level)',
    title: 'Kernel Panic',
    subtitle: 'Systems, OS & Embedded',
    icon: Cpu,
    color: 'emerald',
    desc: 'Bare-metal runtimes, Rust/C low-level kernels, custom memory allocators & high-throughput drivers.',
  },
  {
    id: 'Neural Breach (AI & Agents)',
    title: 'Neural Breach',
    subtitle: 'Autonomous AI & LLMs',
    icon: Brain,
    color: 'cyan',
    desc: 'Local edge LLM clusters, multi-agent autonomous consensus, multimodal reasoning & fine-tuning.',
  },
  {
    id: 'Zero-Day Web (Distributed & Web3)',
    title: 'Zero-Day Web',
    subtitle: 'Distributed Systems & P2P',
    icon: Globe,
    color: 'purple',
    desc: 'Real-time collaborative CRDTs, peer-to-peer decentralized networks & high-concurrency protocols.',
  },
  {
    id: 'Cyber Fortress (Security & Crypto)',
    title: 'Cyber Fortress',
    subtitle: 'Cryptography & Security',
    icon: Shield,
    color: 'amber',
    desc: 'Zero-knowledge proofs, hardware enclaves, automated vulnerability discovery & post-quantum crypto.',
  },
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    yearOfStudy: '2nd Year',
    track: 'Neural Breach (AI & Agents)',
    registrationType: 'solo',
    teamName: '',
    experienceLevel: 'Intermediate',
    tshirtSize: 'L',
    dietaryPref: 'Vegetarian',
    githubUrl: '',
    linkedinUrl: '',
    projectIdea: '',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: '', email: '', role: 'Backend Developer' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (teamMembers.length >= 3) return; // Max team size 4 including leader
    playCyberBeep(700, 0.05);
    setTeamMembers([...teamMembers, { name: '', email: '', role: 'Developer' }]);
  };

  const handleRemoveMember = (idx: number) => {
    playCyberBeep(500, 0.05);
    setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: keyof TeamMember, val: string) => {
    const updated = [...teamMembers];
    updated[idx][field] = val;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.college.trim()) {
      setError('Please fill in all mandatory fields (Name, Email, Institution).');
      return;
    }

    if (formData.registrationType === 'team' && !formData.teamName.trim()) {
      setError('Please provide a Team Name for team registration.');
      return;
    }

    setLoading(true);
    playCyberBeep(850, 0.08);

    try {
      const payload = {
        ...formData,
        teamSize: formData.registrationType === 'team' ? teamMembers.length + 1 : 1,
        teamMembers: formData.registrationType === 'team' ? teamMembers : null,
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00ff88', '#00f0ff', '#f59e0b', '#a855f7'],
        });
      } catch {}

      onSuccess(data.ticket);
    } catch (err: any) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#080d16] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/80 my-8">
        {/* Glow Header */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400"></div>

        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              THE LAST COMMIT 2026 REGISTRATION
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Claim Your Terminal Spot
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Join 300 elite builders competing across systems, AI, web3, and cryptography.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Mode: Solo vs Team */}
          <div>
            <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">
              Registration Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, registrationType: 'solo' })}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-medium text-sm transition-all ${
                  formData.registrationType === 'solo'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Solo Hacker</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, registrationType: 'team' })}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-medium text-sm transition-all ${
                  formData.registrationType === 'team'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Hackathon Team (2-4 Members)</span>
              </button>
            </div>
          </div>

          {/* Team Name if team */}
          {formData.registrationType === 'team' && (
            <div className="p-4 rounded-xl bg-[#0c121e] border border-cyan-500/30 space-y-3">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  placeholder="e.g. Subnet Phantom, Deadlock Breakers"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b13] border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Team Members List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Additional Teammates ({teamMembers.length}/3 max)
                  </span>
                  {teamMembers.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Member
                    </button>
                  )}
                </div>

                {teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 rounded-lg bg-[#070b13] border border-slate-800 items-center"
                  >
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        placeholder={`Member #${idx + 2} Full Name`}
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Role / Skill"
                        value={member.role}
                        onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leader / Primary Participant Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                {formData.registrationType === 'team' ? 'Team Lead Full Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ada Lovelace"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ada@domain.edu"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                College / University *
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. MIT, Stanford, IIT Bombay"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                Year of Study *
              </label>
              <select
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Postgraduate">Postgraduate / Masters / PhD</option>
              </select>
            </div>
          </div>

          {/* Track Selection */}
          <div>
            <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">
              Select Challenge Track *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRACKS.map((t) => {
                const isSelected = formData.track === t.id;
                const Icon = t.icon;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      playCyberBeep(800, 0.04);
                      setFormData({ ...formData, track: t.id });
                    }}
                    className={`cursor-pointer p-4 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-[#10192a] border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'bg-[#0c121e] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-100">{t.title}</div>
                        <div className="text-[11px] font-mono text-slate-400">{t.subtitle}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logistics: Experience, T-Shirt, Dietary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Beginner">Beginner (&lt;1 yr coding)</option>
                <option value="Intermediate">Intermediate (1-3 yrs)</option>
                <option value="Advanced">Advanced (3+ yrs / Prod exp)</option>
                <option value="Hardcore">Hardcore (Kernel / CTF Vet)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                T-Shirt Size
              </label>
              <select
                value={formData.tshirtSize}
                onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="2XL">Double XL (2XL)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                Dietary Preference
              </label>
              <select
                value={formData.dietaryPref}
                onChange={(e) => setFormData({ ...formData, dietaryPref: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian / Omnivore</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain">Jain</option>
                <option value="Halal">Halal</option>
              </select>
            </div>
          </div>

          {/* Socials & Project Pitch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                LinkedIn or Portfolio URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-cyan-400 mb-1">
              Elevator Pitch / Preliminary Concept (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.projectIdea}
              onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
              placeholder="What are you excited to build or experiment with during the 48 hours?"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c121e] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            ></textarea>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-slate-500">
              * Stored securely in database & generates cryptographically signed ticket pass.
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold font-mono text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Code className="w-4 h-4 animate-spin" />
                  <span>MINTING HACKER PASS...</span>
                </>
              ) : (
                <>
                  <span>SUBMIT COMMIT REGISTRATION</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
