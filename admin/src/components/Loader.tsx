import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface LoaderProps {
  className?: string;
  size?: number;
}

export function Loader({ className, size = 24 }: LoaderProps) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center", className)}>
      <Loader2 size={size} className="animate-spin text-emerald-500" />
    </div>
  );
}
