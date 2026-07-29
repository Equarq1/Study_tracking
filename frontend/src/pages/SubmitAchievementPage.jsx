import React, { useState } from 'react';
import { Send, UserCheck, FileText, Sparkles, ShieldCheck } from 'lucide-react';

const SubmitAchievementPage = () => {
  // Категории
  const mockCategories = [
    { id: 1, name: 'Учёба' },
    { id: 2, name: 'Спорт' },
    { id: 3, name: 'Наука' }
  ];

  const [formData, setFormData] = useState({
    categoryId: '',
    text: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика отправки заявки
    setIsSubmitted(true);
    setFormData({ categoryId: '', text: '' });
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      {isSubmitted && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-semibold">
            Заявка успешно отправлена на верификацию!
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#00468c]"></div>
            
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00468c]" />
              Информация о выполненной работе
            </h3>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Направление активности</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00468c] focus:bg-white transition-all font-semibold"
              >
                <option value="">Выберите категорию...</option>
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Описание достижения</label>
              <textarea
                name="text"
                rows="6"
                value={formData.text}
                onChange={handleChange}
                required
                placeholder="Подробно опишите, что конкретно вы сделали..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00468c] focus:bg-white transition-all leading-relaxed font-medium"
              ></textarea>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white rounded-xl bg-[#00468c] hover:bg-[#003366] transition-all shadow-sm flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Отправить заявку
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#002244] border border-[#003366] rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Проверка ИИ-Агентом
            </h3>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              Каждая отправленная заявка проходит автоматический анализ. Нейросеть оценивает суть текста и рекомендует стартовый балл.
            </p>

            <div className="border-t border-slate-700/50 pt-3 flex gap-2 items-start text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Окончательное решение и итоговый балл всегда утверждает преподаватель вручную.</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default SubmitAchievementPage;