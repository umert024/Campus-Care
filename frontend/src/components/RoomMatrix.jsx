import React from 'react';
import { useFacility } from '../context/FacilityContext';
import { EquipmentIcon, IconRoom, IconAlert } from './Icons';

export const RoomMatrix = () => {
  const { rooms, equipment, issues, setSelectedIssueModal, setIsReportModalOpen } = useFacility();

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
        <h2 className="text-xl font-bold text-slate-900">College Physical Infrastructure Matrix</h2>
        <p className="text-xs text-slate-400 mt-1">
          Interactive room-by-room physical infrastructure health & equipment status overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => {
          const roomEq = equipment.filter(e => e.roomNumber === room.number);
          const roomIssues = issues.filter(i => i.roomNumber === room.number && i.status !== 'Resolved');
          
          const totalEq = roomEq.length;
          const operationalEq = roomEq.filter(e => e.status === 'Operational').length;
          const roomHealth = totalEq > 0 ? Math.round((operationalEq / totalEq) * 100) : 100;
          const isCritical = roomIssues.length > 0;

          return (
            <div
              key={room.id}
              className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
                isCritical ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              
              <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isCritical ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    <IconRoom className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                      Room {room.number}
                    </h3>
                    <div className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                      <span>{room.type}</span>
                      <span>•</span>
                      <span>{room.block}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    roomHealth === 100
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : roomHealth >= 75
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {roomHealth}% Health
                  </span>
                  <div className="text-[11px] text-slate-600 mt-1">Cap: {room.capacity} seats</div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Installed Physical Assets</span>
                  <span>{operationalEq}/{totalEq} OK</span>
                </div>

                <div className="space-y-2">
                  {roomEq.map((item) => {
                    const itemIssue = issues.find(i => i.equipmentId === item.id && i.status !== 'Resolved');
                    
                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          item.status === 'Operational'
                            ? 'bg-slate-900/60 border-slate-800/80 text-slate-200'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-200 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <EquipmentIcon type={item.type} className="w-4 h-4 text-indigo-400" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {itemIssue && (
                              <span className="text-[10px] text-amber-300 block font-normal">
                                Issue: {itemIssue.issue} ({itemIssue.status})
                              </span>
                            )}
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase ${
                          item.status === 'Operational'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {roomIssues.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-200">
                      <IconAlert className="w-4 h-4 text-rose-400" />
                      <span>{roomIssues.length} Unresolved Breakdown(s)</span>
                    </div>
                    {roomIssues.map(iss => (
                      <div
                        key={iss.id}
                        onClick={() => setSelectedIssueModal(iss)}
                        className="text-[11px] underline cursor-pointer hover:text-white mt-1"
                      >
                        • {iss.equipmentType}: {iss.issue} ({iss.status})
                      </div>
                    ))}
                  </div>
                )}

              </div>

              <div className="p-3 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{room.floor}</span>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  + Report Issue in Room {room.number}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
