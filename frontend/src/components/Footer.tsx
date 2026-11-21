import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-disclaimer">
        <AlertTriangle className="w-4 h-4" />
        <span><strong>{t.common.disclaimerTitle}:</strong> {t.common.securityDisclaimer}</span>
      </div>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-name">
            <span className="brand-mark"><ShieldCheck className="w-5 h-5" /></span>
            <strong>MEDISCAN</strong>
          </div>
          <p>Secure pharmaceutical verification using QR codes and Ed25519 digital signatures.</p>
        </div>
        <div>
          <h3>Platform</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/verify">Verify Medicine</Link>
        </div>
        <div>
          <h3>Portals</h3>
          <Link to="/login">User / Citizen</Link>
          <Link to="/login">Manufacturer</Link>
          <Link to="/login">Admin</Link>
        </div>
        <div>
          <h3>Reference</h3>
          <a href="https://cdscoonline.gov.in/CDSCO/viewPublicNSQDrug" target="_blank" rel="noreferrer">
            CDSCO NSQ Portal <ExternalLink className="w-3 h-3" />
          </a>
          <span>Ed25519 cryptographic standard</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} MEDISCAN</span>
        <span>React · QR Verification · Ed25519</span>
      </div>
    </footer>
  );
};
