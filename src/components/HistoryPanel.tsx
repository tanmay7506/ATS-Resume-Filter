import React from 'react';
import { Candidate } from '../types';
import { 
  FileCheck, 
  FileX, 
  Download, 
  Trash2, 
  Mail, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  Users
} from 'lucide-react';

interface HistoryPanelProps {
  candidates: Candidate[];
  onContactClick: (candidate: Candidate) => void;
  onClearRejected: () => void;
  onDeleteCandidate: (id: string) => void;
}

export function HistoryPanel({ 
  candidates, 
  onContactClick, 
  onClearRejected,
  onDeleteCandidate
}: HistoryPanelProps) {
  
  const shortlisted = candidates.filter(c => c.status === 'accepted');
  const rejected = candidates.filter(c => c.status === 'rejected');

  // Helper code to handle downloading JSON
  const downloadJSON = (data: Candidate[], filename: string) => {
    const cleanData = data.map(({ id, name, email, phone, role, experience, education, skills, summary, matchPercentage, appliedDate }) => ({
      name, email, phone, role, experience, education, skills, summary, matchPercentage, appliedDate
    }));
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(cleanData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Helper code to handle downloading CSV
  const downloadCSV = (data: Candidate[], filename: string) => {
    const headers = ['Full Name', 'Email', 'Phone', 'Role', 'Experience', 'Education', 'Scored Match %', 'Date Applied'];
    const rows = data.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${c.phone.replace(/"/g, '""')}"`,
      `"${c.role.replace(/"/g, '""')}"`,
      `"${c.experience.replace(/"/g, '""')}"`,
      `"${c.education.replace(/"/g, '""')}"`,
      c.matchPercentage !== undefined ? `${c.matchPercentage}%` : 'N/A',
      c.appliedDate
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="history-panel" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Shortlisted Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[520px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                Shortlisted Candidates
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {shortlisted.length}
                </span>
              </h3>
              <p className="text-slate-500 text-xs">Eligible role candidates ready for outreach</p>
            </div>
          </div>

          {shortlisted.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => downloadCSV(shortlisted, 'shortlisted_pipeline.csv')}
                className="p-1 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
                title="Download Shortlisted as CSV"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
              <button
                onClick={() => downloadJSON(shortlisted, 'shortlisted_pipeline.json')}
                className="p-1 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
                title="Download Shortlisted as JSON"
              >
                <Download className="w-3.5 h-3.5" /> JSON
              </button>
            </div>
          )}
        </div>

        {/* Shortlisted Candidates Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {shortlisted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <Users className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No modern hires shortlisted yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">Swipe cards to the right or click build approval button inside Review mode.</p>
            </div>
          ) : (
            shortlisted.map(candidate => (
              <div 
                key={candidate.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{candidate.name}</span>
                    {candidate.matchPercentage && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" /> {candidate.matchPercentage}% fit
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-xs font-medium">{candidate.role}</p>
                  <div className="flex flex-col gap-0.5 pt-1 text-[11px] text-slate-400">
                    <span className="font-mono">Email: {candidate.email || 'N/A'}</span>
                    <span>Exp: {candidate.experience} | {candidate.education.split(',')[0]}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => onContactClick(candidate)}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Contact
                  </button>
                  <button
                    onClick={() => onDeleteCandidate(candidate.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rejected Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[520px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <FileX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                Rejected Candidates
                <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {rejected.length}
                </span>
              </h3>
              <p className="text-slate-500 text-xs">Candidates bypassed during triage cycle</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {rejected.length > 0 && (
              <>
                <button
                  onClick={() => downloadCSV(rejected, 'rejected_pipeline.csv')}
                  className="p-1 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Download Rejected as CSV"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
                <button
                  onClick={() => downloadJSON(rejected, 'rejected_pipeline.json')}
                  className="p-1 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Download Rejected as JSON"
                >
                  <Download className="w-3.5 h-3.5" /> JSON
                </button>
                <button
                  onClick={onClearRejected}
                  className="p-1 px-2 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 rounded-md hover:bg-rose-100 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Clear all candidate cards from reject list"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Rejected Candidates Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {rejected.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <Users className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No candidates archived yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">Swipe cards to the left or click the red bypass button to screen out resumes.</p>
            </div>
          ) : (
            rejected.map(candidate => (
              <div 
                key={candidate.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{candidate.name}</span>
                    {candidate.matchPercentage && (
                      <span className="text-slate-450 text-[10px] font-medium">({candidate.matchPercentage}% fit)</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-xs">{candidate.role}</p>
                  <p className="text-slate-400 text-[10px] pt-0.5 font-mono">Email: {candidate.email || 'N/A'}</p>
                </div>

                <button
                  onClick={() => onDeleteCandidate(candidate.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 cursor-pointer shrink-0"
                  title="Remove from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
