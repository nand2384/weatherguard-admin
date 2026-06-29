import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-slate-700">Page not found</h2>
        <p className="mt-2 text-sm text-slate-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button className="mt-8" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
