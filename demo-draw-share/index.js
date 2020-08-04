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
      //const script_text = '"ok"';

      const script_text = await new Promise((resolve, reject) => fs.readFile(
        path.resolve(__dirname, './app/index.js'),
        { encoding: 'utf-8' },
        (err, data) => err ? reject(err) : resolve(data)));
    
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

      const pathText = context.bindingData.text;

      let execResult = void 0;
      try {
        execResult = await eval(pathText || '');
        if (typeof execResult === 'function')
          execResult = await execResult();
      }
      catch (error) {
        execResult = {
          message: error && error.message,
          stack: error && error.stack,
          constructor: error && error.constructor && error.constructor.name,
          ...error
        };
      }

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
<pre>${JSON.stringify(execResult, null, 2)}</pre>
</body>
</html>
`
      };
    }
    catch (error) {
      context.res = {
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: error && error.message,
          stack: error && error.stack,
          constructor: error && error.constructor && error.constructor.name,
          ...error
        }, null, 2)
      };
    }
  };