import React, { useEffect } from 'react';
import './FiltersPage.css'; // Не забудьте создать этот файл

const tg = window.Telegram.WebApp;

function FiltersPage({ onBack, onApply }) {
    useEffect(() => {
        tg.BackButton.show();
        tg.BackButton.onClick(onBack);

        tg.MainButton.setText('Применить');
        tg.MainButton.setParams({ is_visible: true });
        tg.MainButton.onClick(onApply);

        return () => {
            tg.BackButton.offClick(onBack);
            tg.MainButton.offClick(onApply);
        }
    }, [onBack, onApply]);

    return (
        <div className="filters-page">
            <h1 className="filters-title">Фильтры</h1>
            {/* Содержимое фильтров будет добавлено здесь */}
            <p>Настройки фильтров скоро появятся.</p>
        </div>
    );
}

export default FiltersPage;

