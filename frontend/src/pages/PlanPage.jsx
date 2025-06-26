import React, { useState, useEffect, useCallback } from 'react';
import './PlanPage.css'; // Подключаем стили для этой страницы
import { FiLock } from 'react-icons/fi';

const tg = window.Telegram.WebApp;

// --- Компонент для создания плана ---
function PlanPage({ onPlanCreated }) {
    const [duration, setDuration] = useState(3);
    const [budget, setBudget] = useState(5000);
    const [calorie, setCalorie] = useState('Средняя');
    const [usePreferences, setUsePreferences] = useState(false); // Состояние для переключателя

    const handleCreatePlan = useCallback(() => {
        // Показываем нативный индикатор загрузки
        tg.MainButton.showProgress();

        // Имитируем создание плана
        const planData = {
            duration,
            budget,
            calorie,
            usePreferences,
            totalCost: Math.floor(budget * 0.95),
            days: Array.from({ length: duration }, (_, i) => ({
                day: `День ${i + 1}`,
                meals: { 'Завтрак': 'Овсянка', 'Обед': 'Курица с рисом', 'Ужин': 'Салат' }
            }))
        };
        
        // Через 2 секунды "возвращаем" созданный план
        setTimeout(() => {
            tg.MainButton.hideProgress();
            onPlanCreated(planData);
        }, 2000);

    }, [duration, budget, calorie, usePreferences, onPlanCreated]);

    // Этот useEffect вызывается ОДИН РАЗ, чтобы не было мерцания
    useEffect(() => {
        tg.MainButton.setText('Создать план');
        tg.MainButton.setParams({ is_visible: true }); // Явно показываем кнопку
        tg.MainButton.onClick(handleCreatePlan);

        return () => {
            tg.MainButton.offClick(handleCreatePlan);
            tg.MainButton.hide(); // Прячем при уходе со страницы
        };
    }, [handleCreatePlan]);

    const showPremiumAlert = () => {
        tg.showAlert('Эта функция доступна в Premium-подписке!');
    };

    return (
        <div className="create-plan-view">
            <h1 className="plan-title">Составление плана питания</h1>
            
            <div className="plan-section">
                <h2 className="section-title">Срок</h2>
                <div className="options-grid">
                    <button className={`option-tile ${duration === 3 ? 'selected' : ''}`} onClick={() => setDuration(3)}>3 дня</button>
                    <button className={`option-tile ${duration === 7 ? 'selected' : ''}`} onClick={() => setDuration(7)}>Неделя</button>
                    {/* Платная опция */}
                    <div className="locked-feature" onClick={showPremiumAlert}>
                        <FiLock className="lock-icon" size={16} />
                        <button className="option-tile disabled">Свой срок</button>
                    </div>
                </div>
            </div>

            <div className="plan-section">
                <h2 className="section-title">Бюджет: {budget} ₽</h2>
                <input 
                    type="range" 
                    min="1000" 
                    max="15000" 
                    step="500"
                    value={budget}
                    className="budget-slider"
                    onChange={(e) => setBudget(Number(e.target.value))}
                />
            </div>
            
            <div className="plan-section">
                <h2 className="section-title">Калорийность</h2>
                 <div className="options-grid">
                    <button className={`option-tile ${calorie === 'Низкая' ? 'selected' : ''}`} onClick={() => setCalorie('Низкая')}>Низкая</button>
                    <button className={`option-tile ${calorie === 'Средняя' ? 'selected' : ''}`} onClick={() => setCalorie('Средняя')}>Средняя</button>
                    <button className={`option-tile ${calorie === 'Высокая' ? 'selected' : ''}`} onClick={() => setCalorie('Высокая')}>Высокая</button>
                </div>
            </div>

             <div className="plan-section">
                <div className="toggle-header">
                    <h2 className="section-title">Учитывать вкусы</h2>
                    {/* Нативный переключатель (toggle) */}
                    <label className="switch">
                        <input type="checkbox" checked={usePreferences} onChange={() => setUsePreferences(prev => !prev)} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <p className="hint-text">На основе ваших предпочтений из профиля.</p>
            </div>
        </div>
    );
};

export default PlanPage;
