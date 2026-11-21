import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileKey2,
  QrCode,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Cryptographic Workflow
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How Verification Works
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
          From the pharmaceutical manufacturing facility to the patient's hands: understanding the cryptographic journey of a MEDISCAN medicine package.
        </p>
      </div>

      {/* Security Disclaimer */}
      <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-400 uppercase tracking-wider mr-1.5">
            Security Principle:
          </span>
          <span>{t.common.securityDisclaimer}</span>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row gap-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-lg flex items-center justify-center shrink-0">
            01
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileKey2 className="w-5 h-5 text-emerald-400" />
              <span>Manufacturer Onboarding & Ed25519 Key Generation</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pharmaceutical companies register with their official Drug Manufacturing License. Once vetted by the National Regulatory Admin, an Ed25519 asymmetric cryptographic key pair is generated. The private signing key is stored in restricted server vaults, while the public key is registered in the public PostgreSQL registry.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row gap-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-lg flex items-center justify-center shrink-0">
            02
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span>Deterministic Canonicalization & Digital Signing</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              When a batch is produced, the manufacturer registers the batch number, manufacturing date, and expiry date. MEDISCAN converts this data into a deterministic canonical JSON string and signs it with the manufacturer's Ed25519 private key. The resulting digital signature is linked to a unique UUID serial ID.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row gap-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-lg flex items-center justify-center shrink-0">
            03
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <span>QR Code Encoding & Serialization</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              A high-density 2D QR code is generated containing only the secure verification URL and serial ID. Medicine details are <strong>never</strong> trusted directly from the QR payload itself, preventing attackers from encoding fake genuine text into offline QR stickers.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row gap-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-lg flex items-center justify-center shrink-0">
            04
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>12-Point Comprehensive Verification Engine</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Upon scanning, the verification engine verifies: (1) serial ID existence, (2) cryptographic signature math, (3) manufacturer approval, (4) key validity, (5) batch status, (6) expiry date, (7) duplicate scan velocity, and (8) cross-checks against published CDSCO NSQ alerts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-6">
        <Link
          to="/verify"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
        >
          <span>Test Verification Engine Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
