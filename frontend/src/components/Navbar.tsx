import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, LayoutDashboard, LogIn, LogOut, Menu, QrCode, ShieldCheck, User, X } from 'lucide-react';
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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand-link" aria-label="MediScan home">
            <span className="brand-mark"><ShieldCheck className="w-5 h-5" /></span>
            <span className="brand-name">MEDISCAN</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link to="/">{t.nav.home}</Link>
            <Link to="/about">{t.nav.about}</Link>
            <Link to="/how-it-works">{t.nav.howItWorks}</Link>
            <a href="/#technology">Technology</a>
            {isAuthenticated && (
              <Link to={getDashboardPath()} className="nav-dashboard">
                <LayoutDashboard className="w-4 h-4" />
                {t.nav.dashboard}
              </Link>
            )}
          </nav>

          <div className="header-actions">
            <button type="button" onClick={() => setIsScannerOpen(true)} className="header-scan-button">
              <QrCode className="w-4 h-4" />
              <span>{t.common.verifyMedicine}</span>
            </button>
            <button type="button" onClick={toggleLanguage} className="language-button" title="Toggle English / Kannada">
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="profile-button">
                  <User className="w-4 h-4" />
                  <span>{user?.full_name?.split(' ')[0]}</span>
                </Link>
                <button type="button" onClick={logout} className="icon-button" title={t.common.logout}>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link to="/login" className="login-button">
                <LogIn className="w-4 h-4" />
                {t.common.login}
              </Link>
            )}
          </div>

          <div className="mobile-actions">
            <button type="button" onClick={toggleLanguage} className="mobile-language">
              {language === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>
            <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="icon-button" aria-label="Toggle navigation">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link to="/" onClick={closeMobileMenu}>{t.nav.home}</Link>
            <Link to="/about" onClick={closeMobileMenu}>{t.nav.about}</Link>
            <Link to="/how-it-works" onClick={closeMobileMenu}>{t.nav.howItWorks}</Link>
            <a href="/#technology" onClick={closeMobileMenu}>Technology</a>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} onClick={closeMobileMenu}>{t.nav.dashboard}</Link>
                <button type="button" onClick={() => { logout(); closeMobileMenu(); }}>{t.common.logout}</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMobileMenu}>{t.common.login}</Link>
                <button type="button" onClick={() => { setIsScannerOpen(true); closeMobileMenu(); }}>Verify Medicine</button>
              </>
            )}
          </nav>
        )}
      </header>

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
};
