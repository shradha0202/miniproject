import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Database,
  Factory,
  Key,
  MonitorCog,
  PackageCheck,
  QrCode,
  Search,
  ShieldCheck,
  UserRound,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { QrScannerModal } from '../components/QrScannerModal';
import { VoiceAssistant } from '../components/VoiceAssistant';

const BlisterStrip: React.FC<{ className?: string; rotate?: string }> = ({
  className = '',
  rotate = '0deg',
}) => (
  <div
    className={`blister-strip ${className}`}
    style={{ transform: `rotate(${rotate})` }}
    aria-hidden="true"
  >
    {[0, 1, 2, 3, 4, 5].map((tablet) => (
      <span className="blister-pocket" key={tablet}>
        <span className="blister-tablet" />
      </span>
    ))}
  </div>
);

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [serialInput, setSerialInput] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    const clean = serialInput.includes('/verify/')
      ? serialInput.split('/verify/')[1].split('?')[0].trim()
      : serialInput.trim();
    navigate(`/verify/${clean}`);
  };

  const handleScanSuccess = (serialId: string) => {
    setIsScannerOpen(false);
    navigate(`/verify/${serialId}`);
  };

  const roles = [
    {
      title: 'User',
      description: 'Verify medicines using secure QR codes.',
      icon: UserRound,
      link: '/login',
      action: 'Open User Portal',
    },
    {
      title: 'Admin',
      description: 'Manage users, manufacturers, reports and regulatory alerts.',
      icon: MonitorCog,
      link: '/login',
      action: 'Open Admin Portal',
    },
    {
      title: 'Manufacturer',
      description: 'Register medicine batches and manage QR codes.',
      icon: Factory,
      link: '/login',
      action: 'Open Manufacturer Portal',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section" id="home">
        <div className="hero-ambient hero-ambient-left" />
        <div className="hero-ambient hero-ambient-right" />
        <BlisterStrip className="hero-blister-left" rotate="-12deg" />
        <BlisterStrip className="hero-blister-right" rotate="11deg" />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital medicine verification</span>
          </div>

          <h1>{languageTitle(t.hero.title)}</h1>
          <p className="hero-subheading">
            Verify pharmaceutical products through secure QR technology and digital signature verification.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-hero-button" onClick={() => setIsScannerOpen(true)}>
              <QrCode className="w-5 h-5" />
              {t.common.verifyMedicine}
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/how-it-works" className="secondary-hero-button">
              Explore How It Works
            </Link>
          </div>

          <VoiceAssistant textToSpeak="Every Medicine. One Trusted Verification. Verify pharmaceutical products through secure QR technology and digital signature verification." />

          <form className="verification-search" onSubmit={handleManualVerify}>
            <Search className="w-4 h-4 verification-search-icon" />
            <input
              type="text"
              value={serialInput}
              onChange={(event) => setSerialInput(event.target.value)}
              placeholder={t.hero.manualInputPlaceholder}
              aria-label="Medicine serial number"
            />
            <button type="submit" disabled={!serialInput.trim()}>
              Verify
            </button>
          </form>
        </div>
      </section>

      <section className="trust-strip" aria-label="Platform capabilities">
        <div>
          <BadgeCheck className="w-5 h-5" />
          <span>Ed25519 verified</span>
        </div>
        <div>
          <PackageCheck className="w-5 h-5" />
          <span>Batch traceability</span>
        </div>
        <div>
          <Activity className="w-5 h-5" />
          <span>Duplicate detection</span>
        </div>
        <div>
          <Volume2 className="w-5 h-5" />
          <span>English & Kannada</span>
        </div>
      </section>

      <section className="role-section" id="portals">
        <div className="section-heading">
          <span>Choose your portal</span>
          <h2>Built for every role in the verification journey</h2>
        </div>
        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <article className="role-card" key={role.title}>
                <div className="role-icon">
                  <Icon className="w-7 h-7" />
                </div>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <Link to={role.link} className="role-link">
                  {role.action}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-copy">
          <span className="section-kicker">About MediScan</span>
          <h2>Pharmaceutical trust, verified with cryptography</h2>
          <p>
            MediScan connects manufacturers, regulators and consumers through tamper-resistant
            digital records and QR-based medicine verification.
          </p>
          <div className="about-checks">
            <span><CheckCircle2 className="w-5 h-5" /> Digital origin proof</span>
            <span><CheckCircle2 className="w-5 h-5" /> CDSCO NSQ cross-checks</span>
          </div>
        </div>
        <div className="technology-grid" id="technology">
          <article>
            <Key className="w-6 h-6" />
            <h3>Ed25519 signing</h3>
            <p>Secure digital signatures establish record integrity and manufacturer origin.</p>
          </article>
          <article>
            <Database className="w-6 h-6" />
            <h3>Batch catalogue</h3>
            <p>Registered formulation and batch records remain traceable across the platform.</p>
          </article>
          <article>
            <Activity className="w-6 h-6" />
            <h3>Velocity monitoring</h3>
            <p>Repeated or abnormal scans help detect suspected duplicate packaging.</p>
          </article>
          <article>
            <Volume2 className="w-6 h-6" />
            <h3>Accessible by voice</h3>
            <p>English and Kannada support help citizens understand verification results.</p>
          </article>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span>How it works</span>
          <h2>A clear verification journey</h2>
        </div>
        <div className="how-grid">
          {[
            ['01', 'Manufacturer approval', 'Regulators verify the manufacturer and activate signing credentials.'],
            ['02', 'Batch registration', 'Authorized batches are signed using a secure Ed25519 private key.'],
            ['03', 'QR generation', 'A unique verification code is linked to each medicine serial.'],
            ['04', 'Citizen verification', 'Consumers scan or enter the serial to review the verification result.'],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span>Start verification</span>
          <h2>Ready to verify a medicine?</h2>
          <p>Scan a product QR code or enter its serial number to check its registered record.</p>
        </div>
        <button type="button" onClick={() => setIsScannerOpen(true)}>
          <QrCode className="w-5 h-5" />
          Verify Medicine
        </button>
      </section>

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

function languageTitle(title: string) {
  return title === 'Verify Every Medicine. Trust Every Dose.'
    ? 'Every Medicine. One Trusted Verification.'
    : title;
}
