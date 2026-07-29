import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, Filter, Calendar, User, Sparkles } from 'lucide-react';

// Маппинг цветов категорий
const categoryColors = {
  'Учёба': 'text-[#00468c]',
  'Спорт': 'text-emerald-600',
  'Наука': 'text-purple-600'
};

const VerificationLedgerPage = () => {
  const [requests] = useState([
    {
      id: "REQ-001",
      date: "02.07.2026",
      category: "Наука",
      curator: "Федоров Д.А.",
      text: "Опубликовал научную статью по методам оптимизации работы СУБД. Получил рецензию научного руководителя.",
      status: "approved",
      aiSuggestedXp: 45,
      finalXp: 50,
      aiComment: "Текст содержит валидные данные об академической публикации высокого уровня."
    },
    {
      id: "REQ-002",
      date: "04.07.2026",
      category: "Учёба",
      curator: "Николаев Н.Н.",
      text: "Успешно сдал лабораторные работы №3 и №4 по курсу объектно-ориентированного программирования раньше дедлайна.",
      status: "pending",
      aiSuggestedXp: 20,
      finalXp: null,
      aiComment: "Стандартное учебное действие. Рекомендуется базовый балл за скорость сдачи."
    },
    {
      id: "REQ-003",
      date: "28.06.2026",
      category: "Спорт",
      curator: "Смирнов К.В.",
      text: "Принял участие в межвузовских соревнованиях по легкоатлетическому кроссу в составе сборной факультета.",
      status: "approved",
      aiSuggestedXp: 30,
      finalXp: 30,
      aiComment: "Спортивная активность подтверждена в реестре участников соревнований."
    },
    {
      id: "REQ-004",
      date: "25.06.2026",
      category: "Наука",
      curator: "Федоров Д.А.",
      text: "Просто ходил на пары всю неделю и слушал лекции.",
      status: "rejected",
      aiSuggestedXp: 0,
      finalXp: 0,
      aiComment: "Отсутствует явное достижение или внеучебная активность. Обычный учебный процесс."
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRequests = requests.filter(req => {
    if (filterStatus === 'all') return true;
    return req.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CheckCircle2 className="w-3 h-3" /> Одобрено
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-700">
            <XCircle className="w-3 h-3" /> Отклонено
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-700">
            <Clock className="w-3 h-3" /> На проверке
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#00468c]" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Фильтрация истории</h3>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Все заявки' },
            { id: 'pending', label: 'На проверке' },
            { id: 'approved', label: 'Одобренные' },
            { id: 'rejected', label: 'Отклоненные' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterStatus(btn.id)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all border ${
                filterStatus === btn.id
                  ? 'bg-[#00468c] border-[#00468c] text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
            Заявок с выбранным статусом не найдено.
          </div>
        ) : (
          filteredRequests.map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-slate-500">
                  <span className="text-slate-900 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{req.id}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {req.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {req.curator}</span>
                </div>
                <div>
                  {getStatusBadge(req.status)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Категория: <span className={categoryColors[req.category] || "text-slate-800"}>{req.category}</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {req.text}
                </p>
              </div>

              {req.aiComment && (
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex gap-2 items-start text-[11px] text-slate-600">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Анализ ИИ: </span> 
                    {req.aiComment}
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Рекомендовано системой: <span className="font-bold text-slate-700">+{req.aiSuggestedXp} XP</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end items-center border-t border-slate-100 pt-3 text-xs font-bold">
                <div className="font-mono">
                  Финальный результат: {' '}
                  {req.status === 'pending' ? (
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Ожидает решения</span>
                  ) : req.status === 'rejected' ? (
                    <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">0 XP</span>
                  ) : (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-black">+{req.finalXp} XP</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VerificationLedgerPage;