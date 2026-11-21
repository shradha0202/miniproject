import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, QrCode, Globe, LogIn, LogOut, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { QrScannerModal } from './QrScannerModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'manufacturer') return '/manufacturer';
    return '/user';
  };

  const handleScanSuccess = (serialId: string) => {
    setIsScannerOpen(false);
    navigate(`/verify/${serialId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">MEDISCAN</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-400/90 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                Ed25519 Secured
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              {t.nav.home}
            </Link>
            <Link to="/about" className="hover:text-emerald-400 transition-colors">
              {t.nav.about}
            </Link>
            <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
              {t.nav.howItWorks}
            </Link>
            <Link to="/verify" className="hover:text-emerald-400 transition-colors">
              {t.nav.verify}
            </Link>
            {isAuthenticated && (
              <Link to={getDashboardPath()} className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.nav.dashboard}</span>
              </Link>
            )}
          </nav>

          {/* Action Tools */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick QR Scanner Trigger */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <QrCode className="w-4 h-4" />
              <span>{t.common.verifyMedicine}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
              title="Toggle English / ಕನ್ನಡ"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
                >
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="max-w-[100px] truncate">{user?.full_name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title={t.common.logout}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.common.login}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-medium bg-neutral-900 border border-neutral-800 rounded text-neutral-300"
            >
              {language === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-4 pt-3 pb-5 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
            >
              {t.nav.home}
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
            >
              {t.nav.about}
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              to="/verify"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
            >
              {t.nav.verify}
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-emerald-400 py-1"
                >
                  {t.nav.dashboard} ({user?.role})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-sm text-rose-400 py-1"
                >
                  {t.common.logout}
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-neutral-800 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold bg-neutral-900 border border-neutral-800 rounded-lg text-white"
                >
                  {t.common.login}
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
};
