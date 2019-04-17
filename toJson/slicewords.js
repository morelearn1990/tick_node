var fs = require("fs");

var data = fs.readFileSync(`${__dirname}/words.json`);

data = JSON.parse(data);

var list = [];
var j = 1;
for (let i = 0; i < data.length; i++) {
  list.push(data[i]);
  if (list.length == 6000) {
    fs.writeFile(`words${j}.json`, JSON.stringify(list), () => {});
    list = [];
    j++;
  }
  if (j == 4) {
    break;
  }
}
