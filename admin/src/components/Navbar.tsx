import { Bell, Search } from 'lucide-react';
import { Dropdown, DropdownItem } from './Dropdown';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/30 bg-white/30 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
      <div className="flex-1 flex justify-start lg:justify-center max-w-lg lg:mx-auto">
        <form className="relative flex w-full items-center" action="#" method="GET">
          <div className="flex w-full items-center relative group">
             <Search size={16} className="absolute left-3 text-slate-500 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
             <input 
               placeholder="Search requests..." 
               className="h-9 w-full rounded-full border border-white/60 bg-white/40 pl-10 pr-12 text-sm text-slate-900 placeholder:text-slate-500 focus:border-white focus:bg-white/70 focus:outline-none focus:ring-4 focus:ring-slate-900/5 shadow-sm transition-all"
             />
             <div className="absolute right-2 flex items-center gap-1 rounded-full border border-white/60 bg-white/50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
               <span className="text-xs">⌘</span>K
             </div>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-end gap-x-4 w-24 lg:w-48">
        <button type="button" className="p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-full hover:bg-white/50">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>

        <Dropdown
          trigger={
            <div className="flex items-center px-3 py-1.5 hover:bg-white/50 rounded-full transition-colors cursor-pointer border border-transparent hover:border-white/40 shadow-sm text-sm font-medium text-slate-700">
              {user?.name || 'User'}
            </div>
          }
        >
          <div className="px-4 py-3 border-b border-slate-100/50 bg-white/80">
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
          </div>
          <DropdownItem onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50/50">
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
