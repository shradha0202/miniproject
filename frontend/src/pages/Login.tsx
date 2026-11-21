import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, UserRound, Factory, MonitorCog, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'user' | 'manufacturer' | 'admin' | null>(null);

  const portals = [
    {
      role: 'user' as const,
      title: 'Citizen Portal',
      description: 'Verify medicines, view scan history, and report suspicious products',
      icon: UserRound,
      registrationPath: '/register',
      registrationLabel: 'Create citizen account',
    },
    {
      role: 'manufacturer' as const,
      title: 'Manufacturer Portal',
      description: 'Manage batches, generate QR codes, and maintain company details',
      icon: Factory,
      registrationPath: '/register-manufacturer',
      registrationLabel: 'Register manufacturer',
    },
    {
      role: 'admin' as const,
      title: 'Admin Portal',
      description: 'Manage users, approve manufacturers, and oversee system operations',
      icon: MonitorCog,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user, manufacturer } = res.data.data;
        login(token, user, manufacturer);

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'manufacturer') {
          navigate('/manufacturer');
        } else {
          navigate('/user');
        }
      } else {
        setError(res.data.error || 'Login failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Invalid credentials or server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      {!selectedRole ? (
        <div className="w-full max-w-6xl space-y-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1d261f] tracking-tight">Welcome to MEDISCAN</h1>
            <p className="text-sm text-[#667267]">Select your portal to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <button
                  key={portal.role}
                  type="button"
                  onClick={() => setSelectedRole(portal.role)}
                  className="group p-7 rounded-2xl bg-white border border-[#e1e8dc] text-center shadow-xl hover:border-[#b7d7a3] hover:-translate-y-1 transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-black text-[#1d261f]">{portal.title}</h2>
                  <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-[#667267]">{portal.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-400">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-[#e1e8dc] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            {selectedRole === 'manufacturer' ? <Factory className="w-6 h-6" /> : selectedRole === 'admin' ? <MonitorCog className="w-6 h-6" /> : <UserRound className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-black text-[#1d261f] tracking-tight">
            {selectedRole === 'manufacturer' ? 'Manufacturer Sign In' : selectedRole === 'admin' ? 'Admin Sign In' : 'Citizen Sign In'}
          </h2>
          <button
            type="button"
            onClick={() => {
              setSelectedRole(null);
              setError(null);
            }}
            className="text-xs text-emerald-400 hover:underline"
          >
            Change portal
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#536057]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full pl-10 pr-3 py-2.5 bg-[#fafcf8] border border-[#dfe6da] rounded-xl text-sm text-[#26322a] placeholder-[#99a49b] focus:outline-none focus:border-[#90b67d] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-[#536057]">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-[#fafcf8] border border-[#dfe6da] rounded-xl text-sm text-[#26322a] placeholder-[#99a49b] focus:outline-none focus:border-[#90b67d] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Sign In</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#edf1ea] text-center space-y-2 text-xs text-[#667267]">
          {selectedRole !== 'admin' && (
            <p>
              {selectedRole === 'manufacturer' ? 'New pharmaceutical manufacturer?' : 'New citizen user?'}{' '}
              <Link
                to={selectedRole === 'manufacturer' ? '/register-manufacturer' : '/register'}
                className="text-emerald-400 hover:underline font-semibold"
              >
                {selectedRole === 'manufacturer' ? 'Register company' : 'Create an account'}
              </Link>
            </p>
          )}
        </div>

        {/* Development Seed Accounts Helper Pill */}
        <div className="p-3 rounded-lg bg-[#f7faf5] border border-[#e1e8dc] text-[11px] text-[#667267] space-y-1">
          <p className="font-semibold text-[#536057]">Default Test Accounts:</p>
          <div className="flex justify-between text-[#667267]">
            <span>Admin:</span>
            <code className="text-emerald-400">admin@mediscan.pharma / Admin@12345</code>
          </div>
          <div className="flex justify-between text-[#667267]">
            <span>Manufacturer:</span>
            <code className="text-emerald-400">mfg@cipla.com / Mfg@12345</code>
          </div>
          <div className="flex justify-between text-[#667267]">
            <span>Citizen:</span>
            <code className="text-emerald-400">user@example.com / User@12345</code>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
