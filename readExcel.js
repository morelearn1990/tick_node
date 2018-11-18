var xlsx = require("node-xlsx").default;
var fs = require("fs");
// Parse a buffer
const workSheetsFromBuffer = xlsx.parse(
  fs.readFileSync(`${__dirname}/COCA60000.xlsx`)
);

var list = workSheetsFromBuffer[1].data;

var maps = list.map(str => {
  return new String(str[0]).toLowerCase();
});

fs.writeFile("words.json", JSON.stringify(maps), () => {});
