// src/components/layout/PageLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const PageLayout = ({ children, title, subtitle, actions }) => {
  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* Заголовок страницы */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>

      {/* Основной контент страницы */}
      <div className="space-y-6">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default PageLayout;