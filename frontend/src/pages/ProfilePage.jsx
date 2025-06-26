import React from 'react';
import './ProfilePage.css';
import { FiChevronRight, FiStar } from 'react-icons/fi';

const tg = window.Telegram.WebApp;

// --- ВРЕМЕННЫЕ ДАННЫЕ (заглушка вместо бэкенда) ---
const mockProfileData = {
    tastes: ['Люблю острое 🌶️', 'Больше овощей 🥦'], // Как будто мы это загрузили
    plan: { type: 'Бесплатный' }
};
// ----------------------------------------------------


function ProfilePage({ onUpgradeClick, onTastesClick, onNotificationsClick }) {
    const user = tg.initDataUnsafe?.user;
    
    // Мы больше не используем isLoading, так как данные "загружаются" мгновенно
    const profileData = mockProfileData;

    const handleSupportClick = () => {
        tg.openTelegramLink('https://t.me/telegram'); 
    };

    return (
        <div className="profile-page">
            <div className="user-info-card">
                <img 
                  src={user?.photo_url} 
                  alt="Аватар" 
                  className="user-avatar" 
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/F0F5F2/333?text=${user?.first_name?.charAt(0) || 'P'}` }}
                />
                <h1 className="user-name">{`${user?.first_name || ''} ${user?.last_name || ''}`}</h1>
                <p className="user-id">@{user?.username || 'telegram_user'}</p>
            </div>

            <div className="settings-section">
                <div className="settings-item" onClick={onTastesClick}>
                    <span>Вкусовые предпочтения</span>
                    <div className="item-value">
                        {/* Показываем количество вкусов из наших временных данных */}
                        <span>{profileData.tastes.length} выбрано</span>
                        <FiChevronRight size={20} className="item-arrow" />
                    </div>
                </div>
                <div className="settings-item" onClick={onNotificationsClick}>
                    <span>Напоминания</span>
                    <FiChevronRight size={20} className="item-arrow" />
                </div>
                <div className="settings-item" onClick={handleSupportClick}>
                    <span>Написать в поддержку</span>
                    <FiChevronRight size={20} className="item-arrow" />
                </div>
            </div>

            <div className="subscription-card">
                 <div className="subscription-icon">
                    <FiStar size={24} />
                </div>
                <div className="subscription-info">
                    <h2 className="subscription-title">Ваш план: {profileData.plan.type}</h2>
                    <p className="subscription-description">Получите доступ ко всем рецептам и планам.</p>
                </div>
                <button className="upgrade-button" onClick={onUpgradeClick}>
                    Улучшить
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;
