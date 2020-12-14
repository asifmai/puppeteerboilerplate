const pupHelper = require('./puppeteerhelper');
const {siteLink} = require('./keys');

const run = async () => {
  try {
    await pupHelper.launchBrowser({debug: true})
  
    await fetch();
    
    await pupHelper.closeBrowser();
  } catch (error) {
    await pupHelper.closeBrowser();
    return error;
  }
};

const fetch = () => new Promise(async (resolve, reject) => {
  let page;
  try {
    page = await pupHelper.launchPage();
    const response = await page.goto(siteLink, {timeout: 180000, waitUntil: 'load'});

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
