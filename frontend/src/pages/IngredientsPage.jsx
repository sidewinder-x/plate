// src/pages/IngredientsPage.jsx (обновленная версия)
import { useState, useEffect, useCallback } from 'react';
import './IngredientsPage.css';

const tg = window.Telegram.WebApp;
const initialIngredients = ['Курица 🐔', 'Рис 🍚', 'Помидоры 🍅', 'Сыр 🧀', 'Лук 🧅', 'Авокадо 🥑', 'Говядина 🥩', 'Картофель 🥔', 'Морковь 🥕', 'Грибы 🍄', 'Яйца 🥚', 'Мука', 'Салат 🥬', 'Лосось 🐟', 'Макароны 🍝', 'Огурец 🥒'];

function IngredientsPage({ onBack, onNext }) {
  const [allIngredients, setAllIngredients] = useState(initialIngredients);
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState('');

  // Обработчик для кнопки "Дальше", обернут в useCallback для стабильности
  const handleNextClick = useCallback(() => {
    if (selected.length === 0) {
      tg.showAlert('Выберите хотя бы один ингредиент!');
      return;
    }
    onNext(selected); // Передаем выбранные ингредиенты на следующий шаг
  }, [selected, onNext]);

  // Этот useEffect настраивает кнопки ОДИН РАЗ при загрузке страницы
  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);
    
    tg.MainButton.setText('Дальше');
    tg.MainButton.show();
    
    return () => {
      tg.BackButton.offClick(onBack);
      tg.MainButton.offClick(handleNextClick); // Очищаем старый обработчик
    };
  }, [onBack, handleNextClick]);
  
  // Этот useEffect ПЕРЕУСТАНАВЛИВАЕТ обработчик для MainButton при изменении selected
  useEffect(() => {
    tg.MainButton.onClick(handleNextClick);
  }, [handleNextClick]);


  const handleTileClick = (ingredient) => {
    tg.HapticFeedback.impactOccurred('light');
    setSelected(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };
  
  const handleAddCustom = () => {
    const newIngredient = custom.trim() + ' ✍️';
    if (custom.trim() && !allIngredients.includes(newIngredient)) {
      setAllIngredients(prev => [newIngredient, ...prev]); // Добавляем в общий список
      handleTileClick(newIngredient); // Сразу выбираем его
      setCustom('');
    }
  };

  return (
    <div className="ingredients-page">
      <div className="progress-bar">
        <div className="progress-step active"></div>
        <div className="progress-step"></div>
        <div className="progress-step"></div>
      </div>
      <h1 className="ingredients-title">Выберите ингредиенты</h1>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Или добавьте свой..." 
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
        />
        <button onClick={handleAddCustom}>Добавить</button>
      </div>

      <div className="ingredients-grid">
        {allIngredients.map(ing => (
          <button
            key={ing}
            className={`ingredient-tile ${selected.includes(ing) ? 'selected' : ''}`}
            onClick={() => handleTileClick(ing)}
          >
            {ing}
          </button>
        ))}
      </div>
    </div>
  );
}

export default IngredientsPage;