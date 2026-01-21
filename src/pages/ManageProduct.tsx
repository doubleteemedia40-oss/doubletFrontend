import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Bold, Italic, List, Globe, Plus, X, Save } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useStore } from '../store/useStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/useToast';

const ManageProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { 
    categories, addCategory, deleteCategory, 
    regions, addRegion, deleteRegion,
    platforms, addPlatform, deletePlatform,
    addProduct, updateProduct, products, isLoading 
  } = useStore();
  
  // State for form fields
  const [productName, setProductName] = useState(existing?.name || '');
  const [platform, setPlatform] = useState(() => {
    const tag = existing?.features.find(f => f.toLowerCase().startsWith('platform:'));
    return tag ? tag.split(':')[1]?.trim() || '' : '';
  });
  const [category, setCategory] = useState(existing?.category || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [basePrice, setBasePrice] = useState(existing ? String(existing.price) : '');
  const [salePrice, setSalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState(existing ? String(existing.stock) : '10');
  const [inStock, setInStock] = useState(true);
  const [region, setRegion] = useState(() => {
    const tag = existing?.features.find(f => f.toLowerCase().startsWith('region:'));
    return tag ? tag.split(':')[1]?.trim() || 'Global (Worldwide)' : 'Global (Worldwide)';
  });
  const [accountAge, setAccountAge] = useState(() => {
    const tag = existing?.features.find(f => f.toLowerCase().startsWith('age:'));
    return tag ? tag.split(':')[1]?.trim() || '' : '';
  });
  const [useAge, setUseAge] = useState(() => {
    const tag = existing?.features.find(f => f.toLowerCase().startsWith('age:'));
    return !!tag;
  });
  const [useFollowers, setUseFollowers] = useState(() => {
    const tag = existing?.features.find(f => f.toLowerCase().startsWith('followers:'));
    return !!tag;
  });
  const [followersCount, setFollowersCount] = useState(() => {
    const tag = existing?.features.find(f => f.toLowerCase().startsWith('followers:'));
    return tag ? tag.split(':')[1]?.trim() || '' : '';
  });
  
  // Dynamic Features
  const [features, setFeatures] = useState<string[]>(() => {
    const feats = existing?.features || ['Email Verified', 'Instant Delivery'];
    return feats.filter(f => {
      const lf = f.toLowerCase();
      return !lf.startsWith('platform:') && !lf.startsWith('region:') && !lf.startsWith('age:') && !lf.startsWith('followers:');
    });
  });
  const [newFeature, setNewFeature] = useState('');

  // Category Management
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Region Management
  const [isManagingRegions, setIsManagingRegions] = useState(false);
  const [newRegion, setNewRegion] = useState('');

  // Platform Management
  const [isManagingPlatforms, setIsManagingPlatforms] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
 
  const handleAddRegion = () => {
    if (newRegion.trim()) {
      addRegion(newRegion.trim());
      setNewRegion('');
    }
  };
 
  const handleDeleteRegion = (reg: string) => {
    if (window.confirm(`Delete region "${reg}"?`)) {
      deleteRegion(reg);
      if (region === reg) setRegion('');
    }
  };
 
  const handleAddPlatform = () => {
    if (newPlatform.trim()) {
      addPlatform(newPlatform.trim());
      setNewPlatform('');
    }
  };
 
  const handleDeletePlatform = (plat: string) => {
    if (window.confirm(`Delete platform "${plat}"?`)) {
      deletePlatform(plat);
      if (platform === plat) setPlatform('');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    if (window.confirm(`Delete category "${cat}"?`)) {
      deleteCategory(cat);
      if (category === cat) setCategory('');
    }
  };

  const existing = id ? products.find(p => p.id === id) : undefined;
  useEffect(() => {
    // reset local state when navigated to "create" page
    if (!id) {
      setProductName('');
      setCategory('');
      setDescription('');
      setBasePrice('');
      setStockQuantity('10');
      setPlatform('');
      setRegion('Global (Worldwide)');
      setAccountAge('');
      setFollowersCount('');
      setUseAge(false);
      setUseFollowers(false);
      setFeatures(['Email Verified', 'Instant Delivery']);
    }
  }, [id]);

  const handleSave = async () => {
    if (!productName || !basePrice || !category) {
      alert('Please fill in required fields (Name, Price, Category)');
      return;
    }

    try {
      const payload = {
        name: productName,
        category,
        description,
        price: parseFloat(basePrice),
        stock: parseInt(stockQuantity) || 0,
        features: [...features, `Region: ${region}`, `Platform: ${platform}`],
      };
      if (useAge && accountAge) payload.features.push(`Age: ${accountAge}`);
      if (useFollowers && followersCount) payload.features.push(`Followers: ${followersCount}`);
      if (id) {
        await updateProduct({ id, ...payload });
        toast.success('Product updated successfully');
      } else {
        await addProduct(payload);
        toast.success('Product saved successfully');
      }
      navigate('/admin/dashboard');
    } catch {
      alert('Failed to save product');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#9ab3bc] mb-6">
          <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/admin/dashboard')}>Home</span>
          <ChevronRight size={16} />
          <span className="text-[#00bfff] font-medium">Manage Product</span>
        </nav>

        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{id ? 'Edit Product' : 'Manage Product'}</h1>
            <p className="text-[#9ab3bc] mt-2">Add or edit digital account details.</p>
          </div>
        </div>

        {/* Form Layout */}
        <div className="space-y-6">
          {/* Section 1: Basic Information */}
          <section className="bg-[#18282e] rounded-xl border border-[#2d4048] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2d4048] bg-[#18282e]/50">
              <h2 className="text-lg font-semibold text-white">Basic Information</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-[#9ab3bc] mb-2">Product Name *</label>
                  <input 
                    className="w-full bg-[#203239] border border-[#2d4048] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors" 
                    placeholder="e.g. Netflix Premium 4K UHD" 
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-[#9ab3bc]">Platform</label>
                    <button 
                      onClick={() => setIsManagingPlatforms(!isManagingPlatforms)}
                      className="text-xs text-[#00bfff] hover:text-white transition-colors"
                    >
                      {isManagingPlatforms ? 'Done' : 'Manage'}
                    </button>
                  </div>
 
                  {isManagingPlatforms ? (
                    <div className="bg-[#203239] border border-[#2d4048] rounded-lg p-3 space-y-3">
                      <div className="flex gap-2">
                        <input 
                          className="flex-1 bg-[#18282e] border border-[#2d4048] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#00bfff]"
                          placeholder="New Platform"
                          value={newPlatform}
                          onChange={(e) => setNewPlatform(e.target.value)}
                        />
                        <button 
                          onClick={handleAddPlatform}
                          className="bg-[#00bfff] text-white p-1 rounded hover:bg-[#00bfff]/80"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {platforms.map(plat => (
                          <div key={plat} className="flex justify-between items-center text-sm text-slate-300 bg-[#18282e] px-2 py-1 rounded">
                            <span>{plat}</span>
                            <button onClick={() => handleDeletePlatform(plat)} className="text-red-400 hover:text-red-300">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <select 
                        className="w-full bg-[#203239] border border-[#2d4048] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors appearance-none"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                      >
                        <option value="">Select Platform</option>
                        {platforms.map(plat => (
                          <option key={plat} value={plat}>{plat}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ab3bc] pointer-events-none">
                        <ChevronDown size={20} />
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-span-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-[#9ab3bc]">Category *</label>
                    <button 
                      onClick={() => setIsManagingCategories(!isManagingCategories)}
                      className="text-xs text-[#00bfff] hover:text-white transition-colors"
                    >
                      {isManagingCategories ? 'Done' : 'Manage'}
                    </button>
                  </div>
                  
                  {isManagingCategories ? (
                    <div className="bg-[#203239] border border-[#2d4048] rounded-lg p-3 space-y-3">
                      <div className="flex gap-2">
                        <input 
                          className="flex-1 bg-[#18282e] border border-[#2d4048] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#00bfff]"
                          placeholder="New Category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button 
                          onClick={handleAddCategory}
                          className="bg-[#00bfff] text-white p-1 rounded hover:bg-[#00bfff]/80"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {categories.map(cat => (
                          <div key={cat} className="flex justify-between items-center text-sm text-slate-300 bg-[#18282e] px-2 py-1 rounded">
                            <span>{cat}</span>
                            <button onClick={() => handleDeleteCategory(cat)} className="text-red-400 hover:text-red-300">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <select 
                        className="w-full bg-[#203239] border border-[#2d4048] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors appearance-none"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ab3bc] pointer-events-none">
                        <ChevronDown size={20} />
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-[#9ab3bc] mb-2">Description</label>
                  <div className="bg-[#203239] border border-[#2d4048] rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-2 py-2 border-b border-[#2d4048] bg-[#0f1e23]/30">
                      <button className="p-1.5 text-[#9ab3bc] hover:text-white rounded hover:bg-[#18282e] transition-colors" type="button">
                        <Bold size={18} />
                      </button>
                      <button className="p-1.5 text-[#9ab3bc] hover:text-white rounded hover:bg-[#18282e] transition-colors" type="button">
                        <Italic size={18} />
                      </button>
                      <button className="p-1.5 text-[#9ab3bc] hover:text-white rounded hover:bg-[#18282e] transition-colors" type="button">
                        <List size={18} />
                      </button>
                    </div>
                    <textarea 
                      className="w-full bg-[#203239] border-none px-4 py-3 text-white placeholder-gray-500 focus:ring-0 resize-y min-h-[120px] focus:outline-none" 
                      placeholder="Enter product details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Stock */}
          <section className="bg-[#18282e] rounded-xl border border-[#2d4048] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2d4048] bg-[#18282e]/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Pricing & Inventory</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-white cursor-pointer select-none" htmlFor="stock-toggle">In Stock</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#2d4048] checked:border-[#00bfff] checked:right-0 transition-all duration-300 left-0" 
                    id="stock-toggle" 
                    name="toggle" 
                    type="checkbox"
                  />
                  <label 
                    className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer border border-[#2d4048] ${inStock ? 'bg-[#00bfff]' : 'bg-[#203239]'}`} 
                    htmlFor="stock-toggle"
                  ></label>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9ab3bc] mb-2">Base Price (₦) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ab3bc]">₦</span>
                    <input 
                      className="w-full bg-[#203239] border border-[#2d4048] rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors" 
                      placeholder="0.00" 
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ab3bc] mb-2">Sale Price (₦)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ab3bc]">₦</span>
                    <input 
                      className="w-full bg-[#203239] border border-[#2d4048] rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors" 
                      placeholder="0.00" 
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ab3bc] mb-2">Stock Quantity</label>
                  <input 
                    className="w-full bg-[#203239] border border-[#2d4048] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors" 
                    type="number" 
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Account Details & Features */}
          <section className="bg-[#18282e] rounded-xl border border-[#2d4048] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2d4048] bg-[#18282e]/50">
              <h2 className="text-lg font-semibold text-white">Account Specs & Features</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-[#9ab3bc]">Region / Country</label>
                    <button 
                      onClick={() => setIsManagingRegions(!isManagingRegions)}
                      className="text-xs text-[#00bfff] hover:text-white transition-colors"
                    >
                      {isManagingRegions ? 'Done' : 'Manage'}
                    </button>
                  </div>

                  {isManagingRegions ? (
                    <div className="bg-[#203239] border border-[#2d4048] rounded-lg p-3 space-y-3">
                      <div className="flex gap-2">
                        <input 
                          className="flex-1 bg-[#18282e] border border-[#2d4048] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#00bfff]"
                          placeholder="New Region"
                          value={newRegion}
                          onChange={(e) => setNewRegion(e.target.value)}
                        />
                        <button 
                          onClick={handleAddRegion}
                          className="bg-[#00bfff] text-white p-1 rounded hover:bg-[#00bfff]/80"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {regions.map(reg => (
                          <div key={reg} className="flex justify-between items-center text-sm text-slate-300 bg-[#18282e] px-2 py-1 rounded">
                            <span>{reg}</span>
                            <button onClick={() => handleDeleteRegion(reg)} className="text-red-400 hover:text-red-300">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <select 
                        className="w-full bg-[#203239] border border-[#2d4048] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors appearance-none"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      >
                        <option value="">Select Region</option>
                        {regions.map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ab3bc] pointer-events-none">
                        <Globe size={20} />
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#9ab3bc]">Use Age</label>
                    <input
                      type="checkbox"
                      checked={useAge}
                      onChange={(e) => setUseAge(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  {useAge && (
                    <input 
                      className="w-full bg-[#203239] border border-[#2d4048] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors" 
                      placeholder="e.g. 3+ years, 1 Month" 
                      type="text"
                      value={accountAge}
                      onChange={(e) => setAccountAge(e.target.value)}
                    />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#9ab3bc]">Use Followers</label>
                    <input
                      type="checkbox"
                      checked={useFollowers}
                      onChange={(e) => setUseFollowers(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  {useFollowers && (
                    <input 
                      className="w-full bg-[#203239] border border-[#2d4048] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00bfff] focus:ring-1 focus:ring-[#00bfff] transition-colors" 
                      placeholder="e.g. 200+, 5k"
                      type="text"
                      value={followersCount}
                      onChange={(e) => setFollowersCount(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-[#9ab3bc] mb-2">Features</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    className="flex-1 bg-[#203239] border border-[#2d4048] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00bfff]"
                    placeholder="Add a feature (e.g., 'Warranty Included')"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <button 
                    onClick={handleAddFeature}
                    className="bg-[#2d4048] text-white px-4 rounded-lg hover:bg-[#3d5058] transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {features.map((feat, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-[#00bfff]/10 text-[#00bfff] border border-[#00bfff]/20">
                      {feat}
                      <button onClick={() => removeFeature(index)} className="hover:text-white transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {features.length === 0 && <span className="text-sm text-gray-500 italic">No features added yet.</span>}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 right-0 left-0 md:left-64 p-4 bg-[#0f1e23]/90 backdrop-blur-md border-t border-[#2d4048] z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2.5 text-sm font-medium text-[#9ab3bc] hover:text-white transition-colors" 
              type="button"
            >
              Cancel
            </button>
            <div className="flex gap-4">
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#00bfff] rounded-lg shadow-lg shadow-[#00bfff]/20 hover:bg-[#00bfff]/90 transition-all transform hover:translate-y-[-1px] flex items-center gap-2" 
                type="button"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageProduct;
