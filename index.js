const puppeteer = require('puppeteer');

(async () => {
    try {
      let data = [];
      let options = {
        headless: false,
        ignoreHTTPSErrors: true,
        slowMo: 134,
        devtools: true,
        args: [
        '--no-sandbox',
        '--auto-open-devtools-for-tabs',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1200',
        '--proxy-server=proxy.crawlera.com:8010',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list'
        ]
      }

      const browser = await puppeteer.launch(options);
      let currentPage = await browser.newPage();
      await currentPage.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
      await currentPage.setViewport({ width: 1920, height: 1200 });
      const key = "MY KEY:";
      await currentPage.setExtraHTTPHeaders({
          'Accept': 'text/html',
          'Accept-Language': 'en-US',
          'Accept-Encoding': 'deflate, gzip;q=1.0, *;q=0.5',
          "Proxy-Authorization": "Basic " + Buffer.from(key).toString("base64"),
        });


      var res =  await currentPage.goto('http://httpbin.org/get', {waitUntil: "domcontentloaded", timeout: 0});

      return [];
    } catch (e) {
      console.log(e);
      return e;
    }
})();