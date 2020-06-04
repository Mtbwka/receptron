import TelegramBot from 'node-telegram-bot-api';

import categories from '../db/categories';
import products from '../db/products';
import chunkArray from './helpers/chunkArray';
import * as enums from './helpers/enums';
import sendSelectedProducts from './helpers/sendSelectedProducts';
import sendMenu from './helpers/sendMenu';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
let selectedProducts = [];

// Menu or Start command
bot.onText(/\/menu|\/start/, async msg => sendMenu(bot, msg.chat.id));

bot.on('message', msg => {
  const product = products.find(p => p.title === msg.text);
  if (product) {
    const isDuplicate = selectedProducts.find(p => p.title === product.title);
    if (isDuplicate) {
      return bot.sendMessage(
        msg.chat.id,
        `${product.title} уже находится в списке ингредиентов`
      );
    }

    selectedProducts.push(product);
    bot.sendMessage(msg.chat.id, `Добавлено ${product.title}`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Меню', callback_data: enums.MENU },
            { text: 'Список ингредиентов', callback_data: enums.SHOW_LIST },
          ],
        ],
      },
    });
  }

  // return bot.sendMessage(msg.chat.id, `Не найдено`);
});

bot.on('callback_query', query => {
  const { message: { chat, message_id, text } = {} } = query;

  if (query.data === enums.MENU) {
    return sendMenu(bot, chat.id);
  }

  if (query.data === enums.SHOW_LIST) {
    return sendSelectedProducts(bot, chat.id, selectedProducts);
  }

  if (query.data === enums.DELETE_MODE) {
    return bot.sendMessage(
      chat.id,
      'Выберите ингредиент который нужно удалить',
      {
        reply_markup: {
          inline_keyboard: chunkArray(
            selectedProducts.map(c => ({
              text: c.title,
              callback_data: `DELETE ${c.slug}`,
            })),
            3
          ),
        },
      }
    );
  }

  const productToRemove = query.data.match(/DELETE (.+)/i);
  if (productToRemove && productToRemove[1]) {
    selectedProducts = selectedProducts.filter(
      p => p.slug !== productToRemove[1]
    );

    if (selectedProducts.length > 0)
      return sendSelectedProducts(bot, chat.id, selectedProducts);
    else
      return bot.sendMessage(chat.id, 'Список пуст', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Меню', callback_data: enums.MENU }]],
        },
      });
  }

  const data = categories.find(c => c.id === Number(query.data))
    ? enums.CATEGORY
    : enums.PRODUCT;

  if (data === enums.CATEGORY) {
    const filteredProducts = chunkArray(
      products.filter(p => p.category === Number(query.data)).map(p => p.title),
      3
    );

    bot.sendMessage(chat.id, 'Выберите продукт из встроенной клавиатуры', {
      reply_markup: {
        keyboard: filteredProducts,
      },
    });
  }
});

bot.onText(/\/list/, msg => {
  if (selectedProducts.length > 0)
    sendSelectedProducts(bot, msg.chat.id, selectedProducts);
  else
    bot.sendMessage(
      msg.chat.id,
      'Список пуст. Введите /menu для того чтобы начать'
    );
});
