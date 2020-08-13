const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

module.exports =
  /**
   * @param {import('@azure/functions').Context} context 
   * @param {import('@azure/functions').HttpRequest} req 
   */
  async function (context, req) {
    try {

      let pngExtension = false;
      const colorText = context.bindingData.text.replace(/\.png$/i, () => {
        pngExtension = true;
        return '';
      });


      if (pngExtension) {
        context.res = {
          headers: { 'content-type': 'image/png' },
          body: getPngBuffer(colorText)
        };
      }
      else {
        context.res = {
          headers: { 'content-type': 'text/html' },
          body: getWebPageHTML(context.req.url, colorText)
        };
      }

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

/**
 * @param {string} colorText
 */
function getPngBuffer(colorText) {

  const color32 = parseColor(colorText);

  const png = new PNG({ width: 800, height: 600 });
  const r = (0xff0000 & color32) / 0x10000;
  const g = (0x00ff00 & color32) / 0x100;
  const b = (0x0000ff & color32);

  const borderColor = r + g + b < 128 * 3 ? 255 : 0;
  const borderWidth = 10;

  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (y * png.width + x) * 4;
      if (Math.min(y, png.height - y, x, png.width - x) < borderWidth) {
        png.data[idx] = borderColor;
        png.data[idx + 1] = borderColor;
        png.data[idx + 2] = borderColor;
        png.data[idx + 3] = 255;
      }
      else {
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = 255;
      }
    }
  }

  const buf = PNG.sync.write(png);

  return buf;
}

/**
 * @param {string} fullUrl
 * @param {string} colorText
 */
function getWebPageHTML(fullUrl, colorText) {

  // May inject script from a file too:
  // const script_text = await new Promise((resolve, reject) => fs.readFile(
  //   path.resolve(__dirname, './app/index.js'),
  //   { encoding: 'utf-8' },
  //   (err, data) => err ? reject(err) : resolve(data)));

  const imageUrl = fullUrl.replace(/\?.*$/, '') + '.png';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Draw Share ${colorText}</title>

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@demo-draw-share">
    <meta name="twitter:creator" content="@486timetable">
    <meta name="twitter:title" content="color:${colorText}">
    <meta name="twitter:description" content="PNG color of ${colorText}">
    <meta name="twitter:image" content="${imageUrl}">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="${imageUrl}">

</head>
<body>${''/*  This, plus that commented piece above would inject script:
<script>
${script_text}
</script>
*/}
<h2>${colorText}</h2>
<img src="${imageUrl}">
</body>
</html>
`;
}

function parseColor(colorText) {
  if (/^0x/i.test(colorText))
    colorText = colorText.slice(2);

  if (colorText.length <= 3)
    colorText =
      colorText.charAt(0) + colorText.charAt(0) +
      colorText.charAt(1) + colorText.charAt(1) +
      colorText.charAt(2) + colorText.charAt(2);
  
  const rgbHex = parseInt(colorText, 16);
  return rgbHex;
}