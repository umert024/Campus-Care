import React, { useState, useEffect } from 'react';
import { useFacility } from '../context/FacilityContext';
import { IconSearch, IconPlus, IconRefresh, IconLogOut } from './Icons';

export const Navbar = () => {
  const {
    searchQuery,
    setSearchQuery,
    stats,
    setIsReportModalOpen,
    resetToDefaultData,
    isBackendConnected,
    currentUser,
    userRole,
    setIsLoginModalOpen,
    logout
  } = useFacility();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Admin': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Technician': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Faculty': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Student': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-header px-4 sm:px-8 py-3.5 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white font-bold">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                Campus<span className="text-indigo-600">Fix</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Facility Management
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {isBackendConnected ? 'Backend API' : 'Local Storage Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">College Physical Infrastructure & Asset Monitoring</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Room (e.g. 302), Equipment, or Issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          
          {/* Active User */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 pl-3 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-lg">{currentUser.avatar}</span>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                  {currentUser.name}
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(userRole)}`}>
                    {userRole}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{currentUser.title}</div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-rose-600 transition-all"
              >
                <IconLogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              Sign in
            </button>
          )}

          {/* Report Breakdown Action */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <IconPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Report Breakdown</span>
          </button>

          {/* Reset Settings */}
          <button
            onClick={resetToDefaultData}
            title="Reset dataset to initial seed state"
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 shadow-sm transition-all"
          >
            <IconRefresh className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
