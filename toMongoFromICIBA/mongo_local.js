let mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/words", { useNewUrlParser: true });

var Schema = mongoose.Schema;

var wordSchema = new Schema({
  order: Number,
  word: String,
  baesInfo: Schema.Types.Mixed,
  collins: Schema.Types.Mixed,
  ee_mean: Schema.Types.Mixed,
  trade_means: Schema.Types.Mixed,
  sentence: Schema.Types.Mixed,
  synonym: Schema.Types.Mixed,
  antonym: Schema.Types.Mixed,
  phrase: Schema.Types.Mixed,
  jushi: Schema.Types.Mixed,
  isMean: {
    type: Boolean,
    default: false
  },
  from: String
});
const word_local = mongoose.model("Word", wordSchema);
module.exports = word_local;
