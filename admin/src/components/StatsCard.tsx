import type { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("relative p-6 overflow-hidden group hover:bg-white/60 transition-colors", className)}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-500 tracking-tight">{title}</p>
          <p className="mt-1.5 text-3xl font-bold tracking-tight text-slate-800">{value}</p>
        </div>
        <div className="rounded-[14px] bg-white/50 border border-white/60 p-2.5 text-slate-600 shadow-sm group-hover:text-slate-900 group-hover:bg-slate-100/50 transition-colors">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span
            className={cn(
              "font-semibold inline-flex items-center gap-1",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.isPositive ? (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10V2M6 2L2 6M6 2L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2V10M6 10L2 6M6 10L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
            {trend.value}
          </span>
          <span className="ml-1.5 text-slate-500 font-medium">from last month</span>
        </div>
      )}
    </Card>
  );
}
