const puppeteer = require('puppeteer');
const testURL = 'https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.html';
const pageURL = 'https://www.lowes.com/pd/DEWALT-5-Tool-20-Volt-Max-Power-Tool-Combo-Kit-with-Soft-Case-Charger-Included-and-2-Batteries-Included/3441520';

(async () => {
  try {
    // Launch Browser
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

    // Launch New Page
    const page = await createPage(browser);

    // Goto the URL
    const response = await page.goto(pageURL, {
      timeout: 0,
      waitUntil: 'load'
    });

    console.log(response.status());
    if (response.status() === 403) { // If IP is blocked
      console.log('Your ip Blocked by Website...');
    } else if (response.status() === 404) { // If Page Not found
      console.log('Page Not Found...');
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
    return 'Completed...';
  } catch (error) {
    return error;
  }
})();


const createPage = (browser) => new Promise(async (resolve, reject) => {
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
    resolve(page);
  } catch (error) {
    reject(error);
  }
});