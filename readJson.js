const wordModel = require('./mongo');

readJsonFile();

async function readJsonFile() {
  var data = fs.readFileSync(filePath());
  data = JSON.parse(data);
  await saveWord(data);
}

async function saveWord(data) {
  for (let i = 0; i < data.length; i++) {
    let word = data[i];
    let wordDoc = new wordModel({
      order: i,
      word
    });
    await wordDoc.save();
    console.log('i', i);
  }
}
