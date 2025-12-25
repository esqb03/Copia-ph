import React from 'react';
import { X, Package, CreditCard, MessageSquare } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'order',
    icon: Package,
    title: 'Order Received!',
    message: 'The latest order has been received, please check and process it',
  },
  {
    id: 2,
    type: 'order',
    icon: Package,
    title: 'Order Received!',
    message: 'The latest order has been received, please check and process it',
  },
  {
    id: 3,
    type: 'payment',
    icon: CreditCard,
    title: 'Payment',
    message: 'Your transaction is being processed by us, wait 2-3 for disbursement to your account',
  },
  {
    id: 4,
    type: 'complaint',
    icon: MessageSquare,
    title: 'Complaint!',
    message: 'Check your order, there is a problem with the customer',
  },
  {
    id: 5,
    type: 'order',
    icon: Package,
    title: 'Order Received!',
    message: 'The latest order has been received, please check and process it',
  },
  {
    id: 6,
    type: 'order',
    icon: Package,
    title: 'Order Received!',
    message: 'The latest order has been received, please check and process it',
  },
];

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  return (
    <div className="fixed top-20 right-8 w-96 bg-white rounded-xl shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl">Notification</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-[#f5f1e8] rounded-lg flex items-center justify-center">
              <notification.icon size={24} className="text-[#a89076]" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">{notification.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
