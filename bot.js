require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Menu principal
const menuPrincipal = {
  reply_markup: {
    keyboard: [
      [{ text: "📄 Sobre" }, { text: "💬 Contato" }],
      [{ text: "🔙 Voltar" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Olá! Escolha uma opção:", menuPrincipal);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (texto === "📄 Sobre") {
    bot.sendMessage(
      chatId,
      "🤖 Este é um bot de exemplo com menu feito em Node.js!"
    );
  } else if (texto === "💬 Contato") {
    bot.sendMessage(chatId, "📧 Fale comigo em: contato@exemplo.com");
  } else if (texto === "🔙 Voltar") {
    bot.sendMessage(chatId, "Voltando ao menu principal...", menuPrincipal);
  }
});
