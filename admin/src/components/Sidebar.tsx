import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, CloudLightning, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['USER'] },
  { name: 'Pending Requests', href: '/admin?tab=pending', icon: Users, roles: ['ADMIN'] },
  { name: 'Approved Users', href: '/admin?tab=approved', icon: UserCheck, roles: ['ADMIN'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const visibleNavigation = navigation.filter((item) =>
    user?.role === 'ADMIN' ? item.roles.includes('ADMIN') : item.roles.includes('USER')
  );

  return (
    <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-white/60 backdrop-blur-3xl border-r border-white/60 p-5 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-full">
      <div className="flex shrink-0 items-center gap-3 px-2 mt-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-slate-900 shadow-sm text-white">
          <CloudLightning size={22} />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">WeatherGuard</span>
      </div>
      
      <nav className="flex flex-1 flex-col mt-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-2">
              {visibleNavigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        isActive
                          ? 'bg-white/60 text-slate-900 shadow-sm border border-white/40'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/30 border border-transparent',
                        'group flex gap-x-3 rounded-2xl p-3 text-sm leading-6 font-semibold transition-all'
                      )
                    }
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", "opacity-80")} aria-hidden="true" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <div className="flex items-center justify-between rounded-2xl bg-white/40 p-3 border border-white/50 backdrop-blur-md">
              <div className="flex flex-col px-2">
                <span className="text-sm font-semibold text-slate-800">{user?.name || 'WeatherGuard'}</span>
              </div>
              <button
                className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-white/50"
                onClick={logout}
              >
                <LogOut size={18} />
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
