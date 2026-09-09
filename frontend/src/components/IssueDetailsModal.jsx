import React, { useState } from 'react';
import { useFacility } from '../context/FacilityContext';
import { IconClose, EquipmentIcon, IconRoom } from './Icons';

export const IssueDetailsModal = () => {
  const { selectedIssueModal, setSelectedIssueModal, updateIssueStatus } = useFacility();

  const [techName, setTechName] = useState('');
  const [updateNote, setUpdateNote] = useState('');

  if (!selectedIssueModal) return null;

  const issue = selectedIssueModal;

  const handleUpdate = (newStatus) => {
    updateIssueStatus(
      issue.id,
      newStatus,
      techName.trim() ? techName.trim() : null,
      updateNote.trim() ? updateNote.trim() : ''
    );
    setUpdateNote('');
    setSelectedIssueModal(prev => ({
      ...prev,
      status: newStatus,
      assignedTechnician: techName.trim() ? techName.trim() : prev.assignedTechnician
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400">
              <EquipmentIcon type={issue.equipmentType} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-300 text-xs">{issue.id}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {issue.priority} Priority
                </span>
              </div>
              <h3 className="font-extrabold text-white text-lg leading-tight mt-0.5">
                Room {issue.roomNumber}: {issue.equipmentType} - {issue.issue}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setSelectedIssueModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Room Location</span>
              <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                <IconRoom className="w-3.5 h-3.5 text-indigo-400" />
                Room {issue.roomNumber}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block font-medium">Current Status</span>
              <span className="font-bold text-amber-300 text-xs mt-1 block">
                {issue.status}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block font-medium">Assigned Tech</span>
              <span className="font-semibold text-slate-200 text-xs mt-1 block">
                {issue.assignedTechnician || 'Unassigned'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block font-medium">Reported Date</span>
              <span className="text-slate-300 text-xs mt-1 block">
                {issue.reportedAt}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Detailed Description
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm leading-relaxed">
              {issue.description}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Admin Controls & Technician Assignment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Assign Technician</label>
                <input
                  type="text"
                  placeholder={issue.assignedTechnician !== 'Unassigned' ? issue.assignedTechnician : 'Technician name...'}
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">Add Work Note</label>
                <input
                  type="text"
                  placeholder="e.g. Lamp ordered..."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 font-medium mr-2">Change Status:</span>

              <button
                onClick={() => handleUpdate('Reported')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  issue.status === 'Reported'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Reported
              </button>

              <button
                onClick={() => handleUpdate('Under repair')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  issue.status === 'Under repair'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Under Repair
              </button>

              <button
                onClick={() => handleUpdate('Resolved')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  issue.status === 'Resolved'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Mark Resolved
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Ticket Updates Log
            </h4>
            <div className="space-y-2">
              {issue.updates && issue.updates.map((upd, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-start justify-between">
                  <div className="text-slate-300">{upd.text}</div>
                  <div className="text-[10px] text-slate-500 shrink-0 ml-4 font-mono">{upd.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">Reported By: {issue.reportedBy}</span>
          <button
            onClick={() => setSelectedIssueModal(null)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
