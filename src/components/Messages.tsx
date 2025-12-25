import React, { useState } from 'react';
import { Bell, Search, MoreVertical, Camera, Mic, Image, Send, MapPin, ChevronDown, ChevronUp, Package } from 'lucide-react';

const contacts = [
  {
    id: 1,
    name: 'Michael B',
    avatar: '👨',
    message: 'I placed an order, but will it take longer?',
    time: '',
    unread: 2,
    role: 'Customer',
  },
  {
    id: 2,
    name: 'Janet',
    avatar: '👩',
    message: 'I want to make changes to my sauce, I hope it',
    time: '',
    unread: 2,
  },
  {
    id: 3,
    name: 'Putri Adel',
    avatar: '👱‍♀️',
    message: 'I want to make changes to my sauce, I ho...',
    time: '',
    unread: 5,
  },
  {
    id: 4,
    name: 'Risa Anggraini',
    avatar: '👩‍🦰',
    message: 'I want to make changes to my sauce, I...',
    time: '',
    unread: 2,
  },
  {
    id: 5,
    name: 'Jonatan',
    avatar: '👨‍💼',
    message: 'I want to make changes to my sauce, I hope it',
    time: '',
    unread: 3,
  },
  {
    id: 6,
    name: 'Tegar',
    avatar: '👨‍🦱',
    message: 'I want to make changes to my sauce, I...',
    time: '',
    unread: 2,
  },
  {
    id: 7,
    name: 'Bambang',
    avatar: '👴',
    message: 'I want to make changes to my sauce, I hope it can be changed...',
    time: '',
    unread: 0,
  },
];

const messages = [
  {
    id: 1,
    sender: 'Michael B',
    text: 'Hi, I want to ask how is my item?',
    time: 'Yesterday',
    isMe: false,
  },
  {
    id: 2,
    sender: 'Me',
    text: 'I found it here, it hasn\'t been sent, even though it has passed the maximum date, please let me know',
    time: '05:30pm Michael B',
    isMe: false,
  },
  {
    id: 3,
    sender: 'Me',
    text: 'Sorry, the goods have been delivered to the courier, the update may be late due to the large amount of interest on 12.12',
    time: '06:20pm You',
    isMe: true,
  },
  {
    id: 4,
    sender: 'Michael B',
    text: 'Okay, thank you',
    time: '06:30pm Michael B',
    isMe: false,
  },
];

const orderDetails = {
  orderNumber: 'June 1, 2023, 08:22 AM',
  products: [
    {
      name: 'Lotion care',
      variant: 'Strawberry',
      quantity: 1,
      price: 23.00,
      image: '🧴',
    },
    {
      name: 'Lotion care',
      variant: 'Strawberry',
      quantity: 1,
      price: 23.00,
      image: '🧴',
    },
  ],
  delivery: {
    service: 'dpcpexpress',
    price: 3.00,
  },
  address: '2464 Royal Ln. Mesa, New Jersey 45463',
  payment: {
    subtotal: 46.00,
    delivery: 3.00,
    tax: 1.00,
    total: 50.00,
  },
};

export default function Messages() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [expandedSections, setExpandedSections] = useState({
    product: true,
    delivery: true,
    address: true,
    payment: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <h1>Messages</h1>
        
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
      <main className="p-8 h-[calc(100vh-88px)]">
        <div className="bg-white rounded-xl h-full flex overflow-hidden">
          {/* Contacts List */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-2 p-4 border-b border-gray-200">
              {['All', 'Unread', 'Complaint'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-[#a89076] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Contact List */}
            <div className="flex-1 overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    activeContact.id === contact.id ? 'bg-[#faf8f4]' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center text-2xl">
                    {contact.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span>{contact.name}</span>
                      {contact.unread > 0 && (
                        <span className="w-5 h-5 bg-[#a89076] text-white rounded-full flex items-center justify-center text-xs">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{contact.message}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center text-2xl">
                  {activeContact.avatar}
                </div>
                <div>
                  <h3>{activeContact.name}</h3>
                  <p className="text-sm text-gray-500">{activeContact.role || 'Customer'}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {message.id === 1 && (
                    <div className="text-center">
                      <span className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                        {message.time}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.isMe
                          ? 'bg-[#a89076] text-white'
                          : 'bg-[#faf8f4] text-gray-800'
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                  {message.time && message.id !== 1 && (
                    <p className={`text-xs text-gray-400 ${message.isMe ? 'text-right' : 'text-left'}`}>
                      {message.time}
                    </p>
                  )}
                </div>
              ))}
              
              {/* User Avatar and Last Message */}
              <div className="flex items-end gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a Notes...."
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:bg-gray-100"
                />
                <button className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Camera size={20} className="text-gray-400" />
                </button>
                <button className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Mic size={20} className="text-gray-400" />
                </button>
                <button className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Image size={20} className="text-gray-400" />
                </button>
                <button className="p-3 bg-[#a89076] hover:bg-[#967d63] rounded-lg transition-colors">
                  <Send size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Order Details Panel */}
          <div className="w-96 border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#faf8f4] rounded-lg flex items-center justify-center">
                    <Package size={18} className="text-[#a89076]" />
                  </div>
                  <h3>Detail Order</h3>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-6">Order #1 {orderDetails.orderNumber}</p>

              {/* Product Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('product')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <span>Product</span>
                  {expandedSections.product ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.product && (
                  <div className="space-y-3">
                    {orderDetails.products.map((product, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-[#faf8f4] rounded-lg">
                        <div className="w-12 h-12 bg-[#a89076] bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
                          {product.image}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-500">Variant: {product.variant}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">${product.price}</p>
                          <p className="text-xs text-gray-500">{product.quantity} Product</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('delivery')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <span>Delivery</span>
                  {expandedSections.delivery ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.delivery && (
                  <div className="flex items-center gap-3 p-3 bg-[#faf8f4] rounded-lg">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">📦</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{orderDetails.delivery.service}</p>
                      <p className="text-xs text-gray-500">Lorem ipsum dolor</p>
                    </div>
                    <p className="text-sm">${orderDetails.delivery.price.toFixed(2)}</p>
                  </div>
                )}
              </div>

              {/* Address Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('address')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <span>Address</span>
                  {expandedSections.address ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.address && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{orderDetails.address}</p>
                    <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.0060,40.7128,12,0/360x180@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
                        alt="Map"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div>
                <button
                  onClick={() => toggleSection('payment')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <span>Payment</span>
                  {expandedSections.payment ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.payment && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal(2 product)</span>
                      <span>${orderDetails.payment.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span>${orderDetails.payment.delivery.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${orderDetails.payment.tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between">
                      <span>Total</span>
                      <span className="text-lg">${orderDetails.payment.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
