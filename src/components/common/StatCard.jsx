import React from 'react';

export const StatCard = ({ icon: Icon, title, value, subtext, trend, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-xl bg-white border border-slate-200 ${onClick ? 'hover:border-slate-300 cursor-pointer transition-all' : ''} shadow-2xs flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${trend.isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {trend.label}
          </span>
        )}
      </div>

      {subtext && (
        <div className="mt-2 text-xs font-medium text-slate-500">
          {subtext}
        </div>
      )}
    </div>
  );
};
