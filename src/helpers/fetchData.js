import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://mnevkusno.ru';

export default async () => {
  const res = await axios.post(`${url}/searchbyingredients`, {
    ingredients: ['pork-22', 'bulb-onion', 'carrot-1'],
  });

  return cheerio.load(res.data);
};
