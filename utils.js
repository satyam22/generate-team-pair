const fs = require('fs');

function getRandomItemfromArray(items) {
  const length = items.length;
  const randomIndex = Math.floor(Math.random() * length);
  return items[randomIndex];
}

function arrayDifference(oldArray, newArray) {
  return oldArray.filter((item) => !newArray.includes(item));
}

function writeToFile(filePath, jsonContent) {
  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
}

module.exports = {
  getRandomItemfromArray,
  arrayDifference,
  writeToFile,
};
