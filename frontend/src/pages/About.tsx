import React from 'react';
import { ShieldCheck, Lock, Database, AlertTriangle, Cpu, Globe2, FileCode2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          Academic Mini-Project (2 Credits)
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About MEDISCAN
        </h1>
        <p className="text-base text-neutral-400 max-w-3xl leading-relaxed">
          A Web-Based Pharmaceutical Verification System Using QR Codes and Ed25519 Digital Signatures, developed under the Department of Information Science and Engineering.
        </p>
      </div>

      {/* Crucial Security Principle */}
      <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-300">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t.common.disclaimerTitle}
            </h3>
            <p className="text-sm font-medium text-neutral-200">
              {t.common.securityDisclaimer}
            </p>
            <p className="text-xs text-neutral-400 pt-1">
              While cryptographic signatures prevent database forgery and man-in-the-middle attacks on digital records, packaging security requires physical visual inspection, tamper-evident seals, and rapid duplicate scan detection.
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Ed25519 Cryptography</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Utilizes Edwards-curve Digital Signature Algorithm (EdDSA) over Curve25519. Provides high performance, collision resistance, and immune to side-channel timing attacks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">PostgreSQL & Canonical JSON</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Data is serialized deterministically before signing. Any alteration of expiry date, composition, or batch number invalidates the signature mathematically.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Regulatory Datasets</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Directly cross-checks queries against CDSCO Not of Standard Quality (NSQ) alerts and uses Indian Pharma formulations as the baseline master catalogue.
          </p>
        </div>
      </div>

      {/* Project Objectives */}
      <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-xl font-bold text-white">Key Academic Objectives</h3>
        <ul className="space-y-3 text-xs text-neutral-300">
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
            <span><strong>Decentralized Verification:</strong> Enable patients and pharmacists to verify medicines on any device without downloading third-party proprietary mobile apps.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
            <span><strong>Strict Role-Based Security:</strong> Strict authorization boundaries isolating Citizens, Approved Manufacturers, and National Regulatory Admins.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
            <span><strong>Multi-lingual & Voice Accessibility:</strong> Breaking literacy and language barriers with Web Speech synthesis and English/Kannada translations.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
            <span><strong>Duplicate Scan Alerting:</strong> Algorithmic detection of repeated scans in short timeframes, pinpointing unauthorized packaging replication.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
