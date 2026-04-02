import React, { useState, useEffect } from 'react';
import { api, Table } from '../lib/api';
import { Plus, Trash2, Search, Filter, CheckCircle, XCircle, MapPin, Calendar, User, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [reservingTable, setReservingTable] = useState<Table | null>(null);
  const [reservationData, setReservationData] = useState({
    customer_name: '',
    start_time: '',
    end_time: ''
  });

  const fetchTables = () => {
    api.getTables().then(setTables);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    await api.addTable(newTableName);
    setNewTableName('');
    setIsAdding(false);
    fetchTables();
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    await api.updateTable(id, { is_available: !currentStatus });
    fetchTables();
  };

  const handleDeleteTable = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus meja ini?')) {
      await api.deleteTable(id);
      fetchTables();
    }
  };

  const handleReserveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservingTable || !reservationData.customer_name || !reservationData.start_time || !reservationData.end_time) return;
    
    try {
      await api.reserveTable(reservingTable.id, reservationData);
      setReservingTable(null);
      setReservationData({ customer_name: '', start_time: '', end_time: '' });
      fetchTables();
    } catch (error) {
      alert(error);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (confirm('Batalkan reservasi ini?')) {
      await api.cancelReservation(id);
      fetchTables();
    }
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'available' && table.is_available && !table.reservation) || 
      (statusFilter === 'occupied' && !table.is_available && !table.reservation) ||
      (statusFilter === 'reserved' && !!table.reservation);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Manajemen Meja</h2>
          <p className="text-[#8C7B6E]">Kelola meja kafe, reservasi, dan ketersediaan.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg shadow-[#6F4E37]/20"
        >
          <Plus size={20} />
          Tambah Meja Baru
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-[#E8E1D9] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B6E]" size={18} />
          <input 
            type="text"
            placeholder="Cari nomor meja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FDFCFB] border border-[#E8E1D9] rounded-xl focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-[#8C7B6E]" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="flex-1 md:w-48 p-2.5 bg-[#FDFCFB] border border-[#E8E1D9] rounded-xl focus:ring-2 focus:ring-[#6F4E37] outline-none text-sm font-medium"
          >
            <option value="all">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="occupied">Terisi</option>
            <option value="reserved">Direservasi</option>
          </select>
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTables.map(table => (
            <motion.div
              key={table.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative p-6 rounded-3xl border-2 transition-all group ${
                table.reservation
                  ? 'bg-purple-50 border-purple-200'
                  : table.is_available 
                    ? 'bg-white border-[#E8E1D9] hover:border-green-200' 
                    : 'bg-[#F5F1ED] border-transparent opacity-80'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                  table.reservation 
                    ? 'bg-purple-100 text-purple-600'
                    : table.is_available ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#6F4E37]">{table.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    table.reservation
                      ? 'bg-purple-200 text-purple-800'
                      : table.is_available ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {table.reservation ? 'Direservasi' : table.is_available ? 'Tersedia' : 'Terisi'}
                  </span>
                </div>

                {table.reservation && (
                  <div className="w-full p-3 bg-white/50 rounded-2xl text-[10px] text-left space-y-1 border border-purple-100">
                    <div className="flex items-center gap-1 font-bold text-purple-700">
                      <User size={10} />
                      {table.reservation.customer_name}
                    </div>
                    <div className="flex items-center gap-1 text-[#8C7B6E]">
                      <Clock size={10} />
                      {table.reservation.start_time} - {table.reservation.end_time}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2 w-full pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => table.reservation ? handleCancelReservation(table.id) : handleToggleAvailability(table.id, table.is_available)}
                      className={`flex-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
                        table.reservation
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : table.is_available 
                            ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {table.reservation ? 'Batal Res' : `Tandai ${table.is_available ? 'Terisi' : 'Tersedia'}`}
                    </button>
                    {!table.reservation && table.is_available && (
                      <button
                        onClick={() => setReservingTable(table)}
                        className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all"
                        title="Reservasi Meja"
                      >
                        <Calendar size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTable(table.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#E8E1D9]">
          <MapPin size={48} className="mx-auto text-[#E8E1D9] mb-4" />
          <p className="text-[#8C7B6E] font-medium">Tidak ada meja yang cocok dengan filter Anda.</p>
        </div>
      )}

      {/* Add Table Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <form onSubmit={handleAddTable} className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#6F4E37]">Tambah Meja Baru</h3>
                  <button type="button" onClick={() => setIsAdding(false)} className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                    <X size={24} className="text-[#8C7B6E]" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider">Nama / Nomor Meja</label>
                  <input 
                    autoFocus
                    type="text"
                    placeholder="misal: Meja 11"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="w-full p-4 bg-[#FDFCFB] border border-[#E8E1D9] rounded-2xl focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 btn btn-outline py-4 rounded-2xl"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn btn-primary py-4 rounded-2xl"
                  >
                    Tambah Meja
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reservation Modal */}
      <AnimatePresence>
        {reservingTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <form onSubmit={handleReserveTable} className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#6F4E37]">Reservasi {reservingTable.name}</h3>
                  <button type="button" onClick={() => setReservingTable(null)} className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                    <X size={24} className="text-[#8C7B6E]" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider">Nama Pelanggan</label>
                    <input 
                      required
                      type="text"
                      placeholder="Masukkan nama pelanggan"
                      value={reservationData.customer_name}
                      onChange={(e) => setReservationData(prev => ({ ...prev, customer_name: e.target.value }))}
                      className="w-full p-4 bg-[#FDFCFB] border border-[#E8E1D9] rounded-2xl focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider">Waktu Mulai</label>
                      <input 
                        required
                        type="time"
                        value={reservationData.start_time}
                        onChange={(e) => setReservationData(prev => ({ ...prev, start_time: e.target.value }))}
                        className="w-full p-4 bg-[#FDFCFB] border border-[#E8E1D9] rounded-2xl focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider">Waktu Selesai</label>
                      <input 
                        required
                        type="time"
                        value={reservationData.end_time}
                        onChange={(e) => setReservationData(prev => ({ ...prev, end_time: e.target.value }))}
                        className="w-full p-4 bg-[#FDFCFB] border border-[#E8E1D9] rounded-2xl focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setReservingTable(null)}
                    className="flex-1 btn btn-outline py-4 rounded-2xl"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn btn-primary py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                  >
                    Konfirmasi Reservasi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
