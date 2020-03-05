const pupHelper = require('./puppeteerhelper');
const siteLink = "https://www.yeezysupply.com/product/FV6125";

(async () => {
  const browser = await pupHelper.launchBrowser();
  const page = await pupHelper.launchPage(browser);
  const response = await page.goto(siteLink, {timeout: 0, waitUntil: 'load'});

  await page.screenshot({path: 'screenshot.png'})
  console.log(response.status());
  console.log(response.statusText());
  console.log(response.url());

  await page.close();
  await browser.close();
})()