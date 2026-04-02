import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Lock, User } from 'lucide-react';
import { api } from '../lib/api';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const user = await api.login(email, password);
      onLogin(user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E8E1D9] p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#6F4E37] rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
            <Coffee size={32} />
          </div>
          <h2 className="text-2xl font-bold">Login Staf</h2>
          <p className="text-[#8C7B6E]">Masukkan kredensial Anda untuk mengakses dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Alamat Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7B6E]" size={20} />
              <input 
                type="email" 
                className="form-input pl-12" 
                placeholder="admin@coffee.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7B6E]" size={20} />
              <input 
                type="password" 
                className="form-input pl-12" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full btn btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
