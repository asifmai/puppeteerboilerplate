const pupHelper = require('./puppeteerhelper');
const {siteLink} = require('./keys');
let browser;

(async () => {
  browser = await pupHelper.launchBrowser(true);

  await run();
  
  await browser.close();
})()

const run = () => new Promise(async (resolve, reject) => {
  let page;
  try {
    page = await pupHelper.launchPage(browser);
    const response = await page.goto(siteLink, {timeout: 0, waitUntil: 'load'});

    await page.screenshot({path: 'screenshot.png'})
    console.log(response.status());
    console.log(response.statusText());
    console.log(response.url());

    await page.close();
    resolve(true);
  } catch (error) {
    if (page) await page.close();
    console.log(`Run Error: ${error}`);
    reject(error);
  }
})
