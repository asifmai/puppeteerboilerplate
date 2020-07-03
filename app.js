const pupHelper = require('./puppeteerhelper');
const {siteLink} = require('./keys');
let browser;

const run = async () => {
  try {
    browser = await pupHelper.launchBrowser();
  
    await fetch();
    
    await browser.close();
  } catch (error) {
    if (browser) await browser.close();
    return error;
  }
};

const fetch = () => new Promise(async (resolve, reject) => {
  let page;
  try {
    page = await pupHelper.launchPage(browser);
    const response = await page.goto(siteLink, {timeout: 0, waitUntil: 'load'});

    // Your Code Here

    await page.close();
    resolve(true);
  } catch (error) {
    if (page) await page.close();
    console.log(`Run Error: ${error}`);
    reject(error);
  }
})

run();
