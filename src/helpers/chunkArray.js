/**
 * Returns an array with arrays of the given size.
 *
 * @param arr {Array} array to split
 * @param chunkSize {Integer} Size of every group
 */

export default (array, chunkSize) => {
  const results = [];

  const filteredArray = array.map((e) => e.title);

  while (filteredArray.length) {
    results.push(filteredArray.splice(0, chunkSize));
  }

  return results;
};
