import React, { useEffect } from 'react';
import './DisplayPlanPage.css'; // Свои стили для страницы
import { FiEdit } from 'react-icons/fi';

const tg = window.Telegram.WebApp;

function DisplayPlanPage({ plan, onBack, onCreateNew }) {

    useEffect(() => {
        // Показываем кнопку "Назад" в шапке
        tg.BackButton.show();
        tg.BackButton.onClick(onBack);

        return () => {
            tg.BackButton.offClick(onBack);
        }
    }, [onBack]);

    return (
        <div className="display-plan-page">
            <div className="display-header">
                <h1 className="plan-title">Ваш план на {plan.duration} дня</h1>
                <button className="create-new-button" onClick={onCreateNew}>
                    <FiEdit size={16} />
                    <span>Новый план</span>
                </button>
            </div>

            <div className="total-cost-card">
                <span>Итоговый бюджет</span>
                <strong>{plan.totalCost} ₽</strong>
            </div>

            <div className="days-container">
                {plan.days.map(dayData => (
                    <div key={dayData.day} className="day-card">
                        <h3 className="day-title">{dayData.day}</h3>
                        <div className="meals-list">
                            {Object.entries(dayData.meals).map(([meal, dish]) => (
                                <div key={meal} className="meal-item clickable">
                                    <span className="meal-name">{meal}</span>
                                    <span className="dish-name">{dish}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisplayPlanPage;
