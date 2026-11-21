import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-neutral-900 bg-black text-neutral-400 text-sm">
      {/* Security Principle Banner */}
      <div className="bg-neutral-950 border-b border-neutral-900 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mr-2">
              {t.common.disclaimerTitle}:
            </span>
            <span className="text-xs text-neutral-300 leading-relaxed">
              {t.common.securityDisclaimer}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-lg font-black text-white tracking-wider">MEDISCAN</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              A Web-Based Pharmaceutical Verification System Using QR Codes and Ed25519 Digital Signatures.
            </p>
            <div className="text-[11px] text-neutral-400">
              Department of Information Science and Engineering
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About MEDISCAN</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/verify" className="hover:text-emerald-400 transition-colors">Verify Medicine</Link></li>
            </ul>
          </div>

          {/* Column 3: Roles & Portals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">User / Manufacturer Login</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Consumer Registration</Link></li>
              <li><Link to="/register-manufacturer" className="hover:text-emerald-400 transition-colors">Manufacturer Onboarding</Link></li>
              <li><Link to="/user" className="hover:text-emerald-400 transition-colors">Citizen Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 4: Regulatory Reference */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Regulatory Data</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://cdscoonline.gov.in/CDSCO/viewPublicNSQDrug"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <span>CDSCO NSQ Drug Portal</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://huggingface.co/datasets/revooda/indian-pharma-data"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <span>Indian Pharma Dataset</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li><span className="text-[11px] text-neutral-400">Ed25519 Cryptographic Standard</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} MEDISCAN Pharmaceutical Security Platform. Academic Project.</p>
          <p>Built with React, Node.js, PostgreSQL, and Ed25519 Cryptography.</p>
        </div>
      </div>
    </footer>
  );
};
