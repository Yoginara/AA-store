import React, { useState, useEffect } from "react";
import { Store, LogOut, Plus, Search, Trash2, Edit3, Image, Tag, Hash, Sparkles, Layers, Box, AlertCircle, ShoppingBag, FolderHeart, RefreshCw } from "lucide-react";
import { settings } from "../config/settings";

export default function AdminDashboard({ token, onLogout, onProductsUpdate, fallbackProducts = [] }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // State Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' atau 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

  // State Form Inputs
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("sepatu laki-laki");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("10");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formImageFile, setFormImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Ambil data produk saat masuk dashboard
  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${settings.apiBaseUrl}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        if (onProductsUpdate) onProductsUpdate(data);
      } else {
        throw new Error("Gagal memuat produk dari server API.");
      }
    } catch (err) {
      console.warn("⚠️  [OFFLINE DASHBOARD] Menggunakan penyimpanan data state produk lokal.");
      setProducts(fallbackProducts);
      if (onProductsUpdate) onProductsUpdate(fallbackProducts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Format Mata Uang Rupiah
  const formatPrice = (value) => {
    return `${settings.currency.symbol} ${value.toLocaleString(settings.currency.locale)}`;
  };

  // Tampilkan modal tambah
  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingProductId(null);
    setFormName("");
    setFormCategory("sepatu laki-laki");
    setFormPrice("");
    setFormStock("10");
    setFormDescription("");
    setFormImageUrl("");
    setFormImageFile(null);
    setError("");
    setIsModalOpen(true);
  };

  // Tampilkan modal edit
  const handleOpenEditModal = (product) => {
    setModalMode("edit");
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormStock(product.stock !== undefined ? product.stock.toString() : "10");
    setFormDescription(product.description || "");
    setFormImageUrl(product.image_url || "");
    setFormImageFile(null);
    setError("");
    setIsModalOpen(true);
  };

  // Tangani Simpan Data CRUD (Tambah / Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    if (!formName || !formPrice) {
      setError("Kolom Nama dan Harga wajib diisi.");
      setIsSaving(false);
      return;
    }

    // Siapkan data bungkusan Multi-part FormData
    const formData = new FormData();
    formData.append("name", formName);
    formData.append("category", formCategory);
    formData.append("price", formPrice);
    formData.append("stock", formStock);
    formData.append("description", formDescription);

    if (formImageFile) {
      formData.append("image", formImageFile);
    } else {
      formData.append("image_url", formImageUrl);
    }

    try {
      let response;
      const url = modalMode === "add" 
        ? `${settings.apiBaseUrl}/api/products` 
        : `${settings.apiBaseUrl}/api/products/${editingProductId}`;

      const method = modalMode === "add" ? "POST" : "PUT";

      response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`
          // Jangan letakkan 'Content-Type', biar browser menyetel batas boundary berkas FormData otomatis
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        fetchProducts(); // Refresh list produk
      } else {
        setError(data.message || "Gagal menyimpan perubahan ke database.");
      }
    } catch (err) {
      console.warn("⚠️  [OFFLINE CRUD CREATE/UPDATE] Mensimulasikan operasi simpan pada state lokal...");
      
      const priceNum = parseFloat(formPrice) || 0;
      const stockNum = parseInt(formStock) || 0;
      const dummyImg = formImageUrl || (formImageFile ? URL.createObjectURL(formImageFile) : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600");

      if (modalMode === "add") {
        // Simulasi tambah offline
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProd = {
          id: newId,
          name: formName,
          category: formCategory,
          price: priceNum,
          stock: stockNum,
          description: formDescription,
          image_url: dummyImg,
          rating: 4.5,
          reviews_count: 0,
          specs: { material: "Bahan Pilihan", weight: "500g", origin: "Lokal" }
        };
        const updatedList = [newProd, ...products];
        setProducts(updatedList);
        if (onProductsUpdate) onProductsUpdate(updatedList);
      } else {
        // Simulasi edit offline
        const updatedList = products.map((p) => {
          if (p.id === editingProductId) {
            return {
              ...p,
              name: formName,
              category: formCategory,
              price: priceNum,
              stock: stockNum,
              description: formDescription,
              image_url: dummyImg
            };
          }
          return p;
        });
        setProducts(updatedList);
        if (onProductsUpdate) onProductsUpdate(updatedList);
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Tangani Hapus Produk (DELETE)
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini dari database?")) return;

    try {
      const response = await fetch(`${settings.apiBaseUrl}/api/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        fetchProducts(); // Refresh list produk
      } else {
        alert(data.message || "Gagal menghapus produk dari server.");
      }
    } catch (err) {
      console.warn("⚠️  [OFFLINE CRUD DELETE] Mensimulasikan penghapusan produk pada state lokal...");
      const updatedList = products.filter(p => p.id !== productId);
      setProducts(updatedList);
      if (onProductsUpdate) onProductsUpdate(updatedList);
    }
  };

  // Filter & Pencarian Tabel
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Hitung Nilai Ringkasan Statistik
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 10), 0);
  const footwearCount = products.filter(p => p.category && !p.category.toLowerCase().startsWith("tas")).length;
  const bagsCount = products.filter(p => p.category === "tas sekolah").length;

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col lg:flex-row text-left">
      
      {/* 1. SIDEBAR DASHBOARD - Dark Theme */}
      <aside className="w-full lg:w-72 bg-primary-900 border-b lg:border-b-0 lg:border-r border-primary-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo Dashboard */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-orange text-white shadow-md shadow-accent-orange/15">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-serif text-base font-black text-white leading-tight">
                UD <span className="text-accent-gold">ABANG ADIK</span>
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-primary-400 font-bold">
                Dasbor Kontrol Admin
              </span>
            </div>
          </div>

          {/* Navigasi Sidebar */}
          <nav className="space-y-1">
            <p className="px-3 text-[9px] font-bold uppercase tracking-wider text-primary-500 mb-2">Main Menu</p>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent-orange/10 border-l-2 border-accent-orange text-accent-orange text-xs font-bold shadow-inner">
              <Box className="h-4 w-4" />
              <span>Kelola Persediaan Produk</span>
            </div>
            <button
              onClick={fetchProducts}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-primary-350 hover:bg-primary-850 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Sinkronisasi Data</span>
            </button>
          </nav>
        </div>

        {/* Profil Bawah / Keluar */}
        <div className="pt-6 border-t border-primary-800 flex items-center justify-between gap-2 mt-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-accent-orange/15 border border-accent-orange/30 flex items-center justify-center font-serif text-sm font-black text-accent-orange">
              A
            </div>
            <div className="text-left leading-none">
              <span className="block text-xs font-extrabold text-white">Administrator</span>
              <span className="text-[9px] text-primary-500 font-bold uppercase mt-0.5 inline-block">Online</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-primary-950 border border-primary-800 text-primary-400 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 transition-all"
            title="Keluar Akun Admin"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 2. AREA KONTEN UTAMA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        
        {/* Tajuk Dasbor */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-primary-900 pb-5">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-black text-white">
              Persediaan Gudang UD ABANG ADIK
            </h1>
            <p className="text-xs text-primary-400 font-semibold mt-1">
              Tambahkan produk baru, edit detail harga, kelola stok barang, dan unggah foto dagangan.
            </p>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-accent-orange px-5 py-3 text-xs font-bold text-white shadow-lg shadow-accent-orange/15 hover:bg-accent-orange-dark transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        {/* 3. KARTU METRIK STATISTIK RINGKAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Total Produk */}
          <div className="rounded-2xl border border-primary-800 bg-primary-900 p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-orange/10 text-accent-orange shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-primary-500">Total Jenis Produk</span>
              <span className="text-xl font-black text-white mt-0.5 block">{products.length} Items</span>
            </div>
          </div>

          {/* Card 3: Pembagian Kategori */}
          <div className="rounded-2xl border border-primary-800 bg-primary-900 p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-sage/10 text-accent-sage shrink-0">
              <FolderHeart className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-primary-500">Sebaran Jenis</span>
              <span className="text-xs font-black text-white mt-0.5 block">
                {footwearCount} Alas Kaki • {bagsCount} Tas Sekolah
              </span>
            </div>
          </div>

        </div>

        {/* 4. TABEL DATA PERSIDIAN */}
        <div className="rounded-2xl border border-primary-800 bg-primary-900 overflow-hidden shadow-2xl">
          
          {/* Header Tabel & Pencarian */}
          <div className="p-4 sm:p-5 border-b border-primary-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Cari produk di gudang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-primary-800 bg-primary-950 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-primary-600 focus:border-accent-orange focus:outline-none"
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
            </div>

            {/* Filter Kategori Tabel */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-primary-800 bg-primary-950 px-3.5 py-2.5 text-xs font-bold text-white focus:border-accent-orange focus:outline-none"
              >
                <option value="all">Semua Kategori</option>
                <option value="sepatu laki-laki">Sepatu Laki-Laki</option>
                <option value="sepatu perempuan">Sepatu Perempuan</option>
                <option value="sepatu anak">Sepatu Anak</option>
                <option value="sandal laki-laki">Sandal Laki-Laki</option>
                <option value="sandal perempuan">Sandal Perempuan</option>
                <option value="sandal anak">Sandal Anak</option>
                <option value="tas sekolah">Tas Sekolah</option>
              </select>
            </div>
          </div>

          {/* Area Data Render Grid */}
          {isLoading ? (
            <div className="py-20 text-center text-xs text-primary-400 font-bold animate-pulse">
              Sedang menyingkronkan persediaan barang...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center max-w-sm mx-auto space-y-2">
              <AlertCircle className="h-8 w-8 text-primary-600 mx-auto" />
              <h3 className="font-bold text-white text-sm">Persediaan Kosong</h3>
              <p className="text-xs text-primary-500 font-semibold leading-relaxed">
                Tidak ada produk di gudang yang sesuai dengan kata kunci atau filter pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-semibold text-left border-collapse">
                <thead>
                  <tr className="bg-primary-950/60 border-b border-primary-800 text-[10px] text-primary-450 uppercase tracking-widest font-black">
                    <th className="py-4 px-4 w-20">Foto</th>
                    <th className="py-4 px-4">Nama Produk</th>
                    <th className="py-4 px-4 w-28">Kategori</th>
                    <th className="py-4 px-4 w-32">Harga</th>
                    <th className="py-4 px-4 w-28 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-850/40">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-primary-950/20 transition-all">
                      {/* Foto */}
                      <td className="py-3.5 px-4">
                        <div className="h-11 w-11 rounded-lg border border-primary-800 bg-primary-950 overflow-hidden shrink-0">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      {/* Nama */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span className="block truncate max-w-xs sm:max-w-md" title={prod.name}>
                          {prod.name}
                        </span>
                        <span className="text-[9px] text-primary-500 font-bold uppercase mt-0.5 block tracking-wider">
                          ID: #{prod.id}
                        </span>
                      </td>
                      {/* Kategori */}
                      <td className="py-3.5 px-4 capitalize text-primary-300">
                        <span className="rounded-md bg-primary-950 border border-primary-850 px-2 py-0.5 inline-block text-[10px]">
                          {prod.category}
                        </span>
                      </td>
                      {/* Harga */}
                      <td className="py-3.5 px-4 font-extrabold text-accent-gold">
                        {formatPrice(prod.price)}
                      </td>
                      {/* Tindakan CRUD */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-primary-950 border border-primary-800 text-primary-300 hover:bg-accent-orange/15 hover:text-accent-orange hover:border-accent-orange/20 transition-all"
                            title="Edit Produk"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-primary-950 border border-primary-800 text-primary-300 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/20 transition-all"
                            title="Hapus Produk"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      {/* 5. MODAL FORM: TAMBAH & EDIT PRODUK (CRUD) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop penutup modal */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Konten Card Form */}
          <div className="relative w-full max-w-lg rounded-3xl bg-primary-900 border border-primary-800 shadow-2xl transition-all duration-300 z-10 overflow-hidden text-left">
            
            {/* Header Form */}
            <div className="bg-gradient-to-r from-accent-orange to-accent-gold-dark px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse text-white" />
                <h2 className="font-serif text-sm sm:text-base font-black">
                  {modalMode === "add" ? "Tambah Produk Baru" : "Edit Rincian Produk"}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs font-bold">
              {error && (
                <div className="rounded-xl bg-rose-955/20 border border-rose-900 p-3 text-rose-400 font-bold text-center">
                  ⚠️ {error}
                </div>
              )}

              {/* Input Nama */}
              <div className="space-y-1.5">
                <label className="text-primary-300">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Masukkan nama produk..."
                  className="w-full rounded-xl border border-primary-800 bg-primary-950 px-3.5 py-2.5 text-xs text-white focus:border-accent-orange focus:outline-none"
                />
              </div>

              {/* Pilihan Kategori */}
              <div className="space-y-1.5">
                <label className="text-primary-300 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-accent-orange" />
                  Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-xl border border-primary-800 bg-primary-950 px-3.5 py-2.5 text-xs font-bold text-white focus:border-accent-orange focus:outline-none"
                >
                  <option value="sepatu laki-laki">Sepatu Laki-Laki</option>
                  <option value="sepatu perempuan">Sepatu Perempuan</option>
                  <option value="sepatu anak">Sepatu Anak</option>
                  <option value="sandal laki-laki">Sandal Laki-Laki</option>
                  <option value="sandal perempuan">Sandal Perempuan</option>
                  <option value="sandal anak">Sandal Anak</option>
                  <option value="tas sekolah">Tas Sekolah</option>
                </select>
              </div>

              {/* Input Harga */}
              <div className="space-y-1.5">
                <label className="text-primary-300 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-accent-orange" />
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Contoh: 185000"
                  className="w-full rounded-xl border border-primary-800 bg-primary-950 px-3.5 py-2.5 text-xs text-white focus:border-accent-orange focus:outline-none"
                />
              </div>

              {/* Input Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-primary-300">Deskripsi Ringkas</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Masukkan keterangan material bahan, kelebihan, sol luar..."
                  className="w-full rounded-xl border border-primary-800 bg-primary-950 px-3.5 py-2.5 text-xs text-white focus:border-accent-orange focus:outline-none"
                />
              </div>

              {/* Unggah Gambar Produk (Image Upload) */}
              <div className="space-y-3 p-4 bg-primary-950/60 rounded-2xl border border-primary-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-orange flex items-center gap-1.5">
                  <Image className="h-3.5 w-3.5 text-accent-orange" />
                  Media Gambar Produk
                </span>
                
                {/* 1. File Upload berkas lokal */}
                <div className="space-y-1">
                  <label className="text-[10px] text-primary-400 block mb-1">Unggah Berkas Gambar Lokal (Multer)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormImageFile(e.target.files[0]);
                        setError("");
                      }
                    }}
                    className="w-full text-xs text-primary-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-900 file:text-white file:cursor-pointer"
                  />
                </div>

                {/* Pembatas Teks */}
                <div className="flex items-center gap-2 py-1">
                  <hr className="flex-grow border-primary-800" />
                  <span className="text-[9px] text-primary-500 font-bold uppercase shrink-0">ATAU MASUKKAN TAUTAN URL</span>
                  <hr className="flex-grow border-primary-800" />
                </div>

                {/* 2. Text Input URL */}
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      if (e.target.value) setFormImageFile(null); // Reset file selection
                    }}
                    placeholder="Gunakan URL Unsplash (Contoh: https://images.unsplash.com/...)"
                    className="w-full rounded-xl border border-primary-800 bg-primary-950 px-3.5 py-2.5 text-xs text-white focus:border-accent-orange focus:outline-none"
                    disabled={!!formImageFile}
                  />
                </div>
              </div>

              {/* Aksi Form Simpan */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-primary-800 hover:bg-primary-800 py-3 text-xs font-bold text-primary-300 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-accent-orange py-3 text-xs font-bold text-white shadow-lg shadow-accent-orange/15 hover:bg-accent-orange-dark transition-all cursor-pointer"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
// Icon Penutup Tambahan
function X(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
