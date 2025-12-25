import React from 'react';

interface StatsCardProps {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}

export default function StatsCard({ icon, title, value, subtitle }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#a89076] bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
          {icon}
        </div>
        <p className="text-gray-600">{title}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <h2>{value}</h2>
        <span className="text-gray-400">{subtitle}</span>
      </div>
    </div>
  );
}
