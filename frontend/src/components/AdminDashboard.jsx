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

  const technicians = ['Anil Kumar', 'Electrician Mohan', 'Ravi Patil', 'Suresh More'];

  const filteredIssues = issues.filter(issue => {
    if (statusFilter === 'Unresolved' && ['Resolved', 'Closed'].includes(issue.status)) return false;
    if (statusFilter !== 'All' && statusFilter !== 'Unresolved' &&
        issue.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (equipmentFilter !== 'All' &&
        issue.equipmentType?.toLowerCase() !== equipmentFilter.toLowerCase()) return false;
    if (priorityFilter !== 'All' &&
        issue.priority?.toLowerCase() !== priorityFilter.toLowerCase()) return false;

    if (!searchQuery) return true;

    const q = searchQuery.toLowerCase();
    return [
      issue.roomNumber,
      issue.equipmentName,
      issue.equipmentType,
      issue.issue,
      issue.description,
      issue.id,
      issue.assignedTechnician
    ].some(value => value?.toLowerCase().includes(q));
  });

  const saveTechnician = (issueId) => {
    if (techInput.trim()) {
      updateIssueStatus(
        issueId,
        'Under repair',
        techInput.trim(),
        'Assigned technician via admin panel'
      );
    }
    setEditingTechId(null);
    setTechInput('');
  };

  const priorityClass = {
    Urgent: 'badge-danger',
    High: 'badge-warning',
    Medium: 'badge-info',
    Low: 'badge-neutral'
  };

  const statusClass = {
    Reported: 'badge-danger',
    'Under repair': 'badge-warning',
    Resolved: 'badge-success'
  };

  return (
    <div className="space-y-4">
      <div className="panel p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Issue Dashboard</h2>
              <span className="badge-info">{filteredIssues.length} tickets</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review breakdowns, assign technicians and track repairs.
            </p>
          </div>

          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {['Unresolved', 'Reported', 'Under repair', 'Resolved', 'All'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition ${
                  statusFilter === status
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1">
            <IconFilter className="w-4 h-4 text-indigo-500 shrink-0" />
            <select
              value={equipmentFilter}
              onChange={e => setEquipmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All equipment</option>
              <option value="Projector">Projector</option>
              <option value="AC">AC</option>
              <option value="Fan">Fan</option>
              <option value="Computer">Computer</option>
              <option value="Bench">Bench</option>
              <option value="Electrical">Electrical</option>
            </select>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All priorities</option>
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
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="panel py-14 text-center">
          <IconCheck className="w-9 h-9 text-emerald-500 mx-auto mb-2" />
          <p className="font-semibold text-slate-800">No issues found</p>
          <p className="text-xs text-slate-400 mt-1">Try changing the filters or search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map(issue => (
            <div key={issue.id} className="panel p-4 sm:p-5 hover:border-indigo-200 transition">
              <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="font-mono text-[11px] font-bold text-indigo-600">{issue.id}</span>
                    <span className={priorityClass[issue.priority] || 'badge-neutral'}>
                      {issue.priority}
                    </span>
                    <span className={statusClass[issue.status] || 'badge-neutral'}>
                      {issue.status}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <EquipmentIcon type={issue.equipmentType} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900">
                        {issue.issue}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <IconRoom className="w-3.5 h-3.5" />
                          Room {issue.roomNumber}
                        </span>
                        <span>{issue.equipmentName}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3 mt-3">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-slate-400">
                    <span>Reported by <b className="text-slate-600">{issue.reportedBy}</b></span>
                    <span>Technician <b className="text-slate-600">{issue.assignedTechnician || 'Unassigned'}</b></span>
                  </div>
                </div>

                <div className="xl:w-52 flex xl:flex-col gap-2 xl:border-l xl:border-slate-100 xl:pl-4">
                  {editingTechId === issue.id ? (
                    <div className="flex flex-1 gap-2">
                      <select
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        className="simple-input flex-1 min-w-0 bg-white"
                      >
                        <option value="">Select technician</option>
                        {technicians.map(technician => (
                          <option key={technician} value={technician}>
                            {technician}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => saveTechnician(issue.id)} className="small-primary">
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTechId(issue.id);
                        setTechInput(issue.assignedTechnician !== 'Unassigned' ? issue.assignedTechnician : '');
                      }}
                      className="small-button"
                    >
                      {issue.assignedTechnician === 'Unassigned' ? 'Assign technician' : 'Change technician'}
                    </button>
                  )}

                  <div className="flex gap-2">
                    {issue.status?.toLowerCase() !== 'under repair' &&
                     issue.status?.toLowerCase() !== 'resolved' && (
                      <button
                        onClick={() => updateIssueStatus(
                          issue.id,
                          'Under repair',
                          issue.assignedTechnician !== 'Unassigned'
                            ? issue.assignedTechnician
                            : 'On-Duty Technician'
                        )}
                        className="small-button flex-1"
                      >
                        Start repair
                      </button>
                    )}

                    {issue.status?.toLowerCase() !== 'resolved' && (
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'Resolved')}
                        className="small-success flex-1"
                      >
                        Resolve
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedIssueModal(issue)}
                      className="icon-button shrink-0"
                      title="View details"
                    >
                      <IconEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
