import categories from '../../db/categories';
import chunkArray from '../helpers/chunkArray';

export default (bot, chatId) => {
  bot.sendMessage(chatId, 'Выберите категорию продуктов из списка:', {
    reply_markup: {
      inline_keyboard: chunkArray(
        categories.map(c => ({ text: c.title, callback_data: c.id })),
        2,
        true
      ),
    },
  });
};
