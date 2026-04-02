import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, LayoutDashboard, Package, BarChart3, LogOut, Store, MapPin, Wallet, Users } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ user, onLogout }: { user: any, onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const allNavItems = [
    { path: '/admin', label: 'Kasir', icon: LayoutDashboard, roles: ['Admin', 'Kasir'] },
    { path: '/products', label: 'Produk', icon: Coffee, roles: ['Admin'] },
    { path: '/inventory', label: 'Inventaris', icon: Package, roles: ['Admin'] },
    { path: '/finance', label: 'Keuangan', icon: Wallet, roles: ['Admin'] },
    { path: '/employees', label: 'Karyawan', icon: Users, roles: ['Admin'] },
    { path: '/reports', label: 'Laporan', icon: BarChart3, roles: ['Admin'] },
    { path: '/profile', label: 'Profil', icon: Store, roles: ['Admin'] },
    { path: '/tables', label: 'Meja', icon: MapPin, roles: ['Admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role_name));

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D241E]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E8E1D9] p-6 hidden md:flex flex-col">
        <Link to="/admin" className="flex items-center gap-3 mb-10 px-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-[#6F4E37] rounded-xl flex items-center justify-center text-white">
            <Coffee size={24} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Bean & Brew</h1>
        </Link>

        <div className="mb-8 px-2 py-3 bg-[#FDFCFB] rounded-2xl border border-[#E8E1D9]">
          <p className="text-[10px] font-bold uppercase text-[#8C7B6E] tracking-wider mb-1">Pengguna</p>
          <p className="text-sm font-bold text-[#3C2A21] truncate">{user?.name}</p>
          <p className="text-[10px] text-[#8C7B6E]">{user?.role_name}</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-link",
                  isActive && "active"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="nav-link text-red-600 hover:bg-red-50 hover:text-red-700 mt-auto"
        >
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-3 md:p-8 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E1D9] flex justify-around p-4 md:hidden z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "text-[#6F4E37]" : "text-[#8C7B6E]"
              )}
            >
              <Icon size={24} />
            </Link>
          );
        })}
        <button onClick={handleLogout} className="p-2 text-red-600">
          <LogOut size={24} />
        </button>
      </nav>
    </div>
  );
}
