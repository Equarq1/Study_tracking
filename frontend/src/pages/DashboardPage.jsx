import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Trophy, Microscope, PlusCircle, History, ShieldAlert } from 'lucide-react';

// Имитация записей из базы данных (xp_ledger) со статусом approved
const mockXpLedger = [
  { id: 1, category: 'Учёба', title: 'Сдал зимнюю сессию на все отличные оценки', xp: 90 },
  { id: 2, category: 'Спорт', title: 'Второе место в межвузовском чемпионате по футболу', xp: 100 },
  { id: 3, category: 'Учёба', title: 'Победитель локального хакатона КФУ', xp: 100 },
  { id: 4, category: 'Наука', title: 'Публикация научной статьи', xp: 50 },
];

// Маппинг стилей под  категории
const categoryConfig = {
  'Учёба': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', barBg: 'bg-blue-600', icon: BookOpen },
  'Спорт': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', barBg: 'bg-emerald-600', icon: Trophy },
  'Наука': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', barBg: 'bg-purple-600', icon: Microscope }
};

const DashboardPage = () => {
  // Информация о студенте 
  const user = {
    name: 'Сергеев Сергей Сергеевич',
    group: '11-521',
    course: '2 курс',
    isCurator: true // Для отображения желтой панели куратора
  };

  // 1. ДИНАМИЧЕСКИЙ РАСЧЕТ XP
  const totalXp = mockXpLedger.reduce((sum, item) => sum + item.xp, 0);

  const xpByCategory = mockXpLedger.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.xp;
    return acc;
  }, { 'Учёба': 0, 'Спорт': 0, 'Наука': 0 });

  // 2. ОПРЕДЕЛЕНИЕ УРОВНЯ
  let level = { current: 1, title: 'Новичок', nextXp: 100, prevXp: 0 };
  if (totalXp >= 1000) level = { current: 5, title: 'Легенда', nextXp: 1000, prevXp: 1000 };
  else if (totalXp >= 600) level = { current: 4, title: 'Лидер', nextXp: 1000, prevXp: 600 };
  else if (totalXp >= 300) level = { current: 3, title: 'Активист', nextXp: 600, prevXp: 300 };
  else if (totalXp >= 100) level = { current: 2, title: 'Участник', nextXp: 300, prevXp: 100 };

  // Расчет прогресса для шкалы уровня
  const xpInCurrentLevel = totalXp - level.prevXp;
  const xpNeededForNext = level.nextXp - level.prevXp;
  const levelProgress = level.current === 5 ? 100 : (xpInCurrentLevel / xpNeededForNext) * 100;

  return (
    <div className="space-y-6">
      
      {/* ПАНЕЛЬ КУРАТОРА (Показывается только если пользователь куратор) */}
      {user.isCurator && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-xl text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Панель куратора</h4>
              <p className="text-[11px] text-slate-600 font-medium">Вам доступны 3 новые заявки студентов на верификацию баллов.</p>
            </div>
          </div>
          <Link 
            to="/curator-dashboard" 
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs text-center"
          >
            Перейти к проверке
          </Link>
        </div>
      )}

      {/* ОСНОВНОЙ ПРОФИЛЬ СТУДЕНТА */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Карточка уровня и данных */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#00468c]"></div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Студент КФУ</div>
            <h2 className="text-xl font-black text-slate-950 tracking-tight">{user.name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Группа {user.group} • {user.course}</p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">{totalXp}</span>
                <span className="text-xs font-bold text-slate-400 ml-1">Всего XP</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-[#00468c] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                  Ур. {level.current} — {level.title}
                </span>
              </div>
            </div>

            {/* Прогресс-бар уровня */}
            {level.current < 5 && (
              <div className="space-y-1.5">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#00468c] h-full transition-all duration-500" style={{ width: `${levelProgress}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>{level.prevXp} XP</span>
                  <span>Осталось {level.nextXp - totalXp} XP до уровня {level.current + 1}</span>
                  <span>{level.nextXp} XP</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Сильные стороны (XP по категориям) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#00468c]"></div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">Сильные стороны</h3>
          
          <div className="space-y-4">
            {Object.keys(categoryConfig).map((catName) => {
              const cfg = categoryConfig[catName];
              const xp = xpByCategory[catName] || 0;
              const percentage = totalXp > 0 ? (xp / totalXp) * 100 : 0;

              return (
                <div key={catName} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <cfg.icon className="w-3.5 h-3.5 text-slate-400" />
                      {catName}
                    </span>
                    <span className="text-slate-900 font-bold">{xp} XP</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${cfg.barBg} h-full transition-all`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ЛЕНТА ПОДТВЕРЖДЁННЫХ ДОСТИЖЕНИЙ ) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#00468c]" />
          Лента подтверждённых достижений (бейджи)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockXpLedger.map((badge) => {
            const style = categoryConfig[badge.category];
            const IconComponent = style.icon;
            
            return (
              <div 
                key={badge.id} 
                className={`flex flex-col justify-between p-4 rounded-xl border ${style.bg} ${style.border} transition-all hover:shadow-sm relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-1.5 rounded-lg bg-white shadow-xs ${style.text}`}>
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-xs font-black tracking-tight ${style.text}`}>
                    +{badge.xp} XP
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-2">
                  {badge.title}
                </p>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">
                  {badge.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link 
          to="/submit-achievement" 
          className="p-5 bg-[#00468c] hover:bg-[#003366] text-white rounded-2xl shadow-xs transition-all flex flex-col justify-between h-28 group"
        >
          <PlusCircle className="w-6 h-6 text-blue-200 group-hover:scale-110 transition-transform" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider block">Подать новую заявку</span>
            <span className="text-[10px] text-blue-200 font-medium">Отправить активность на анализ ИИ и проверку куратору</span>
          </div>
        </Link>

        <Link 
          to="/verification-ledger" 
          className="p-5 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-2xl shadow-xs transition-all flex flex-col justify-between h-28 group"
        >
          <History className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider block">Статус и история заявок</span>
            <span className="text-[10px] text-slate-500 font-medium">Посмотреть лог верификации и текущий статус проверок</span>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default DashboardPage;