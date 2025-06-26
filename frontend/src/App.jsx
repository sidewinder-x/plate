// src/App.jsx

import { useState, useEffect } from 'react';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import './App.css';
import BottomMenu from './BottomMenu';
import IngredientsPage from './pages/IngredientsPage';
import PreferencesPage from './pages/PreferencesPage';
import ResultsPage from './pages/ResultsPage';
import ProfilePage from './pages/ProfilePage';
import PlanPage from './pages/PlanPage';
import DisplayPlanPage from './pages/DisplayPlanPage';
import RecipesPage from './pages/RecipesPage';
import SubscriptionPage from './pages/SubscriptionPage';
import FiltersPage from './pages/FiltersPage';
import PaymentPage from './pages/PaymentPage';
// Импортируем новые страницы
import TastePreferencesPage from './pages/TastePreferencesPage';
import NotificationsPage from './pages/NotificationsPage';

const tg = window.Telegram.WebApp;

const lightTheme = {
  bgColor: '#ffffff',
  textColor: '#000000',
  hintColor: '#a8a8a8',
  linkColor: '#007aff',
  buttonColor: '#28ff7e',
  buttonTextColor: '#000000',
  secondaryBgColor: '#f4f4f5',
};

function App() {
    const [activeTab, setActiveTab] = useState('home');
    // ИЗМЕНЕНИЕ: Добавляем новые экраны в состояние view
    const [view, setView] = useState('main'); 
    const [recipeQuery, setRecipeQuery] = useState({});
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        tg.ready();
        tg.expand();
        
        tg.setHeaderColor(lightTheme.bgColor);
        tg.setBackgroundColor(lightTheme.bgColor);

        const root = document.documentElement;
        Object.entries(lightTheme).forEach(([key, value]) => {
            const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVar, value);
        });
    }, []);
    
    useEffect(() => {
        if (activeTab === 'plan' && view === 'main') {
            if (plan) {
                setView('plan_display');
            } else {
                setView('plan_creation');
            }
        }
    }, [activeTab, view, plan]);


    // --- Функции навигации ---
    const showHomePage = () => { 
        setView('main'); 
        setActiveTab('home');
        tg.BackButton.hide(); 
        tg.MainButton.hide(); 
    };

    const returnToProfileTab = () => {
        setView('main');
        setActiveTab('profile');
        tg.BackButton.hide();
        tg.MainButton.hide();
    };

    const returnToRecipesTab = () => {
        setView('main');
        setActiveTab('recipes');
        tg.BackButton.hide();
        tg.MainButton.hide();
    };
    
    // Флоу подбора рецепта
    const showIngredientsPage = () => setView('ingredients');
    const showPreferencesPage = (ingredients) => { 
        setRecipeQuery({ ingredients }); 
        setView('preferences'); 
    };
    const showResultsPage = (preferences) => {
        const finalQuery = { ...recipeQuery, ...preferences };
        setRecipeQuery(finalQuery);
        setView('results');
    };
    
    // Флоу создания плана
    const showPlanCreationPage = () => setView('plan_creation');
    const handlePlanCreated = (createdPlan) => {
        setPlan(createdPlan);
        setView('plan_display');
    };

    // Флоу подписки и настроек профиля
    const showSubscriptionPage = () => setView('subscription');
    const showFiltersPage = () => setView('filters');
    const showPaymentPage = () => setView('payment');
    const showTastePreferencesPage = () => setView('taste_preferences');
    const showNotificationsPage = () => setView('notifications');


    const handlePayment = () => {
        tg.showAlert('Оплата прошла успешно! Спасибо за подписку.');
        showHomePage();
    };

    // --- Логика отрисовки ---
    const renderModalView = () => {
        switch (view) {
            case 'ingredients': return <IngredientsPage onBack={showHomePage} onNext={showPreferencesPage} />;
            case 'preferences': return <PreferencesPage onBack={showIngredientsPage} onNext={showResultsPage} />;
            case 'results': return <ResultsPage query={recipeQuery} onBack={showPreferencesPage} onFinish={showHomePage} />;
            case 'plan_creation': return <PlanPage onBack={showHomePage} onPlanCreated={handlePlanCreated} />;
            case 'plan_display': return <DisplayPlanPage plan={plan} onBack={showHomePage} onCreateNew={showPlanCreationPage} />;
            case 'subscription': return <SubscriptionPage onBack={returnToProfileTab} onSubscribeClick={showPaymentPage} />;
            case 'payment': return <PaymentPage onBack={() => setView('subscription')} onPay={handlePayment} />;
            case 'filters': return <FiltersPage onBack={returnToRecipesTab} onApply={returnToRecipesTab} />;
            // ИЗМЕНЕНИЕ: Добавляем новые экраны
            case 'taste_preferences': return <TastePreferencesPage onBack={returnToProfileTab} />;
            case 'notifications': return <NotificationsPage onBack={returnToProfileTab} />;
            default: return null;
        }
    };

    const HomePage = () => (
      <div className="page home-page">
        <h2 className="home-title">Чем порадуем себя сегодня?</h2>
        <div className="action-buttons">
            <button className="action-button primary" onClick={showIngredientsPage}>
              <FiSearch size={20} />
              <span>Найти</span>
            </button>
            <button className="action-button secondary" onClick={() => setActiveTab('plan')}>
              <FiCalendar size={20} />
              <span>План</span>
            </button>
        </div>
      </div>
    );

    const renderTabView = () => {
        switch(activeTab) {
            case 'home': return <HomePage />;
            case 'recipes': return <RecipesPage onFilterClick={showFiltersPage} />;
            case 'plan': return <div className="page"></div>;
            // ИЗМЕНЕНИЕ: Передаем новые функции в ProfilePage
            case 'profile': return <ProfilePage onUpgradeClick={showSubscriptionPage} onTastesClick={showTastePreferencesPage} onNotificationsClick={showNotificationsPage} />;
            default: return <HomePage />;
        }
    }

    return view !== 'main' ? renderModalView() : (
      <div className="app-container">
        <div className="content-area">
          {renderTabView()}
        </div>
        <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    );
}

export default App;
