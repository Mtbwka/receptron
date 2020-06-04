/**
 * Returns an array with arrays of the given size.
 *
 * @param array {Array} array to split
 * @param chunkSize {Integer} Size of every group
 */

export default (array, chunkSize, fullFirstRow) => {
  const results = [];
  if (fullFirstRow) {
    results.push(array.splice(0, 1));
  }

  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }

  return results;
};
