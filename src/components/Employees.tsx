import React, { useState, useEffect } from 'react';
import { api, Employee, EmployeeRole, Payroll } from '../lib/api';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Banknote, 
  Search, 
  Edit2, 
  Trash2, 
  Plus,
  FileText,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<EmployeeRole[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'employees' | 'roles' | 'payrolls'>('employees');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Selected Data
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRole, setSelectedRole] = useState<EmployeeRole | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  // Forms
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    role_id: 0,
    phone: '',
    email: '',
    password: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
    joined_date: new Date().toISOString().split('T')[0]
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    base_salary: 0
  });

  const [payrollForm, setPayrollForm] = useState({
    employee_id: 0,
    amount: 0,
    period: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eData, rData, pData] = await Promise.all([
        api.getEmployees(),
        api.getEmployeeRoles(),
        api.getPayrolls()
      ]);
      setEmployees(eData);
      setRoles(rData);
      setPayrolls(pData);
    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // --- Employee Handlers ---
  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEmployee) {
        await api.updateEmployee(selectedEmployee.id, employeeForm);
      } else {
        await api.addEmployee(employeeForm);
      }
      setIsEmployeeModalOpen(false);
      resetEmployeeForm();
      loadData();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Gagal menyimpan data karyawan.');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
      try {
        await api.deleteEmployee(id);
        loadData();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Gagal menghapus karyawan.');
      }
    }
  };

  const resetEmployeeForm = () => {
    setSelectedEmployee(null);
    setEmployeeForm({
      name: '',
      role_id: roles.length > 0 ? roles[0].id : 0,
      phone: '',
      email: '',
      password: '',
      status: 'Aktif',
      joined_date: new Date().toISOString().split('T')[0]
    });
  };

  // --- Role Handlers ---
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        await api.updateEmployeeRole(selectedRole.id, roleForm);
      } else {
        await api.addEmployeeRole(roleForm);
      }
      setIsRoleModalOpen(false);
      resetRoleForm();
      loadData();
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Gagal menyimpan jabatan.');
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus jabatan ini? Pastikan tidak ada karyawan yang menggunakan jabatan ini.')) {
      try {
        await api.deleteEmployeeRole(id);
        loadData();
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Gagal menghapus jabatan. Mungkin masih digunakan oleh karyawan.');
      }
    }
  };

  const resetRoleForm = () => {
    setSelectedRole(null);
    setRoleForm({
      name: '',
      base_salary: 0
    });
  };

  // --- Payroll Handlers ---
  const openPayrollModal = (employee: Employee) => {
    const role = roles.find(r => r.id === employee.role_id);
    setPayrollForm({
      employee_id: employee.id,
      amount: role ? role.base_salary : 0,
      period: new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
      notes: 'Gaji Pokok'
    });
    setIsPayrollModalOpen(true);
  };

  const handlePayrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPayroll = await api.processPayroll(payrollForm);
      setIsPayrollModalOpen(false);
      loadData();
      // Show invoice
      setSelectedPayroll(newPayroll as Payroll);
      setIsInvoiceModalOpen(true);
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Gagal memproses penggajian.');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // --- Filters ---
  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.role_name && e.role_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPayrolls = payrolls.filter(p => 
    (p.employee_name && p.employee_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.period.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F4E37]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3C2A21]">Karyawan & Penggajian</h1>
          <p className="text-[#8C7B6E]">Kelola data karyawan, jabatan, dan proses penggajian</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              resetRoleForm();
              setIsRoleModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#FDFCFB] text-[#6F4E37] border border-[#6F4E37] px-4 py-2 rounded-xl hover:bg-[#F5F2ED] transition-colors"
          >
            <Briefcase size={20} />
            <span className="hidden sm:inline">Tambah Jabatan</span>
          </button>
          <button 
            onClick={() => {
              resetEmployeeForm();
              setIsEmployeeModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#6F4E37] text-white px-4 py-2 rounded-xl hover:bg-[#3C2A21] transition-colors shadow-sm"
          >
            <UserPlus size={20} />
            <span>Tambah Karyawan</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#F5F2ED] overflow-hidden">
        <div className="p-4 border-b border-[#F5F2ED] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-[#FDFCFB] p-1 rounded-xl w-fit overflow-x-auto">
            <button 
              onClick={() => setActiveTab('employees')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'employees' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-[#8C7B6E] hover:text-[#6F4E37]'}`}
            >
              Data Karyawan
            </button>
            <button 
              onClick={() => setActiveTab('roles')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'roles' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-[#8C7B6E] hover:text-[#6F4E37]'}`}
            >
              Jabatan
            </button>
            <button 
              onClick={() => setActiveTab('payrolls')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'payrolls' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-[#8C7B6E] hover:text-[#6F4E37]'}`}
            >
              Riwayat Penggajian
            </button>
          </div>
          {(activeTab === 'employees' || activeTab === 'payrolls') && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B6E]" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama..." 
                className="w-full pl-10 pr-4 py-2 bg-[#FDFCFB] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#6F4E37] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'employees' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FDFCFB] text-[#8C7B6E] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Nama Karyawan</th>
                  <th className="px-6 py-4 font-bold">Jabatan</th>
                  <th className="px-6 py-4 font-bold">Kontak</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Gaji Bulan Ini</th>
                  <th className="px-6 py-4 font-bold">Status Gaji</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2ED]">
                {filteredEmployees.map((e) => {
                  const role = roles.find(r => r.id === e.role_id);
                  const baseSalary = role ? role.base_salary : 0;
                  const currentPeriod = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });
                  const isPaid = payrolls.some(p => p.employee_id === e.id && p.period === currentPeriod);

                  return (
                  <tr key={e.id} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#3C2A21]">{e.name}</div>
                      <div className="text-xs text-[#8C7B6E]">Bergabung: {new Date(e.joined_date).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                        {e.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#3C2A21]">{e.phone}</div>
                      <div className="text-xs text-[#8C7B6E]">{e.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${e.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#3C2A21]">
                      {formatCurrency(baseSalary)}
                    </td>
                    <td className="px-6 py-4">
                      {isPaid ? (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-600">
                          Sudah Dibayar
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-600">
                          Belum Dibayar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => !isPaid && openPayrollModal(e)}
                          disabled={isPaid}
                          className={`p-2 rounded-lg transition-colors ${isPaid ? 'text-gray-300 cursor-not-allowed' : 'text-green-600 hover:bg-green-50'}`}
                          title={isPaid ? "Sudah dibayar bulan ini" : "Bayar Gaji"}
                        >
                          <Banknote size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedEmployee(e);
                            setEmployeeForm({
                              name: e.name,
                              role_id: e.role_id,
                              phone: e.phone,
                              email: e.email,
                              password: e.password || '',
                              status: e.status,
                              joined_date: e.joined_date
                            });
                            setIsEmployeeModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(e.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#8C7B6E]">
                      Tidak ada data karyawan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'roles' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FDFCFB] text-[#8C7B6E] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Nama Jabatan</th>
                  <th className="px-6 py-4 font-bold">Gaji Pokok Default</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2ED]">
                {roles.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#3C2A21]">{r.name}</td>
                    <td className="px-6 py-4 font-medium text-[#6F4E37]">{formatCurrency(r.base_salary)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedRole(r);
                            setRoleForm({
                              name: r.name,
                              base_salary: r.base_salary
                            });
                            setIsRoleModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteRole(r.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-[#8C7B6E]">
                      Belum ada data jabatan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'payrolls' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FDFCFB] text-[#8C7B6E] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Tanggal & Ref</th>
                  <th className="px-6 py-4 font-bold">Karyawan</th>
                  <th className="px-6 py-4 font-bold">Periode</th>
                  <th className="px-6 py-4 font-bold">Catatan</th>
                  <th className="px-6 py-4 font-bold">Total Dibayar</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2ED]">
                {filteredPayrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#3C2A21]">
                        {new Date(p.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-[#8C7B6E]">{p.reference_id}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#3C2A21]">{p.employee_name}</td>
                    <td className="px-6 py-4 text-sm text-[#3C2A21]">{p.period}</td>
                    <td className="px-6 py-4 text-sm text-[#8C7B6E]">{p.notes}</td>
                    <td className="px-6 py-4 font-bold text-green-600">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedPayroll(p);
                          setIsInvoiceModalOpen(true);
                        }}
                        className="p-2 text-[#6F4E37] hover:bg-[#F5F2ED] rounded-lg transition-colors"
                        title="Lihat Slip Gaji"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPayrolls.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#8C7B6E]">
                      Belum ada riwayat penggajian
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Employee Modal */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-[#F5F2ED] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#3C2A21]">
                  {selectedEmployee ? 'Edit Karyawan' : 'Tambah Karyawan'}
                </h2>
                <button onClick={() => setIsEmployeeModalOpen(false)} className="text-[#8C7B6E] hover:text-[#6F4E37]">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <form onSubmit={handleEmployeeSubmit} className="p-6 space-y-4">
                <div>
                  <label className="form-label">Nama Lengkap</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nama Karyawan"
                    value={employeeForm.name}
                    onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Jabatan</label>
                  <select 
                    className="form-input"
                    value={employeeForm.role_id}
                    onChange={e => setEmployeeForm({...employeeForm, role_id: Number(e.target.value)})}
                    required
                  >
                    <option value={0} disabled>Pilih Jabatan...</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">No. Telepon</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="08..."
                      value={employeeForm.phone}
                      onChange={e => setEmployeeForm({...employeeForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="email@..."
                      value={employeeForm.email}
                      onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Kata Sandi</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Kata Sandi..."
                      value={employeeForm.password}
                      onChange={e => setEmployeeForm({...employeeForm, password: e.target.value})}
                      required={!selectedEmployee}
                    />
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <select 
                      className="form-input"
                      value={employeeForm.status}
                      onChange={e => setEmployeeForm({...employeeForm, status: e.target.value as any})}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Tanggal Bergabung</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={employeeForm.joined_date}
                    onChange={e => setEmployeeForm({...employeeForm, joined_date: e.target.value})}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#6F4E37] text-white py-3 rounded-xl font-bold hover:bg-[#3C2A21] transition-all shadow-md mt-4"
                >
                  Simpan Karyawan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Role Modal */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[#F5F2ED] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#3C2A21]">
                  {selectedRole ? 'Edit Jabatan' : 'Tambah Jabatan'}
                </h2>
                <button onClick={() => setIsRoleModalOpen(false)} className="text-[#8C7B6E] hover:text-[#6F4E37]">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <form onSubmit={handleRoleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="form-label">Nama Jabatan</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Contoh: Barista"
                    value={roleForm.name}
                    onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Gaji Pokok Default (IDR)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="0"
                    value={roleForm.base_salary || ''}
                    onChange={e => setRoleForm({...roleForm, base_salary: Number(e.target.value)})}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#6F4E37] text-white py-3 rounded-xl font-bold hover:bg-[#3C2A21] transition-all shadow-md mt-4"
                >
                  Simpan Jabatan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payroll Modal */}
      <AnimatePresence>
        {isPayrollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-[#F5F2ED] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#3C2A21]">Proses Penggajian</h2>
                <button onClick={() => setIsPayrollModalOpen(false)} className="text-[#8C7B6E] hover:text-[#6F4E37]">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <form onSubmit={handlePayrollSubmit} className="p-6 space-y-4">
                <div className="p-4 bg-blue-50 text-blue-800 rounded-xl mb-4">
                  <p className="text-sm">Anda akan memproses gaji untuk:</p>
                  <p className="font-bold text-lg">{employees.find(e => e.id === payrollForm.employee_id)?.name}</p>
                </div>
                
                <div>
                  <label className="form-label">Periode Gaji</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Contoh: Maret 2024"
                    value={payrollForm.period}
                    onChange={e => setPayrollForm({...payrollForm, period: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Total Gaji Dibayarkan (IDR)</label>
                  <input 
                    type="number" 
                    className="form-input text-xl font-bold text-green-600" 
                    placeholder="0"
                    value={payrollForm.amount || ''}
                    onChange={e => setPayrollForm({...payrollForm, amount: Number(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Catatan Tambahan</label>
                  <textarea 
                    className="form-input h-20 resize-none" 
                    placeholder="Contoh: Gaji pokok + Bonus lembur"
                    value={payrollForm.notes}
                    onChange={e => setPayrollForm({...payrollForm, notes: e.target.value})}
                  />
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-800 flex items-start gap-2">
                  <Banknote size={16} className="shrink-0 mt-0.5" />
                  <p>Memproses penggajian akan otomatis mencatat pengeluaran di halaman Keuangan.</p>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md mt-4"
                >
                  Bayar Gaji & Buat Slip
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice / Slip Gaji Modal */}
      <AnimatePresence>
        {isInvoiceModalOpen && selectedPayroll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:bg-white print:p-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden print:shadow-none print:rounded-none"
            >
              <div className="p-8 print:p-4">
                {/* Header Slip */}
                <div className="text-center mb-8 border-b-2 border-dashed border-[#E8E1D9] pb-6">
                  <div className="w-16 h-16 bg-[#6F4E37] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 print:hidden">
                    <Banknote size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#3C2A21] uppercase tracking-widest">Slip Gaji</h2>
                  <p className="text-[#8C7B6E] mt-1 font-medium">Bean & Brew Cafe</p>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-y-4 mb-8 text-sm">
                  <div>
                    <p className="text-[#8C7B6E] mb-1">No. Referensi</p>
                    <p className="font-bold text-[#3C2A21]">{selectedPayroll.reference_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#8C7B6E] mb-1">Tanggal Pembayaran</p>
                    <p className="font-bold text-[#3C2A21]">
                      {new Date(selectedPayroll.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#8C7B6E] mb-1">Nama Karyawan</p>
                    <p className="font-bold text-[#3C2A21] text-lg">{selectedPayroll.employee_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#8C7B6E] mb-1">Periode</p>
                    <p className="font-bold text-[#3C2A21]">{selectedPayroll.period}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-[#FDFCFB] rounded-xl p-4 border border-[#F5F2ED] mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#8C7B6E] font-medium">Keterangan</span>
                    <span className="text-[#3C2A21] font-medium text-right">{selectedPayroll.notes || 'Gaji Pokok'}</span>
                  </div>
                  <div className="border-t border-[#E8E1D9] my-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3C2A21] font-bold text-lg">Total Diterima</span>
                    <span className="text-green-600 font-bold text-2xl">{formatCurrency(selectedPayroll.amount)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-[#8C7B6E] mt-12">
                  <p>Dokumen ini adalah bukti pembayaran gaji yang sah.</p>
                  <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-[#FDFCFB] border-t border-[#F5F2ED] flex gap-4 print:hidden">
                <button 
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-[#8C7B6E] hover:bg-[#F5F2ED] transition-colors"
                >
                  Tutup
                </button>
                <button 
                  onClick={handlePrintInvoice}
                  className="flex-1 bg-[#6F4E37] text-white py-3 rounded-xl font-bold hover:bg-[#3C2A21] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  <span>Cetak / PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
