import React, { useEffect, useState } from 'react';
import { Building2, ShieldCheck, Mail, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const ManufacturerProfile: React.FC = () => {
  const { user, manufacturer } = useAuth();
  const [profile, setProfile] = useState<any>(manufacturer);
  const [loading, setLoading] = useState(!manufacturer);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.data.manufacturer) {
          setProfile(res.data.data.manufacturer);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-emerald-400" />
          <span>Manufacturer Enterprise Profile</span>
        </h1>
        <p className="text-xs text-neutral-400">
          Official regulatory licensing details and contact information registered with MEDISCAN.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-white">{profile?.company_name}</h2>
            <span className="text-xs text-neutral-400 font-mono">License: {profile?.license_number}</span>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              profile?.approval_status === 'approved'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            ● {profile?.approval_status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-neutral-400 block flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-500" />
              <span>Official Regulatory Contact Email</span>
            </span>
            <span className="text-neutral-200 font-semibold">{profile?.contact_email || 'N/A'}</span>
          </div>

          <div className="space-y-1">
            <span className="text-neutral-400 block flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-neutral-500" />
              <span>Contact Telephone</span>
            </span>
            <span className="text-neutral-200 font-semibold">{profile?.contact_phone || 'N/A'}</span>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <span className="text-neutral-400 block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>Registered Manufacturing Facility Address</span>
            </span>
            <p className="text-neutral-200 leading-relaxed">{profile?.address || 'N/A'}</p>
          </div>

          <div className="sm:col-span-2 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
            Approved on: {profile?.approved_at ? new Date(profile.approved_at).toLocaleDateString('en-IN') : 'Under review'}
          </div>
        </div>
      </div>
    </div>
  );
};
