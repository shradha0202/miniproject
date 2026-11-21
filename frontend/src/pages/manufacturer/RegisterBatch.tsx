import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  QrCode,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  Key,
  Calendar,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const RegisterBatch: React.FC = () => {
  const { manufacturer } = useAuth();
  const { t } = useLanguage();

  const [medicines, setMedicines] = useState<any[]>([]);
  const [searchMedicine, setSearchMedicine] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<any | null>(null);

  const [batchNumber, setBatchNumber] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Fetch medicines from catalogue
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get('/medicines?active_only=true&limit=100');
        if (res.data.success) {
          setMedicines(res.data.data.items);
        }
      } catch (err) {
        console.error('Failed to fetch medicines catalogue', err);
      }
    };
    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter((m) => {
    const term = searchMedicine.toLowerCase();
    return (
      m.medicine_name.toLowerCase().includes(term) ||
      (m.brand_name && m.brand_name.toLowerCase().includes(term)) ||
      (m.composition && m.composition.toLowerCase().includes(term))
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedMedicine) {
      setError('Please select a medicine formulation from the master catalogue.');
      return;
    }

    if (new Date(expiryDate) <= new Date(manufacturingDate)) {
      setError('Expiry date must be strictly later than manufacturing date.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/manufacturer/batches', {
        medicine_id: selectedMedicine.id,
        batch_number: batchNumber.trim(),
        manufacturing_date: manufacturingDate,
        expiry_date: expiryDate,
      });

      if (res.data.success) {
        setSuccessData(res.data.data);
      } else {
        setError(res.data.error || 'Batch registration failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Batch registration failed.');
    } finally {
      setLoading(false);
    }
  };

 const handleDownloadQr = async () => {
  if (!successData?.batch?.serial_id) return;

  try {
    const response = await api.get(
      `/manufacturer/batches/${successData.batch.serial_id}/qr`,
      {
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], {
      type: 'image/png',
    });

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `MEDISCAN-QR-${successData.batch.batch_number}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error('QR download failed:', err);
    setError('Unable to download QR code. Please try again.');
  }
};

  if (manufacturer?.approval_status !== 'approved') {
    return (
      <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Batch Registration Restricted</h2>
        <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
          Your manufacturer account is currently in <strong className="text-amber-400 uppercase">{manufacturer?.approval_status || 'pending'}</strong> status. Only regulatory approved pharmaceutical manufacturers can register and digitally sign batches.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <PlusCircle className="w-6 h-6 text-emerald-400" />
          <span>Register & Sign Medicine Batch</span>
        </h1>
        <p className="text-xs text-neutral-400">
          Enter formulation and batch lifecycle dates to generate an Ed25519 digital signature and high-density 2D QR code.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success View */}
      {successData ? (
        <div className="p-8 rounded-2xl bg-neutral-900 border border-emerald-500/30 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Cryptographic Registration Complete
              </span>
              <h2 className="text-xl font-black text-white">Batch Successfully Registered & Signed</h2>
              <p className="text-xs text-neutral-400 mt-1">
                The Ed25519 digital signature has been recorded and canonical payload committed to PostgreSQL.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
            {/* QR Image Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-black rounded-xl border border-neutral-800 space-y-3">
              <img
                src={successData.qr.qr_data_url}
                alt="Batch QR Code"
                className="w-48 h-48 rounded-lg bg-white p-2"
              />
              <button
                onClick={handleDownloadQr}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download QR PNG</span>
              </button>
            </div>

            {/* Cryptographic Details */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-400 block">Generated Serial ID (UUID):</span>
                <span className="font-mono text-emerald-400 font-bold text-sm block">
                  {successData.batch.serial_id}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Batch Number:</span>
                <span className="font-mono text-white font-bold">{successData.batch.batch_number}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Ed25519 Signing Key:</span>
                <span className="font-mono text-neutral-300">{successData.cryptography.key_id}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Digital Signature (Base64):</span>
                <p className="p-2 rounded bg-neutral-950 border border-neutral-800 font-mono text-[10px] text-neutral-400 break-all">
                  {successData.cryptography.signature_base64}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-between">
            <button
              onClick={() => {
                setSuccessData(null);
                setBatchNumber('');
                setSelectedMedicine(null);
              }}
              className="text-xs text-neutral-400 hover:text-white"
            >
              + Register Another Batch
            </button>

            <Link
              to="/manufacturer/my-batches"
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg"
            >
              Go to My Batches
            </Link>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          {/* Medicine Selector from Catalogue */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              1. Select Medicine Formulation (Master Catalogue)
            </label>

            {selectedMedicine ? (
              <div className="p-3 rounded-xl bg-neutral-950 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {selectedMedicine.brand_name || selectedMedicine.medicine_name}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {selectedMedicine.medicine_name} | {selectedMedicine.strength} | {selectedMedicine.dosage_form}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMedicine(null)}
                  className="text-xs text-rose-400 hover:underline font-semibold"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchMedicine}
                    onChange={(e) => setSearchMedicine(e.target.value)}
                    placeholder="Search active medicine catalogue by name, brand, or formula..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950 divide-y divide-neutral-900">
                  {filteredMedicines.slice(0, 10).map((med) => (
                    <button
                      key={med.id}
                      type="button"
                      onClick={() => setSelectedMedicine(med)}
                      className="w-full p-2.5 text-left hover:bg-neutral-900 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-white block">
                          {med.brand_name ? `${med.brand_name} (${med.medicine_name})` : med.medicine_name}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {med.composition || 'Active formula'} • {med.dosage_form || 'Form'}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-semibold">Select</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Batch Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              2. Batch Identifier / Lot Number
            </label>
            <input
              type="text"
              required
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g. BATCH-2026-X81"
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
            />
          </div>

          {/* Lifecycle Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">3. Manufacturing Date</label>
              <input
                type="date"
                required
                value={manufacturingDate}
                onChange={(e) => setManufacturingDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">4. Expiry Date</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedMedicine || !batchNumber || !manufacturingDate || !expiryDate}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Sign with Ed25519 & Generate Batch QR Code</span>
          </button>
        </form>
      )}
    </div>
  );
};
