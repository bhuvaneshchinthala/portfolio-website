const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4321/about-me', { waitUntil: 'networkidle0' });
  
  const rootHtml = await page.evaluate(() => {
    return document.getElementById('root') ? document.getElementById('root').innerHTML : document.body.innerHTML;
  });
  
  console.log(rootHtml.substring(0, 2000));

  await browser.close();
})();
