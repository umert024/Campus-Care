import React from 'react';
import { useFacility } from '../context/FacilityContext';
import { IconAlert, IconWrench, IconInventory, IconCheck } from './Icons';

export const StatCards = () => {
  const { stats, setStatusFilter, setActiveTab } = useFacility();

  const cards = [
    {
      title: 'Unresolved Issues',
      value: stats.unresolvedCount,
      subtext: `${stats.reportedCount} reported, ${stats.underRepairCount} under repair`,
      icon: IconAlert,
      bg: 'bg-white',
      borderColor: 'border-amber-200',
      iconColor: 'bg-amber-50 text-amber-600 border border-amber-200',
      badge: 'Action Required',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      onClick: () => {
        setActiveTab('dashboard');
        setStatusFilter('Unresolved');
      }
    },
    {
      title: 'Under Repair',
      value: stats.underRepairCount,
      subtext: 'Assigned to technicians',
      icon: IconWrench,
      bg: 'bg-white',
      borderColor: 'border-indigo-200',
      iconColor: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
      badge: 'In Progress',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      onClick: () => {
        setActiveTab('dashboard');
        setStatusFilter('Under repair');
      }
    },
    {
      title: 'Total Campus Assets',
      value: stats.totalEquipmentCount,
      subtext: '7 Rooms & 4 Major Facilities',
      icon: IconInventory,
      bg: 'bg-white',
      borderColor: 'border-purple-200',
      iconColor: 'bg-purple-50 text-purple-600 border border-purple-200',
      badge: 'Tracked',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      onClick: () => {
        setActiveTab('inventory');
      }
    },
    {
      title: 'Operational Rate',
      value: `${stats.healthPercentage}%`,
      subtext: `${stats.operationalEqCount} items functional`,
      icon: IconCheck,
      bg: 'bg-white',
      borderColor: 'border-emerald-200',
      iconColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      badge: 'Normal Range',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      onClick: () => {
        setActiveTab('inventory');
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.onClick}
            className={`glass-panel p-5 rounded-2xl border ${card.borderColor} ${card.bg} hover:shadow-md hover:border-indigo-400 cursor-pointer transition-all duration-200 group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">
                  {card.value}
                </div>
              </div>
              <div className={`p-3 rounded-xl ${card.iconColor} shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                {card.subtext}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
