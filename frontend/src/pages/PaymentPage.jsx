// src/pages/PaymentPage.jsx
import React, { useEffect } from 'react';
import './PaymentPage.css'; // Не забудьте создать этот файл
import { FiCreditCard, FiLock } from 'react-icons/fi';

const tg = window.Telegram.WebApp;

function PaymentPage({ onBack, onPay }) {
    useEffect(() => {
        tg.BackButton.show();
        tg.BackButton.onClick(onBack);

        tg.MainButton.setText('Оплатить 199₽');
        tg.MainButton.setParams({ is_visible: true });
        tg.MainButton.onClick(onPay);

        return () => {
            tg.BackButton.offClick(onBack);
            tg.MainButton.offClick(onPay);
        };
    }, [onBack, onPay]);

    return (
        <div className="payment-page">
            <h1 className="payment-title">Оплата подписки</h1>
            <div className="card-form">
                <div className="input-group">
                    <label>Номер карты</label>
                    <div className="input-with-icon">
                        <FiCreditCard />
                        <input type="tel" inputMode="numeric" placeholder="0000 0000 0000 0000" />
                    </div>
                </div>
                <div className="row">
                    <div className="input-group">
                        <label>Срок</label>
                        <input type="tel" inputMode="numeric" placeholder="ММ / ГГ" />
                    </div>
                    <div className="input-group">
                        <label>CVC</label>
                        <input type="tel" inputMode="numeric" placeholder="123" />
                    </div>
                </div>
            </div>
            <div className="secure-note">
                <FiLock />
                <span>Безопасная оплата. Данные карты не сохраняются.</span>
            </div>
        </div>
    );
}

export default PaymentPage;
