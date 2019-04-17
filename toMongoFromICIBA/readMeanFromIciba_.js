const wordModel = require("./mongo_local");
const request = require("request");

fetchWordsAndSave();

async function fetchWordsAndSave(data) {
  let list = await wordModel.find({ isMean: false });
  console.log("list", list.length);
  for (let i = 0; i < list.length; i++) {
    try {
      let meaningFetched = await Promise.race([fetchMeaning(list[i].word, i), timeout(list[i].word, i)]);
      // console.log("meaningFetched", meaningFetched);
      let { baesInfo, collins, ee_mean, trade_means, sentence, synonym, antonym, phrase, jushi } = meaningFetched;
      await wordModel.updateOne({ order: list[i].order }, { baesInfo, collins, ee_mean, trade_means, sentence, synonym, antonym, phrase, jushi, isMean: true });
      console.log("updateOne", list[i].order);
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
