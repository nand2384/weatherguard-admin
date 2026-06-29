import React from 'react';
import { cn } from '../utils/cn';

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md shadow-sm">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b border-white/40 bg-white/40 backdrop-blur-md", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b border-white/30 transition-colors hover:bg-white/40 data-[state=selected]:bg-white/50", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("h-11 px-4 text-left align-middle text-[11px] font-bold uppercase tracking-wider text-slate-500 [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  );
}
