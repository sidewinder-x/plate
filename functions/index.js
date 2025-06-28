const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const admin = require("firebase-admin");

// --- НАСТРОЙКА ---
// Firebase автоматически найдет ключ, если он лежит в этой же папке
admin.initializeApp();

const db = admin.firestore();
// ВАЖНО: Вставьте сюда токен вашего бота из @BotFather
const BOT_TOKEN = "7404437624:AAGft30FOpbPMapHsUQ107yR9iJINDbhnd8";

const app = express();
// Разрешаем запросы с любого источника
app.use(cors({ origin: true }));

// --- Middleware для проверки авторизации ---
const validateTelegramAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("tma ")) {
      return res.status(401).send("Unauthorized: No Telegram auth data");
    }
    const initData = authHeader.split(" ")[1];
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    const user = JSON.parse(params.get("user"));

    if (!hash || !user) {
      return res.status(400).send("Bad Request: Invalid initData");
    }

    params.delete("hash");
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(BOT_TOKEN)
      .digest();
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (calculatedHash !== hash) {
      return res.status(403).send("Forbidden: Data validation failed");
    }

    req.userId = user.id.toString();
    next();
  } catch (error) {
    console.error("Auth validation error:", error);
    return res.status(500).send("Internal Server Error during auth");
  }
};

// --- API Эндпоинты ---
app.get("/profile", validateTelegramAuth, async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      const defaultProfile = { tastes: [], plan: null };
      await userRef.set(defaultProfile);
      return res.json(defaultProfile);
    }
    res.json(doc.data());
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/profile/tastes", validateTelegramAuth, async (req, res) => {
    const { tastes } = req.body;
    if (!Array.isArray(tastes)) {
        return res.status(400).send("Bad Request: 'tastes' must be an array.");
    }
    try {
        const userRef = db.collection("users").doc(req.userId);
        await userRef.update({ tastes });
        res.status(200).json({ message: "Tastes updated successfully" });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


// Экспортируем наше Express приложение как облачную функцию с именем 'api'
exports.api = functions.https.onRequest(app);
