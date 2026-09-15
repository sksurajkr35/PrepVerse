import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { CoolBackdrop } from './components/CoolBackdrop';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DSAPracticePage } from './pages/DSAPracticePage';
import { CodeArenaPage } from './pages/CodeArenaPage';
import { AptitudePage } from './pages/AptitudePage';
import { MockTestsPage } from './pages/MockTestsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CoreCSPage } from './pages/CoreCSPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { AIMentorPage } from './pages/AIMentorPage';
import { StudyPlanPage } from './pages/StudyPlanPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (activeTab === 'landing' || !isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
        <CoolBackdrop />
        <div className="relative z-10">
          <LandingPage />
        </div>
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'dsa':
        return <DSAPracticePage />;
      case 'compiler':
        return <CodeArenaPage />;
      case 'aptitude':
        return <AptitudePage />;
      case 'mock-tests':
        return <MockTestsPage />;
      case 'companies':
        return <CompaniesPage />;
      case 'core-cs':
        return <CoreCSPage />;
      case 'interview':
        return <InterviewPrepPage />;
      case 'ai-mentor':
        return <AIMentorPage />;
      case 'study-plan':
        return <StudyPlanPage />;
      case 'resume':
      case 'resume-builder':
        return <ResumeBuilderPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col selection:bg-teal-500 selection:text-white transition-colors duration-200">
      <CoolBackdrop />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation Navbar */}
        <div className="print:hidden">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 gap-6 relative print:p-0 print:max-w-none">
          {/* Sidebar Navigation */}
          <div className="print:hidden shrink-0">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Main Content Viewport */}
          <main className="flex-1 min-w-0 overflow-y-auto pr-1 custom-scrollbar pb-12 print:overflow-visible print:p-0">
            {renderActivePage()}
          </main>
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
