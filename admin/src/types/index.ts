export type ApprovalStatus = 'INCOMPLETE' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type AlertFrequency = 'EVERY_HOUR' | 'EVERY_3_HOURS' | 'EVERY_6_HOURS' | 'SEVERE_ONLY';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  approvalStatus: ApprovalStatus;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  alertFrequency?: AlertFrequency;
  telegramConnected: boolean;
  createdAt?: string; 
  updatedAt?: string; 
}

export interface DashboardStats {
  pendingRequests: number;
  approvedUsers: number;
  totalUsers: number;
}
