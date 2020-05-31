import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import cheerio from 'cheerio';
import categories from '../db/categories';
import products from '../db/products';
import chunkArray from './helpers/chunkArray';

const url = 'https://mnevkusno.ru';

const fetchData = async () => {
  const res = await axios.post(`${url}/searchbyingredients`, {
    ingredients: ['pork-22', 'bulb-onion', 'carrot-1'],
  });

  debugger;

  return cheerio.load(res.data);
};

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const providedPoducts = [];

bot.on('message', async (msg) => {
  const product = products.find((p) => p.title === msg.text);

  if (product) {
    providedPoducts.push(product);
    bot.sendMessage(msg.chat.id, `Добавлено ${product.title}`);
  } else {
    debugger;

    bot.sendMessage(msg.chat.id, 'Выберите категорию из списка', {
      reply_markup: {
        inline_keyboard: chunkArray(
          categories.map((c) => ({ text: c.title, callback_data: c.id })),
          2
        ),
      },
    });

    bot.on('callback_query', (query) => {
      const { message: { chat, message_id, text } = {} } = query;

      const filteredProducts = chunkArray(
        products
          .filter((p) => p.category === Number(query.data))
          .map((p) => p.title),
        3
      );
      if (filteredProducts.length > 0) {
        bot.sendMessage(chat.id, 'Выберите продукт', {
          reply_markup: {
            keyboard: filteredProducts,
          },
        });
      } else {
        bot.sendMessage(chat.id, 'Not found!');
      }
    });
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `${providedPoducts.map((p) => p.title)} `);
});
