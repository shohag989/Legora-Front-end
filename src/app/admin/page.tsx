"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import axiosSecure from '@/services/axiosSecure';
import toast from 'react-hot-toast';
import { 
  FiUsers, 
  FiShield, 
  FiLayers, 
  FiShoppingBag, 
  FiTrendingUp, 
  FiSearch, 
  FiTrash2, 
  FiUserCheck 
} from 'react-icons/fi';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalDesigners: number;
  totalVisitors: number;
  totalServices: number;
  totalOrders: number;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: 'visitor' | 'designer' | 'admin';
  photoURL?: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'messages'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actioningUserId, setActioningUserId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, messagesRes] = await Promise.all([
        axiosSecure.get('/admin/stats'),
        axiosSecure.get('/admin/users'),
        axiosSecure.get('/admin/messages')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setMessages(messagesRes.data);
    } catch (error: any) {
      console.error('Failed to load admin console data:', error);
      toast.error('Access denied or failed to load administration data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!window.confirm("Are you sure you want to delete/archive this message?")) return;
    try {
      setLoading(true);
      await axiosSecure.delete(`/admin/messages/${msgId}`);
      toast.success("Message deleted successfully.");
      setMessages(prev => prev.filter(m => m._id !== msgId));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete message.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'visitor' | 'designer' | 'admin') => {
    try {
      setActioningUserId(userId);
      const response = await axiosSecure.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated successfully to ${newRole}!`);
      
      // Update local state
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: response.data.role } : u));
      
      // Refresh stats in background
      const statsRes = await axiosSecure.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setActioningUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete user "${userName}"? This will permanently remove their profile, listed gigs, and related orders!`)) {
      return;
    }

    try {
      setActioningUserId(userId);
      await axiosSecure.delete(`/admin/users/${userId}`);
      toast.success('User and associated data removed successfully.');
      
      // Update local state
      setUsers(prev => prev.filter(u => u._id !== userId));
      
      // Refresh stats
      const statsRes = await axiosSecure.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to remove user.');
    } finally {
      setActioningUserId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-background font-sans text-text overflow-hidden relative">
        {/* Aesthetic Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[950px] bg-gradient-to-b from-indigo-500/10 via-brand-blue/15 to-transparent -z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[950px] bg-grid-pattern -z-10 opacity-70 pointer-events-none" />
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-left">
          
          {/* Header */}
          <div className="mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-100/60 border border-indigo-200 px-4 py-1.5 rounded-full text-indigo-850 text-xs font-semibold">
              <FiShield className="w-3.5 h-3.5 text-indigo-600" />
              Administrative Control Console
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Platform <span className="text-indigo-650">Administration.</span>
            </h1>
            <p className="text-base text-slate-500 leading-relaxed max-w-xl font-semibold">
              Oversee users activity, manage roles, adjust permissions, and view global application statistics.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-400">Loading admin console...</span>
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {/* Total Users */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500">
                      <FiUsers className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{stats.totalUsers}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Users</div>
                    </div>
                  </div>

                  {/* Designers */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
                      <FiUserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{stats.totalDesigners}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Designers</div>
                    </div>
                  </div>

                  {/* Visitors */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
                      <FiUsers className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{stats.totalVisitors}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Visitors</div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                      <FiLayers className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{stats.totalServices}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Listed Gigs</div>
                    </div>
                  </div>

                  {/* Orders */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600">
                      <FiShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{stats.totalOrders}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Orders</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-3 px-6 text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'border-indigo-500 text-indigo-650'
                      : 'border-transparent text-slate-400 hover:text-slate-650'
                  }`}
                >
                  User Registry ({users.length})
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`py-3 px-6 text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'messages'
                      ? 'border-indigo-500 text-indigo-650'
                      : 'border-transparent text-slate-400 hover:text-slate-650'
                  }`}
                >
                  Contact Messages ({messages.length})
                </button>
              </div>

              {/* Users Management Section */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-lg shadow-slate-100/50 space-y-6">
                  
                  {/* Search Bar & Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 leading-none">User Registry</h2>
                      <span className="text-xs font-semibold text-slate-400">Modify accounts permission roles or terminate access</span>
                    </div>
                    <div className="relative max-w-sm w-full">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiSearch className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-full border border-slate-350 bg-slate-50/40 py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-bold transition-all"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  {filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-450 text-[10px] font-black uppercase tracking-wider">
                            <th className="pb-3">User Profile</th>
                            <th className="pb-3">Sign Up Date</th>
                            <th className="pb-3">Status / Role</th>
                            <th className="pb-3">Change Role</th>
                            <th className="pb-3 text-right">Delete Account</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-600">
                          {filteredUsers.map((u) => (
                            <tr key={u._id} className="hover:bg-slate-50/30 transition-colors">
                              {/* Avatar & Name */}
                              <td className="py-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-slate-100 border border-slate-200">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0F172A&color=fff`} 
                                    alt={u.name}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0F172A&color=fff`;
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900">{u.name}</div>
                                  <div className="text-[10px] text-slate-400 font-bold">{u.email}</div>
                                </div>
                              </td>

                              {/* Sign Up Date */}
                              <td className="py-4 text-xs font-bold text-slate-500">
                                {new Date(u.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </td>

                              {/* Status Badge */}
                              <td className="py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${
                                  u.role === 'admin' 
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                                    : u.role === 'designer' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                  {u.role}
                                </span>
                              </td>

                              {/* Role Select Dropdown */}
                              <td className="py-4">
                                <select
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value as any)}
                                  disabled={actioningUserId === u._id}
                                  className="block rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer disabled:opacity-60"
                                >
                                  <option value="visitor">Visitor</option>
                                  <option value="designer">Designer</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>

                              {/* Delete Action Button */}
                              <td className="py-4 text-right">
                                <button
                                  onClick={() => handleDeleteUser(u._id, u.name)}
                                  disabled={actioningUserId === u._id}
                                  className="p-2 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-60"
                                  title="Remove User Profile"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400 font-medium">
                      No users matching your search criteria.
                    </div>
                  )}

                </div>
              )}

              {/* Contact Messages Section */}
              {activeTab === 'messages' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-lg shadow-slate-100/50 space-y-6">
                  <div className="border-b border-slate-100 pb-5 mb-6">
                    <h2 className="text-xl font-extrabold text-slate-900 leading-none">Contact Inquiries</h2>
                    <span className="text-xs font-semibold text-slate-400">View and archive messages sent by visitors and designers</span>
                  </div>

                  {messages.length > 0 ? (
                    <div className="space-y-6">
                      {messages.map((msg) => (
                        <div key={msg._id} className="border border-slate-150 rounded-2xl p-6 hover:border-indigo-200 transition-all bg-slate-50/20 text-left relative group">
                          {/* Trash button */}
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Message"
                          >
                            <FiTrash2 className="w-4.5 h-4.5" />
                          </button>

                          <div className="space-y-3.5 pr-10">
                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-bold">
                              <span className="text-slate-900 font-black text-sm">{msg.name}</span>
                              <span className="text-slate-400 font-medium">({msg.email})</span>
                              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                              <span className="text-indigo-650 uppercase tracking-widest text-[10px]">{msg.projectCategory}</span>
                              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                              <span className="text-slate-400 font-semibold">
                                {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Message text */}
                            <div className="bg-white border border-slate-100 rounded-xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium shadow-sm">
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 font-medium">
                      No contact messages received yet.
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}
