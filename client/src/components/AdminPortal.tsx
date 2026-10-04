import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  Users,
  Shirt,
  Utensils,
  School,
  Download,
  Search,
  RefreshCw,
  Trash2,
  Sparkles,
  BarChart3,
  Cpu,
  Eye
} from 'lucide-react';
import { playCyberBeep } from '../utils/audio';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTicket: (ticket: any) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose, onViewTicket }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('tlc_admin_token'));
  const [email, setEmail] = useState('admin@thelastcommit.dev');
  const [password, setPassword] = useState('LastCommit2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data
  const [activeTab, setActiveTab] = useState<'analytics' | 'registrations'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [trackFilter, setTrackFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (token && isOpen) {
      fetchDashboardData();
    }
  }, [token, isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    playCyberBeep(800, 0.05);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('tlc_admin_token', data.token);
      setToken(data.token);
      playCyberBeep(1000, 0.1);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    playCyberBeep(500, 0.05);
    localStorage.removeItem('tlc_admin_token');
    setToken(null);
    setAnalytics(null);
    setRegistrations([]);
  };

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const [anaRes, regRes] = await Promise.all([
        fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/registrations', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (anaRes.status === 401 || regRes.status === 401) {
        handleLogout();
        return;
      }

      const anaData = await anaRes.json();
      const regData = await regRes.json();

      if (anaData.success) setAnalytics(anaData.analytics);
      if (regData.success) setRegistrations(regData.registrations);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!token) return;
    playCyberBeep(900, 0.04);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local state
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: newStatus, checked_in_at: data.checkedInAt } : r
          )
        );
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to permanently delete registration for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete registration:', err);
    }
  };

  const handleSeedDemo = async () => {
    if (!token) return;
    setSeeding(true);
    playCyberBeep(1100, 0.1);
    try {
      const res = await fetch('/api/admin/seed-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Seed demo error:', err);
    } finally {
      setSeeding(false);
    }
  };

  const handleExportCsv = () => {
    if (!token) return;
    playCyberBeep(700, 0.05);
    window.open('/api/admin/export', '_blank');
  };

  if (!isOpen) return null;

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      r.full_name?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.college?.toLowerCase().includes(term) ||
      r.ticket_code?.toLowerCase().includes(term) ||
      r.team_name?.toLowerCase().includes(term);

    const matchesTrack = trackFilter === 'ALL' || r.track === trackFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesTrack && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#080d16] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/90 my-6 flex flex-col max-h-[92vh]">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 shrink-0"></div>

        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0d1422] border-b border-cyan-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  ORGANIZER COMMAND CENTER
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ADMIN v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                The Last Commit 2026 · Real-Time Operations &amp; Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In - Login Form */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-950/50">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Organizer Authentication</h3>
            <p className="text-xs text-slate-400 mt-1">
              Restricted to authorized hackathon directors, track leads, and operations staff.
            </p>

            {loginError && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e1626] border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e1626] border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loginLoading ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE & ENTER'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-left">
              <span className="text-[11px] font-mono text-slate-500 block mb-1">
                Demo Evaluator Credentials:
              </span>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div>Email: <span className="text-cyan-300">admin@thelastcommit.dev</span></div>
                <div>Password: <span className="text-emerald-300">LastCommit2026!</span></div>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Nav Tabs & Top Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 bg-[#0c121e] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    playCyberBeep(700, 0.04);
                    setActiveTab('analytics');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'analytics'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>INTELLIGENCE &amp; METRICS</span>
                </button>

                <button
                  onClick={() => {
                    playCyberBeep(700, 0.04);
                    setActiveTab('registrations');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'registrations'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>ATTENDEE ROSTER ({registrations.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={fetchDashboardData}
                  disabled={loadingData}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                  <span>SYNC DATA</span>
                </button>

                <button
                  onClick={handleSeedDemo}
                  disabled={seeding}
                  className="px-3 py-2 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 text-xs font-mono flex items-center gap-1.5 border border-purple-500/30 transition-colors"
                  title="Generate 6 realistic registrations to view dynamic charts"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{seeding ? 'GENERATING...' : '+ SEED DEMO HACKERS'}</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5 border border-emerald-500/40 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT CSV</span>
                </button>
              </div>
            </div>

            {/* TAB 1: ANALYTICS & INSIGHTS */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-6">
                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  <div className="bg-[#0c121e] border border-cyan-500/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block">TOTAL REGISTRATIONS</span>
                    <div className="text-2xl font-extrabold text-white mt-1">
                      {analytics.overview.totalRegistrations}
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {analytics.overview.soloCount} solo · {analytics.overview.teamCount} teams
                    </span>
                  </div>

                  <div className="bg-[#0c121e] border border-cyan-500/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block">TOTAL HACKERS</span>
                    <div className="text-2xl font-extrabold text-cyan-300 mt-1">
                      {analytics.overview.totalHackers}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      avg team size: {analytics.overview.avgTeamSize}
                    </span>
                  </div>

                  <div className="bg-[#0c121e] border border-cyan-500/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block">OCCUPANCY RATE</span>
                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                      {analytics.overview.occupancyRate}%
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      cap: {analytics.overview.maxCapacity} participants
                    </span>
                  </div>

                  <div className="bg-[#0c121e] border border-cyan-500/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block">CHECKED-IN VENUE</span>
                    <div className="text-2xl font-extrabold text-amber-400 mt-1">
                      {analytics.overview.checkedInHackers}
                    </div>
                    <span className="text-[10px] font-mono text-amber-400">
                      {analytics.overview.checkInRate}% attendance
                    </span>
                  </div>

                  <div className="bg-[#0c121e] border border-cyan-500/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block">CONFIRMED SEATS</span>
                    <div className="text-2xl font-extrabold text-slate-200 mt-1">
                      {analytics.overview.confirmedCount}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Approved badges</span>
                  </div>

                  <div className="bg-[#0c121e] border border-cyan-500/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block">WAITLIST / PENDING</span>
                    <div className="text-2xl font-extrabold text-rose-400 mt-1">
                      {analytics.overview.waitlistCount + analytics.overview.pendingCount}
                    </div>
                    <span className="text-[10px] font-mono text-rose-400">
                      {analytics.overview.waitlistCount} waitlisted
                    </span>
                  </div>
                </div>

                {/* Analytical Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Track Distribution */}
                  <div className="bg-[#0c121e] border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        Challenge Track Distribution
                      </h4>
                      <span className="text-xs font-mono text-slate-400">Room Allocation</span>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(analytics.tracks || {}).map(([trackName, count]: any) => {
                        const total = analytics.overview.totalRegistrations || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={trackName} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-300 truncate max-w-[280px]">
                                {trackName}
                              </span>
                              <span className="font-mono text-cyan-400">
                                {count} teams ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Year of Study Distribution */}
                  <div className="bg-[#0c121e] border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <School className="w-4 h-4 text-emerald-400" />
                        Academic Cohort Demographics
                      </h4>
                      <span className="text-xs font-mono text-slate-400">Undergrad vs PG</span>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(analytics.years || {}).map(([yearName, count]: any) => {
                        const total = analytics.overview.totalRegistrations || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={yearName} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-300">{yearName}</span>
                              <span className="font-mono text-emerald-400">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* T-Shirt Merch Inventory Breakdown */}
                  <div className="bg-[#0c121e] border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Shirt className="w-4 h-4 text-purple-400" />
                        T-Shirt Sizing Procurement Count
                      </h4>
                      <span className="text-xs font-mono text-slate-400">Merchandise Orders</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 pt-2">
                      {['S', 'M', 'L', 'XL', '2XL'].map((size) => {
                        const count = analytics.tshirts?.[size] || 0;
                        return (
                          <div
                            key={size}
                            className="bg-[#080d16] border border-slate-800 p-3 rounded-xl text-center"
                          >
                            <span className="text-xs font-mono text-slate-400 block font-bold">
                              {size}
                            </span>
                            <span className="text-lg font-extrabold text-purple-300 mt-1 block">
                              {count}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">units</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dietary Catering Breakdown */}
                  <div className="bg-[#0c121e] border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-amber-400" />
                        Dietary &amp; Food Catering Requirements
                      </h4>
                      <span className="text-xs font-mono text-slate-400">Kitchen Headcount</span>
                    </div>

                    <div className="space-y-2.5">
                      {Object.entries(analytics.dietary || {}).map(([diet, count]: any) => (
                        <div
                          key={diet}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#080d16] border border-slate-800 text-xs"
                        >
                          <span className="text-slate-300 font-medium">{diet} Meals</span>
                          <span className="font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {count} portions
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Institutions Represented */}
                <div className="bg-[#0c121e] border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <School className="w-4 h-4 text-cyan-400" />
                      Top Participating Colleges &amp; Universities
                    </h4>
                    <span className="text-xs font-mono text-slate-400">Institutional Footprint</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(analytics.topColleges || []).map((c: any) => (
                      <div
                        key={c.college}
                        className="p-3 rounded-xl bg-[#080d16] border border-slate-800/80 flex items-center justify-between"
                      >
                        <span className="text-xs font-medium text-slate-200 truncate pr-2">
                          {c.college}
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10">
                          {c.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTRATIONS MANAGEMENT TABLE */}
            {activeTab === 'registrations' && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0c121e] p-3 rounded-2xl border border-slate-800">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by participant name, email, college, ticket code, or team..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[#070a12] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={trackFilter}
                      onChange={(e) => setTrackFilter(e.target.value)}
                      className="px-3 py-2 bg-[#070a12] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="ALL">All Tracks</option>
                      <option value="Kernel Panic (Systems & Low-Level)">Kernel Panic</option>
                      <option value="Neural Breach (AI & Agents)">Neural Breach</option>
                      <option value="Zero-Day Web (Distributed & Web3)">Zero-Day Web</option>
                      <option value="Cyber Fortress (Security & Crypto)">Cyber Fortress</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-[#070a12] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CHECKED_IN">CHECKED_IN (At Venue)</option>
                      <option value="PENDING">PENDING</option>
                      <option value="WAITLISTED">WAITLISTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c121e]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0f1726] text-slate-400 font-mono text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">TICKET / STATUS</th>
                          <th className="py-3 px-4">PARTICIPANT / TEAM</th>
                          <th className="py-3 px-4">COLLEGE / YEAR</th>
                          <th className="py-3 px-4">TRACK</th>
                          <th className="py-3 px-4">DETAILS</th>
                          <th className="py-3 px-4 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {filteredRegistrations.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                              No registrations match current filter parameters.
                            </td>
                          </tr>
                        ) : (
                          filteredRegistrations.map((r) => {
                            const isCheckedIn = r.status === 'CHECKED_IN';
                            return (
                              <tr key={r.id} className="hover:bg-[#101826]/70 transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="font-mono font-bold text-cyan-300 text-xs">
                                    {r.ticket_code}
                                  </div>
                                  <div className="mt-1">
                                    <select
                                      value={r.status}
                                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                                      className={`text-[10px] font-mono px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${
                                        isCheckedIn
                                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold'
                                          : r.status === 'CONFIRMED'
                                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                          : r.status === 'WAITLISTED'
                                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                          : 'bg-slate-800 text-slate-400 border-slate-700'
                                      }`}
                                    >
                                      <option value="CONFIRMED">CONFIRMED</option>
                                      <option value="CHECKED_IN">CHECKED_IN</option>
                                      <option value="PENDING">PENDING</option>
                                      <option value="WAITLISTED">WAITLISTED</option>
                                      <option value="REJECTED">REJECTED</option>
                                    </select>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-white">{r.full_name}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">{r.email}</div>
                                  {r.registration_type === 'team' && (
                                    <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                                      Squad: {r.team_name} ({r.team_size} members)
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="font-medium text-slate-200">{r.college}</div>
                                  <div className="text-[11px] font-mono text-slate-400">
                                    {r.year_of_study}
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 max-w-[180px]">
                                  <div className="text-xs text-emerald-400 font-medium truncate">
                                    {r.track}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-500">
                                    Exp: {r.experience_level}
                                  </div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="text-[11px] font-mono text-slate-400">
                                    Size: <span className="text-slate-200">{r.tshirt_size}</span>
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-400">
                                    Diet: <span className="text-slate-200">{r.dietary_pref}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-right space-x-1.5">
                                  <button
                                    onClick={() => {
                                      playCyberBeep(800, 0.05);
                                      onViewTicket({
                                        ticketCode: r.ticket_code,
                                        fullName: r.full_name,
                                        email: r.email,
                                        college: r.college,
                                        track: r.track,
                                        registrationType: r.registration_type,
                                        teamName: r.team_name,
                                        createdAt: r.created_at,
                                      });
                                    }}
                                    title="View Badge Ticket"
                                    className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDelete(r.id, r.full_name)}
                                    title="Delete Entry"
                                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
