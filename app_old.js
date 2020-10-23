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
    // const response = await page.goto('https://www.jomashop.com/juicy-couture-watches.html?price=%7B"from"%3A800%7D', {timeout: 0, waitUntil: 'load'});
    const response = await page.goto('https://www.jomashop.com/lucien-piccard-watches.html?price=%7B"from"%3A800%7D', {timeout: 0, waitUntil: 'load'});
    await page.waitFor(3000);
    // Your Code Here
    console.log(response.status());
    console.log(page.url());

    await page.close();
    resolve(true);
  } catch (error) {
    if (page) await page.close();
    console.log(`Run Error: ${error}`);
    reject(error);
  }
})

run();
