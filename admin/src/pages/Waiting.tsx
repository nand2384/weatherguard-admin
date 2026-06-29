import { CheckCircle2, Clock, XCircle, LogOut } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

interface WaitingProps {
  isRejected?: boolean;
}

export function Waiting({ isRejected = false }: WaitingProps) {
  const { logout } = useAuth();
  return (
    <div className="glass-panel rounded-2xl w-full max-w-md p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl relative">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm text-white mb-6 ${isRejected ? 'bg-red-500' : 'bg-amber-500'}`}>
        {isRejected ? <XCircle size={32} /> : <Clock size={32} />}
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-800">
        {isRejected ? 'Access Request Rejected' : 'Access Request Submitted'}
      </h2>
      <p className="mt-4 text-sm text-slate-500 font-medium max-w-sm">
        {isRejected 
          ? 'Unfortunately, your request for access to WeatherGuard has been declined by an administrator.'
          : 'Your request has been submitted successfully. An administrator will review your request. You will receive a Telegram notification once your account has been approved.'}
      </p>

      {!isRejected && (
        <div className="w-full mt-8 bg-white/40 backdrop-blur-md rounded-2xl p-5 border border-white/60 space-y-3 text-sm font-semibold text-slate-700 text-left">
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle2 size={18} />
            <span>Google Account Connected</span>
          </div>
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle2 size={18} />
            <span>Telegram Connected</span>
          </div>
          <div className="flex items-center gap-3 text-amber-500">
            <Clock size={18} />
            <span>Waiting For Admin Approval</span>
          </div>
        </div>
      )}

      <div className="w-full mt-8 space-y-3">
        <Button variant="secondary" className={`w-full h-11 bg-slate-100 ${isRejected ? 'text-red-400' : 'text-slate-400'}`} disabled>
          {isRejected ? 'Access Denied' : 'Waiting for Approval'}
        </Button>
        <Button variant="outline" className="w-full h-11 text-slate-600 hover:text-slate-900" onClick={logout}>
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
