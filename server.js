
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Проверка сервера
app.get("/api/status", (req, res) => {
  res.json({ message: "Сервер работает!" });
});

// Отправка заявки в Telegram
app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: "Заполните имя и телефон"
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        error: "Не настроены данные Telegram"
      });
    }

    const text =
      `Новая заявка с сайта!\n\n` +
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n` +
      `Сообщение: ${message || "Не указано"}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      console.error("Ошибка Telegram:", result);
      return res.status(502).json({
        error: "Не удалось отправить заявку"
      });
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ошибка сервера"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
