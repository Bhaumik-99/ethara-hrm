import { useEffect, useState, useCallback } from 'react';
import { getEmployees, createEmployee, deleteEmployee, getDepartments } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Search, Trash2, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ employee_id: '', full_name: '', email: '', department: '' });
  const [formErrors, setFormErrors] = useState({});

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search) params.search = search;
      if (deptFilter && deptFilter !== 'all') params.department = deptFilter;
      const res = await getEmployees(params);
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const validateForm = () => {
    const errors = {};
    if (!form.employee_id.trim()) errors.employee_id = 'Employee ID is required';
    if (!form.full_name.trim()) errors.full_name = 'Full name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email))
      errors.email = 'Invalid email format';
    if (!form.department) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      await createEmployee(form);
      toast.success('Employee added successfully');
      setAddOpen(false);
      setForm({ employee_id: '', full_name: '', email: '', department: '' });
      setFormErrors({});
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add employee';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmployee(deleteTarget);
      toast.success('Employee deleted successfully');
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to delete employee');
    }
  };

  return (
    <div data-testid="employees-page" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-[#1A4D2E] tracking-tight">Employees</h1>
          <p className="text-[#71717A] text-sm mt-1">Manage your team members</p>
        </div>
        <Button
          data-testid="add-employee-btn"
          onClick={() => setAddOpen(true)}
          className="bg-[#1A4D2E] hover:bg-[#143A22] text-white active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
          <Input
            data-testid="employee-search-input"
            placeholder="Search by name, ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger data-testid="dept-filter-select" className="w-full sm:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div data-testid="employees-loading" className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div data-testid="employees-error" className="flex flex-col items-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <Button
              data-testid="employees-retry-btn"
              onClick={fetchEmployees}
              className="mt-4 bg-[#1A4D2E] hover:bg-[#143A22] text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : employees.length === 0 ? (
        <div data-testid="employees-empty" className="flex flex-col items-center py-16">
          <div className="bg-[#F5F5F0] rounded-full p-5 mb-4">
            <Users className="h-10 w-10 text-[#1A4D2E]" />
          </div>
          <h3 className="text-lg font-semibold text-[#18181B] mb-1">No employees found</h3>
          <p className="text-sm text-[#71717A] mb-4">
            {search || deptFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first employee'}
          </p>
          {!search && deptFilter === 'all' && (
            <Button
              data-testid="empty-add-employee-btn"
              onClick={() => setAddOpen(true)}
              className="bg-[#1A4D2E] hover:bg-[#143A22] text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Employee
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#E4E4E7] rounded-lg animate-fade-in-up stagger-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.employee_id} data-testid={`employee-row-${emp.employee_id}`}>
                  <TableCell className="font-mono text-sm text-[#71717A]">{emp.employee_id}</TableCell>
                  <TableCell className="font-medium">{emp.full_name}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-[#71717A]">{emp.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-[#F5F5F0] text-[#1A4D2E] border-[#E4E4E7]">
                      {emp.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      data-testid={`delete-employee-${emp.employee_id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(emp.employee_id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Employee Dialog */}
      <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) { setFormErrors({}); setForm({ employee_id: '', full_name: '', email: '', department: '' }); } }}>
        <DialogContent data-testid="add-employee-dialog" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1A4D2E]">Add New Employee</DialogTitle>
            <DialogDescription>Fill in the details to add a new team member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                data-testid="input-employee-id"
                placeholder="e.g. EMP001"
                value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                className={formErrors.employee_id ? 'border-red-400' : ''}
              />
              {formErrors.employee_id && <p className="text-xs text-red-500 mt-1">{formErrors.employee_id}</p>}
            </div>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                data-testid="input-full-name"
                placeholder="e.g. John Doe"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={formErrors.full_name ? 'border-red-400' : ''}
              />
              {formErrors.full_name && <p className="text-xs text-red-500 mt-1">{formErrors.full_name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                placeholder="e.g. john@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={formErrors.email ? 'border-red-400' : ''}
              />
              {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                <SelectTrigger data-testid="input-department" className={formErrors.department ? 'border-red-400' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.department && <p className="text-xs text-red-500 mt-1">{formErrors.department}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              data-testid="submit-employee-btn"
              onClick={handleAdd}
              disabled={submitting}
              className="bg-[#1A4D2E] hover:bg-[#143A22] text-white w-full active:scale-95 transition-all"
            >
              {submitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent data-testid="delete-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete employee <strong>{deleteTarget}</strong> and all their attendance records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-delete-btn"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
