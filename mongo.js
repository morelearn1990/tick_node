let mongoose = require('mongoose');
const fs = require('fs');
const request = require('request');

mongoose.connect(
  'mongodb://127.0.0.1:27017/words',
  { useNewUrlParser: true }
);

var Schema = mongoose.Schema;

var wordSchema = new Schema({
  order: Number,
  word: String,
  meaning: [
    { parts: [{ part: String, means: Array }], ph_am: String, ph_en: String }
  ],
  isMean: {
    type: Boolean,
    default: false
  },
  isSound: {
    type: Boolean,
    default: false
  }
});
const wordModel = mongoose.model('Word', wordSchema);
module.exports = wordModel;
