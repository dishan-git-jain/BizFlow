import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';
import { TaskModal } from '../components/tasks/TaskModal';
import { OnboardingModal } from '../components/common/OnboardingModal';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex selection:bg-slate-900 selection:text-white">
      {/* Onboarding Wizard Modal */}
      <OnboardingModal />

      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Navbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ onOpenCreateTask: () => setIsCreateTaskOpen(true) }} />
        </main>
      </div>

      {/* Global Quick Create Task Modal */}
      <TaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />
    </div>
  );
};
