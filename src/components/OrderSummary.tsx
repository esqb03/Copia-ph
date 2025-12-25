import React, { useState } from 'react';
import { Bell, Search, MoreVertical, Download, Filter } from 'lucide-react';

const orders = [
  {
    id: 'P909',
    customer: 'Jimmy Alan',
    order: { icon: '🧴', name: 'bodycare' },
    amount: '$233.00',
    date: 'Nov 23,2023',
    status: 'received',
  },
  {
    id: 'P910',
    customer: 'Dianne Russell',
    order: { icon: '🏠', name: 'Haircare' },
    amount: '$233.00',
    date: 'Nov 23,2023',
    status: 'shipping',
  },
  {
    id: 'P911',
    customer: 'Wade Warren',
    order: { icon: '💄', name: 'Skincare' },
    amount: '$233.00',
    date: 'Nov 23,2023',
    status: 'shipping',
  },
  {
    id: 'P912',
    customer: 'Brooklyn',
    order: { icon: '🧴', name: 'bodycare' },
    amount: '$233.00',
    date: 'Nov 23,2023',
    status: 'canceled',
  },
  {
    id: 'P913',
    customer: 'Leslie Alexander',
    order: { icon: '🧴', name: 'bodycare' },
    amount: '$233.00',
    date: 'Nov 23,2023',
    status: 'done',
  },
  {
    id: 'P914',
    customer: 'Jenny Wilson',
    order: { icon: '🏠', name: 'Haircare' },
    amount: '$233.00',
    date: 'Nov 23,2023',
    status: 'done',
  },
  {
    id: 'P915',
    customer: 'Guy Hawkins',
    order: { icon: '🧴', name: 'bodycare' },
    amount: '$233.00',
    date: 'Nov 23,2023',
    status: 'complaint',
  },
  {
    id: 'P916',
    customer: 'Robert Fox',
    order: { icon: '💄', name: 'Skincare' },
    amount: '$233.00',
    date: 'Nov 23,2023',
    status: 'done',
  },
];

const tabs = [
  { label: 'All Order', count: null },
  { label: 'Received', count: 20 },
  { label: 'Shipping', count: 30 },
  { label: 'Complaint', count: 1 },
  { label: 'Canceled', count: 4 },
  { label: 'Done', count: 2034 },
];

const statusStyles: { [key: string]: string } = {
  received: 'bg-green-100 text-green-700',
  shipping: 'bg-purple-100 text-purple-700',
  canceled: 'bg-gray-100 text-gray-700',
  done: 'bg-blue-100 text-blue-700',
  complaint: 'bg-red-100 text-red-700',
};

export default function OrderSummary() {
  const [activeTab, setActiveTab] = useState('All Order');

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <h1>Order Summary</h1>
        
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
        <div className="bg-white rounded-xl p-6">
          {/* Search and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Transaction"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={20} className="text-gray-600" />
                <span>Bulk Action</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={20} className="text-gray-600" />
                <span>Export Product</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`px-4 py-3 transition-colors relative ${
                  activeTab === tab.label
                    ? 'text-[#a89076]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && ` (${tab.count})`}
                {activeTab === tab.label && (
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
                  <th className="text-left py-4 px-4 text-gray-600">Customer</th>
                  <th className="text-left py-4 px-4 text-gray-600">Order</th>
                  <th className="text-left py-4 px-4 text-gray-600">Amount</th>
                  <th className="text-left py-4 px-4 text-gray-600">Date</th>
                  <th className="text-left py-4 px-4 text-gray-600">Status</th>
                  <th className="text-left py-4 px-4 text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">{order.id}</td>
                    <td className="py-4 px-4">{order.customer}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#a89076] bg-opacity-20 rounded-lg flex items-center justify-center text-xl">
                          {order.order.icon}
                        </div>
                        <span>{order.order.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{order.amount}</td>
                    <td className="py-4 px-4">{order.date}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm ${statusStyles[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={20} className="text-gray-400" />
                      </button>
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
