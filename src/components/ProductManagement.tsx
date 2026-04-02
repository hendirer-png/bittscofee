import React, { useState, useEffect } from 'react';
import { api, Product, Category, CustomizationGroup, CustomizationOption } from '../lib/api';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Upload, ChevronDown, ChevronUp, Settings2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductManagement() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const firstInputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customizationTemplates, setCustomizationTemplates] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'templates'>('products');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    is_required: false,
    min_selection: 0,
    max_selection: 1,
    options: [] as CustomizationOption[]
  });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    image_url: '',
    is_available: true,
    customization_groups: [] as CustomizationGroup[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.getProducts().then(setProducts);
    api.getCategories().then(setCategories);
    api.getCustomizationTemplates().then(setCustomizationTemplates);
  };

  const handleOpenModal = (product?: Product) => {
    triggerRef.current = document.activeElement as HTMLElement;
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        image_url: product.image_url,
        is_available: product.is_available,
        customization_groups: product.customization_groups || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: categories[0]?.id || 0,
        image_url: 'https://picsum.photos/seed/coffee/400/300',
        is_available: true,
        customization_groups: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, formData);
    } else {
      await api.addProduct(formData);
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await api.deleteProduct(id);
        loadData();
      } catch (error: any) {
        alert('Gagal menghapus produk: ' + error.message);
      }
    }
  };

  const addCustomGroup = () => {
    setFormData(prev => ({
      ...prev,
      customization_groups: [
        ...(prev.customization_groups || []),
        { name: 'Grup Baru', is_required: false, min_selection: 0, max_selection: 1, options: [] }
      ]
    }));
  };

  const removeCustomGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customization_groups: prev.customization_groups?.filter((_, i) => i !== index)
    }));
  };

  const updateCustomGroup = (index: number, updates: Partial<CustomizationGroup>) => {
    setFormData(prev => ({
      ...prev,
      customization_groups: prev.customization_groups?.map((g, i) => i === index ? { ...g, ...updates } : g)
    }));
  };

  const addOption = (groupIndex: number) => {
    setFormData(prev => ({
      ...prev,
      customization_groups: prev.customization_groups?.map((g, i) => 
        i === groupIndex ? { ...g, options: [...g.options, { name: 'Pilihan Baru', price: 0, is_available: true }] } : g
      )
    }));
  };

  const removeOption = (groupIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      customization_groups: prev.customization_groups?.map((g, i) => 
        i === groupIndex ? { ...g, options: g.options.filter((_, oi) => oi !== optionIndex) } : g
      )
    }));
  };

  const updateOption = (groupIndex: number, optionIndex: number, updates: Partial<CustomizationOption>) => {
    setFormData(prev => ({
      ...prev,
      customization_groups: prev.customization_groups?.map((g, i) => 
        i === groupIndex ? { ...g, options: g.options.map((o, oi) => oi === optionIndex ? { ...o, ...updates } : o) } : g
      )
    }));
  };

  const handleOpenTemplateModal = (template?: any) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateFormData({
        name: template.name,
        is_required: template.is_required,
        min_selection: template.min_selection,
        max_selection: template.max_selection,
        options: template.options || []
      });
    } else {
      setEditingTemplate(null);
      setTemplateFormData({
        name: '',
        is_required: false,
        min_selection: 0,
        max_selection: 1,
        options: []
      });
    }
    setIsTemplateModalOpen(true);
  };

  const handleSubmitTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      await api.updateCustomizationTemplate(editingTemplate.id, templateFormData);
    } else {
      await api.addCustomizationTemplate(templateFormData);
    }
    setIsTemplateModalOpen(false);
    loadData();
  };

  const handleDeleteTemplate = async (id: number) => {
    if (confirm('Hapus template kustomisasi ini?')) {
      await api.deleteCustomizationTemplate(id);
      loadData();
    }
  };

  const addTemplateOption = () => {
    setTemplateFormData(prev => ({
      ...prev,
      options: [...prev.options, { name: 'Pilihan Baru', price: 0, is_available: true }]
    }));
  };

  const removeTemplateOption = (index: number) => {
    setTemplateFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const updateTemplateOption = (index: number, updates: Partial<CustomizationOption>) => {
    setTemplateFormData(prev => ({
      ...prev,
      options: prev.options.map((o, i) => i === index ? { ...o, ...updates } : o)
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      // Fallback to mock base64 if not configured
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
      return;
    }

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData(prev => ({ ...prev, image_url: data.secure_url }));
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('Unggah gambar gagal. Silakan periksa konfigurasi Cloudinary Anda.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      // Focus the first input
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus
        triggerRef.current?.focus();
      };
    }
  }, [isModalOpen]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Manajemen Produk</h2>
          <p className="text-[#8C7B6E]">Kelola menu dan kustomisasi produk Anda.</p>
        </div>
        
        <div className="flex gap-3">
          {activeTab === 'products' ? (
            <button onClick={() => handleOpenModal()} className="btn btn-primary">
              <Plus size={20} />
              Tambah Produk
            </button>
          ) : (
            <button onClick={() => handleOpenTemplateModal()} className="btn btn-primary">
              <Plus size={20} />
              Tambah Grup Kustomisasi
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#E8E1D9]">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 text-sm font-bold transition-all relative ${
            activeTab === 'products' ? 'text-[#6F4E37]' : 'text-[#8C7B6E] hover:text-[#6F4E37]'
          }`}
        >
          Daftar Produk
          {activeTab === 'products' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F4E37]" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 text-sm font-bold transition-all relative ${
            activeTab === 'templates' ? 'text-[#6F4E37]' : 'text-[#8C7B6E] hover:text-[#6F4E37]'
          }`}
        >
          Grup Kustomisasi (Add-ons)
          {activeTab === 'templates' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F4E37]" />
          )}
        </button>
      </div>

      <div className="space-y-12">
        {activeTab === 'products' ? (
          <>
            {categories.map(category => {
              const categoryProducts = products.filter(p => p.category_id === category.id);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={category.id} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-[#6F4E37]">{category.name}</h3>
                    <div className="h-[1px] flex-1 bg-[#E8E1D9]"></div>
                    <span className="text-xs font-bold text-[#8C7B6E] uppercase tracking-widest">{categoryProducts.length} Item</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#E8E1D9] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#FDFCFB] text-[#8C7B6E] text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-bold">Produk</th>
                            <th className="px-6 py-4 font-bold">Harga</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E1D9]">
                          {categoryProducts.map(product => (
                            <tr key={product.id} className="hover:bg-[#FDFCFB] transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="relative w-12 h-12 shrink-0">
                                    <img src={product.image_url} className="w-full h-full rounded-lg object-cover" referrerPolicy="no-referrer" />
                                    {!product.is_available && <div className="absolute inset-0 bg-black/20 rounded-lg" />}
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#1A1A1A]">{product.name}</p>
                                    <p className="text-xs text-[#8C7B6E] line-clamp-1 max-w-xs">{product.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-bold text-[#6F4E37]">Rp {product.price.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {product.is_available ? 'Tersedia' : 'Stok Habis'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => { setSelectedProduct(product); setIsDetailModalOpen(true); }} 
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#6F4E37] bg-[#FDFCFB] border border-[#E8E1D9] hover:bg-[#F5F1ED] rounded-xl transition-all shadow-sm"
                                  >
                                    <Eye size={14} />
                                    <span>Detail</span>
                                  </button>
                                  <button 
                                    onClick={() => handleOpenModal(product)} 
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100"
                                    title="Edit Produk"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(product.id)} 
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                    title="Hapus Produk"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              );
            })}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8E1D9] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FDFCFB] text-[#8C7B6E] text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Nama Grup</th>
                    <th className="px-6 py-4 font-bold">Wajib</th>
                    <th className="px-6 py-4 font-bold">Min/Maks</th>
                    <th className="px-6 py-4 font-bold">Pilihan</th>
                    <th className="px-6 py-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E1D9]">
                  {customizationTemplates.map(template => (
                    <tr key={template.id} className="hover:bg-[#FDFCFB] transition-colors">
                      <td className="px-6 py-4 font-bold">{template.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${template.is_required ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                          {template.is_required ? 'Ya' : 'Tidak'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{template.min_selection} - {template.max_selection}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(template.options || []).map((o: any, idx: number) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-white border border-[#E8E1D9] rounded text-[#8C7B6E]">
                              {o.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenTemplateModal(template)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteTemplate(template.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customizationTemplates.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#8C7B6E]">
                        Belum ada grup kustomisasi (template).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white z-[60] rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-[#E8E1D9] flex items-center justify-between bg-[#FDFCFB]">
                <h3 className="text-xl font-bold">Detail Produk</h3>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-[#F5F1ED] rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-6">
                  <img src={selectedProduct.image_url} className="w-32 h-32 rounded-2xl object-cover shadow-md" referrerPolicy="no-referrer" />
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-[#F5F1ED] text-[#6F4E37] rounded-full text-[10px] font-bold uppercase">
                      {selectedProduct.category_name}
                    </span>
                    <h4 className="text-2xl font-bold">{selectedProduct.name}</h4>
                    <p className="text-xl font-bold text-[#6F4E37]">Rp {selectedProduct.price.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase ${selectedProduct.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedProduct.is_available ? 'Tersedia' : 'Stok Habis'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider">Deskripsi</h5>
                  <p className="text-[#1A1A1A] leading-relaxed">{selectedProduct.description}</p>
                </div>
                {selectedProduct.customization_groups && selectedProduct.customization_groups.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider">Kustomisasi</h5>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedProduct.customization_groups.map((group, idx) => (
                        <div key={idx} className="p-3 bg-[#FDFCFB] rounded-xl border border-[#E8E1D9]">
                          <p className="text-sm font-bold mb-2">{group.name} <span className="text-[10px] text-[#8C7B6E] font-normal">({group.is_required ? 'Wajib' : 'Opsional'})</span></p>
                          <div className="flex flex-wrap gap-2">
                            {group.options.map((opt, oIdx) => (
                              <span key={oIdx} className={`text-[10px] px-2 py-1 rounded border ${opt.is_available ? 'border-[#E8E1D9] text-[#8C7B6E]' : 'border-red-100 text-red-400 line-through'}`}>
                                {opt.name} {opt.price > 0 && `(+${opt.price})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-[#E8E1D9] bg-[#FDFCFB]">
                <button onClick={() => { setIsDetailModalOpen(false); handleOpenModal(selectedProduct); }} className="w-full btn btn-primary">
                  <Edit2 size={18} />
                  Edit Produk Ini
                </button>
              </div>
            </motion.div>
          </>
        )}

        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              className="fixed inset-0 m-auto w-full max-w-2xl max-h-[90vh] bg-white z-[60] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-[#E8E1D9] flex items-center justify-between shrink-0">
                <h3 id="modal-title" className="text-xl font-bold">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg"
                  aria-label="Tutup modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <form id="product-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#8C7B6E]">Informasi Dasar</h4>
                    <div>
                      <label htmlFor="product-name" className="form-label">Nama Produk</label>
                      <input 
                        id="product-name"
                        type="text" 
                        className="form-input" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                        ref={firstInputRef}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="product-category" className="form-label">Kategori</label>
                        <select 
                          id="product-category"
                          className="form-input"
                          value={formData.category_id}
                          onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})}
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="product-price" className="form-label">Harga (Rp)</label>
                        <input 
                          id="product-price"
                          type="number" 
                          className="form-input" 
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="product-description" className="form-label">Deskripsi</label>
                      <textarea 
                        id="product-description"
                        className="form-input h-24 resize-none" 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#FDFCFB] rounded-2xl border border-[#E8E1D9]">
                      <input 
                        id="product-available"
                        type="checkbox" 
                        className="w-5 h-5 rounded border-[#E8E1D9] text-[#6F4E37] focus:ring-[#6F4E37]"
                        checked={formData.is_available}
                        onChange={e => setFormData({...formData, is_available: e.target.checked})}
                      />
                      <label htmlFor="product-available" className="font-bold text-sm cursor-pointer">
                        Produk tersedia untuk dipesan
                      </label>
                    </div>

                    <div>
                      <label htmlFor="product-image-url" className="form-label">Gambar Produk</label>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                          <input 
                            id="product-image-url"
                            type="text" 
                            className="form-input flex-1" 
                            placeholder="Tempel URL gambar atau unggah di bawah"
                            value={formData.image_url}
                            onChange={e => setFormData({...formData, image_url: e.target.value})}
                            required
                          />
                          <div className="w-12 h-12 bg-[#F5F1ED] rounded-xl flex items-center justify-center text-[#6F4E37] overflow-hidden border border-[#E8E1D9] shrink-0">
                            {formData.image_url ? (
                              <img src={formData.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <ImageIcon size={20} />
                            )}
                          </div>
                        </div>
                        
                        <div 
                          onClick={() => !isUploading && fileInputRef.current?.click()}
                          className={`border-2 border-dashed border-[#E8E1D9] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#6F4E37] hover:bg-[#F5F1ED] transition-all group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white transition-colors">
                            {isUploading ? (
                              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload size={20} />
                            )}
                          </div>
                          <p className="text-sm font-bold">
                            {isUploading ? 'Mengunggah ke Cloudinary...' : 'Klik untuk unggah gambar'}
                          </p>
                          <p className="text-xs text-[#8C7B6E]">PNG, JPG atau WEBP (Maks 2MB)</p>
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#E8E1D9]" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[#8C7B6E]">Grup Kustomisasi</h4>
                      <div className="flex items-center gap-2">
                        {customizationTemplates.length > 0 && (
                          <div className="relative group">
                            <button 
                              type="button" 
                              className="text-xs font-bold text-[#8C7B6E] hover:text-[#6F4E37] flex items-center gap-1"
                            >
                              <Plus size={14} /> Tambah dari Template
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E8E1D9] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              {customizationTemplates.map(t => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      customization_groups: [...(formData.customization_groups || []), {
                                        name: t.name,
                                        is_required: t.is_required,
                                        min_selection: t.min_selection,
                                        max_selection: t.max_selection,
                                        options: (t.options || []).map((o: any) => ({ ...o }))
                                      }]
                                    });
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-[#3C2A21] hover:bg-[#FDFCFB] first:rounded-t-xl last:rounded-b-xl"
                                >
                                  {t.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <button 
                          type="button" 
                          onClick={addCustomGroup}
                          className="text-xs font-bold text-[#6F4E37] hover:underline flex items-center gap-1"
                        >
                          <Plus size={14} /> Tambah Grup Baru
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {formData.customization_groups?.map((group, gIndex) => (
                        <div key={gIndex} className="p-4 bg-[#FDFCFB] rounded-2xl border border-[#E8E1D9] space-y-4">
                          <div className="flex gap-4 items-start">
                            <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold uppercase text-[#8C7B6E] mb-1 block">Nama Grup</label>
                                  <input 
                                    type="text" 
                                    className="form-input py-2 text-sm" 
                                    value={group.name}
                                    onChange={e => updateCustomGroup(gIndex, { name: e.target.value })}
                                    placeholder="misal Temperatur"
                                  />
                                </div>
                                <div className="flex items-end gap-3 pb-2">
                                  <input 
                                    type="checkbox" 
                                    id={`req-${gIndex}`}
                                    className="w-4 h-4 rounded border-[#E8E1D9] text-[#6F4E37]"
                                    checked={group.is_required}
                                    onChange={e => updateCustomGroup(gIndex, { is_required: e.target.checked })}
                                  />
                                  <label htmlFor={`req-${gIndex}`} className="text-xs font-bold cursor-pointer">Wajib</label>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold uppercase text-[#8C7B6E] mb-1 block">Pilihan Min</label>
                                  <input 
                                    type="number" 
                                    className="form-input py-2 text-sm" 
                                    value={group.min_selection}
                                    onChange={e => updateCustomGroup(gIndex, { min_selection: parseInt(e.target.value) })}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold uppercase text-[#8C7B6E] mb-1 block">Pilihan Maks</label>
                                  <input 
                                    type="number" 
                                    className="form-input py-2 text-sm" 
                                    value={group.max_selection}
                                    onChange={e => updateCustomGroup(gIndex, { max_selection: parseInt(e.target.value) })}
                                  />
                                </div>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeCustomGroup(gIndex)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="pl-4 border-l-2 border-[#E8E1D9] space-y-3">
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] font-bold uppercase text-[#8C7B6E]">Pilihan</p>
                              <button 
                                type="button" 
                                onClick={() => addOption(gIndex)}
                                className="text-[10px] font-bold text-[#6F4E37] hover:underline flex items-center gap-1"
                              >
                                <Plus size={12} /> Tambah Pilihan
                              </button>
                            </div>
                            <div className="space-y-2">
                              {(group.options || []).map((option, oIndex) => (
                                <div key={oIndex} className="flex gap-2 items-center">
                                  <input 
                                    type="text" 
                                    className="form-input py-1 text-xs flex-1" 
                                    value={option.name}
                                    onChange={e => updateOption(gIndex, oIndex, { name: e.target.value })}
                                    placeholder="Nama Pilihan"
                                  />
                                  <div className="relative w-24">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#8C7B6E]">Rp</span>
                                    <input 
                                      type="number" 
                                      className="form-input py-1 pl-7 text-xs" 
                                      value={option.price}
                                      onChange={e => updateOption(gIndex, oIndex, { price: parseInt(e.target.value) })}
                                    />
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => updateOption(gIndex, oIndex, { is_available: !option.is_available })}
                                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${option.is_available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                                  >
                                    {option.is_available ? 'Siap' : 'Habis'}
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => removeOption(gIndex, oIndex)}
                                    className="p-1 text-[#8C7B6E] hover:text-red-500"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-[#E8E1D9] bg-[#FDFCFB] shrink-0">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn btn-outline">Batal</button>
                  <button type="submit" form="product-form" className="flex-1 btn btn-primary">
                    <Save size={20} />
                    {editingProduct ? 'Perbarui Produk' : 'Simpan Produk'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
        {/* Template Modal */}
        {isTemplateModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTemplateModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] bg-white z-[60] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-[#E8E1D9] flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold">{editingTemplate ? 'Edit Grup Kustomisasi' : 'Tambah Grup Kustomisasi'}</h3>
                <button onClick={() => setIsTemplateModalOpen(false)} className="p-2 hover:bg-[#F5F1ED] rounded-lg">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="form-label">Nama Grup</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={templateFormData.name}
                    onChange={e => setTemplateFormData({...templateFormData, name: e.target.value})}
                    placeholder="misal: Tambahan Topping"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#FDFCFB] rounded-2xl border border-[#E8E1D9]">
                    <input 
                      type="checkbox" 
                      id="template-required"
                      className="w-5 h-5 rounded border-[#E8E1D9] text-[#6F4E37]"
                      checked={templateFormData.is_required}
                      onChange={e => setTemplateFormData({...templateFormData, is_required: e.target.checked})}
                    />
                    <label htmlFor="template-required" className="font-bold text-sm cursor-pointer">Wajib</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#8C7B6E] mb-1 block">Min</label>
                      <input 
                        type="number" 
                        className="form-input py-2" 
                        value={templateFormData.min_selection}
                        onChange={e => setTemplateFormData({...templateFormData, min_selection: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#8C7B6E] mb-1 block">Maks</label>
                      <input 
                        type="number" 
                        className="form-input py-2" 
                        value={templateFormData.max_selection}
                        onChange={e => setTemplateFormData({...templateFormData, max_selection: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider">Daftar Pilihan</h5>
                    <button 
                      type="button" 
                      onClick={addTemplateOption}
                      className="text-xs font-bold text-[#6F4E37] flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> Tambah Pilihan
                    </button>
                  </div>
                  <div className="space-y-2">
                    {templateFormData.options.map((option, idx) => (
                      <div key={idx} className="flex gap-2 items-center p-3 bg-[#FDFCFB] rounded-xl border border-[#E8E1D9]">
                        <input 
                          type="text" 
                          className="form-input py-1 text-sm flex-1" 
                          value={option.name}
                          onChange={e => updateTemplateOption(idx, { name: e.target.value })}
                          placeholder="Nama (misal: Keju)"
                        />
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#8C7B6E]">Rp</span>
                          <input 
                            type="number" 
                            className="form-input py-1 pl-7 text-sm" 
                            value={option.price}
                            onChange={e => updateTemplateOption(idx, { price: parseInt(e.target.value) })}
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => updateTemplateOption(idx, { is_available: !option.is_available })}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${option.is_available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                        >
                          {option.is_available ? 'Siap' : 'Habis'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeTemplateOption(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {templateFormData.options.length === 0 && (
                      <p className="text-center py-4 text-xs text-[#8C7B6E] border-2 border-dashed border-[#E8E1D9] rounded-xl">
                        Belum ada pilihan. Klik "Tambah Pilihan" di atas.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#E8E1D9] bg-[#FDFCFB]">
                <div className="flex gap-3">
                  <button onClick={() => setIsTemplateModalOpen(false)} className="flex-1 btn btn-outline">Batal</button>
                  <button onClick={handleSubmitTemplate} className="flex-1 btn btn-primary">
                    <Save size={20} />
                    Simpan Grup
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
