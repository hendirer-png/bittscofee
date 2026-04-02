import { Link } from 'react-router-dom';
import { Coffee, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-50"
            alt="Coffee Shop"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Coffee className="text-[#D4A373]" />
              <span className="uppercase tracking-[0.3em] text-sm font-bold text-[#D4A373]">Pengalaman Kopi Premium</span>
            </div>
            <h1 className="mb-8">Bangkitkan Indera Anda di Setiap Tegukan</h1>
            <p className="text-lg text-gray-200 mb-10 max-w-lg">
              Nikmati biji kopi terbaik dari seluruh dunia, dipanggang dengan sempurna dan disajikan dalam suasana yang nyaman.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn btn-primary px-8 py-4 text-lg">
                Pesan Sekarang
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-outline border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
                Login Staf
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#FDFCFB]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F5F1ED] rounded-2xl flex items-center justify-center text-[#6F4E37] mx-auto mb-6">
                <Star size={32} />
              </div>
              <h3 className="mb-4">Kualitas Terbaik</h3>
              <p className="text-[#8C7B6E]">Kami hanya memilih 1% biji kopi terbaik di dunia untuk campuran khas kami.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F5F1ED] rounded-2xl flex items-center justify-center text-[#6F4E37] mx-auto mb-6">
                <Clock size={32} />
              </div>
              <h3 className="mb-4">Layanan Cepat</h3>
              <p className="text-[#8C7B6E]">Kopi Anda diseduh segar dan disajikan dalam hitungan menit oleh barista ahli kami.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F5F1ED] rounded-2xl flex items-center justify-center text-[#6F4E37] mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="mb-4">Tempat Nyaman</h3>
              <p className="text-[#8C7B6E]">Tempat yang sempurna untuk bekerja, bertemu teman, atau sekadar menikmati momen tenang.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cafe Info Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-[#FDFCFB] rounded-[3rem] border border-[#E8E1D9] overflow-hidden shadow-xl shadow-[#6F4E37]/5">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Kunjungi Kami</h2>
                  <p className="text-[#8C7B6E] leading-relaxed">
                    Jl. Cigadung Raya No. 123, Cigadung, Kec. Cibeunying Kaler, Kota Bandung, Jawa Barat 40191
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[#6F4E37]">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#E8E1D9]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#8C7B6E] uppercase">Jam Operasional</p>
                      <p className="font-bold">08:00 - 22:00 (Setiap Hari)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[#6F4E37]">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#E8E1D9]">
                      <Coffee size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#8C7B6E] uppercase">Kontak</p>
                      <p className="font-bold">+62 812-3456-7890</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#6F4E37] p-12 text-white flex flex-col justify-center space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Info Pembayaran</h2>
                  <p className="text-white/70 leading-relaxed">
                    Kami menerima Tunai, QRIS, dan Transfer Bank. Untuk transfer manual, silakan gunakan rekening di bawah ini:
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase">BCA</span>
                    </div>
                    <p className="text-xl font-bold tracking-wider">1234567890</p>
                    <p className="text-[10px] text-white/60 uppercase font-medium">PT BITTS KOPI INDONESIA</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase">Mandiri</span>
                    </div>
                    <p className="text-xl font-bold tracking-wider">0987654321</p>
                    <p className="text-[10px] text-white/60 uppercase font-medium">PT BITTS KOPI INDONESIA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
