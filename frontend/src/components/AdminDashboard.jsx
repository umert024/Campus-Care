import React, { useState } from 'react';
import { useFacility } from '../context/FacilityContext';
import { EquipmentIcon, IconCheck, IconEye, IconFilter, IconRoom } from './Icons';

export const AdminDashboard = () => {
  const {
    issues,
    statusFilter,
    setStatusFilter,
    equipmentFilter,
    setEquipmentFilter,
    searchQuery,
    updateIssueStatus,
    setSelectedIssueModal,
  } = useFacility();

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [editingTechId, setEditingTechId] = useState(null);
  const [techInput, setTechInput] = useState('');

  const filteredIssues = issues.filter(issue => {
    if (statusFilter === 'Unresolved') {
      if (issue.status === 'Resolved' || issue.status === 'Closed') return false;
    } else if (statusFilter !== 'All') {
      if (issue.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
    }

    if (equipmentFilter !== 'All') {
      if (issue.equipmentType?.toLowerCase() !== equipmentFilter.toLowerCase()) return false;
    }

    if (priorityFilter !== 'All') {
      if (issue.priority?.toLowerCase() !== priorityFilter.toLowerCase()) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRoom = issue.roomNumber?.toLowerCase().includes(q);
      const matchEq = issue.equipmentName?.toLowerCase().includes(q) || issue.equipmentType?.toLowerCase().includes(q);
      const matchIssue = issue.issue?.toLowerCase().includes(q) || issue.description?.toLowerCase().includes(q);
      const matchId = issue.id?.toLowerCase().includes(q);
      const matchTech = issue.assignedTechnician?.toLowerCase().includes(q);

      return matchRoom || matchEq || matchIssue || matchId || matchTech;
    }

    return true;
  });

  const handleTechSave = (issueId) => {
    if (techInput.trim()) {
      updateIssueStatus(issueId, 'Under repair', techInput.trim(), 'Assigned technician via admin panel');
    }
    setEditingTechId(null);
    setTechInput('');
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200 font-semibold';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'under repair':
      case 'in progress':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'reported':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Admin Queue & Unresolved Issues</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {filteredIssues.length} Tickets
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitor, assign technicians, and update status for campus infrastructure breakdowns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {['Unresolved', 'Reported', 'Under repair', 'Resolved', 'All'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <IconFilter className="w-4 h-4 text-indigo-600" />
            <span>Filter Equipment:</span>
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Projector">Projector</option>
              <option value="AC">AC</option>
              <option value="Fan">Fan</option>
              <option value="Computer">Computer</option>
              <option value="Bench">Bench</option>
              <option value="Electrical">Electrical Equipment</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {(equipmentFilter !== 'All' || priorityFilter !== 'All' || statusFilter !== 'Unresolved') && (
            <button
              onClick={() => {
                setEquipmentFilter('All');
                setPriorityFilter('All');
                setStatusFilter('Unresolved');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2 ml-auto"
            >
              Reset Filters
            </button>
          )}

        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Ticket & Priority</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Equipment</th>
                <th className="py-3.5 px-4">Issue Reported</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Technician / Reporter</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <IconCheck className="w-8 h-8 text-emerald-600/60" />
                      <p className="text-base font-semibold text-slate-700">No unresolved issues matching filter criteria.</p>
                      <p className="text-xs text-slate-500">All equipment items in this category are operating normally.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="py-4 px-4 align-top">
                      <div className="font-mono font-bold text-indigo-700 text-xs">{issue.id}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full border ${getPriorityBadge(issue.priority)}`}>
                        {issue.priority} Priority
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                        <IconRoom className="w-4 h-4 text-indigo-600" />
                        <span>Room {issue.roomNumber}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-indigo-600">
                          <EquipmentIcon type={issue.equipmentType} className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{issue.equipmentType}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{issue.equipmentName}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top max-w-xs">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        {issue.issue}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border ${getStatusBadge(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="text-xs">
                        <div className="text-slate-800 font-semibold">
                          <span className="text-slate-500 font-normal">Tech:</span> {issue.assignedTechnician || 'Unassigned'}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          <span className="text-slate-400 font-normal">By:</span> {issue.reportedBy}
                        </div>
                      </div>

                      {editingTechId === issue.id ? (
                        <div className="mt-2 flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Technician Name"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            className="text-xs px-2 py-1 bg-white border border-indigo-500 rounded text-slate-900 focus:outline-none"
                          />
                          <button
                            onClick={() => handleTechSave(issue.id)}
                            className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingTechId(issue.id);
                            setTechInput(issue.assignedTechnician !== 'Unassigned' ? issue.assignedTechnician : '');
                          }}
                          className="text-[11px] text-indigo-600 hover:underline mt-1 block font-medium"
                        >
                          {issue.assignedTechnician === 'Unassigned' ? '+ Assign Tech' : 'Change Tech'}
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top text-right space-y-1.5">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {issue.status?.toLowerCase() !== 'under repair' && issue.status?.toLowerCase() !== 'resolved' && (
                          <button
                            onClick={() => updateIssueStatus(issue.id, 'Under repair', issue.assignedTechnician !== 'Unassigned' ? issue.assignedTechnician : 'On-Duty Technician')}
                            className="px-2.5 py-1 text-xs rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold transition-all shadow-sm"
                          >
                            Mark Under Repair
                          </button>
                        )}

                        {issue.status?.toLowerCase() !== 'resolved' && (
                          <button
                            onClick={() => updateIssueStatus(issue.id, 'Resolved')}
                            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold transition-all shadow-sm"
                          >
                            Mark Resolved
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedIssueModal(issue)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 shadow-sm"
                          title="View Details"
                        >
                          <IconEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
