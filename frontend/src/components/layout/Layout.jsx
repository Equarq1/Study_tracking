import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut,
  Bell,
  ChevronDown,
  Shield,
  Zap,
  Target,
  GraduationCap
} from 'lucide-react';

const Layout = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Новый навык разблокирован!', time: '5 мин назад', read: false },
    { id: 2, text: 'Добавлено подтверждение по новой дисциплине', time: '1 час назад', read: false },
    { id: 3, text: 'Заявка успешно проверена ИИ', time: '3 часа назад', read: true },
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const navigate = useNavigate();
  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Данные пользователя
  const user = {
    name: 'Сергеев Сергей Сергеевич',
    role: 'Студент',
    avatar: 'СС',
    title: 'Активист',
    level: 3,
    xp: 340,
    email: 'sergeev@university.ru'
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsUserMenuOpen(false);
  };

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationsOpen(false);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans antialiased selection:bg-blue-100 flex flex-col">
      
      {/* Минималистичная шапка приложения */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto w-full">
          
          {/* Левая часть: Логотип (клик по нему ведет на главную) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group shrink-0">
              <div className="w-9 h-9 bg-[#00468c] rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-[#003366] transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[#00468c] font-bold text-base tracking-tight">StudPoints</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-medium border border-slate-200">КФУ</span>
                </div>
                <span className="text-slate-400 text-[10px] block -mt-0.5 font-medium tracking-tight">Личный кабинет студента</span>
              </div>
            </Link>
          </div>

          {/* Правая часть: Уведомления и Профиль */}
          <div className="flex items-center space-x-4 shrink-0">
            
            {/* Блок Уведомлений */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={handleToggleNotifications}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-lg transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00468c] rounded-full"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Уведомления</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-[#00468c] font-semibold hover:underline"
                      >
                        Прочитать все
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-3 text-xs transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                        <p className={`text-slate-700 ${!n.read ? 'font-medium' : ''}`}>{n.text}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Блок пользователя */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleToggleUserMenu}
                className="flex items-center space-x-2.5 hover:bg-slate-50 rounded-xl p-1.5 border border-transparent hover:border-slate-100 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#00468c] shadow-sm">
                  {user.avatar}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    {user.name} <ChevronDown className="w-3 h-3 text-slate-400" />
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {user.title} (ур. {user.level})
                  </p>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-full bg-[#00468c] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{user.role}</p>
                        <p className="text-[11px] font-mono text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* Карточка статуса в выпадающем списке */}
                    <div className="mt-3 p-3 bg-white rounded-lg border border-slate-100 shadow-inner space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Звание (Уровень {user.level})</span>
                        <span className="text-slate-800 font-bold">{user.xp} XP</span>
                      </div>
                      <div className="text-center py-1 bg-slate-50 rounded border border-slate-100">
                        <span className="text-[#00468c] font-black tracking-wide uppercase text-xs">
                          {user.title}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-1.5">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Мой профиль</span>
                    </Link>
                  </div>
                  
                  <div className="p-1.5 border-t border-slate-100 bg-slate-50/30">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Выйти из кабинета</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент страницы полностью во всю ширину */}
      <main className="pt-24 flex-grow w-full">
        <div className="px-4 sm:px-6 lg:px-8 pb-12 mx-auto max-w-7xl">
          {children || <Outlet />}
        </div>
      </main>

      {/* Полноэкранный футер */}
      <footer className="bg-white border-t border-slate-200 w-full mt-auto">
        <div className="mx-auto px-6 py-8 text-xs max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-slate-600">
            <div className="space-y-2.5">
              <h3 className="text-slate-900 font-bold flex items-center text-xs tracking-tight">
                <GraduationCap className="w-4 h-4 mr-2 text-[#00468c]" />
                StudPoints КФУ
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                Интеллектуальная подсистема учета и верификации профессиональных компетенций студентов Казанского федерального университета.
              </p>
              <div className="flex space-x-2">
                <span className="text-slate-500 text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-mono font-medium">
                  v2.0.1
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-2.5 tracking-tight text-[11px] uppercase">Разделы системы</h4>
              <ul className="space-y-1.5 text-[11px] font-semibold">
                <li><Link to="/skill-tree" className="text-slate-500 hover:text-[#00468c] transition-colors">Дерево навыков</Link></li>
                <li><Link to="/profile" className="text-slate-500 hover:text-[#00468c] transition-colors">Личный профиль</Link></li>
                <li><Link to="/cv" className="text-slate-500 hover:text-[#00468c] transition-colors">Цифровое портфолио</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-2.5 tracking-tight text-[11px] uppercase">Спецификация</h4>
              <ul className="space-y-1.5 text-[11px] font-medium text-slate-400">
                <li className="flex items-center"><Shield className="w-3.5 h-3.5 mr-2 text-emerald-600 shrink-0" /> Цифровая подпись данных</li>
                <li className="flex items-center"><Zap className="w-3.5 h-3.5 mr-2 text-amber-500 shrink-0" /> Асинхронный лог изменений</li>
                <li className="flex items-center"><Target className="w-3.5 h-3.5 mr-2 text-blue-500 shrink-0" /> Модульно-рейтинговый учёт</li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-2.5 tracking-tight text-[11px] uppercase">Поддержка ИАС</h4>
              <ul className="space-y-1 text-[11px] text-slate-500 font-medium">
                <li>📧 support@kpfu.ru</li>
                <li>📞 +7 (843) 233-71-00</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} Казанский (Приволжский) федеральный университет. Все права защищены.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Layout;