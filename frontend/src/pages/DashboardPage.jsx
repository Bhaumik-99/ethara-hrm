import { useEffect, useState } from 'react';
import { getDashboard } from '@/lib/api';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const statCards = [
  { key: 'total_employees', label: 'Total Employees', icon: Users, color: 'bg-[#1A4D2E]' },
  { key: 'present_today', label: 'Present Today', icon: UserCheck, color: 'bg-emerald-600' },
  { key: 'absent_today', label: 'Absent Today', icon: UserX, color: 'bg-red-500' },
  { key: 'unmarked_today', label: 'Unmarked', icon: Clock, color: 'bg-amber-500' },
];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboard();
      setData(res.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div data-testid="dashboard-loading" className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="dashboard-error" className="flex flex-col items-center justify-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <UserX className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error}</p>
          <button
            data-testid="dashboard-retry-btn"
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#1A4D2E] rounded-md hover:bg-[#143A22] transition-colors active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page" className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#1A4D2E] tracking-tight">Dashboard</h1>
        <p className="text-[#71717A] text-sm mt-1">Overview of your workforce at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={card.key}
            data-testid={`stat-card-${card.key}`}
            className={`animate-fade-in-up stagger-${idx + 1} bg-white border border-[#E4E4E7] rounded-lg p-6 hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#71717A]">{card.label}</span>
              <div className={`${card.color} rounded-md p-2`}>
                <card.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#18181B] tracking-tight">
              {data?.[card.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div
          data-testid="department-breakdown"
          className="animate-fade-in-up bg-white border border-[#E4E4E7] rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-[#18181B] mb-4">Department Breakdown</h2>
          {data?.departments?.length > 0 ? (
            <div className="space-y-3">
              {data.departments.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-[#3F3F46]">{dept.department}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-[#F4F4F5] rounded-full h-2">
                      <div
                        className="bg-[#1A4D2E] h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((dept.count / (data?.total_employees || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#18181B] w-8 text-right">{dept.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#A1A1AA] py-8 text-center">No departments yet</p>
          )}
        </div>

        {/* Recent Activity */}
        <div
          data-testid="recent-activity"
          className="animate-fade-in-up bg-white border border-[#E4E4E7] rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-[#18181B] mb-4">Recent Activity</h2>
          {data?.recent_activity?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Employee</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recent_activity.map((record, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-sm font-medium">{record.full_name}</TableCell>
                    <TableCell className="text-sm text-[#71717A]">{record.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-[#A1A1AA] py-8 text-center">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
