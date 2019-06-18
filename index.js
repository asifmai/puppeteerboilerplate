const puppeteer = require('puppeteer');
const testURL = 'https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.html';
const moment = require('moment');
const fs = require('fs');

const runBot = async () => {
  try {
    console.log(dt(), 'Scrape Started');

    // Launch Browser
    const browser = await launchBrowser();

    // Launch New Page
    const page = await launchPage(browser);

    // Goto the URL
    const response = await page.goto(testURL, {
      timeout: 0,
      waitUntil: 'load'
    });

    console.log(dt(), 'Page Response Status: ', response.status(), response.statusText());
    if (response.status() === 403) { // If IP is blocked
      console.log(dt(), 'Your ip Blocked by Website...');
    } else if (response.status() === 404) { // If Page Not found
      console.log(dt(), 'Page Not Found...');
    } else { // Everything is good
      // Your
      // Code
      // Here


      // Take a screenshot of the page
      await page.screenshot({path: 'screenshot.png'});
    }

    // Close the page
    await page.close();

    // Close the browser
    await browser.close();
    console.log(dt(), 'Scrape Completed');
    return 'Completed...';
  } catch (error) {
    console.log(dt(), 'Scraping Error: ', error)
    return error;
  }
};

const launchPage = (browser) => new Promise(async (resolve, reject) => {
  try {
    // Create New Page
    const page = await browser.newPage();

    // Set user agent for page.
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
    await page.setUserAgent(userAgent);

    // Pass the Webdriver Test.
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });

      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
    });

    // Set Page view port
    await page.setViewport({
      width: 1366,
      height: 768
    });

    // Set Request Interception to avoid receiving images, fonts and stylesheets for fast speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'image' || req.resourceType() === 'font' || req.resourceType() === 'stylesheet') {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Set Extra Header for request
    // await page.setExtraHTTPHeaders({'iqbal': 'Pakistan'});
    console.log(dt(), 'Launched Page');
    resolve(page);
  } catch (error) {
    console.log(dt(), 'Launch Page Error: ', error)
    reject(error);
  }
});

const launchBrowser = () => new Promise(async (resolve, reject) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,                        // To run on headless: true
      args: [
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--window-size=1366,768',      
        // ['--no-sandbox'],                  // To run on linux
        '--proxy-server=143.255.52.90:8080',    //To use a sock5 proxy
        // '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
      ],
      ignoreHTTPSErrors: true,
      userDataDir: './tmp',
    });
    console.log(dt(), 'Launched Browser');
    resolve(browser);
  } catch (error) {
    console.log(dt(), 'Browser Launch Error: ', error);
    reject(error);
  }
});

const dt = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss') + ' -';
}

runBot();