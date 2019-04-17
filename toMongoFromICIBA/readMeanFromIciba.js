const wordModel = require("./mongo_local");
const request = require("request");

// const LENGTH = 19999; // 总单词数量 先来20000
const FIRSR = 60020;

fetchWordsAndSave();

async function fetchWordsAndSave(data) {
  for (let i = FIRSR; i < 60050; i++) {
    try {
      let wordDoc = await wordModel.findOne({ order: i });
      let meaningFetched = await Promise.race([fetchMeaning(wordDoc.word, i), timeout(wordDoc.word, i)]);
      // console.log("meaningFetched", meaningFetched);
      let { baesInfo, collins, ee_mean, trade_means, sentence, synonym, antonym, phrase, jushi } = meaningFetched;
      await wordModel.updateOne({ order: i }, { baesInfo, collins, ee_mean, trade_means, sentence, synonym, antonym, phrase, jushi, isMean: true });
      console.log("updateOne", i);
      // console.log(i);
    } catch (error) {
      console.log(error);
    }
  }
}

function fetchMeaning(word, i) {
  return new Promise((resolve, reject) => {
    let url = "http://www.iciba.com/index.php?a=getWordMean&c=search&word=" + word;
    request.get(url, function(err, httpResponse, body) {
      if (err) {
        reject(err);
      }
      try {
        let meanings = JSON.parse(body);
        resolve(meanings);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function timeout(word, i) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout " + word + " " + i));
    }, 5000);
  });
}
