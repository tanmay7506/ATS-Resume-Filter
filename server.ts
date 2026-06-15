import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API Key lazy-initialization pattern
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API endpoint to parse resumes with Gemini
app.post('/api/parse-resume', async (req, res) => {
  try {
    const { resumeText, desiredRole } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    const ai = getGenAI();
    const prompt = `Please carefully search, scan, and parse the following CV/resume text.
Compare the applicant's experience, skills, and background against the target desired role: "${desiredRole || 'Software Engineer'}".

Extract and evaluate:
1. Full Name
2. Contact Email (scanned directly from the file content)
3. Phone number
4. Primary professional role/title
5. Total years of experience (e.g. "5 Years")
6. Highest education degree achieved
7. Key professional technical skills (extract up to 10 core keywords)
8. A professional 1-sentence executive summary of the candidate
9. AI match suitability rating (percentage integer between 30 and 100)
10. AI candidate evaluation comments (a constructive paragraph highlighting how their expertise fits the desired position, why the score is given, and clear recommendations)

Resume Content:
"""
${resumeText}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a professional HR Principal Technical Recruiter. You rigorously parse and analyze resumes and CVs to screen applicants for suitability in technical and corporate job positions. You always extract exact email addresses and telephone numbers present in the CV, never make them up.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'The candidate full name.' },
            email: { type: Type.STRING, description: 'The email address scanned from the resume. Maximize efforts to locate it. Return empty string if not found.' },
            phone: { type: Type.STRING, description: 'The phone number scanned from the resume. Return empty string if not found.' },
            role: { type: Type.STRING, description: 'Current or suitable title.' },
            experience: { type: Type.STRING, description: 'E.g., "5 Years" or "8 Years".' },
            education: { type: Type.STRING, description: 'E.g., "B.S. in Computer Science, Stanford University".' },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of up to 10 prominent technical/professional skill keywords.'
            },
            summary: { type: Type.STRING, description: 'A robust one-sentence summary of the candidate talent profile.' },
            aiReasoning: { type: Type.STRING, description: ' Rationale, matches, mismatch details, and professional hiring evaluation statement.' },
            matchPercentage: { type: Type.INTEGER, description: 'Calculated suitability score from 30 to 100 based on core skills and targeted role.' }
          },
          required: [
            'name', 'email', 'phone', 'role', 'experience', 'education', 'skills', 'summary', 'aiReasoning', 'matchPercentage'
          ]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Emply response received from Gemini.');
    }

    const parsedData = JSON.parse(textOutput.trim());
    res.json({ success: true, candidate: parsedData });
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error while analyzing the CV. Make sure your secrets configuration is correct.' 
    });
  }
});

// 2. API endpoint to send (simulate) emails from ATS
app.post('/api/send-email', (req, res) => {
  const { toEmail, applicantName, subject, body } = req.body;
  if (!toEmail || !subject || !body) {
    return res.status(400).json({ error: 'Recipient email, subject and body are required.' });
  }

  // Simulate server sending process
  console.log('--------------------------------------------------');
  console.log(`[SMTP SIMULATOR] Outbound email queued to: ${toEmail}`);
  console.log(`[SMTP SIMULATOR] For Candidate: ${applicantName}`);
  console.log(`[SMTP SIMULATOR] Subject: ${subject}`);
  console.log(`[SMTP SIMULATOR] Body:\n${body}`);
  console.log('--------------------------------------------------');

  setTimeout(() => {
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      smtpStatus: '250 OK Message accepted for delivery',
      message: `Direct recruitment dispatch successfully routed to ${toEmail}`
    });
  }, 1000);
});

// Serve frontend static assets from 'dist' in production, utilize Vite in development
const PORT = 3000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Let Vite handle frontend routing & hot module reloading in development
  import('vite').then((viteModule) => {
    viteModule.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    }).then((vite) => {
      app.use(vite.middlewares);
      console.log(`[ATS Server] Dev Mode: Vite dev tools mounted.`);
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ATS Server] Workspace Server live at http://localhost:${PORT}`);
});
