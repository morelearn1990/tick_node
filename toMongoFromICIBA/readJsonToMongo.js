const word_local = require("./mongo_local");
const fs = require("fs");

readJsonFile();

async function readJsonFile() {
  var data = fs.readFileSync(`${__dirname}/words.json`);
  data = JSON.parse(data);
  await saveWord(data);
}

async function saveWord(data) {
  for (let i = 0; i < data.length; i++) {
    let word = data[i];
    let wordDoc = new word_local({
      order: i,
      word
    });
    await wordDoc.save();
    console.log(i);
  }
}
