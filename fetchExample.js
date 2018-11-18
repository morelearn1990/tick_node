var makeExampleUrl = word =>
  `https://click.fanyi.baidu.com/?src=2&page=3&locate=zh&query=${word}&from=en&to=zh`;
async function fetchExample(word) {
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
