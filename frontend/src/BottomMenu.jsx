// frontend/src/BottomMenu.jsx
import { FiHome, FiBookOpen, FiCalendar, FiUser } from 'react-icons/fi';

const tg = window.Telegram.WebApp;

function BottomMenu({ activeTab, setActiveTab }) {
  
  const handleTabClick = (tabName) => {
    // Вибрация при смене вкладки для ощущения нативности
    tg.HapticFeedback.impactOccurred('light'); 
    setActiveTab(tabName);
  };

  return (
    <nav className="bottom-menu">
      <button 
        className={`menu-button ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => handleTabClick('home')}
      >
        <FiHome size={24} />
        <span>Главная</span>
      </button>
      
      <button 
        className={`menu-button ${activeTab === 'recipes' ? 'active' : ''}`}
        onClick={() => handleTabClick('recipes')}
      >
        <FiBookOpen size={24} />
        <span>Рецепты</span>
      </button>

      <button 
        className={`menu-button ${activeTab === 'plan' ? 'active' : ''}`}
        onClick={() => handleTabClick('plan')}
      >
        <FiCalendar size={24} />
        <span>План</span>
      </button>

      <button 
        className={`menu-button ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => handleTabClick('profile')}
      >
        <FiUser size={24} />
        <span>Профиль</span>
      </button>
    </nav>
  );
}

export default BottomMenu;