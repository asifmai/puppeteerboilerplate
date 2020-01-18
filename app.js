const pupHelper = require('./puppeteerhelper');
const siteLink = "https://pptr.dev/";

(async () => {
  const browser = await pupHelper.launchBrowser(true);
  const page = await pupHelper.launchPage(browser, true);
  const response = await page.goto(siteLink, {timeout: 0, waitUntil: 'load'});

  console.log(response.status());
  console.log(response.statusText());
  console.log(response.url());

  await page.close();
  await browser.close();
})()