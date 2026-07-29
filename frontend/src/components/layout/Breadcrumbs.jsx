// src/components/layout/Breadcrumbs.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const routeNames = {
    'skill-tree': 'Дерево навыков',
    'profile': 'Мой профиль',
    'achievements': 'Достижения',
    'cv': 'Генератор CV',
    'statistics': 'Статистика',
    'settings': 'Настройки системы',
    'skills': 'Карта развития',
    'ledger': 'История заявок', 
    'submit-achievement': 'Подать заявку'
  };

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-4 font-medium" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-[#00468c] text-slate-400 transition-colors flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = routeNames[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {last ? (
              <span className="text-slate-700 font-semibold">{name}</span>
            ) : (
              <Link to={to} className="hover:text-[#00468c] text-slate-500 transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;