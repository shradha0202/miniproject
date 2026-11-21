import React, { useEffect, useState } from 'react';
import { ShieldAlert, Search, CheckCircle2, MessageSquare, AlertCircle, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [activeReport, setActiveReport] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('reviewed');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/reports?status=${statusFilter}` : '/reports';
      const res = await api.get(url);
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleUpdateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/reports/${activeReport.id}/status`, {
        status: newStatus,
        admin_notes: adminNotes,
      });
      if (res.data.success) {
        setActiveReport(null);
        fetchReports();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update report.');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = reports.filter((r) => {
    const term = search.toLowerCase();
    return (
      (r.reason && r.reason.toLowerCase().includes(term)) ||
      (r.description && r.description.toLowerCase().includes(term)) ||
      (r.serial_id && r.serial_id.toLowerCase().includes(term)) ||
      (r.reporter_email && r.reporter_email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Suspicious Medicine Incident Reports</span>
          </h1>
          <p className="text-xs text-neutral-400">
            Citizen and health provider alerts regarding suspected counterfeits, expired products, and packaging tampering.
          </p>
        </div>

        <div className="admin-report-filters flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No incident reports found matching filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3">Serial ID</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Reporter</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-800/30">
                    <td className="py-3 text-neutral-400">
                      {new Date(r.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 font-semibold text-rose-300">{r.reason}</td>
                    <td className="py-3 font-mono text-neutral-300">
                      {r.serial_id ? `${r.serial_id.slice(0, 8)}...` : 'N/A'}
                    </td>
                    <td className="py-3 text-neutral-300 max-w-[240px] truncate">{r.description}</td>
                    <td className="py-3 text-neutral-400">{r.reporter_email || 'Anonymous Citizen'}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : r.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          setActiveReport(r);
                          setNewStatus(r.status);
                          setAdminNotes(r.admin_notes || '');
                        }}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Investigation / Review Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">Investigate Incident Report</h3>
              <button onClick={() => setActiveReport(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Reason:</span>
                <span className="font-semibold text-rose-400">{activeReport.reason}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Reported By:</span>
                <span className="text-white">{activeReport.reporter_email || 'Anonymous'}</span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-neutral-400 block">Incident Statement:</span>
                <p className="text-neutral-200 p-2 rounded bg-neutral-900/60 leading-relaxed">
                  {activeReport.description}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateReport} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Update Report Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Under Investigation (Reviewed)</option>
                  <option value="resolved">Resolved (Inspection Complete)</option>
                  <option value="dismissed">Dismissed (False Report / Inconclusive)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Administrative Notes / Action Taken</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Field inspector dispatched to pharmacy on 20-Nov-2026. Samples seized for laboratory assay..."
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                >
                  Save Investigation Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
