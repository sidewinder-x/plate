// src/pages/ResultsPage.jsx
import { useState, useEffect } from 'react';
import './ResultsPage.css'; // Свои стили для страницы

const tg = window.Telegram.WebApp;

// --- Имитация данных, которые в будущем придут с бэкенда ---
const mockResults = {
  bestChoice: {
    id: 1,
    title: 'Куриная грудка с рисом и авокадо',
    image: 'https://images.unsplash.com/photo-1598515213692-5f2824142a64?q=80&w=2592&auto=format&fit=crop', // Пример картинки
    time: '30 мин',
    difficulty: 'Легко',
    description: 'Идеально сбалансированное и полезное блюдо, которое легко приготовить после рабочего дня.'
  },
  otherOptions: [
    { id: 2, title: 'Салат Цезарь с курицей', image: 'https://images.unsplash.com/photo-1580013759946-4a02c91a7f44?q=80&w=2535&auto=format&fit=crop', time: '20 мин' },
    { id: 3, title: 'Томатный суп с сыром', image: 'https://images.unsplash.com/photo-1601002844392-50616f7a6a4e?q=80&w=2574&auto=format&fit=crop', time: '45 мин' },
    { id: 4, title: 'Паста Карбонара', image: 'https://images.unsplash.com/photo-1608796329241-BC62c3a54a2a?q=80&w=2574&auto=format&fit=crop', time: '25 мин' },
  ]
};
// -----------------------------------------------------------

function ResultsPage({ query, onBack, onFinish }) {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(null);

  // --- Имитация загрузки данных с сервера ---
  useEffect(() => {
    // Показываем нативные кнопки
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);

    tg.MainButton.setText('Завершить');
    tg.MainButton.show();
    tg.MainButton.onClick(onFinish);

    console.log('Запрос на бэкенд с параметрами:', query); // Здесь будет реальный fetch

    const timer = setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
    }, 2000); // Имитируем задержку сети в 2 секунды

    return () => {
      clearTimeout(timer);
      tg.BackButton.offClick(onBack);
      tg.MainButton.offClick(onFinish);
    };
  }, [query, onBack, onFinish]);


  // --- Рендер компонента ---

  if (isLoading) {
    return (
      <div className="results-page loading">
        <div className="spinner"></div>
        <p>Подбираем лучшие рецепты...</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="progress-bar">
        <div className="progress-step filled"></div>
        <div className="progress-step filled"></div>
        <div className="progress-step active"></div>
      </div>

      <h1 className="results-title">Отлично! Вот что мы подобрали:</h1>

      <div className="best-choice-section">
        <h2 className="section-title">✨ Лучший выбор</h2>
        <div className="recipe-card best-choice-card">
          <img src={results.bestChoice.image} alt={results.bestChoice.title} className="card-image"/>
          <div className="card-content">
            <h3 className="card-title">{results.bestChoice.title}</h3>
            <p className="card-description">{results.bestChoice.description}</p>
            <div className="card-tags">
              <span className="tag">{results.bestChoice.time}</span>
              <span className="tag">{results.bestChoice.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="other-options-section">
        <h2 className="section-title">Другие варианты</h2>
        <div className="other-options-grid">
          {results.otherOptions.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} className="card-image small"/>
               <div className="card-content">
                 <h3 className="card-title small">{recipe.title}</h3>
                 <div className="card-tags">
                   <span className="tag">{recipe.time}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;