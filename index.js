const puppeteer = require('puppeteer');

(async () => {
  try {
    // Launch Browser
    const browser = await puppeteer.launch({
      headless: false,                      // To run on linux server use headless: true
      args: ['--window-size=1366,768']      // To run on linux server use args: ['--no-sandbox']
    });

    // Launch New Page
    const page = await browser.newPage();

    // Set Page view port
    await page.setViewport({
      width: 1366,
      height: 768
    });

    // Set Request Interception to avoid receiving images, fonts and stylesheets
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'image' || req.resourceType() === 'font' || req.resourceType() === 'stylesheet') {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Goto the URL
    const response = await page.goto('https://www.google.com', {
      timeout: 0,
      waitUntil: 'load'
    });

    if (response.status() === 403) { // If IP is blocked
      console.log('Your ip Blocked by Website...');
    } else if (response.status() === 404) { // If Page Not found
      console.log('Page Not Found...');
    } else { // Everything is good
      // Your
      // Code
      // Here
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