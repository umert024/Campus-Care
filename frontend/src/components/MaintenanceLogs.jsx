import React from 'react';
import { useFacility } from '../context/FacilityContext';
import { IconClock } from './Icons';

export const MaintenanceLogs = () => {
  const { issues, setSelectedIssueModal } = useFacility();

  const allLogs = [];
  issues.forEach(issue => {
    if (issue.updates) {
      issue.updates.forEach(upd => {
        allLogs.push({
          ticketId: issue.id,
          roomNumber: issue.roomNumber,
          equipmentType: issue.equipmentType,
          equipmentName: issue.equipmentName,
          issueTitle: issue.issue,
          status: issue.status,
          priority: issue.priority,
          timestamp: upd.timestamp,
          text: upd.text
        });
      });
    }
  });

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
        <h2 className="text-xl font-bold text-white">Campus Maintenance & Audit Logs</h2>
        <p className="text-xs text-slate-400 mt-1">
          Chronological timeline of infrastructure breakdown reports, technician updates, and repair resolutions.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
        <div className="relative border-l-2 border-slate-800 space-y-6 pl-6 ml-2">
          {allLogs.map((log, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center group-hover:scale-125 group-hover:bg-indigo-600 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {log.ticketId}
                    </span>
                    <span className="text-xs font-bold text-white">
                      Room {log.roomNumber} ({log.equipmentType})
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300">
                      {log.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <IconClock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-200 leading-relaxed font-medium">
                  {log.text}
                </div>

                <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                  <span>Issue: <strong className="text-slate-300">{log.issueTitle}</strong></span>
                  <span className="text-indigo-400 hover:underline cursor-pointer" onClick={() => {
                    const iss = issues.find(i => i.id === log.ticketId);
                    if (iss) setSelectedIssueModal(iss);
                  }}>
                    View Ticket →
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
