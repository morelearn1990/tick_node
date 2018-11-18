const wordModel = require('./mongo');
const request = require('request');

const wordUrl = 'https://fanyi.baidu.com/basetrans';
const LENGTH = 20000; // 总单词数量 先来20000
const FIRSR = 0;

fetchWordsAndSave();

async function fetchWordsAndSave(data) {
  for (let i = FIRSR; i < LENGTH; i++) {
    let wordDoc = await wordModel.findOne({ order: i });
    let meaningFetched = await fetchMeaning(wordDoc.word);
    let meaning = meaningFetched.map(el => ({
      parts: el.parts,
      ph_am: el.ph_am,
      ph_en: el.ph_en
    }));
    await wordModel.updateOne({ order: i }, { meaning, isMean: true });
    console.log(i);
  }
}
async function fetchMeaning(word) {
  return new Promise((resolve, reject) => {
    let headers = {
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Mobile Safari/537.36'
    };
    let formData = {
      from: 'en',
      to: 'zh',
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
        ? (meanings = meanings.dict.symbols)
        : (meanings = []);
      resolve(meanings);
    });
  });
}
