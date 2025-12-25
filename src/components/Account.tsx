import React, { useState } from 'react';
import { Bell, Search, ThumbsUp, MessageCircle, Monitor, LogOut as LogOutIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const responseData = [
  { day: '10', value: 20 },
  { day: '20', value: 40 },
  { day: '30', value: 60 },
  { day: '40', value: 50 },
  { day: '50', value: 80 },
  { day: '60', value: 70 },
  { day: '70', value: 85 },
  { day: '80', value: 90 },
  { day: '90', value: 75 },
  { day: '100', value: 95 },
];

const loginHistory = [
  { device: 'Iphone', date: 'Nov 23, 2023 at 08.00 am', icon: '📱' },
  { device: 'Website', date: 'Nov 23, 2023 at 08.00 am', icon: '🌐' },
  { device: 'website', date: 'Nov 23, 2023 at 08.00 am', icon: '🌐' },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState('Store Account');
  const [formData, setFormData] = useState({
    name: 'Dpopstudio',
    phone: '(406) 555-0120',
    email: 'dpop@site.com',
    about: 'A shop that sells various kinds of',
    address: '4517 Washington Ave. Manchester,',
  });

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <h1>Account</h1>
        
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
        {/* Tabs */}
        <div className="flex items-center gap-8 mb-8 border-b border-gray-200">
          {['Store Account', 'Internal Account'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 transition-colors relative ${
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

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="col-span-2 space-y-6">
            {/* Batch and Feedback */}
            <div className="grid grid-cols-2 gap-6">
              {/* Pro Sales */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#faf8f4] rounded-lg flex items-center justify-center">
                    <ThumbsUp size={20} className="text-[#a89076]" />
                  </div>
                  <p className="text-sm text-gray-600">Batch</p>
                </div>
                <h2>Pro Sales</h2>
              </div>

              {/* Feedback */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#faf8f4] rounded-lg flex items-center justify-center">
                    <MessageCircle size={20} className="text-[#a89076]" />
                  </div>
                  <p className="text-sm text-gray-600">Feedback</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <h2>4.9</h2>
                  <span className="text-gray-500">/out of 5.0</span>
                </div>
              </div>
            </div>

            {/* Store Performance */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3>Store Performance</h3>
              </div>
              
              <div className="relative mb-6">
                {/* Circular Progress */}
                <div className="w-48 h-48 mx-auto relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#f5f1e8"
                      strokeWidth="16"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#a89076"
                      strokeWidth="16"
                      strokeDasharray="502"
                      strokeDashoffset="150"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl mb-1">90</p>
                    <p className="text-sm text-gray-500">Point of 100</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-xl mb-1">You're Amazing🔥</p>
                <p className="text-sm text-gray-500">Your sales performance score is better than 80% other user</p>
              </div>
            </div>

            {/* Average Response */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3>Average Response</h3>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#a89076]">
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <h2>2 Hours</h2>
                <span className="text-green-600 text-sm">+8.34%</span>
              </div>

              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={responseData}>
                  <XAxis dataKey="day" tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Bar dataKey="value" fill="#a89076" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Login History */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#faf8f4] rounded-lg flex items-center justify-center">
                    <LogOutIcon size={20} className="text-[#a89076]" />
                  </div>
                  <h3>Login History</h3>
                </div>
                <button className="text-sm border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                  Logout All
                </button>
              </div>

              <div className="space-y-4">
                {loginHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#faf8f4] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
                        {item.icon}
                      </div>
                      <div>
                        <h4>{item.device}</h4>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-[#a89076] transition-colors">
                      Logout
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Edit Profile */}
          <div>
            <div className="bg-white rounded-xl p-6 sticky top-8">
              <h3 className="mb-6">Edit Profile</h3>

              {/* Profile Photo */}
              <div className="mb-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm">
                    Remove
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">About Store</label>
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Store Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#faf8f4] border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
