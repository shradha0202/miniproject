import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Building2,
  Pill,
  QrCode,
  History,
  FileSpreadsheet,
  AlertOctagon,
  LogOut,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar: React.FC = () => {
  const { user, manufacturer, logout } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/manufacturers', label: 'Manufacturers', icon: Building2 },
    { to: '/admin/medicines', label: 'Medicine Master', icon: Pill },
    { to: '/admin/batches', label: 'Registered Batches', icon: QrCode },
    { to: '/admin/reports', label: 'Suspicious Reports', icon: ShieldAlert },
    { to: '/admin/cdsco-alerts', label: 'CDSCO NSQ Alerts', icon: AlertOctagon },
    { to: '/admin/users', label: 'System Users', icon: Users },
  ];

  const mfgLinks = [
    { to: '/manufacturer', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/manufacturer/register-batch', label: 'Register Batch', icon: PlusCircle },
    { to: '/manufacturer/my-batches', label: 'My Batches & QR', icon: QrCode },
    { to: '/manufacturer/profile', label: 'Company Profile', icon: Building2 },
  ];

  const userLinks = [
    { to: '/user', label: 'My Dashboard', icon: LayoutDashboard, end: true },
    { to: '/user/history', label: 'Scan History', icon: History },
    { to: '/report', label: 'Report Medicine', icon: ShieldAlert },
  ];

  const links = user.role === 'admin' ? adminLinks : user.role === 'manufacturer' ? mfgLinks : userLinks;

  return (
    <aside className="dashboard-sidebar w-64 shrink-0 bg-neutral-950 border-r border-neutral-800/80 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* User Card */}
        <div className="dashboard-user-card p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user.full_name}</h4>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {user.role}
              </span>
            </div>
          </div>
          {user.role === 'manufacturer' && manufacturer && (
            <div className="mt-2.5 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
              <span className="text-neutral-300 font-medium block truncate">{manufacturer.company_name}</span>
              <span className={`inline-block mt-0.5 text-[10px] font-semibold uppercase ${
                manufacturer.approval_status === 'approved' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                ● Status: {manufacturer.approval_status}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="dashboard-sidebar-nav space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="dashboard-sidebar-logout pt-4 border-t border-neutral-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.common.logout}</span>
        </button>
      </div>
    </aside>
  );
};
