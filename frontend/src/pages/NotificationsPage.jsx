// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import './NotificationsPage.css'; // Не забудьте создать этот файл

const tg = window.Telegram.WebApp;

function NotificationsPage({ onBack }) {
    const [reminders, setReminders] = useState({ morning: true, shopping: false });

    const handleSave = () => {
        tg.showAlert('Настройки уведомлений сохранены!');
        onBack();
    };

    useEffect(() => {
        tg.BackButton.show();
        tg.BackButton.onClick(onBack);
        tg.MainButton.setText('Сохранить');
        tg.MainButton.show();
        tg.MainButton.onClick(handleSave);
        return () => {
            tg.BackButton.offClick(onBack);
            tg.MainButton.offClick(handleSave);
        }
    }, [onBack]);

    const handleToggle = (key) => {
        setReminders(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="notifications-page">
            <h1 className="notifications-title">Напоминания</h1>
            <div className="notifications-list">
                <div className="notification-item">
                    <div className="item-text">
                        <h3>Утреннее меню</h3>
                        <p>Присылать план на день каждое утро в 9:00.</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={reminders.morning} onChange={() => handleToggle('morning')} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="notification-item">
                    <div className="item-text">
                        <h3>Список покупок</h3>
                        <p>Напоминать о походе в магазин за день до начала плана.</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={reminders.shopping} onChange={() => handleToggle('shopping')} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    );
}
export default NotificationsPage;

