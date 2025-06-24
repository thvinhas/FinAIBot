const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// Cria o bot
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.first_name;

  // Responde ao comando /start
  bot.sendMessage(chatId, `Olá, ${username}! Eu sou um bot do Telegram.`);
});

// Comando /ajuda
bot.onText(/\/ajuda/, (msg) => {
  const chatId = msg.chat.id;

  // Responde ao comando /ajuda
  bot.sendMessage(
    chatId,
    "Aqui está a ajuda: \n- Use /start para iniciar.\n- Use /ajuda para saber mais."
  );
});

// Resposta a qualquer outra mensagem
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  // Se não for um comando, responde com uma mensagem genérica
  if (!message.startsWith("/")) {
    bot.sendMessage(chatId, `Você disse: ${message}`);
  }
});
