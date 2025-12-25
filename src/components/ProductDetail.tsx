import React, { useState } from 'react';
import { Bell, Search, ArrowLeft, Star } from 'lucide-react';

interface ProductDetailProps {
  onBack: () => void;
}

const productImages = [
  'https://images.unsplash.com/photo-1760860992928-221d73c4c0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'https://images.unsplash.com/photo-1646579360571-de5ecf3af648?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'https://images.unsplash.com/photo-1761864293811-d6e937225df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
];

const reviews = [
  {
    id: 1,
    name: 'Lucia',
    rating: 5,
    text: 'Lorem ipsum dolor sit amet consectetur. Lacus Id rutrum netus dictumst rhoncus molestie.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

export default function ProductDetail({ onBack }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('Sweet Flower');
  const [selectedSize, setSelectedSize] = useState('Travel Size');

  const variants = ['Sweet Flower', 'Deep Forest', 'Ocean', 'Vanilla blue'];
  const sizes = ['Travel Size', '60ml'];

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1>Product</h1>
        </div>
        
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
      <main className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-xl overflow-hidden mb-4">
              <img
                src={productImages[selectedImage]}
                alt="Product"
                className="w-full h-[500px] object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-white rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-[#a89076]' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Ratings Section */}
            <div className="bg-white rounded-xl p-6 mt-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#a89076] rounded-lg flex items-center justify-center">
                    <Star size={24} className="text-white fill-white" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Ratings</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl">4.9</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Based on of 05 ratings</p>
                </div>

                <div className="flex-1"></div>

                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#a89076] rounded-lg flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Global Review</p>
                </div>
              </div>

              {/* Reviews */}
              {reviews.map((review) => (
                <div key={review.id} className="border-t border-gray-200 pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4>{review.name}</h4>
                      <div className="flex items-center gap-1 my-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.text}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-13">
                    {[review.avatar, review.avatar, review.avatar].map((avatar, i) => (
                      <img
                        key={i}
                        src={avatar}
                        alt="Review photo"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div>
            <div className="bg-white rounded-xl p-6">
              {/* Stock and Sales */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#faf8f4] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      📦
                    </div>
                    <span className="text-sm text-gray-600">Stock</span>
                  </div>
                  <p className="text-2xl">245</p>
                  <p className="text-sm text-gray-500">Pack</p>
                </div>
                <div className="bg-[#faf8f4] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      🛒
                    </div>
                    <span className="text-sm text-gray-600">Sales</span>
                  </div>
                  <p className="text-2xl">12.345</p>
                  <p className="text-sm text-gray-500">Pack</p>
                </div>
              </div>

              {/* Product Name and Price */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="mb-2">Name Produk</h2>
                  <p className="text-sm text-gray-500">ID Product</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl text-[#a89076]">$80.00</p>
                </div>
              </div>

              {/* About Product */}
              <div className="mb-6">
                <h3 className="mb-3">About Product</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur. Eget gravida nisl faucibus egestas. Fames pharetra elit etiam scelerisque ultricies a orci sed mus.
                </p>
              </div>

              {/* Variant Product */}
              <div className="mb-6">
                <h3 className="mb-3">Variant Produk</h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedVariant === variant
                          ? 'border-[#a89076] bg-[#faf8f4]'
                          : 'border-gray-300 hover:border-[#a89076]'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Product */}
              <div className="mb-6">
                <h3 className="mb-3">Size Product</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'border-[#a89076] bg-[#faf8f4]'
                          : 'border-gray-300 hover:border-[#a89076]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-6">
                <h3 className="mb-3">Additional Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Items Detail : 10 • 23 cm</p>
                  <p className="text-gray-600">
                    How to use: m dolor sit amet consectetur. Eget gravida nisl faucibus egesta
                  </p>
                  <p className="text-gray-600">
                    Composision: m dolor sit amet consectetur. Eget gravida nisl faucibus egestas. Fames pharetra elit etiam scelerisque ultricies a orci sed mus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
