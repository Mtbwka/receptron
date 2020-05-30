import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import cheerio from 'cheerio';
import categories from '../db/categories';
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

bot.on('message', async (msg) => {
  bot.sendMessage(msg.chat.id, 'Выберите категорию из списка', {
    reply_markup: {
      keyboard: chunkArray(categories, 3),
    },
  });
});
