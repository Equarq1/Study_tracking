Авторизация
  POST /api/auth/login/        — вход, возвращает токен
  POST /api/auth/register/     — регистрация

Профиль студента
  GET  /api/profile/           — данные текущего пользователя,
                                 суммарный XP, уровень

  GET  /api/profile/stats/     — XP по категориям (для диаграммы
                                 сильных сторон)

Заявки (студент)
  GET  /api/requests/          — список своих заявок (с фильтром
                                 ?status=pending|approved|rejected)
  POST /api/requests/          — подать новую заявку

Заявки (куратор)
  GET  /api/curator/requests/          — входящие заявки на проверку
  PATCH /api/curator/requests/{id}/    — подтвердить/отклонить,
                                         передать final_xp

Справочники
  GET  /api/categories/        — список категорий (для дропдауна
                                 в форме заявки)
