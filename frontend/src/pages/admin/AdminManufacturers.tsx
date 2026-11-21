import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Key,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminManufacturers: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchManufacturers = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/admin/manufacturers?status=${statusFilter}`
        : '/admin/manufacturers';
      const res = await api.get(url);
      if (res.data.success) {
        setManufacturers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch manufacturers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      const res = await api.post(`/admin/manufacturers/${id}/approve`);
      if (res.data.success) {
        setMessage(res.data.message);
        fetchManufacturers();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Approval failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalId || !rejectReason.trim()) return;
    setActionLoading(rejectModalId);
    try {
      const res = await api.post(`/admin/manufacturers/${rejectModalId}/reject`, {
        reason: rejectReason.trim(),
      });
      if (res.data.success) {
        setRejectModalId(null);
        setRejectReason('');
        fetchManufacturers();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Rejection failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id: string) => {
    const reason = prompt('Enter suspension reason:');
    if (!reason) return;
    setActionLoading(id);
    try {
      const res = await api.post(`/admin/manufacturers/${id}/suspend`, { reason });
      if (res.data.success) {
        fetchManufacturers();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Suspension failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = manufacturers.filter((m) => {
    const term = search.toLowerCase();
    return (
      m.company_name.toLowerCase().includes(term) ||
      m.license_number.toLowerCase().includes(term) ||
      m.contact_email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <span>Pharmaceutical Manufacturer Licensing</span>
          </h1>
          <p className="text-xs text-neutral-400">
            Review drug manufacturing licenses, approve companies, and provision Ed25519 signing keys.
          </p>
        </div>

        <div className="responsive-filter-row flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or license..."
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No manufacturers found matching the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="pb-3">Company Name</th>
                  <th className="pb-3">License Number</th>
                  <th className="pb-3">Official Email</th>
                  <th className="pb-3">Ed25519 Key ID</th>
                  <th className="pb-3">Batches</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Regulatory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-800/30">
                    <td className="py-3.5">
                      <span className="font-bold text-white block">{m.company_name}</span>
                      <span className="text-[11px] text-neutral-400">{m.representative_name}</span>
                    </td>
                    <td className="py-3.5 font-mono text-neutral-300">{m.license_number}</td>
                    <td className="py-3.5 text-neutral-300">{m.contact_email}</td>
                    <td className="py-3.5 font-mono text-[11px] text-emerald-400">
                      {m.active_key_id || <span className="text-neutral-600">None</span>}
                    </td>
                    <td className="py-3.5 text-neutral-300 font-semibold">{m.batch_count || 0}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.approval_status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : m.approval_status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {m.approval_status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {m.approval_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(m.id)}
                            disabled={actionLoading === m.id}
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] transition-colors"
                          >
                            {actionLoading === m.id ? 'Approving...' : 'Approve & KeyGen'}
                          </button>
                          <button
                            onClick={() => setRejectModalId(m.id)}
                            className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {m.approval_status === 'approved' && (
                        <button
                          onClick={() => handleSuspend(m.id)}
                          className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 font-semibold text-[11px] transition-colors"
                        >
                          Suspend
                        </button>
                      )}

                      {m.approval_status === 'suspended' && (
                        <button
                          onClick={() => handleApprove(m.id)}
                          className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-semibold text-[11px] transition-colors"
                        >
                          Reinstate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Provide Rejection Reason</h3>
            <p className="text-xs text-neutral-400">
              State why the drug manufacturing license or application failed regulatory standards.
            </p>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. License number not found in State Drug Licensing Authority database..."
              className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
