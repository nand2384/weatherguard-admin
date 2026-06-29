import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, Activity } from 'lucide-react';

import { StatsCard } from '../components/StatsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Loader } from '../components/Loader';
import { Modal } from '../components/Modal';

import { api } from '../services/api';
import type { DashboardStats, User } from '../types';

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pending';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, pendingData, approvedData] = await Promise.all([
          api.getStats(),
          api.getPendingUsers(),
          api.getApprovedUsers()
        ]);
        setStats(statsData);
        setPendingUsers(pendingData);
        setApprovedUsers(approvedData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (userId: string) => {
    setIsApproving(userId);
    try {
      await api.approveUser(userId);
      const [pendingData, approvedData] = await Promise.all([
        api.getPendingUsers(),
        api.getApprovedUsers()
      ]);
      setPendingUsers(pendingData);
      setApprovedUsers(approvedData);
      setStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          pendingRequests: Math.max(0, prev.pendingRequests - 1),
          approvedUsers: prev.approvedUsers + 1,
        };
      });
    } catch (error) {
      console.error("Failed to approve user", error);
    } finally {
      setIsApproving(null);
    }
  };

  const handleReject = async (userId: string) => {
    setIsRejecting(userId);
    try {
      await api.rejectUser(userId);
      const pendingData = await api.getPendingUsers();
      setPendingUsers(pendingData);
      setStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          pendingRequests: Math.max(0, prev.pendingRequests - 1),
        };
      });
    } catch (error) {
      console.error("Failed to reject user", error);
    } finally {
      setIsRejecting(null);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader size={32} /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {activeTab === 'pending' ? 'Pending Requests' : 'Approved Users'}
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            {activeTab === 'pending'
              ? 'Manage pending user access requests.'
              : 'View and manage approved active users.'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <>
            {activeTab === 'pending' && (
              <div className="space-y-6">
                  {stats && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <StatsCard title="Pending Requests" value={stats.pendingRequests} icon={<Users size={20} />} trend={{ value: '12%', isPositive: false }} />
                      <StatsCard title="Approved Users" value={stats.approvedUsers} icon={<UserCheck size={20} />} trend={{ value: '4%', isPositive: true }} />
                      <StatsCard title="Total Users" value={stats.totalUsers} icon={<Activity size={20} />} />
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-sm">
                    <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-4">Pending Approval</h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Telegram</TableHead>
                          <TableHead>Requested</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-slate-900">{user.name}</span>
                                  <span className="text-xs text-slate-500">{user.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600">{user.city}</TableCell>
                            <TableCell className="text-slate-600">{user.alertFrequency}</TableCell>
                            <TableCell>
                              <Badge variant={user.telegramConnected ? 'approved' : 'pending'}>
                                {user.telegramConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(user)}
                                >
                                  Details
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(user.id)}
                                  disabled={isApproving === user.id}
                                >
                                  {isApproving === user.id ? <Loader size={16} className="text-white" /> : 'Approve'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                  onClick={() => handleReject(user.id)}
                                  disabled={isRejecting === user.id}
                                >
                                  {isRejecting === user.id ? <Loader size={16} /> : 'Reject'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {pendingUsers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                              No pending requests.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {activeTab === 'approved' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-800">Approved Users</h2>
                      <p className="text-sm text-slate-500 mt-1">Users currently active in the system.</p>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Telegram</TableHead>
                        <TableHead>Approved At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-900">{user.name}</span>
                                <span className="text-xs text-slate-500">{user.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">{user.city}</TableCell>
                          <TableCell className="text-slate-600">{user.alertFrequency}</TableCell>
                          <TableCell>
                            <Badge variant={user.telegramConnected ? 'approved' : 'pending'}>
                              {user.telegramConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                      {approvedUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                            No approved users.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

          </>
        </motion.div>
      </AnimatePresence>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-800">{selectedUser.name}</h4>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-slate-600">City</p>
                <p className="text-slate-800 font-medium">{selectedUser.city}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-600">Alert Frequency</p>
                <p className="text-slate-800 font-medium">{selectedUser.alertFrequency}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-600">Telegram Status</p>
                <Badge variant={selectedUser.telegramConnected ? 'approved' : 'pending'} className="mt-1">
                  {selectedUser.telegramConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                </Badge>
              </div>
              <div>
                <p className="font-semibold text-slate-600">Requested Date</p>
                <p className="text-slate-800 font-medium">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
