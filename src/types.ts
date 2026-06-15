export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  education: string;
  skills: string[];
  summary: string;
  resumeText: string;
  status: 'pending' | 'accepted' | 'rejected';
  aiReasoning?: string;
  matchPercentage?: number;
  appliedDate: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface SendEmailPayload {
  toEmail: string;
  applicantName: string;
  subject: string;
  body: string;
}
