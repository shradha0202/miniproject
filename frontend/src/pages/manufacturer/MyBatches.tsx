import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Search, Download, PlusCircle, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export const MyBatches: React.FC = () => {
  const { t } = useLanguage();
  const [batches, setBatches] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewSerialId, setPreviewSerialId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await api.get('/manufacturer/batches');
        if (res.data.success) {
          setBatches(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch manufacturer batches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const filtered = batches.filter((b) => {
    const term = search.toLowerCase();
    return (
      b.batch_number.toLowerCase().includes(term) ||
      b.medicine_name.toLowerCase().includes(term) ||
      (b.brand_name && b.brand_name.toLowerCase().includes(term)) ||
      b.serial_id.toLowerCase().includes(term)
    );
  });

  const downloadQr = (serialId: string) => {
    window.open(`${api.defaults.baseURL}/manufacturer/batches/${serialId}/qr`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <QrCode className="w-6 h-6 text-emerald-400" />
            <span>My Registered Batches & Digital Signatures</span>
          </h1>
          <p className="text-xs text-neutral-400">Manage cryptographic provenance records and printable 2D QR codes</p>
        </div>

        <div className="responsive-filter-row flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search batches..."
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <Link
            to="/manufacturer/register-batch"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Batch</span>
          </Link>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No registered batches found. Click "New Batch" to register your first product.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="pb-3">Batch Number</th>
                  <th className="pb-3">Medicine & Formula</th>
                  <th className="pb-3">Mfg Date</th>
                  <th className="pb-3">Exp Date</th>
                  <th className="pb-3">Signing Key ID</th>
                  <th className="pb-3">Scans</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-800/30">
                    <td className="py-3 font-mono font-bold text-white">{b.batch_number}</td>
                    <td className="py-3">
                      <span className="font-semibold text-white block">{b.brand_name || b.medicine_name}</span>
                      <span className="text-[11px] text-neutral-400">{b.medicine_name} ({b.strength || 'N/A'})</span>
                    </td>
                    <td className="py-3 text-neutral-300">{b.manufacturing_date}</td>
                    <td className="py-3 text-neutral-300">{b.expiry_date}</td>
                    <td className="py-3 font-mono text-[11px] text-emerald-400">{b.key_id}</td>
                    <td className="py-3 text-neutral-300">{b.scan_count || 0}</td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => downloadQr(b.serial_id)}
                        className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 inline-flex items-center gap-1 font-semibold text-[11px]"
                        title="Download QR PNG"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PNG</span>
                      </button>
                      <Link
                        to={`/verify/${b.serial_id}`}
                        target="_blank"
                        className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 inline-flex items-center gap-1 font-semibold text-[11px]"
                        title="Verify Public Endpoint"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
