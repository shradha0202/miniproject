import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { VerifyMedicine } from './pages/VerifyMedicine';
import { Login } from './pages/Login';
import { RegisterUser } from './pages/RegisterUser';
import { RegisterManufacturer } from './pages/RegisterManufacturer';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { ScanHistory } from './pages/user/ScanHistory';
import { ReportMedicine } from './pages/user/ReportMedicine';

// Manufacturer Pages
import { ManufacturerDashboard } from './pages/manufacturer/ManufacturerDashboard';
import { RegisterBatch } from './pages/manufacturer/RegisterBatch';
import { MyBatches } from './pages/manufacturer/MyBatches';
import { ManufacturerProfile } from './pages/manufacturer/ManufacturerProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminManufacturers } from './pages/admin/AdminManufacturers';
import { AdminMedicines } from './pages/admin/AdminMedicines';
import { AdminBatches } from './pages/admin/AdminBatches';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminCdscoAlerts } from './pages/admin/AdminCdscoAlerts';
import { AdminUsers } from './pages/admin/AdminUsers';

// Protected Route Guard
const ProtectedLayout: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-[#2f5d38] text-sm">
        Loading MEDISCAN session...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Public Layout
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1d261f]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Shell */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/verify" element={<VerifyMedicine />} />
              <Route path="/verify/:serialId" element={<VerifyMedicine />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterUser />} />
              <Route path="/register-manufacturer" element={<RegisterManufacturer />} />
              <Route path="/report" element={<ReportMedicine />} />
            </Route>

            {/* Citizen User Protected Shell */}
            <Route element={<ProtectedLayout allowedRoles={['user', 'admin']} />}>
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/user/history" element={<ScanHistory />} />
            </Route>

            {/* Manufacturer Protected Shell */}
            <Route element={<ProtectedLayout allowedRoles={['manufacturer', 'admin']} />}>
              <Route path="/manufacturer" element={<ManufacturerDashboard />} />
              <Route path="/manufacturer/register-batch" element={<RegisterBatch />} />
              <Route path="/manufacturer/my-batches" element={<MyBatches />} />
              <Route path="/manufacturer/profile" element={<ManufacturerProfile />} />
            </Route>

            {/* Admin Protected Shell */}
            <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/manufacturers" element={<AdminManufacturers />} />
              <Route path="/admin/medicines" element={<AdminMedicines />} />
              <Route path="/admin/batches" element={<AdminBatches />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/cdsco-alerts" element={<AdminCdscoAlerts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
