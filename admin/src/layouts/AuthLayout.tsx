import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background is handled by index.css body background */}
      <div className="relative w-full max-w-md z-10 glass-panel-heavy rounded-3xl p-2 shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
}
