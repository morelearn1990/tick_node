const fetch = require("node-fetch");
const fs = require("fs");
const request = require("request");

var wordUrl = "https://fanyi.baidu.com/basetrans";
var makeExampleUrl = word =>
  `https://click.fanyi.baidu.com/?src=2&page=3&locate=zh&query=${word}&from=en&to=zh`;
var makeSoundUrl = word =>
  `https://fanyi.baidu.com/gettts?lan=en&text=${word}&spd=3&source=web`;

var makeSoundPath = (index, word) => `${__dirname}/words${index}/${word}.mp3`;

var filePath = index => `${__dirname}/words${index}.json`;
var length = 19;
var listIndex = 8;
var last = 200;
var lastFile = 3;

readJsonFile();

async function readJsonFile() {
  for (let i = listIndex; i < length; i++) {
    var data = fs.readFileSync(filePath(i));
    data = JSON.parse(data);
    await fetchWords(i, data);
  }
}

async function fetchWords(i, data) {
  let list = [];
  let listi = i == listIndex ? lastFile : 1;
  let startIndex = i == listIndex ? last : 0;
  if (!fs.existsSync(`${__dirname}/words${i}`)) {
    fs.mkdirSync(`${__dirname}/words${i}`);
  }
  for (let j = startIndex; j < data.length; j++) {
    let word = data[j];
    try {
      await getSound(i, word);
    } catch (e) {
      console.log(e);
    }
    let meaning = await getMeaning(word);
    list.push({
      word,
      meaning
    });
    if (list.length == 100) {
      fs.writeFileSync(
        `${__dirname}/words${i}/words${listi}.json`,
        JSON.stringify(list)
      );
      listi++;
      list = [];
    }
    last++;
    console.log(`list${i}-${last}`);
  }
}

async function getSound(i, words) {
  return new Promise((resolve, reject) => {
    request
      .get({ url: makeSoundUrl(words) })
      .pipe(fs.createWriteStream(makeSoundPath(i, words)))
      .on("finish", () => {
        resolve("ok");
      })
      .on("error", e => {
        reject();
      })
      .on("close", () => {});
  });
}

async function getMeaning(word) {
  return new Promise((resolve, reject) => {
    let headers = {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Mobile Safari/537.36"
    };
    let formData = {
      from: "en",
      to: "zh",
      query: word
    };
    request.post({ url: wordUrl, form: formData, headers }, function(
      err,
      httpResponse,
      body
    ) {
      if (err) {
        reject(err);
      }
      let meanings = JSON.parse(body);
      meanings.dict.symbols
        ? (meanings = meanings.dict.symbols[0].parts)
        : (meanings = []);
      resolve(meanings);
    });
  });
}
async function getExample(word) {
  return new Promise((resolve, reject) => {
    let headers = {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Mobile Safari/537.36"
    };
    request.get({ url: makeExampleUrl(word) }, function(
      err,
      httpResponse,
      body
    ) {
      if (err) {
        reject(err);
      }
    });
  });
}
