const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const admin = require('firebase-admin');
const path = require('path'); // Добавляем модуль для работы с путями

// --- НАСТРОЙКА ---
// Подключаем наш секретный ключ к Firebase
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
// ВАЖНО: Вставьте сюда токен вашего бота из @BotFather
const BOT_TOKEN = 'ВАШ_ТОКЕН_БОТА_СЮДА';

const app = express();
app.use(cors());
app.use(express.json());

// --- РАЗДАЧА ФРОНТЕНДА ---
// Указываем Express, где лежат готовые файлы нашего React-приложения.
// Он будет брать их из папки frontend/dist.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// --- API ЭНДПОИНТЫ ---
// Вся наша логика API теперь будет жить по пути /api/...
const apiRouter = express.Router();

// Middleware для проверки подлинности пользователя Telegram
const validateTelegramAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('tma ')) {
            return res.status(401).send('Unauthorized: No Telegram auth data');
        }

        const initData = authHeader.split(' ')[1];
        const params = new URLSearchParams(initData);
        const hash = params.get('hash');
        const user = JSON.parse(params.get('user'));

        if (!hash || !user) {
            return res.status(400).send('Bad Request: Invalid initData');
        }

        params.delete('hash');
        const dataCheckString = Array.from(params.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
        const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

        if (calculatedHash !== hash) {
            return res.status(403).send('Forbidden: Data validation failed');
        }
        
        req.userId = user.id.toString();
        next();
    } catch (error) {
        console.error("Auth validation error:", error);
        return res.status(500).send('Internal Server Error during auth');
    }
};

// Получить данные профиля пользователя
apiRouter.get('/profile', validateTelegramAuth, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.userId);
        const doc = await userRef.get();

        if (!doc.exists) {
            const defaultProfile = {
                tastes: [],
                notifications: { morning: true, shopping: false },
                plan: null,
            };
            await userRef.set(defaultProfile);
            return res.json(defaultProfile);
        }

        res.json(doc.data());
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Обновить вкусовые предпочтения
apiRouter.post('/profile/tastes', validateTelegramAuth, async (req, res) => {
    const { tastes } = req.body;
    if (!Array.isArray(tastes)) {
        return res.status(400).send('Bad Request: "tastes" must be an array.');
    }
    try {
        const userRef = db.collection('users').doc(req.userId);
        await userRef.update({ tastes });
        res.status(200).json({ message: 'Tastes updated successfully' });
    } catch (error) {
        console.error("Error updating tastes:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Регистрируем все наши API-маршруты по префиксу /api
app.use('/api', apiRouter);


// --- ОБРАБОТКА ВСЕХ ОСТАЛЬНЫХ ЗАПРОСОВ ---
// Эта часть очень важна для React. Если запрос не является запросом к API,
// мы отдаем главный файл index.html. React сам разберется, какую страницу показать.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});


// --- Запуск сервера ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
