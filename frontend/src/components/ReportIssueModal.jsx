import React, { useState } from 'react';
import { useFacility } from '../context/FacilityContext';
import { IconClose, IconAlert } from './Icons';

export const ReportIssueModal = () => {
  const { isReportModalOpen, setIsReportModalOpen, rooms, equipment, addIssue } = useFacility();

  const [roomNumber, setRoomNumber] = useState('302');
  const [equipmentType, setEquipmentType] = useState('Projector');
  const [issueTitle, setIssueTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [reportedBy, setReportedBy] = useState('');

  if (!isReportModalOpen) return null;

  const availableEqInRoom = equipment.filter(e => e.roomNumber === roomNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;

    const matchedEq = availableEqInRoom.find(e => e.type.toLowerCase() === equipmentType.toLowerCase()) || availableEqInRoom[0];

    addIssue({
      roomNumber,
      equipmentType,
      equipmentId: matchedEq?.id || null,
      equipmentName: matchedEq?.name || `${equipmentType} in Room ${roomNumber}`,
      issueTitle,
      description,
      priority,
      reportedBy: reportedBy.trim() || 'Staff Caretaker'
    });

    setIssueTitle('');
    setDescription('');
    setIsReportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <IconAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Report Infrastructure Breakdown</h3>
              <p className="text-xs text-slate-400">Log a broken equipment item for campus facilities team</p>
            </div>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Select Room / Location
            </label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
              required
            >
              {rooms.map(r => (
                <option key={r.id} value={r.number}>
                  Room {r.number} ({r.type} - {r.floor})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Equipment Category
            </label>
            <select
              value={equipmentType}
              onChange={(e) => setEquipmentType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
              required
            >
              <option value="Projector">Projector</option>
              <option value="AC">AC (Air Conditioner)</option>
              <option value="Fan">Ceiling Fan / Ventilation</option>
              <option value="Computer">Computer / PC</option>
              <option value="Bench">Bench / Furniture</option>
              <option value="Electrical">Electrical Equipment / Switch</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Issue Summary
            </label>
            <input
              type="text"
              placeholder="e.g. No display, Water leakage..."
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Detailed Symptoms / Description
            </label>
            <textarea
              rows="3"
              placeholder="Describe error indicators or physical damage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="Low">Low (Routine)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="High">High (Classroom Blocked)</option>
                <option value="Urgent">Urgent (Safety Hazard)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Reported By (Faculty/Staff)
              </label>
              <input
                type="text"
                placeholder="e.g. Prof. Sharma"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Submit Ticket
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
