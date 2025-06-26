// src/pages/PreferencesPage.jsx
import { useState, useEffect } from 'react';
import './PreferencesPage.css'; // Свои стили для страницы

const tg = window.Telegram.WebApp;

// Опции для выбора
const difficulties = ['Легко', 'Средне', 'Сложно'];
const times = ['~20 мин', '~45 мин', '1 час+'];
const tags = ['Полезно', 'Быстрый ужин', 'Для гостей', 'Вегетарианское', 'Низкокалорийное'];

function PreferencesPage({ onBack, onNext }) {
  const [difficulty, setDifficulty] = useState('Средне');
  const [time, setTime] = useState('~45 мин');
  const [selectedTags, setSelectedTags] = useState([]);

  // Настройка нативных кнопок Telegram
  useEffect(() => {
    // Кнопка "Назад" возвращает на экран ингредиентов
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);

    // Кнопка "Дальше" переходит к результатам
    tg.MainButton.setText('Подобрать рецепт');
    tg.MainButton.show();
    tg.MainButton.onClick(() => onNext({ difficulty, time, selectedTags }));

    return () => {
      tg.BackButton.offClick(onBack);
      tg.MainButton.offClick(() => onNext({ difficulty, time, selectedTags }));
    };
  }, [onBack, onNext, difficulty, time, selectedTags]);

  const handleTagClick = (tag) => {
    tg.HapticFeedback.impactOccurred('light');
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="preferences-page">
      <div className="progress-bar">
        <div className="progress-step filled"></div>
        <div className="progress-step active"></div>
        <div className="progress-step"></div>
      </div>

      <div className="preference-section">
        <h2 className="section-title">Сложность</h2>
        <div className="options-grid single-choice">
          {difficulties.map(d => (
            <button key={d} className={`option-tile ${difficulty === d ? 'selected' : ''}`} onClick={() => setDifficulty(d)}>{d}</button>
          ))}
        </div>
      </div>

      <div className="preference-section">
        <h2 className="section-title">Скорость приготовления</h2>
        <div className="options-grid single-choice">
          {times.map(t => (
            <button key={t} className={`option-tile ${time === t ? 'selected' : ''}`} onClick={() => setTime(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="preference-section">
        <h2 className="section-title">Метки</h2>
        <div className="options-grid multi-choice">
          {tags.map(tag => (
            <button key={tag} className={`option-tile ${selectedTags.includes(tag) ? 'selected' : ''}`} onClick={() => handleTagClick(tag)}>{tag}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreferencesPage;