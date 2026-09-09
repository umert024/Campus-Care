import React, { useState } from 'react';
import { useFacility } from '../context/FacilityContext';
import { EquipmentIcon, IconWrench, IconCheck, IconEye } from './Icons';

export const TechnicianView = () => {
  const { techWorkOrders, updateIssueStatus, setSelectedIssueModal, currentUser } = useFacility();
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handleSaveNote = (issueId) => {
    if (noteText.trim()) {
      updateIssueStatus(issueId, 'Under repair', currentUser ? currentUser.name : 'Technician', noteText.trim());
    }
    setActiveNoteId(null);
    setNoteText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-200 bg-amber-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300">
              <IconWrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Technician Work Orders</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {currentUser ? currentUser.name : 'Service Tech'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Your assigned breakdown tickets & repair status logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Assigned Orders</div>
              <div className="text-2xl font-extrabold text-amber-700">{techWorkOrders.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {techWorkOrders.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center text-slate-500 bg-white">
            <IconCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-60" />
            <p className="text-base font-semibold text-slate-800">No active work orders assigned to you.</p>
            <p className="text-xs text-slate-500 mt-1">All assigned facilities are operational.</p>
          </div>
        ) : (
          techWorkOrders.map((issue) => (
            <div
              key={issue.id}
              className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-700 text-xs">{issue.id}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">
                    {issue.priority} Priority
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                    {issue.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-indigo-600">
                    <EquipmentIcon type={issue.equipmentType} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Room {issue.roomNumber}: {issue.equipmentName}
                    </h3>
                    <div className="text-xs font-semibold text-rose-700 mt-0.5">
                      Issue: {issue.issue}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {issue.description}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span>Reported By: <strong>{issue.reportedBy}</strong></span>
                  <span>•</span>
                  <span>Date: {issue.reportedAt}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
                
                {issue.status !== 'Under repair' && issue.status !== 'Resolved' && (
                  <button
                    onClick={() => updateIssueStatus(issue.id, 'Under repair', currentUser ? currentUser.name : 'Technician', 'Started inspection & repair')}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-all shadow-sm"
                  >
                    🔨 Start Repair
                  </button>
                )}

                {issue.status !== 'Resolved' && (
                  <button
                    onClick={() => updateIssueStatus(issue.id, 'Resolved', currentUser ? currentUser.name : 'Technician', 'Repair completed & verified')}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-all shadow-sm"
                  >
                    ✅ Mark Completed
                  </button>
                )}

                {activeNoteId === issue.id ? (
                  <div className="w-full space-y-1 mt-1">
                    <input
                      type="text"
                      placeholder="Enter work progress note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-indigo-500 rounded-lg text-slate-900 focus:outline-none"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSaveNote(issue.id)}
                        className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => setActiveNoteId(null)}
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveNoteId(issue.id)}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    + Add Progress Note
                  </button>
                )}

                <button
                  onClick={() => setSelectedIssueModal(issue)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 mt-1 shadow-sm"
                >
                  <IconEye className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
