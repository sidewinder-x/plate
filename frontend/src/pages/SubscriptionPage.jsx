import React, { useEffect } from 'react';
import './SubscriptionPage.css';
import { FiCheckCircle, FiZap } from 'react-icons/fi';

const tg = window.Telegram.WebApp;

const features = [
    'Все рецепты без ограничений',
    'Составление плана на любой срок',
    'Умный подбор по вкусам',
    'Низкокалорийные планы питания',
    'Приоритетная поддержка'
];

function SubscriptionPage({ onBack }) {

    const handleSubscribe = () => {
        // Здесь будет логика покупки через Telegram Stars или другой сервис
        tg.showAlert('Спасибо за интерес! Покупка подписки скоро станет доступна.');
    };

    useEffect(() => {
        // Настраиваем нативные кнопки для этого экрана
        tg.BackButton.show();
        tg.BackButton.onClick(onBack);

        tg.MainButton.setText('Оформить за 199₽ / месяц');
        tg.MainButton.show();
        tg.MainButton.onClick(handleSubscribe);

        return () => {
            tg.BackButton.offClick(onBack);
            tg.MainButton.offClick(handleSubscribe);
        };
    }, [onBack]);

    return (
        <div className="subscription-page">
            <div className="promo-icon">
                <FiZap size={48} />
            </div>
            <h1 className="promo-title">PRO Подписка</h1>
            <p className="promo-subtitle">Раскройте полный потенциал приложения</p>

            <ul className="features-list">
                {features.map(feature => (
                    <li key={feature} className="feature-item">
                        <FiCheckCircle className="feature-icon" size={20} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SubscriptionPage;
