import * as enums from './enums';

export default (bot, chatId, selectedProducts) => {
  bot.sendMessage(
    chatId,
    `Список ингридиентов: ${selectedProducts.map(
      (p, i) => `\n${i + 1}. ${p.title}`
    )}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Меню', callback_data: enums.MENU },
            { text: 'Удалить ингридиент', callback_data: enums.DELETE_MODE },
          ],
          [{ text: 'Найти рецепт', callback_data: enums.FIND_RECIPE }],
        ],
      },
    }
  );
};
