import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Database, 
  Settings, 
  FilePlus2, 
  Check, 
  X, 
  Mail, 
  Trash2, 
  Sparkles, 
  Download, 
  Briefcase, 
  Maximize2,
  Undo2,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle,
  MessageSquareCode,
  Globe,
  Send,
  Loader2
} from 'lucide-react';
import { Candidate, EmailTemplate } from './types';
import { initialCandidates } from './mockData';
import { ResumeCard } from './components/ResumeCard';
import { HistoryPanel } from './components/HistoryPanel';

export default function App() {
  // Tabs: 'swipe' | 'database' | 'templates' | 'import-cv'
  const [activeTab, setActiveTab] = useState<'swipe' | 'database' | 'templates' | 'import-cv'>('swipe');
  
  // States
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchRole, setSearchRole] = useState<string>('Senior Frontend Engineer');
  
  // Quick Upload Form state
  const [rawResumeInput, setRawResumeInput] = useState<string>('');
  const [targetRoleForUpload, setTargetRoleForUpload] = useState<string>('Senior Frontend Engineer');
  const [parsingSpinner, setParsingSpinner] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Email outreach Modal State
  const [outreachModalOpen, setOutreachModalOpen] = useState<boolean>(false);
  const [contactCandidate, setContactCandidate] = useState<Candidate | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('outreach');
  const [subjectInput, setSubjectInput] = useState<string>('');
  const [bodyInput, setBodyInput] = useState<string>('');
  const [emailSending, setEmailSending] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  // Templates State
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [newTemplateSubject, setNewTemplateSubject] = useState<string>('');
  const [newTemplateBody, setNewTemplateBody] = useState<string>('');

  // Toast / Status notification states
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load from local storage
  useEffect(() => {
    const cachedCandidates = localStorage.getItem('ats_candidates');
    if (cachedCandidates) {
      try {
        setCandidates(JSON.parse(cachedCandidates));
      } catch (e) {
        setCandidates(initialCandidates);
      }
    } else {
      setCandidates(initialCandidates);
      localStorage.setItem('ats_candidates', JSON.stringify(initialCandidates));
    }

    // Default Email Templates
    const cachedTemplates = localStorage.getItem('ats_templates');
    const defaultTemplates: EmailTemplate[] = [
      {
        id: 'outreach',
        name: 'Initial Interview Invitation',
        subject: 'Interview Schedule Proposal - ProHire Technical Screening',
        body: 'Dear [Name],\n\nWe scanned your CV in our Applicant Tracking System and found your experience as a [Role] highly relevant to our needs.\n\nWe would love to invite you for an initial chat with our engineering team next week. Please let us know your availability.\n\nBest regards,\nProHire Sourcing Department'
      },
      {
        id: 'rejection',
        name: 'Standard Screening Rejection',
        subject: 'Update on your job application with ProHire Group',
        body: 'Dear [Name],\n\nThank you for taking the time to apply and share your CV for the [Role] position.\n\nAfter thorough screen reviews of your credentials and credentials match profile, we regret to inform you that we have decided to progress with other candidates who more aligned with local requirements.\n\nWe wish you all the best in your career pursuits.\n\nSincerely,\nProHire Talent Team'
      }
    ];

    if (cachedTemplates) {
      try {
        setTemplates(JSON.parse(cachedTemplates));
      } catch (e) {
        setTemplates(defaultTemplates);
      }
    } else {
      setTemplates(defaultTemplates);
      localStorage.setItem('ats_templates', JSON.stringify(defaultTemplates));
    }
  }, []);

  // Save candidates whenever they change
  const updateCandidatesList = (newList: Candidate[]) => {
    setCandidates(newList);
    localStorage.setItem('ats_candidates', JSON.stringify(newList));
  };

  // Toast helper
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Swipe (manual or button-triggered)
  const handleSwipe = (approved: boolean, candidateId?: string) => {
    const targetId = candidateId || pendingCandidates[0]?.id;
    if (!targetId) return;

    const updated = candidates.map(c => {
      if (c.id === targetId) {
        return { ...c, status: approved ? 'accepted' : 'rejected' as const };
      }
      return c;
    });

    updateCandidatesList(updated);
    showToast(
      approved ? `Shortlisted ${candidates.find(c => c.id === targetId)?.name} to pipeline` : `Rejected candidate card`, 
      approved ? 'success' : 'info'
    );
  };

  // Undo last action (resets back to pending)
  const handleUndo = () => {
    const sortedProcessed = [...candidates]
      .filter(c => c.status !== 'pending')
      .sort((a, b) => b.id.localeCompare(a.id)); // Simple heuristic of last toggled
    
    if (sortedProcessed.length === 0) {
      showToast('No actions to undo', 'info');
      return;
    }

    const lastProcessed = sortedProcessed[0];
    const updated = candidates.map(c => {
      if (c.id === lastProcessed.id) {
        return { ...c, status: 'pending' as const };
      }
      return c;
    });

    updateCandidatesList(updated);
    showToast(`Restored ${lastProcessed.name} back to review stack`, 'success');
  };

  // Full-clear of rejected candidates
  const handleClearRejected = () => {
    if (window.confirm('Are you absolutely sure you want to permanently clear all rejected candidates from your repository history?')) {
      const remaining = candidates.filter(c => c.status !== 'rejected');
      updateCandidatesList(remaining);
      showToast('Cleared all rejected applicant cards successfully.', 'info');
    }
  };

  // Delete specific candidate from lists
  const handleDeleteCandidate = (id: string) => {
    const remaining = candidates.filter(c => c.id !== id);
    updateCandidatesList(remaining);
    showToast('Applicant profile deleted from tracking.', 'info');
  };

  // Contact Applicant Trigger
  const handleContactClick = (candidate: Candidate) => {
    setContactCandidate(candidate);
    
    // Choose the active template (default 'outreach')
    const template = templates.find(t => t.id === 'outreach') || templates[0];
    if (template) {
      setSelectedTemplateId(template.id);
      
      // Auto replace placeholders
      let processedBody = template.body
        .replace(/\[Name\]/g, candidate.name)
        .replace(/\[Role\]/g, candidate.role);
      
      setSubjectInput(template.subject);
      setBodyInput(processedBody);
    } else {
      setSubjectInput('Job Application Update');
      setBodyInput(`Dear ${candidate.name},\n\nWe analyzed your CV...`);
    }

    setOutreachModalOpen(true);
  };

  // Template switch in Contact Modal
  const handleTemplateSelectionChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template && contactCandidate) {
      let processedBody = template.body
        .replace(/\[Name\]/g, contactCandidate.name)
        .replace(/\[Role\]/g, contactCandidate.role);
      setSubjectInput(template.subject);
      setBodyInput(processedBody);
    }
  };

  // Simulate Sending Email via automated API proxy
  const handleSendEmail = async () => {
    if (!contactCandidate) return;
    setEmailSending(true);
    setSendSuccessMessage(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toEmail: contactCandidate.email,
          applicantName: contactCandidate.name,
          subject: subjectInput,
          body: bodyInput
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSendSuccessMessage(data.message || `Outreach email delivered securely!`);
        showToast(`Email dispatched to ${contactCandidate.name}!`, 'success');
        setTimeout(() => {
          setOutreachModalOpen(false);
          setSendSuccessMessage(null);
        }, 2200);
      } else {
        throw new Error(data.error || 'Server rejected mail dispatch.');
      }
    } catch (err: any) {
      alert(`Outbound Dispatch Error: ${err.message}`);
    } finally {
      setEmailSending(false);
    }
  };

  // Handle template creations
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName || !newTemplateSubject || !newTemplateBody) {
      showToast('All template fields are required', 'error');
      return;
    }

    const nextTemplate: EmailTemplate = {
      id: `temp_${Date.now()}`,
      name: newTemplateName,
      subject: newTemplateSubject,
      body: newTemplateBody
    };

    const updated = [...templates, nextTemplate];
    setTemplates(updated);
    localStorage.setItem('ats_templates', JSON.stringify(updated));

    setNewTemplateName('');
    setNewTemplateSubject('');
    setNewTemplateBody('');
    showToast(`Template "${nextTemplate.name}" created!`, 'success');
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('ats_templates', JSON.stringify(updated));
    showToast('Template deleted successfully', 'info');
  };

  // Handle Raw Text Parse submission via Gemini API
  const handleParseCVText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawResumeInput.trim()) {
      setParseError('Please insert or copy-paste raw resume contents.');
      return;
    }
    
    setParsingSpinner(true);
    setParseError(null);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeText: rawResumeInput,
          desiredRole: targetRoleForUpload
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'The backend was unable to parse the resume.');
      }

      const generated: Candidate = {
        id: `cand_${Date.now()}`,
        name: data.candidate.name || 'Unknown Candidate',
        email: data.candidate.email || '',
        phone: data.candidate.phone || '',
        role: data.candidate.role || targetRoleForUpload,
        experience: data.candidate.experience || 'Not specified',
        education: data.candidate.education || 'Not specified',
        skills: Array.isArray(data.candidate.skills) ? data.candidate.skills : [],
        summary: data.candidate.summary || 'Summary not provided.',
        resumeText: rawResumeInput,
        status: 'pending',
        aiReasoning: data.candidate.aiReasoning,
        matchPercentage: data.candidate.matchPercentage || 70,
        appliedDate: new Date().toISOString().split('T')[0]
      };

      // Add to tracking candidates
      const updated = [generated, ...candidates];
      updateCandidatesList(updated);
      
      // Clear inputs
      setRawResumeInput('');
      showToast(`Success! ${generated.name} parsed and added to review stack.`, 'success');
      
      // Switch back to review tab to preview applicant card
      setActiveTab('swipe');
    } catch (err: any) {
      setParseError(err.message || 'Gemini scanning error. Please make sure your server is online.');
    } finally {
      setParsingSpinner(false);
    }
  };

  // Inject a quick test CV demo text to easy parse testing
  const injectSampleResume = () => {
    setRawResumeInput(`ALAN TURING
London, UK | turing.a@talesoflogic.org | (555) 012-3456

SUMMARY
Distinguished computer scientist and cryptanalyst with extensive experience designing custom computing architectures, logic algorithms, and multi-threaded electro-mechanical systems.

EXPERIENCE
Chief Cryptanalyst | Government Code & Cypher School | 1939 - 1945
- Designed and built "The Bombe", an electromechanical decryption machine searching through cipher rotor parameters.
- Formulated the statistical "Banburismus" technique yielding rapid logic evaluations.

TECHNICAL SKILLS
- Cryptanalysis, Logical Theory, Machine Intelligence, Mathematics, Algorithm Optimization, Hardware Schematics, Python (Basic)

EDUCATION
PhD in Mathematical Logic | Princeton University | 1938`);
  };

  // Filter candidates who are pending
  const pendingCandidates = candidates.filter(c => c.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div id="toast-notification" className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl shadow-lg border text-sm transition-all duration-300 font-medium ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : toastMessage.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className={`p-1 rounded-full ${
            toastMessage.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200'
          }`}>
            <Check className="w-4 h-4" />
          </div>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header section styled professionally */}
      <header className="bg-slate-900 text-white border-b border-slate-950 shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-6 h-18 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/10">
              <Layers className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-xl flex items-center gap-1.5 text-white">
                PROHIRE <span className="text-emerald-400 font-medium text-sm tracking-widest uppercase py-0.5 px-1.5 bg-slate-800 rounded">ATS Workspace</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono -mt-0.5">Formal Triage & Evaluation Matrix</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('swipe')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'swipe'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              Triage Deck
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              Pipeline Repositories
            </button>
            <button
              onClick={() => setActiveTab('import-cv')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'import-cv'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FilePlus2 className="w-4 h-4 shrink-0" />
              Scan CV
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              Outreach Templates
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center min-h-0">
        
        {/* VIEW 1: SWIPE MODE DECK */}
        {activeTab === 'swipe' && (
          <div id="view-review" className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full min-h-0 py-2">
            
            {/* Top Info metrics bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 select-none bg-white p-3.5 rounded-xl border border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <Briefcase className="text-slate-500 w-4 h-4" />
                <span className="text-xs font-medium text-slate-500">Current Target Screening Focus:</span>
                <span className="text-xs font-bold text-slate-900 border-b border-dashed border-slate-400 pb-0.5">{searchRole}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
                  Pending CV Queue: <strong className="text-slate-900 font-mono">{pendingCandidates.length}</strong>
                </span>
                
                {/* Undo controller */}
                <button
                  onClick={handleUndo}
                  className="p-1 px-2.5 text-[10px] font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-100 bg-white border border-slate-200 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  title="Undo last selection card"
                >
                  <Undo2 className="w-3.5 h-3.5" /> UNDO
                </button>
              </div>
            </div>

            {/* Resume Card stack holder */}
            <div className="relative flex-1 min-h-[520px] max-h-[540px] flex items-center justify-center">
              {pendingCandidates.length > 0 ? (
                // Render only the top 2 cards for extreme performance (top card is active, 2nd card is hidden behind for depth context)
                pendingCandidates.slice(0, 2).reverse().map((candidate, idx, arr) => {
                  const isActive = idx === arr.length - 1;
                  return (
                    <ResumeCard 
                      key={candidate.id}
                      candidate={candidate}
                      onSwipe={(approved) => handleSwipe(approved, candidate.id)}
                      isActive={isActive}
                    />
                  );
                })
              ) : (
                <div id="no-pending-state" className="text-center p-8 border-2 border-dashed border-slate-200 bg-white rounded-2xl max-w-md mx-auto w-full py-16 flex flex-col items-center justify-center shadow-sm">
                  <CheckCircle className="w-14 h-14 text-emerald-500 mb-4 animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-900">Queue Screening Complete</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-[320px] leading-relaxed">
                     All applicant CV cards in this category are fully evaluated. You can switch to the pipeline lists to outreach.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-2 w-full px-8">
                    <button
                      onClick={() => setActiveTab('import-cv')}
                      className="w-full bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-800 cursor-pointer"
                    >
                      <FilePlus2 className="w-4 h-4" /> Scan a new CV
                    </button>
                    <button
                      onClick={() => {
                        // Reset mock data to let user demo again
                        updateCandidatesList(initialCandidates);
                        showToast('Demonstration candidates refilled to review queue.', 'success');
                      }}
                      className="w-full bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Refill Mock Queue
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Control Swiper buttons as requested (large Red and Green round buttons) */}
            <div className="flex justify-center items-center gap-8 py-5 shrink-0 select-none">
              <button
                onClick={() => handleSwipe(false)}
                disabled={pendingCandidates.length === 0}
                className="w-18 h-18 rounded-full bg-white border border-rose-200 text-rose-500 hover:text-white hover:bg-rose-500 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 group"
                id="btn-reject-card"
                title="Reject candidate (Swipe Left / Left Arrow)"
              >
                <X className="w-8 h-8 stroke-[2.5px] transition-transform group-hover:rotate-[-12deg]" />
              </button>

              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold select-none">
                Decision Matrix
              </span>

              <button
                onClick={() => handleSwipe(true)}
                disabled={pendingCandidates.length === 0}
                className="w-18 h-18 rounded-full bg-white border border-emerald-200 text-emerald-500 hover:text-white hover:bg-emerald-500 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 group"
                id="btn-approve-card"
                title="Shortlist applicant (Swipe Right / Right Arrow)"
              >
                <Check className="w-8 h-8 stroke-[2.5px] transition-transform group-hover:scale-110" />
              </button>
            </div>

          </div>
        )}

        {/* VIEW 2: DATABASE VIEW - ACCEPTED/REJECTED LISTS */}
        {activeTab === 'database' && (
          <div id="view-database" className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 select-none">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Database className="w-5.5 h-5.5 text-slate-800" /> Executive Talent Pipeline Databases
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Secure, local repositories categorized by screening decision state outcomes</p>
              </div>
              
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-500">Filter role display:</span>
                <select 
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className="bg-white border border-slate-200 text-xs text-slate-800 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                  <option value="Senior Backend / Cloud Specialist">Senior Backend / Cloud Specialist</option>
                  <option value="Technical Product Manager">Technical Product Manager</option>
                  <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                  <option value="Database Engineer & Security Administrator">Database Engineer & Security Administrator</option>
                  <option value="All Scanned Roles">All Scanned Roles</option>
                </select>
              </div>
            </div>

            {/* Render separation lists panel */}
            <HistoryPanel 
              candidates={searchRole === 'All Scanned Roles' ? candidates : candidates.filter(c => c.role === searchRole || searchRole === 'All Scanned Roles')}
              onContactClick={handleContactClick}
              onClearRejected={handleClearRejected}
              onDeleteCandidate={handleDeleteCandidate}
            />
          </div>
        )}

        {/* VIEW 3: SCAN A NEW PORTFOLIO / RESUME */}
        {activeTab === 'import-cv' && (
          <div id="view-scan" className="max-w-2xl mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="border-b border-slate-100 pb-5 mb-5 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <FilePlus2 className="w-5.5 h-5.5 text-slate-800" /> AI CV Extraction Scanner
                </h2>
                <p className="text-xs text-slate-500 mt-1">Copy-paste plain CV texts to extract contacts, analyze eligibility metrics, and score match fits with Gemini</p>
              </div>
              <button
                onClick={injectSampleResume}
                className="px-3 py-1 bg-slate-100 font-bold border border-slate-200 hover:bg-slate-200 text-[11px] text-slate-800 rounded-md transition-colors cursor-pointer"
                title="Fill a demonstration cv automatically"
              >
                Incorporate Sample Resume
              </button>
            </div>

            {parseError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Parsing Failure</span>
                  {parseError}
                </div>
              </div>
            )}

            <form onSubmit={handleParseCVText} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Desired Screening Position</label>
                  <select
                    value={targetRoleForUpload}
                    onChange={(e) => setTargetRoleForUpload(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-950"
                  >
                    <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                    <option value="Senior Backend / Cloud Specialist">Senior Backend / Cloud Specialist</option>
                    <option value="Technical Product Manager">Technical Product Manager</option>
                    <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                    <option value="Database Engineer & Security Administrator">Database Engineer & Security Administrator</option>
                  </select>
                  <p className="text-[10px] text-slate-400">Gemini will compute percentage compatibility index relative to this exact role.</p>
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Gemini extracts full names, exact email IDs, contact numbers, and creates a matched scoring matrix.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Plain text Resume/CV content</label>
                <textarea
                  value={rawResumeInput}
                  onChange={(e) => setRawResumeInput(e.target.value)}
                  placeholder="Paste or import full resume string details here..."
                  rows={10}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-950"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={parsingSpinner}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                >
                  {parsingSpinner ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin mr-1" />
                      Gemini Agent Analyzing Credentials Match & Scanning Email ID...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
                      Evaluate & Screen Candidate with Gemini AI
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 4: MANAGE outreach TEMPLATES */}
        {activeTab === 'templates' && (
          <div id="view-templates" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[520px]">
              <div className="border-b border-slate-100 pb-3 mb-4 shrink-0">
                <h3 className="font-bold text-slate-900 text-base">Create Outbound Template</h3>
                <p className="text-slate-400 text-xs">Save generic generic templates for instant candidate outreach mailing</p>
              </div>

              <form onSubmit={handleCreateTemplate} className="flex-1 flex flex-col justify-between min-h-0 space-y-3">
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Internal Template Name</label>
                    <input
                      type="text"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="e.g. Technical Interview Call or Rejection Letter"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Outbound Email Subject</label>
                    <input
                      type="text"
                      value={newTemplateSubject}
                      onChange={(e) => setNewTemplateSubject(e.target.value)}
                      placeholder="e.g. Schedule Request - your application"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Message Body Content</label>
                    <textarea
                      value={newTemplateBody}
                      onChange={(e) => setNewTemplateBody(e.target.value)}
                      placeholder="Dear [Name],\n\nUse [Name] and [Role] as dynamic variable replacement values inside body..."
                      rows={6}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 shrink-0">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Save Template
                  </button>
                </div>
              </form>
            </div>

            {/* List panel */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[520px]">
              <div className="border-b border-slate-100 pb-3 mb-4 shrink-0">
                <h3 className="font-bold text-slate-900 text-base">Stored Templates Repository</h3>
                <p className="text-slate-400 text-xs">These templates instantly dynamically map [Name] and [Role] placeholders when drafting outbound emails</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {templates.map(template => (
                  <div key={template.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors relative">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <span className="bg-slate-200 text-slate-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-300">
                          {template.id === 'outreach' || template.id === 'rejection' ? 'System Default' : 'Custom Saved'}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1.5">{template.name}</h4>
                      </div>

                      {template.id !== 'outreach' && template.id !== 'rejection' && (
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 px-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-md transition-colors cursor-pointer"
                          title="Delete template configuration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-white border border-slate-100 p-3 rounded-lg leading-relaxed">
                      <p><strong className="text-slate-800">Subject:</strong> {template.subject}</p>
                      <hr className="border-slate-100 my-1" />
                      <p className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-500">{template.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* OUTBOUND EMAIL OUTREACH MODAL */}
      {outreachModalOpen && contactCandidate && (
        <div id="outreach-email-modal" className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500 text-slate-950 rounded-lg">
                  <Mail className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base leading-tight">Candidate Direct Dispatch</h3>
                  <p className="text-[10px] text-slate-400">SMTP Server Delivery Simulator Engine</p>
                </div>
              </div>
              <button 
                onClick={() => setOutreachModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body form */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              
              {sendSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2.5 leading-relaxed tracking-tight">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="font-bold">{sendSuccessMessage}</div>
                </div>
              )}

              {/* Recipient Coordinates Summary */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-none">
                <div>
                  <span className="text-slate-400 block mb-1">CANDIDATE NAME</span>
                  <span className="font-bold text-slate-900">{contactCandidate.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">SCANNED EMAIL COORD</span>
                  <span className="font-bold text-slate-900 font-mono text-[11px] select-text">{contactCandidate.email || 'No email scanned'}</span>
                </div>
              </div>

              {/* Template selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Outbound Generic Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelectionChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-slate-950"
                  disabled={emailSending}
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Direct Mail inputs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Outreach Subject Line</label>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Subject of outreach..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                  disabled={emailSending}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Draft Message Content</label>
                <textarea
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  placeholder="Draft mail copy..."
                  rows={8}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950 font-mono text-[11px] leading-relaxed"
                  disabled={emailSending}
                />
              </div>

            </div>

            {/* Modal dispatch footer */}
            <div className="bg-slate-50 border-t border-slate-100 p-4.5 flex gap-3 shrink-0">
              <button
                onClick={() => setOutreachModalOpen(false)}
                className="w-full border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                disabled={emailSending}
              >
                Cancel Draft & Return
              </button>
              <button
                onClick={handleSendEmail}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                disabled={emailSending || !contactCandidate.email}
              >
                {emailSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Transmit Email
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer credits and information */}
      <footer className="bg-slate-900 text-slate-400 py-4.5 border-t border-slate-950 select-none shrink-0 text-center text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 ProHire Applicant Tracking Workplace. All rights reserved.</p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Server Pipeline: <strong className="text-emerald-400 font-mono">127.0.0.1:3000</strong></span>
            <span>|</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Real-time Gemini 3.5 Assistant Coordinated</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
