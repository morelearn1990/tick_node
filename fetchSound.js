const wordModel = require('./mongo');
const request = require('request');
const fs = require('fs');

const soundDir = `${__dirname}/mp3`;
const makeSoundPath = word => `${__dirname}/mp3/${word}.mp3`;
const makeSoundUrl = word =>
  `https://fanyi.baidu.com/gettts?lan=en&text=${word}&spd=3&source=web`;

const LENGTH = 1000; // 总单词数量 60023 先来 6000
const FIRSR = 0;

fetchSoundAndUpdate();
async function fetchSoundAndUpdate(data) {
  if (!fs.existsSync(soundDir)) {
    fs.mkdirSync(soundDir);
  }
  for (let i = FIRSR; i < LENGTH; i++) {
    let wordDoc = await wordModel.findOne({ order: i });
    let isFetched;
    try {
      isFetched = await fetchSound(wordDoc.word);
    } catch (error) {
      console.log('error_index', error);
    }
    await wordModel.updateOne(
      { order: i },
      { isSound: isFetched === true ? true : false }
    );
    console.log(i);
  }
}

async function fetchSound(word) {
  return new Promise((resolve, reject) => {
    request
      .get({ url: makeSoundUrl(word) })
      .pipe(fs.createWriteStream(makeSoundPath(word)))
      .on('finish', () => {
        resolve(true);
      })
      .on('error', e => {
        reject(false);
      })
      .on('close', () => {});
  });
}
