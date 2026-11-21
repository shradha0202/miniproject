import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, QrCode, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { VerificationCard, VerificationData } from '../components/VerificationCard';
import { QrScannerModal } from '../components/QrScannerModal';

export const VerifyMedicine: React.FC = () => {
  const { serialId: paramSerialId } = useParams<{ serialId?: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [inputSerial, setInputSerial] = useState(paramSerialId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationData | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const performVerification = async (targetSerial: string) => {
    if (!targetSerial.trim()) return;

    let clean = targetSerial.trim();
    if (clean.includes('/verify/')) {
      clean = clean.split('/verify/')[1].split('?')[0].trim();
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const res = await api.post('/verification/verify', { serial_id: clean });
      if (res.data.success) {
        setVerificationResult(res.data.data);
      } else {
        setError(res.data.error || 'Verification request was rejected.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || 'Unable to connect to verification server.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramSerialId) {
      setInputSerial(paramSerialId);
      performVerification(paramSerialId);
    }
  }, [paramSerialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSerial.trim()) {
      let clean = inputSerial.trim();
      if (clean.includes('/verify/')) {
        clean = clean.split('/verify/')[1].split('?')[0].trim();
      }
      navigate(`/verify/${clean}`);
    }
  };

  const handleScanSuccess = (scannedSerial: string) => {
    setIsScannerOpen(false);
    navigate(`/verify/${scannedSerial}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.verification.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
          Enter a pharmaceutical UUID serial ID or scan the package QR code for instant Ed25519 cryptographic authentication.
        </p>
      </div>

      {/* Input / Scanner Bar */}
      <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => setIsScannerOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-105 shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR</span>
        </button>

        <form onSubmit={handleSubmit} className="w-full min-w-0 flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={inputSerial}
              onChange={(e) => setInputSerial(e.target.value)}
              placeholder="Paste Serial ID (e.g. 47ff01a4-4ad6-4792-91fd-196b00bd15e8)..."
              className="w-full min-w-0 pl-10 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!inputSerial.trim() || loading}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 font-semibold text-sm rounded-xl transition-colors shrink-0 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Verify</span>
          </button>
        </form>
      </div>

      {/* Quick Test Demo Chips */}
      {!verificationResult && !loading && (
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-400 space-y-2.5">
          <div className="flex items-center gap-2 text-neutral-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quick Test Demonstrations:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                // Fetch valid seed batch serial if available, or navigate
                api.get('/medicines?limit=1').then(() => {
                  // If we know seed serial or can query
                });
              }}
              className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-neutral-300 transition-colors"
            >
              Tip: Scan any generated manufacturer QR code
            </button>
            <span className="text-neutral-500 self-center">|</span>
            <span className="text-neutral-400 self-center">
              Guest scans are fully supported without registration.
            </span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Running Cryptographic Verification...</h4>
            <p className="text-xs text-neutral-400">
              Validating Ed25519 signature, checking CDSCO NSQ alerts, and analyzing scan patterns...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-800 text-rose-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Verification Request Failed</p>
            <p className="mt-1 text-rose-300/90">{error}</p>
          </div>
        </div>
      )}

      {/* Verification Result Display */}
      {verificationResult && !loading && (
        <VerificationCard
          data={verificationResult}
          onScanAnother={() => {
            setInputSerial('');
            setVerificationResult(null);
            setIsScannerOpen(true);
          }}
        />
      )}

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};
