import { useEffect, useState, useCallback } from 'react';
import { getEmployees, getAttendance, markAttendance, getAttendanceSummary } from '@/lib/api';
import { toast } from 'sonner';
import { CalendarCheck, CalendarDays, UserCheck, UserX, BarChart3, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar'; 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select' ;
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [summaryData, setSummaryData] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [marking, setMarking] = useState(null);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [empRes, attRes] = await Promise.all([
        getEmployees(),
        getAttendance({ date_filter: dateStr }),
      ]);
      setEmployees(empRes.data);
      setAttendance(attRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [dateStr]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMark = async (employeeId, status) => {
    try {
      setMarking(employeeId);
      await markAttendance({ employee_id: employeeId, date: dateStr, status });
      toast.success(`Marked ${status} for ${employeeId}`);
      const attRes = await getAttendance({ date_filter: dateStr });
      setAttendance(attRes.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setMarking(null);
    }
  };

  const getStatus = (employeeId) => {
    const record = attendance.find((a) => a.employee_id === employeeId);
    return record?.status || null;
  };

  const openSummary = async (employeeId) => {
    try {
      const res = await getAttendanceSummary(employeeId);
      setSummaryData(res.data);
      setSummaryOpen(true);
    } catch (err) {
      toast.error('Failed to load summary');
    }
  };

  const filteredEmployees = filterEmployee === 'all'
    ? employees
    : employees.filter((e) => e.employee_id === filterEmployee);

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;

  return (
    <div data-testid="attendance-page" className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#1A4D2E] tracking-tight">Attendance</h1>
        <p className="text-[#71717A] text-sm mt-1">Track and manage daily attendance</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up stagger-1">
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 flex items-center gap-4">
          <div className="bg-[#F5F5F0] rounded-md p-2.5">
            <CalendarDays className="h-5 w-5 text-[#1A4D2E]" />
          </div>
          <div>
            <p className="text-xs text-[#71717A]">Selected Date</p>
            <p className="text-sm font-semibold text-[#18181B]">{format(selectedDate, 'MMM dd, yyyy')}</p>
          </div>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 flex items-center gap-4">
          <div className="bg-emerald-50 rounded-md p-2.5">
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-[#71717A]">Present</p>
            <p data-testid="present-count" className="text-sm font-semibold text-emerald-700">{presentCount}</p>
          </div>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 flex items-center gap-4">
          <div className="bg-red-50 rounded-md p-2.5">
            <UserX className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-[#71717A]">Absent</p>
            <p data-testid="absent-count" className="text-sm font-semibold text-red-600">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-2">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              data-testid="date-picker-btn"
              variant="outline"
              className="w-full sm:w-56 justify-between font-normal"
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#A1A1AA]" />
                {format(selectedDate, 'MMM dd, yyyy')}
              </span>
              <ChevronDown className="h-4 w-4 text-[#A1A1AA]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              data-testid="attendance-calendar"
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setDatePickerOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={filterEmployee} onValueChange={setFilterEmployee}>
          <SelectTrigger data-testid="employee-filter-select" className="w-full sm:w-56">
            <SelectValue placeholder="All Employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.employee_id} value={emp.employee_id}>
                {emp.full_name} ({emp.employee_id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div data-testid="attendance-loading" className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div data-testid="attendance-empty" className="flex flex-col items-center py-16">
          <div className="bg-[#F5F5F0] rounded-full p-5 mb-4">
            <CalendarCheck className="h-10 w-10 text-[#1A4D2E]" />
          </div>
          <h3 className="text-lg font-semibold text-[#18181B] mb-1">No employees found</h3>
          <p className="text-sm text-[#71717A]">Add employees first to start marking attendance</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E4E4E7] rounded-lg animate-fade-in-up stagger-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => {
                const status = getStatus(emp.employee_id);
                return (
                  <TableRow key={emp.employee_id} data-testid={`attendance-row-${emp.employee_id}`}>
                    <TableCell className="font-mono text-sm text-[#71717A]">{emp.employee_id}</TableCell>
                    <TableCell className="font-medium">{emp.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-[#F5F5F0] text-[#1A4D2E] border-[#E4E4E7]">
                        {emp.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {status ? (
                        <Badge
                          className={
                            status === 'Present'
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'
                          }
                        >
                          {status}
                        </Badge>
                      ) : (
                        <span className="text-sm text-[#A1A1AA]">Not marked</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          data-testid={`mark-present-${emp.employee_id}`}
                          size="sm"
                          variant={status === 'Present' ? 'default' : 'outline'}
                          disabled={marking === emp.employee_id}
                          onClick={() => handleMark(emp.employee_id, 'Present')}
                          className={
                            status === 'Present'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white text-xs'
                              : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs'
                          }
                        >
                          <UserCheck className="h-3.5 w-3.5 mr-1" /> Present
                        </Button>
                        <Button
                          data-testid={`mark-absent-${emp.employee_id}`}
                          size="sm"
                          variant={status === 'Absent' ? 'default' : 'outline'}
                          disabled={marking === emp.employee_id}
                          onClick={() => handleMark(emp.employee_id, 'Absent')}
                          className={
                            status === 'Absent'
                              ? 'bg-red-500 hover:bg-red-600 text-white text-xs'
                              : 'text-red-500 border-red-200 hover:bg-red-50 text-xs'
                          }
                        >
                          <UserX className="h-3.5 w-3.5 mr-1" /> Absent
                        </Button>
                        <Button
                          data-testid={`view-summary-${emp.employee_id}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => openSummary(emp.employee_id)}
                          className="text-[#71717A] hover:text-[#1A4D2E]"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary Dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent data-testid="attendance-summary-dialog" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1A4D2E]">Attendance Summary</DialogTitle>
            <DialogDescription>{summaryData?.full_name} ({summaryData?.employee_id})</DialogDescription>
          </DialogHeader>
          {summaryData && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5F5F0] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#1A4D2E]">{summaryData.total_present}</p>
                  <p className="text-xs text-[#71717A] mt-1">Present Days</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{summaryData.total_absent}</p>
                  <p className="text-xs text-[#71717A] mt-1">Absent Days</p>
                </div>
              </div>
              <div className="bg-white border border-[#E4E4E7] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#71717A]">Attendance Rate</span>
                  <span className="text-sm font-semibold text-[#1A4D2E]">{summaryData.attendance_rate}%</span>
                </div>
                <div className="w-full bg-[#F4F4F5] rounded-full h-2.5">
                  <div
                    className="bg-[#1A4D2E] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${summaryData.attendance_rate}%` }}
                  />
                </div>
                <p className="text-xs text-[#A1A1AA] mt-2">
                  {summaryData.total_days} total days tracked
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
