import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PageLayout from './components/layout/PageLayout';
import Breadcrumbs from './components/layout/Breadcrumbs';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import StudentProfile from './pages/StudentProfile';
import SubmitAchievementPage from './pages/SubmitAchievementPage';
import VerificationLedgerPage from './pages/VerificationLedgerPage';
import CuratorDashboard from './pages/CuratorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          {/* Главная страница (Дашборд) */}
          <Route index element={<DashboardPage />} />
          
          {/* Профиль студента */}
          <Route path="profile" element={
            <PageLayout 
              title="Мой профиль" 
              subtitle="Управление личными данными и академическими достижениями"
            >
              <Breadcrumbs />
              <StudentProfile />
            </PageLayout>
          } />

          {/* Форма подачи новой заявки на XP */}
          <Route path="submit-achievement" element={
            <PageLayout 
              title="Отправка активности" 
              subtitle="Заявление выполненных работ куратору для подтверждения навыков и начисления XP"
            >
              <Breadcrumbs />
              <SubmitAchievementPage />
            </PageLayout>
          } />

          {/* Лог трансляций и история статусов заявок */}
          <Route path="verification-ledger" element={
            <PageLayout 
              title="История верификации" 
              subtitle="Реестр отправленных заявок, статусы проверок кураторами и лог начисления XP"
            >
              <Breadcrumbs />
              <VerificationLedgerPage />
            </PageLayout>
          } />

          {/* Панель проверки для студентов-кураторов */}
          <Route path="curator-dashboard" element={
            <PageLayout 
              title="Панель куратора" 
              subtitle="Интерфейс верификации студенческих работ, оценка сложности и управление начислением XP"
            >
              <Breadcrumbs />
              <CuratorDashboard />
            </PageLayout>
          } />
        </Route> 
      </Routes>
    </Router>
  );
}

export default App;