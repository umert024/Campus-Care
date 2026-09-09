import React from 'react';
import { useFacility } from '../context/FacilityContext';
import { IconDashboard, IconInventory, IconMatrix, IconLogs, IconWrench } from './Icons';

export const Sidebar = () => {
  const { activeTab, setActiveTab, stats, userRole, techWorkOrders } = useFacility();

  const getNavItems = () => {
    switch (userRole) {
      case 'Technician':
        return [
          {
            id: 'tech-queue',
            label: 'My Work Orders',
            subtitle: 'Assigned Repair Tasks',
            icon: IconWrench,
            badge: techWorkOrders.length > 0 ? techWorkOrders.length : null,
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
          },
          {
            id: 'inventory',
            label: 'Facility Catalog',
            subtitle: 'Campus Assets & Tools',
            icon: IconInventory,
            badge: stats.totalEquipmentCount,
            badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
          },
          {
            id: 'logs',
            label: 'Maintenance History',
            subtitle: 'Repair Audit Trail',
            icon: IconLogs,
            badge: null
          }
        ];
      case 'Faculty':
        return [
          {
            id: 'inventory',
            label: 'Classroom & Lab Assets',
            subtitle: 'Equipment Inventory',
            icon: IconInventory,
            badge: stats.totalEquipmentCount,
            badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
          },
          {
            id: 'matrix',
            label: 'Room Health Map',
            subtitle: 'Classroom Status Grid',
            icon: IconMatrix,
            badge: null
          },
          {
            id: 'logs',
            label: 'Breakdown Logs',
            subtitle: 'Reported Issues Status',
            icon: IconLogs,
            badge: null
          }
        ];
      case 'Student':
        return [
          {
            id: 'matrix',
            label: 'Room Infrastructure Map',
            subtitle: 'Classroom Health Grid',
            icon: IconMatrix,
            badge: null
          },
          {
            id: 'inventory',
            label: 'Facility Catalog',
            subtitle: 'Public Equipment Inventory',
            icon: IconInventory,
            badge: stats.totalEquipmentCount,
            badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
          }
        ];
      case 'Admin':
      default:
        return [
          {
            id: 'dashboard',
            label: 'Admin Dashboard',
            subtitle: 'Unresolved Issues Queue',
            icon: IconDashboard,
            badge: stats.unresolvedCount > 0 ? stats.unresolvedCount : null,
            badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
          },
          {
            id: 'inventory',
            label: 'Facility Catalog',
            subtitle: 'Infrastructure Assets',
            icon: IconInventory,
            badge: stats.totalEquipmentCount,
            badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
          },
          {
            id: 'matrix',
            label: 'Room Infrastructure Matrix',
            subtitle: 'Classrooms & Labs Map',
            icon: IconMatrix,
            badge: null
          },
          {
            id: 'logs',
            label: 'Maintenance History',
            subtitle: 'Repair Audit Log',
            icon: IconLogs,
            badge: null
          }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="glass-panel rounded-2xl p-3 border border-slate-200 sticky top-20 shadow-sm bg-white">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-600 uppercase flex items-center justify-between">
          <span>{userRole} Workspace</span>
        </div>

        <nav className="space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-slate-900'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-tight">{item.label}</div>
                    <div className={`text-[11px] font-normal leading-tight mt-0.5 ${
                      isActive ? 'text-indigo-100' : 'text-slate-400'
                    }`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {item.badge !== null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Health Score Summary Card */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
            <span>Facility Health Score</span>
            <span className="font-bold text-emerald-600">{stats.healthPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.healthPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {stats.operationalEqCount} of {stats.totalEquipmentCount} physical assets operating normally.
          </p>
        </div>
      </div>
    </aside>
  );
};
