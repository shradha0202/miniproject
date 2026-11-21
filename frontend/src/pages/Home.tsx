import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  Search,
  Key,
  Database,
  Activity,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { QrScannerModal } from '../components/QrScannerModal';
import { VoiceAssistant } from '../components/VoiceAssistant';

export const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [serialInput, setSerialInput] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (serialInput.trim()) {
      let clean = serialInput.trim();
      if (clean.includes('/verify/')) {
        clean = clean.split('/verify/')[1].split('?')[0].trim();
      }
      navigate(`/verify/${clean}`);
    }
  };

  const handleScanSuccess = (serialId: string) => {
    setIsScannerOpen(false);
    navigate(`/verify/${serialId}`);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Decorative subtle background aura */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[600px] h-[300px] bg-emerald-500/15 blur-[120px] rounded-full"></div>
        </div>

        {/* Security Principle Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ed25519 Cryptographic Verification Platform</span>
        </div>

        {/* Main Heading & Subheading */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          {t.hero.title}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subheading}
        </p>

        {/* Voice summary of page */}
        <div className="mt-4 flex justify-center">
          <VoiceAssistant textToSpeak={`${t.hero.title}. ${t.hero.subheading}`} />
        </div>

        {/* Interactive Verification Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 shrink-0"
            >
              <QrCode className="w-4 h-4" />
              <span>{t.hero.scanButton}</span>
            </button>

            <form onSubmit={handleManualVerify} className="w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={serialInput}
                  onChange={(e) => setSerialInput(e.target.value)}
                  placeholder={t.hero.manualInputPlaceholder}
                  className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={!serialInput.trim()}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 font-semibold text-sm rounded-xl transition-colors shrink-0"
              >
                {t.hero.verifyButton}
              </button>
            </form>
          </div>

          {/* Quick Demo Pre-filled links */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400 flex-wrap">
            <span>Try demo batches:</span>
            <Link
              to="/verify"
              className="text-emerald-400 hover:underline font-mono"
            >
              Interactive Verification Sandbox →
            </Link>
          </div>
        </div>

        {/* Quick action secondary buttons */}
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/how-it-works"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors"
          >
            <span>{t.hero.learnMore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            {t.common.login}
          </Link>
          <Link
            to="/register-manufacturer"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Manufacturer Portal
          </Link>
        </div>
      </section>

      {/* 2. SECURITY PRINCIPLE CLARIFICATION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-300 relative overflow-hidden shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                {t.common.disclaimerTitle}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                {t.common.securityDisclaimer}
              </p>
              <p className="text-xs text-neutral-400 pt-1 leading-relaxed">
                MEDISCAN provides zero-trust cryptographic origin proof, tamper detection, duplicate scan frequency tracking, and regulatory cross-checks with CDSCO alerts to safeguard patient health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT MEDISCAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              About The Project
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Combating Counterfeit Medicines with Pure Math & Cryptography
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              According to the World Health Organization (WHO), substandard and falsified medical products affect millions of patients globally. Traditional barcodes and packaging holograms can be easily photographed, reprinted, and forged.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              MEDISCAN implements asymmetric <strong className="text-white">Ed25519 digital signatures</strong> over deterministic canonical batch records. Each manufacturer registers unique cryptographic key pairs, and every medicine package carries a digitally signed serial token that can be independently verified on any smartphone browser in seconds.
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Trust Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CDSCO NSQ Cross-Checks</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
              <Key className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Ed25519 Signing</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                High-speed elliptic curve cryptography ensuring absolute non-repudiation of manufacturer origin.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
              <Database className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Master Catalogue</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Centralized formulation records mapped from official Indian Pharma datasets.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
              <Activity className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Velocity Checks</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Detects cloning attacks when a genuine QR code is replicated on thousands of counterfeit units.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
              <Volume2 className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Voice & Kannada</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Accessible to every citizen through bilingual voice synthesis in English and Kannada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {t.nav.howItWorks}
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            How The MEDISCAN Verification System Works
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            A seamless four-step verification loop connecting pharmaceutical regulators, manufacturers, and patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 relative">
            <span className="text-3xl font-black text-emerald-500/20">01</span>
            <h4 className="text-sm font-bold text-white">Manufacturer Approval</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Regulatory admins verify drug manufacturing licenses and generate unique Ed25519 signing keys.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 relative">
            <span className="text-3xl font-black text-emerald-500/20">02</span>
            <h4 className="text-sm font-bold text-white">Batch Cryptographic Signing</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Approved manufacturers register batch dates, generating deterministic canonical payload signatures.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 relative">
            <span className="text-3xl font-black text-emerald-500/20">03</span>
            <h4 className="text-sm font-bold text-white">QR Code Generation</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Unique high-density QR codes containing secure verification tokens are printed on medicine packaging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 relative">
            <span className="text-3xl font-black text-emerald-500/20">04</span>
            <h4 className="text-sm font-bold text-white">Instant Citizen Verification</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Consumers scan the QR code via mobile camera. The backend runs 12 verification checks in milliseconds.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHY MEDICINE VERIFICATION MATTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              The Counterfeit Threat
            </span>
            <h3 className="text-2xl font-black text-white">Why Verification Matters</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fake antibiotics, contaminated syrups, and expired formulations cause thousands of preventable deaths and treatment failures every year.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
            <span className="text-2xl font-black text-rose-400">1 in 10</span>
            <h4 className="text-sm font-bold text-white">Substandard Medical Products</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              WHO reports that an estimated 10.5% of medicines in low- and middle-income nations fail quality benchmarks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
            <span className="text-2xl font-black text-emerald-400">100%</span>
            <h4 className="text-sm font-bold text-white">Mathematical Origin Integrity</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ed25519 digital signatures guarantee that authorized records cannot be forged without the private key.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & FOOTER PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-black text-white">Ready to verify your medicine?</h2>
        <p className="text-sm text-neutral-400 max-w-lg mx-auto">
          Scan the QR code on your blister pack, bottle, or carton to instantly verify origin, expiry, and regulatory alerts.
        </p>
        <button
          onClick={() => setIsScannerOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
        >
          <QrCode className="w-5 h-5" />
          <span>Launch Camera QR Scanner</span>
        </button>
      </section>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};
