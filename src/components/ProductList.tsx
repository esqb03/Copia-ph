import React, { useState } from 'react';
import { Bell, Search, ChevronDown, ChevronUp, Download } from 'lucide-react';

interface ProductListProps {
  onViewProduct: () => void;
}

const products = Array(8).fill(null).map((_, index) => ({
  id: 'P909',
  name: 'bodycare',
  icon: '🧴',
  totalBuyer: 2456,
  price: 34.00,
  stock: 249,
  status: 'active',
}));

const categories = [
  { id: 1, name: 'Category 1', checked: false },
  { id: 2, name: 'Category 2', checked: false },
  { id: 3, name: 'Category 3', checked: false },
  { id: 4, name: 'Category 4', checked: true },
];

const brands = [
  { id: 1, name: 'Brand A', checked: false },
  { id: 2, name: 'Brand B', checked: false },
  { id: 3, name: 'Brand C', checked: false },
  { id: 4, name: 'Brand D', checked: false },
  { id: 5, name: 'Brand E', checked: true },
];

export default function ProductList({ onViewProduct }: ProductListProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    size: true,
    price: true,
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [activeTab, setActiveTab] = useState('All Product');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const tabs = ['All Product', 'Live', 'Archive', 'Out of stock'];

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <h1>Product</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Anything..."
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#a89076] w-80"
            />
          </div>
          <button className="relative p-2 hover:bg-gray-50 rounded-lg">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-10 h-10 bg-[#a89076] rounded-full overflow-hidden">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-72 bg-white rounded-xl p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3>Filter By</h3>
            <button className="p-2 bg-[#faf8f4] rounded-lg hover:bg-[#f5f1e8] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a89076" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
          </div>

          {/* Category Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between mb-4"
            >
              <span>Category</span>
              {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.category && (
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={category.checked}
                      className="w-4 h-4 rounded border-gray-300 text-[#a89076] focus:ring-[#a89076]"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brand Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => toggleSection('brand')}
              className="w-full flex items-center justify-between mb-4"
            >
              <span>Brand</span>
              {expandedSections.brand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.brand && (
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={brand.checked}
                      className="w-4 h-4 rounded border-gray-300 text-[#a89076] focus:ring-[#a89076]"
                    />
                    <span className="text-sm text-gray-700">{brand.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Size Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => toggleSection('size')}
              className="w-full flex items-center justify-between mb-4"
            >
              <span>Size</span>
              {expandedSections.size ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {/* Price Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between mb-4"
            >
              <span>Price</span>
              {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.price && (
              <div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-[#e8dfd0] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#a89076]"
                />
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="w-full bg-[#a89076] hover:bg-[#967d63] text-white py-3 rounded-lg transition-colors">
            Apply
          </button>
        </div>

        {/* Products Table */}
        <div className="flex-1 bg-white rounded-xl p-6">
          {/* Search and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Product"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span>⋮</span>
                <span>Bulk Action</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={20} className="text-gray-600" />
                <span>Export Product</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#a89076] text-white rounded-lg hover:bg-[#967d63] transition-colors">
                <span>+</span>
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 transition-colors relative ${
                  activeTab === tab
                    ? 'text-[#a89076]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a89076]" />
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-600">ID</th>
                  <th className="text-left py-4 px-4 text-gray-600">Product</th>
                  <th className="text-left py-4 px-4 text-gray-600">Total Buyer</th>
                  <th className="text-left py-4 px-4 text-gray-600">Price</th>
                  <th className="text-left py-4 px-4 text-gray-600">Stock</th>
                  <th className="text-left py-4 px-4 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr 
                    key={index} 
                    onClick={onViewProduct}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">{product.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#a89076] rounded-lg flex items-center justify-center text-xl">
                          {product.icon}
                        </div>
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{product.totalBuyer}</td>
                    <td className="py-4 px-4">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-4">{product.stock}</td>
                    <td className="py-4 px-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a89076]"></div>
                        <span className="ml-3 text-sm">Active</span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">Showing 1 to 10 of 10 entries</p>
            <div className="flex items-center gap-2">
              {[1, 2, '...', 9, 10].map((page, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    page === 1
                      ? 'bg-[#a89076] text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
