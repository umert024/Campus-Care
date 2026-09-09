import React from 'react';
import { useFacility } from './context/FacilityContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StatCards } from './components/StatCards';
import { AdminDashboard } from './components/AdminDashboard';
import { TechnicianView } from './components/TechnicianView';
import { InventoryCatalog } from './components/InventoryCatalog';
import { RoomMatrix } from './components/RoomMatrix';
import { MaintenanceLogs } from './components/MaintenanceLogs';
import { ReportIssueModal } from './components/ReportIssueModal';
import { IssueDetailsModal } from './components/IssueDetailsModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const { activeTab, currentUser } = useFacility();

  return (
    <div className="min-h-screen bg-[#F5F3FF] text-slate-900 flex flex-col font-sans selection:bg-violet-600 selection:text-white">
      
      {/* Sticky Top Header */}
      <Navbar />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        
        {/* Metric Cards Header */}
        <StatCards />

        {/* Sidebar + View switcher */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          <Sidebar />

          <section className="flex-1 w-full">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'tech-queue' && <TechnicianView />}
            {activeTab === 'inventory' && <InventoryCatalog />}
            {activeTab === 'matrix' && <RoomMatrix />}
            {activeTab === 'logs' && <MaintenanceLogs />}
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-violet-200 bg-white/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-violet-700">College Facility Management System</strong> — Personal user accounts
          </div>
          <div>
            Logged in as: <span className="text-slate-300 font-bold">{currentUser ? `${currentUser.name} (${currentUser.role})` : 'Guest'}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportIssueModal />
      <IssueDetailsModal />
      <LoginModal />

    </div>
  );
}
