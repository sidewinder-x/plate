const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const admin = require('firebase-admin');
const path = require('path');

// --- НАСТРОЙКА ---
// ИЗМЕНЕНИЕ: Читаем ключ из переменных окружения, а не из файла
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
  // Эта ошибка появится в логах Render, если вы забыли добавить переменную
  throw new Error("Секретный ключ Firebase (FIREBASE_SERVICE_ACCOUNT) не найден в переменных окружения.");
}

// Превращаем строку обратно в JSON-объект
const serviceAccount = JSON.parse(serviceAccountString);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
// ВАЖНО: Не забудьте вставить ваш токен сюда или добавить его как вторую переменную окружения
const BOT_TOKEN = process.env.BOT_TOKEN;

const app = express();
app.use(cors());
app.use(express.json());

// --- РАЗДАЧА ФРОНТЕНДА ---
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// --- API ЭНДПОИНТЫ ---
const apiRouter = express.Router();

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
        return res.status(500).send('Internal Server Error during auth');
    }
};

apiRouter.get('/profile', validateTelegramAuth, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.userId);
        const doc = await userRef.get();
        if (!doc.exists) {
            const defaultProfile = { tastes: [], plan: null };
            await userRef.set(defaultProfile);
            return res.json(defaultProfile);
        }
        res.json(doc.data());
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

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
        res.status(500).send('Internal Server Error');
    }
});

app.use('/api', apiRouter);

// --- ОБРАБОТКА ВСЕХ ОСТАЛЬНЫХ ЗАПРОСОВ ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});


// --- Запуск сервера ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
