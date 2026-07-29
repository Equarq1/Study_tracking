import React, { useState } from 'react';
import { Check, X, AlertCircle, Sparkles, FileText, User, ShieldAlert } from 'lucide-react';

// Добавляем маппинг цветов для категорий согласно ТЗ (Пункт 3.6)
const categoryColors = {
  'Учёба': 'text-[#00468c]',
  'Спорт': 'text-emerald-600',
  'Наука': 'text-purple-600'
};

const CuratorDashboard = () => {
  // Список поступающих заявок от студентов строго по ТЗ
  const [requests, setRequests] = useState([
    {
      id: "REQ-002",
      student: "Иванов И.И.",
      group: "11-521",
      date: "04.07.2026",
      category: "Учёба",
      text: "Успешно сдал лабораторные работы №3 и №4 по курсу объектно-ориентированного программирования раньше дедлайна.",
      aiSuggestedXp: 20,
      aiComment: "Стандартное учебное действие. Рекомендуется базовый балл за скорость сдачи."
    },
    {
      id: "REQ-005",
      student: "Петров П.П.",
      group: "11-521",
      date: "03.07.2026",
      category: "Спорт",
      text: "Занял 2-е место в составе сборной КФУ на межвузовском чемпионате по волейболу.",
      aiSuggestedXp: 40,
      aiComment: "Спортивное достижение высокого уровня. Подтверждено протоколом соревнований."
    }
  ]);

  // Стейт для хранения изменяемых куратором баллов (final_xp)
  const [finalPoints, setFinalPoints] = useState({
    "REQ-002": 20,
    "REQ-005": 40
  });

  // Хэндлер изменения баллов вручную
  const handlePointsChange = (id, value) => {
    const val = Math.max(0, Math.min(100, Number(value)));
    setFinalPoints(prev => ({ ...prev, [id]: val }));
  };

  // Действие: Одобрить заявку
  const handleApprove = (id) => {
    const approvedXp = finalPoints[id];
    alert(`Заявка ${id} одобрена. Студенту начислено: ${approvedXp} XP (final_xp)`);
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  // Действие: Отклонить заявку
  const handleReject = (id) => {
    alert(`Заявка ${id} отклонена. Баллы не начислены.`);
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Шапка кабинета */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#00468c]"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Панель верификации</div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Входящие заявки на XP</h2>
          </div>
          <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold font-mono text-slate-700">
            Очередь: {requests.length} шт.
          </div>
        </div>
      </div>

      {/* Список заявок в очереди куратора */}
      <div className="space-y-6">
        {requests.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
            Все заявки успешно проверены. Очередь пуста!
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
              
              {/* Левая и центральная часть: Информация о студенте и текст */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono font-bold text-slate-500 border-b border-slate-100 pb-3">
                  <span className="text-slate-900 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{req.id}</span>
                  <span className="flex items-center gap-1 text-slate-800"><User className="w-3.5 h-3.5 text-slate-400" /> {req.student} (гр. {req.group})</span>
                  <span className="text-slate-300">|</span>
                  <span>{req.date}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Направление: <span className={categoryColors[req.category] || "text-slate-800"}>{req.category}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                    {req.text}
                  </p>
                </div>

                {/* Блок анализа ИИ */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex gap-3 items-start text-[11px] text-slate-600">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      Вердикт ИИ-Агента 
                      <span className="font-mono text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 ml-1">
                        ai_suggested_xp: +{req.aiSuggestedXp}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600 font-medium leading-relaxed">{req.aiComment}</p>
                  </div>
                </div>
              </div>

              {/* Правая часть: Принятие решения куратором и ввод final_xp */}
              <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    Утверждение баллов (final_xp)
                  </div>

                  {/* Слайдер регулировки баллов */}
                  <div className="space-y-1.5">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={finalPoints[req.id]} 
                      onChange={(e) => handlePointsChange(req.id, e.target.value)}
                      className="w-full accent-[#00468c] cursor-pointer"
                    />
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">0 XP</span>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={finalPoints[req.id]}
                        onChange={(e) => handlePointsChange(req.id, e.target.value)}
                        className="w-16 text-center font-mono font-black text-xs text-[#00468c] bg-white border border-slate-200 rounded-lg py-1 focus:outline-none focus:border-[#00468c]"
                      />
                      <span className="text-[10px] font-bold text-slate-400 font-mono">100 XP</span>
                    </div>
                  </div>
                </div>

                {/* Кнопки вынесения вердикта */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="py-2 px-3 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Отклонить
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="py-2 px-3 text-[11px] font-bold text-white bg-[#00468c] border border-[#003366] rounded-xl hover:bg-[#002244] transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Одобрить
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CuratorDashboard;