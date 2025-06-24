// Carrega as variáveis de ambiente do arquivo .env (como o token do bot)
require("dotenv").config();

// Importa a biblioteca do Telegram Bot
const TelegramBot = require("node-telegram-bot-api");

// Cria a instância do bot com polling (escutando novas mensagens)
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Define o menu principal com botões personalizados
const menuPrincipal = {
  reply_markup: {
    keyboard: [
      [{ text: "Enviar Recibo" }, { text: "💬 Contato" }],
      [{ text: "🔙 Voltar" }],
    ],
    resize_keyboard: true, // Redimensiona o teclado para caber melhor
    one_time_keyboard: false, // Mantém o teclado visível
  },
};

// Cria um conjunto para guardar usuários que estão aguardando enviar uma foto
const esperandoFoto = new Set();

// Comando /menu — exibe o menu principal ao usuário
bot.onText(/\/menu/, (msg) => {
  bot.sendMessage(msg.chat.id, "Olá! Escolha uma opção:", menuPrincipal);
});

// Evento principal que escuta todas as mensagens
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // -------------------------------
  // TRATAMENTO DE IMAGEM (FOTO)
  // -------------------------------
  // Se o usuário enviou uma imagem E ele está na lista de quem clicou em "Enviar Recibo"
  if (msg.photo && esperandoFoto.has(chatId)) {
    esperandoFoto.delete(chatId); // Remove da lista de espera (evita duplicidade)

    // Pega a maior resolução da imagem enviada
    const photo = msg.photo[msg.photo.length - 1];

    // Obtém a URL pública temporária do arquivo da imagem
    const fileUrl = await bot.getFileLink(photo.file_id);

    // Mostra a URL da imagem no console (útil para debug ou IA)
    console.log("URL da imagem:", fileUrl.href);

    // Resposta ao usuário
    bot.sendMessage(chatId, "✅ Recibo recebido! Enviando para a IA...");

    // Aqui você pode enviar a URL da imagem para uma IA, API externa ou processamento local
    // Exemplo futuro: await axios.post('https://sua-ia.com/analisar', { imagem: fileUrl.href });

    return; // Sai do handler aqui, para não cair nos testes abaixo
  }

  // -------------------------------
  // TRATAMENTO DE MENSAGENS DE TEXTO
  // -------------------------------
  if (msg.text === "Enviar Recibo") {
    // Marca que esse usuário está prestes a enviar um recibo
    esperandoFoto.add(chatId);

    // Orienta o usuário a enviar a imagem
    bot.sendMessage(chatId, "📸 Por favor, envie a foto do recibo agora.");
  } else if (msg.text === "💬 Contato") {
    // Responde com informações de contato
    bot.sendMessage(chatId, "📧 Fale comigo em: contato@exemplo.com");
  } else if (msg.text === "🔙 Voltar") {
    // Reenvia o menu principal
    bot.sendMessage(chatId, "Voltando ao menu principal...", menuPrincipal);
  }
});
