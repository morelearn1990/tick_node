const wordModel = require('./mongo');
const request = require('request');
const fs = require('fs');

const LENGTH = 20000; // 总单词数量 先来20000
const FIRSR = 0;
const Dir = `${__dirname}`;
const listi = 1;

exportAndAave();
async function exportAndAave(data) {
  let list = [];
  for (let i = FIRSR; i < LENGTH; i++) {
    let wordDoc = await wordModel.findOne({ order: i });
    list.push({
      order: wordDoc.order,
      word: wordDoc.word,
      meaning: wordDoc.meaning,
      isSound: wordDoc.isSound
    });
    if (list.length == 4000) {
      fs.writeFileSync(`${__dirname}/words${listi}.json`, JSON.stringify(list));
      listi++;
      list = [];
    }
  }
}
