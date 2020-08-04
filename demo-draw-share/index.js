const fs = require('fs');
const path = require('path');
//const puppeteer = require('puppeteer');

module.exports =
  /**
   * @param {import('@azure/functions').Context} context 
   * @param {import('@azure/functions').HttpRequest} req 
   */
  async function (context, req) {
    try {
      const script_text = '"ok"';
      // const script_text = await new Promise((resolve, reject) => fs.readFile(
      //   path.resolve(path__dirname, './app/index.js'),
      //   { encoding: 'utf-8' },
      //   (err, data) => err ? reject(err) : resolve(data)));
    
      // let url = 'http://wikipedia.org/';
      // if (typeof context.bindingData.text === 'string' && context.bindingData.text) {
      //   url = /^(http:)|(https:)/i.test(context.bindingData.text) ?
      //     context.bindingData.text :
      //     'http://' + context.bindingData.text;
      // }
    
      // const browser = await puppeteer.launch();
      // const page = await browser.newPage();
      // await page.goto(url);
      // const screenshot = await page.screenshot();

      // await browser.close();

      const pathText = 'path-text'; // context.bindingData.text
      context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
          'content-type': 'text/html'
        },
        body:
          `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Draw Share ${pathText}</title>
</head>
<body>
<script>
${script_text}
</script>
<h2>${pathText}</h2>
</body>
</html>
`
      };
    }
    catch (error) {
      context.res = {
        status: 200,
        body: 'FAILED: ' + err.toString()
      };
    }
  };