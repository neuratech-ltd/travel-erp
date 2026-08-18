import React, { useState, useEffect, useMemo } from 'react'
import { User, Plus, Search, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import EmployeeStatsCard from '@/components/employee/EmployeeStatsCard'
import EmployeeCard from '@/components/employee/EmployeeCard'
import { Employee } from '../../backend/modules/employee/employee.services'
import AddEmployeeModal from '@/components/employee/AddEmployeeModal'
import EditEmployeeModal from '@/components/employee/EditEmployeeModal'

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>(undefined)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployeeId(employee.id)
    setIsEditModalOpen(true)
  }

  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/employees')
      const json = await res.json()
      if (json.success) {
        setEmployees(json.data)
      }
    } catch (e) {
      console.error('Failed to fetch employees', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  //   setEditingEmployee(null);
  //   setFormData({
  //     name: '',
  //     designation: '',
  //     department: 'Sales',
  //     email: '',
  //     phone: '',
  //     joiningDate: new Date().toISOString().split('T')[0],
  //     status: 'Active'
  //   });
  //   setFormError('');
  //   setIsModalOpen(true);
  // };

  // const handleOpenEdit = (emp: Employee) => {
  //   setEditingEmployee(emp);
  //   setFormData({
  //     name: emp.name,
  //     designation: emp.designation,
  //     department: emp.department,
  //     email: emp.email,
  //     phone: emp.phone,
  //     joiningDate: emp.joiningDate,
  //     status: emp.status
  //   });
  //   setFormError('');
  //   setIsModalOpen(true);
  // };

  // const handleDelete = async (id: string, name: string) => {
  //   if (confirm(`Are you sure you want to delete employee "${name}"?`)) {
  //     try {
  //       const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
  //       const json = await res.json();
  //       if (json.success) {
  //         fetchEmployees();
  //       } else {
  //         alert(json.message || 'Failed to delete');
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!formData.name.trim()) {
  //     setFormError('Employee name is required');
  //     return;
  //   }

  //   try {
  //     const url = editingEmployee ? `/api/employees/${editingEmployee.id}` : '/api/employees';
  //     const method = editingEmployee ? 'PUT' : 'POST';
  //     const res = await fetch(url, {
  //       method,
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData)
  //     });
  //     const json = await res.json();
  //     if (json.success) {
  //       fetchEmployees();
  //       setIsModalOpen(false);
  //     } else {
  //       setFormError(json.message || 'Operation failed');
  //     }
  //   } catch (err: any) {
  //     setFormError(err.message || 'Network error');
  //   }
  // };

  // Filtered employees
  // const filteredEmployees = useMemo(() => {
  //   return employees.filter(emp => {
  //     const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
  //     const query = searchQuery.toLowerCase();
  //     const matchesSearch = emp.name.toLowerCase().includes(query) ||
  //                           emp.designation.toLowerCase().includes(query) ||
  //                           emp.email.toLowerCase().includes(query) ||
  //                           emp.phone.includes(query);
  //     return matchesDept && matchesSearch;
  //   });
  // }, [employees]);

  // // Unique departments for filter list
  // const departments = useMemo(() => {
  //   const list = new Set<string>();
  //   employees.forEach(e => { if (e.department) list.add(e.department); });
  //   return Array.from(list);
  // }, [employees]);

  // // Stats
  // const stats = useMemo(() => {
  //   const active = employees.filter(e => e.status === 'Active').length;
  //   return {
  //     total: employees.length,
  //     active,
  //     inactive: employees.length - active
  //   };
  // }, [employees]);

  return (
    <div id="employees-container" className="flex-1 p-6 bg-slate-50 overflow-y-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0A1D1C]">Employee Directory</h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage Welcare Trip advisors, executives and office administrators
          </p>
        </div>

        <button
          onClick={setIsModalOpen.bind(null, true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          ADD NEW EMPLOYEE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EmployeeStatsCard title="Total Staff" amount={employees.length} icon={<User className="h-5 w-5" />} />
        <EmployeeStatsCard
          title="Active Staff"
          status="active"
          amount={employees.filter((emp) => emp.status === 'ACTIVE').length}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <EmployeeStatsCard
          title="Inactive Staff"
          status="inactive"
          amount={employees.filter((emp) => emp.status === 'INACTIVE').length}
          icon={<XCircle className="h-5 w-5" />}
        />
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search employee by name, designation, email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500">
            <option value="All">All Departments</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.department}>
                {emp.department}
              </option>
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

      <div className="flex flex-row gap-4 flex-wrap">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 font-semibold text-xs animate-pulse">
            LOADING EMPLOYEE RECORDS...
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white py-12 px-4 rounded-2xl border border-slate-200 text-center text-slate-400">
            No employee records found. Click "ADD NEW EMPLOYEE" to create one.
          </div>
        ) : (
          employees.map((emp) => (
            <EmployeeCard key={emp.id} setIsModalOpen={setIsEditModalOpen} onEdit={handleEditEmployee} employee={emp} />
          ))
        )}
      </div>
      {isModalOpen && <AddEmployeeModal setIsModalOpen={setIsModalOpen} />}
      {isEditModalOpen && selectedEmployeeId && (
        <EditEmployeeModal id={selectedEmployeeId} setIsModalOpen={setIsEditModalOpen} />
      )}
    </div>
  )
}
