import { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Menu } from 'lucide-react';
import { cn } from '../utils/cn';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen bg-slate-100 text-slate-900 font-sans antialiased overflow-hidden flex">
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:flex lg:flex-col",
          sidebarOpen ? "translate-x-0 flex flex-col" : "-translate-x-full hidden"
        )}
      >
        <Sidebar />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen relative z-0 lg:pl-72 w-full h-full">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white/70 backdrop-blur-md px-4 py-4 sm:px-6 lg:hidden border-b border-white/40">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 hover:text-slate-900 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-slate-900 tracking-tight">
            WeatherGuard Admin
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Navbar />
          <main className="flex-1 overflow-y-auto w-full">
            <div className="px-4 py-8 sm:px-6 lg:px-10 max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
