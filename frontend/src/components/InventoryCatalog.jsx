import React, { useState } from 'react';
import { useFacility } from '../context/FacilityContext';
import { EquipmentIcon, IconRoom, IconWrench } from './Icons';

export const InventoryCatalog = () => {
  const {
    equipment,
    rooms,
    equipmentFilter,
    setEquipmentFilter,
    roomFilter,
    setRoomFilter,
    searchQuery,
    setIsReportModalOpen,
    setSelectedIssueModal,
    issues
  } = useFacility();

  const [conditionFilter, setConditionFilter] = useState('All');

  const filteredEquipment = equipment.filter(item => {
    if (equipmentFilter !== 'All') {
      if (item.type?.toLowerCase() !== equipmentFilter.toLowerCase()) return false;
    }

    if (roomFilter !== 'All') {
      if (item.roomNumber?.toLowerCase() !== roomFilter.toLowerCase()) return false;
    }

    if (conditionFilter !== 'All') {
      if (item.status?.toLowerCase() !== conditionFilter.toLowerCase()) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchType = item.type?.toLowerCase().includes(q);
      const matchRoom = item.roomNumber?.toLowerCase().includes(q);
      const matchSerial = item.serial?.toLowerCase().includes(q);
      return matchName || matchType || matchRoom || matchSerial;
    }

    return true;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'under repair':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'needs service':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'out of order':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Campus Infrastructure Catalog</h2>
            <p className="text-xs text-slate-400 mt-1">
              Complete inventory of Classrooms, Labs, Projectors, ACs, Fans, Computers, Benches, and Electrical Units.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-indigo-400">{filteredEquipment.length}</strong> of {equipment.length} Assets
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
          
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Equipment Type</label>
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Projector">Projector</option>
              <option value="AC">AC (Air Conditioner)</option>
              <option value="Fan">Fans & Ventilation</option>
              <option value="Computer">Computers & Workstations</option>
              <option value="Bench">Benches & Seating</option>
              <option value="Electrical">Electrical Equipment</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Location / Room</label>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Campus Rooms</option>
              {rooms.map(room => (
                <option key={room.id} value={room.number}>
                  Room {room.number} ({room.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Condition Status</label>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="Under Repair">Under Repair</option>
              <option value="Needs Service">Needs Service</option>
              <option value="Out of Order">Out of Order</option>
            </select>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.length === 0 ? (
          <div className="col-span-full glass-panel p-12 rounded-2xl text-center text-slate-500">
            <p className="text-base font-semibold text-slate-300">No equipment items found.</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or search query.</p>
          </div>
        ) : (
          filteredEquipment.map((item) => {
            const activeIssue = issues.find(i => i.equipmentId === item.id && i.status !== 'Resolved');

            return (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-indigo-400">
                        <EquipmentIcon type={item.type} className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                          {item.type}
                        </span>
                        <h3 className="font-bold text-white text-base leading-tight mt-0.5">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Room Location:</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <IconRoom className="w-3.5 h-3.5 text-indigo-400" />
                        Room {item.roomNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Serial Tag:</span>
                      <span className="font-mono text-slate-300 text-[11px]">{item.serial}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Installed Date:</span>
                      <span className="text-slate-400">{item.installedDate}</span>
                    </div>
                  </div>

                  {activeIssue && (
                    <div
                      onClick={() => setSelectedIssueModal(activeIssue)}
                      className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between cursor-pointer hover:bg-amber-500/20 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span className="font-medium line-clamp-1">Active Ticket: {activeIssue.issue}</span>
                      </div>
                      <span className="font-bold underline text-[11px]">View Ticket</span>
                    </div>
                  )}

                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {item.id}
                  </span>
                  
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                  >
                    <IconWrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Report Breakdown</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
