import React, { useState } from 'react';
import { User, GraduationCap, Save, CheckCircle, Key, Mail } from 'lucide-react';

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    lastName: 'Сергеев',       
    firstName: 'Сергей',        
    middleName: 'Сергеевич',    
    groupNumber: '11-521',    
    email: 'sergey.sergeev@kpfu.ru'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsPasswordModalOpen(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-semibold">
            Изменения успешно сохранены.
          </div>
        </div>
      )}

      {/* Верхняя панель действий */}
      <div className="flex justify-between items-center bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <button 
          type="button"
          onClick={() => setIsPasswordModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
        >
          <Key className="w-3.5 h-3.5 text-slate-500" />
          Сменить пароль
        </button>

        <div className="flex space-x-2">
          <button 
            type="button" 
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all hover:bg-slate-50 shadow-sm"
          >
            Отмена
          </button>
          <button 
            form="student-profile-form"
            type="submit" 
            className="px-4 py-2 text-xs font-bold text-white bg-[#00468c] hover:bg-[#003366] rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Сохранить изменения
          </button>
        </div>
      </div>

      <form id="student-profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Левая колонка: Основные персональные данные */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#00468c]"></div>
          
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-[#00468c]" />
            Личная информация
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Фамилия</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Имя</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Отчество</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Редактируемая смена почты */}
          <div className="mt-5 max-w-md">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Электронная почта аккаунта
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-mono font-medium"
              />
            </div>
          </div>
        </div>

        {/* Правая колонка: Академический статус */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#00468c]" />
            Академический статус
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Номер группы</label>
              <input
                type="text"
                name="groupNumber"
                value={formData.groupNumber}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Курс обучения</label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold">
                2 курс (Бакалавриат)
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Модальное окно смены пароля */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#00468c]"></div>
            
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#00468c]" />
              Безопасность: Смена пароля
            </h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Текущий пароль</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Новый пароль</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Минимум 8 символов"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Подтвердите новый пароль</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#00468c] hover:bg-[#003366] rounded-lg transition-colors shadow-sm"
                >
                  Обновить пароль
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;