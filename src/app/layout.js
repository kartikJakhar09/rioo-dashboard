import './globals.css';
import { LeadProvider } from '@/context/LeadContext';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Rioo Revenue Engine — Lead Dashboard',
  description:
    'AI-powered lead analytics dashboard for the Rioo Revenue Engine. Track pipeline stages, qualification scores, and outreach performance in real-time.',
  keywords: 'lead generation, CRM, pipeline, AI qualification, analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LeadProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        </LeadProvider>
      </body>
    </html>
  );
}
