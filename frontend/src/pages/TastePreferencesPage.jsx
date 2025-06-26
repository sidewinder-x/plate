import React, { useState, useEffect, useCallback } from 'react';
import './TastePreferencesPage.css';

const tg = window.Telegram.WebApp;

const allTastes = ['Люблю острое 🌶️', 'Ненавижу лук 🧅', 'Больше овощей 🥦', 'Без глютена', 'Меньше соли', 'Без сахара'];

function TastePreferencesPage({ onBack }) {
    // Начальное состояние — два выбранных вкуса для демонстрации
    const [selectedTastes, setSelectedTastes] = useState(['Больше овощей 🥦', 'Без сахара']);

    // Имитация сохранения данных
    const handleSave = useCallback(() => {
        // Показываем нативный индикатор загрузки на кнопке
        tg.MainButton.showProgress(); 
        
        // Имитируем задержку, как будто отправляем запрос на сервер
        setTimeout(() => {
            tg.MainButton.hideProgress(); // Прячем индикатор
            tg.HapticFeedback.notificationOccurred('success'); // Даем виброотклик об успехе
            onBack(); // Возвращаемся на страницу профиля
        }, 1000); // Задержка в 1 секунду
        
    }, [onBack]);

    // Настраиваем нативные кнопки Telegram при загрузке страницы
    useEffect(() => {
        tg.BackButton.show();
        tg.BackButton.onClick(onBack);
        
        tg.MainButton.setText('Сохранить');
        tg.MainButton.show();
        tg.MainButton.onClick(handleSave);
        
        // Очищаем обработчики при уходе со страницы
        return () => {
            tg.BackButton.offClick(onBack);
            tg.MainButton.offClick(handleSave);
        }
    }, [onBack, handleSave]);

    // Функция для выбора/отмены выбора вкуса
    const handleTasteClick = (taste) => {
        tg.HapticFeedback.impactOccurred('light');
        setSelectedTastes(prev => 
            prev.includes(taste) 
                ? prev.filter(t => t !== taste) // Убрать, если уже выбран
                : [...prev, taste]               // Добавить, если не выбран
        );
    };

    return (
        <div className="taste-page">
            <h1 className="taste-title">Вкусовые предпочтения</h1>
            <p className="taste-subtitle">Выберите то, что вам нравится или не нравится, чтобы мы могли делать более точные подборки.</p>
            <div className="tastes-grid">
                {allTastes.map(taste => (
                    <button 
                        key={taste} 
                        className={`taste-tile ${selectedTastes.includes(taste) ? 'selected' : ''}`} 
                        onClick={() => handleTasteClick(taste)}
                    >
                        {taste}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TastePreferencesPage;
