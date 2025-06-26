import React, { useState, useEffect } from 'react';
import './RecipesPage.css'; // Свои стили для этой страницы
import { FiSliders, FiLock } from 'react-icons/fi';

const tg = window.Telegram.WebApp;

// --- Имитация данных, которые в будущем придут с вашего бэкенда ---
const mockRecipes = [
    { id: 1, category: 'Завтраки', title: 'Сырники с ягодами', image: 'https://images.unsplash.com/photo-1596796332159-1b270736635f?q=80&w=2574&auto=format&fit=crop' },
    { id: 2, category: 'Завтраки', title: 'Овсяная каша с бананом', image: 'https://images.unsplash.com/photo-1595192176238-01d784a3b9b4?q=80&w=2574&auto=format&fit=crop' },
    { id: 3, category: 'Завтраки', title: 'Авокадо тост с яйцом', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2670&auto=format&fit=crop' },
    { id: 4, category: 'Обеды', title: 'Куриный суп с лапшой', image: 'https://images.unsplash.com/photo-1629515978283-a773a955427d?q=80&w=2574&auto=format&fit=crop' },
    { id: 5, category: 'Обеды', title: 'Паста Болоньезе', image: 'https://images.unsplash.com/photo-1621996346565-e326e20f545c?q=80&w=2565&auto=format&fit=crop' },
    { id: 6, category: 'Ужины', title: 'Запеченный лосось с овощами', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2670&auto=format&fit=crop' },
];
// --------------------------------------------------------------------

function RecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Завтраки');
    const [useTastePreferences, setUseTastePreferences] = useState(false);
    const [showAll, setShowAll] = useState(false); // Для показа всех рецептов
    
    // Имитируем, что у пользователя нет Premium-подписки
    const isPremium = false; 

    // --- Имитация загрузки рецептов при первом рендере ---
    useEffect(() => {
        // В будущем здесь будет fetch-запрос к вашему бэкенду
        // fetch('https://your-api.com/recipes')
        //   .then(res => res.json())
        //   .then(data => setRecipes(data));
        setRecipes(mockRecipes);
    }, []);

    const showPremiumAlert = () => {
        tg.showAlert('Больше рецептов доступно в Premium-подписке!');
    };

    const handleShowMore = () => {
        if (isPremium) {
            setShowAll(true);
        } else {
            showPremiumAlert();
        }
    };

    const filteredRecipes = recipes.filter(r => r.category === activeCategory);
    // Для бесплатной версии показываем только 1, для платной - все
    const visibleRecipes = showAll || isPremium ? filteredRecipes : filteredRecipes.slice(0, 1);

    return (
        <div className="recipes-page">
            <div className="recipes-header">
                <h1>Рецепты</h1>
                <button className="filter-button" onClick={() => tg.showAlert('Фильтры скоро появятся!')}>
                    <FiSliders size={20} />
                    <span>Фильтры</span>
                </button>
            </div>

            <div className="taste-toggle-section">
                <span>Учитывать вкусы</span>
                <label className="switch">
                    <input type="checkbox" checked={useTastePreferences} onChange={() => setUseTastePreferences(p => !p)} />
                    <span className="slider round"></span>
                </label>
            </div>

            <div className="category-tabs">
                {['Завтраки', 'Обеды', 'Ужины', 'Десерты'].map(cat => (
                    <button 
                        key={cat}
                        className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => {
                            setActiveCategory(cat);
                            setShowAll(false); // Сбрасываем показ при смене категории
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="recipe-list">
                {visibleRecipes.map(recipe => (
                    <div key={recipe.id} className="recipe-item-card">
                        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                        <h3 className="recipe-title">{recipe.title}</h3>
                    </div>
                ))}
            </div>

            {/* Кнопка "Показать еще" для бесплатных пользователей */}
            {!isPremium && !showAll && filteredRecipes.length > 1 && (
                <div className="show-more-container">
                    <button className="show-more-button" onClick={handleShowMore}>
                        <FiLock size={14} />
                        <span>Показать еще {filteredRecipes.length - 1}</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default RecipesPage;
