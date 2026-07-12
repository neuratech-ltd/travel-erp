import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  X,
  Building,
  RefreshCw
} from 'lucide-react';
import { Employee } from '../types';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formError, setFormError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: 'Sales',
    email: '',
    phone: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Fetch employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/employees');
      const json = await res.json();
      if (json.success) {
        setEmployees(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch employees', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      designation: '',
      department: 'Sales',
      email: '',
      phone: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      email: emp.email,
      phone: emp.phone,
      joiningDate: emp.joiningDate,
      status: emp.status
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete employee "${name}"?`)) {
      try {
        const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          fetchEmployees();
        } else {
          alert(json.message || 'Failed to delete');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Employee name is required');
      return;
    }

    try {
      const url = editingEmployee ? `/api/employees/${editingEmployee.id}` : '/api/employees';
      const method = editingEmployee ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        fetchEmployees();
        setIsModalOpen(false);
      } else {
        setFormError(json.message || 'Operation failed');
      }
    } catch (err: any) {
      setFormError(err.message || 'Network error');
    }
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch = emp.name.toLowerCase().includes(query) ||
                            emp.designation.toLowerCase().includes(query) ||
                            emp.email.toLowerCase().includes(query) ||
                            emp.phone.includes(query);
      return matchesDept && matchesSearch;
    });
  }, [employees, deptFilter, searchQuery]);

  // Unique departments for filter list
  const departments = useMemo(() => {
    const list = new Set<string>();
    employees.forEach(e => { if (e.department) list.add(e.department); });
    return Array.from(list);
  }, [employees]);

  // Stats
  const stats = useMemo(() => {
    const active = employees.filter(e => e.status === 'Active').length;
    return {
      total: employees.length,
      active,
      inactive: employees.length - active
    };
  }, [employees]);

  return (
    <div id="employees-container" className="flex-1 p-6 bg-slate-50 overflow-y-auto space-y-6">
      
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0A1D1C]">Employee Directory</h2>
          <p className="text-xs text-slate-500 font-medium">Manage Welcare Trip advisors, executives and office administrators</p>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          ADD NEW EMPLOYEE
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-4xs font-bold text-slate-400 uppercase tracking-widest">Total Staff</span>
            <strong className="text-xl text-[#0A1D1C] font-semibold">{stats.total}</strong>
          </div>
          <div className="p-2.5 bg-[#0A1D1C]/5 rounded-xl text-[#0A1D1C]">
            <User className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-4xs font-bold text-emerald-600 uppercase tracking-widest">Active Staff</span>
            <strong className="text-xl text-emerald-700 font-semibold">{stats.active}</strong>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-4xs font-bold text-rose-500 uppercase tracking-widest">On Leave / Inactive</span>
            <strong className="text-xl text-rose-700 font-semibold">{stats.inactive}</strong>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input 
            type="text" 
            placeholder="Search employee by name, designation, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={fetchEmployees}
          className="p-2 text-slate-500 hover:text-emerald-600 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer self-start sm:self-auto"
          title="Refresh employees list"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Employees Grid list */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 font-semibold text-xs animate-pulse">
          LOADING EMPLOYEE RECORDS...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white py-12 px-4 rounded-2xl border border-slate-200 text-center text-slate-400">
          No employee records found. Click "ADD NEW EMPLOYEE" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id} 
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-600/30 hover:shadow-md transition-all group"
            >
              {/* Badge for Department and Status */}
              <div className="p-4 pb-0 flex justify-between items-start">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-4xs font-bold uppercase tracking-wide">
                  {emp.department}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-4xs font-bold uppercase tracking-wide ${
                  emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {emp.status}
                </span>
              </div>

              {/* Profile Details */}
              <div className="p-4 text-center">
                <div className="h-14 w-14 rounded-full bg-[#0A1D1C]/5 group-hover:bg-emerald-50 transition-colors border border-slate-100 flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-[#0A1D1C]/60 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm tracking-tight">{emp.name}</h3>
                <p className="text-4xs text-[#0A1D1C]/80 font-bold uppercase tracking-widest mt-0.5">{emp.designation}</p>
                
                {/* Contact items */}
                <div className="mt-4 pt-3 border-t border-slate-50 space-y-2 text-3xs text-slate-500 text-left">
                  {emp.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                  )}
                  {emp.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Joined: {emp.joiningDate}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-1.5">
                <button 
                  onClick={() => handleOpenEdit(emp)}
                  className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded text-indigo-600 transition-all cursor-pointer"
                  title="Edit employee"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(emp.id, emp.name)}
                  className="p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded text-rose-600 transition-all cursor-pointer"
                  title="Delete employee"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Modal Overlay */}
      {isModalOpen && (
        <div id="modal-overlay" className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div id="modal-drawer" className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#0A1D1C] text-white">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    {editingEmployee ? 'Edit Employee Info' : 'Register New Employee'}
                  </h3>
                  <p className="text-4xs text-emerald-300">Set ERP access roles & metadata</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-2xs font-bold">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Employee Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Haji Mohammad Selim"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Job Designation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Medical Travel Advisor"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Department</label>
                <select 
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none"
                >
                  <option value="Administration">Administration</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Reservations">Reservations</option>
                  <option value="Visa Desk">Visa Desk</option>
                  <option value="Accounts & Audit">Accounts & Audit</option>
                  <option value="Medical Desk">Medical Coordination Desk</option>
                </select>
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. selim@welcaretrip.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Contact Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +88017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Joining Date</label>
                <input 
                  type="date" 
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Status</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={formData.status === 'Active'}
                      onChange={() => setFormData({ ...formData, status: 'Active' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={formData.status === 'Inactive'}
                      onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                      className="text-rose-600 focus:ring-emerald-500"
                    />
                    Inactive / On Leave
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-6 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  {editingEmployee ? 'SAVE DETAILS' : 'CREATE ACCOUNT'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
