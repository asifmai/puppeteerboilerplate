const puppeteer = require('puppeteer')

module.exports.launchBrowser = (debug = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        // headless: true,
        // executablePath: 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',   // Use Windows Browser
        // slowMo: 10,              // Slow down the browser
        // timeout: 0,              // Disable timeout
        // defaultViewport: null,
        userDataDir: './temp',
        ignoreHTTPSErrors: true,
        devtools: debug,
        args: [
          '--disable-setuid-sandbox',
          '--no-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certifcate-errors',
          '--ignore-certifcate-errors-spki-list',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-accelerated-2d-canvas',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--window-size=1366x768',
          // '--proxy-server=143.255.52.90:8080'
          // '--user-data-dir',                            // use local data directory called tmp
          // '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
        ],
      });
      resolve(browser);
    } catch (error) {
      console.log('Browser Launch Error: ', error);
      reject(error);
    }
  });
}

module.exports.launchPage = (browser, blockResources = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create New Page
      const page = await browser.newPage();

      // Set page View Port
      // await page.setViewport({ width: 1366, height: 768 });

      // Set user agent for page.
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
      await page.setUserAgent(userAgent);

      // Pass the Webdriver Test.
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });

        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });

        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });
      });

      if (blockResources === true) {
        const blockedResources = [
          'image',
          'stylesheet',
          'media',
          'font',
          'texttrack',
          'object',
          'beacon',
          'csp_report',
          'imageset'
        ];

        const skippedResources = [
          'quantserve',
          'adzerk',
          'doubleclick',
          'adition',
          'exelator',
          'sharethrough',
          'cdn.api.twitter',
          'google-analytics',
          'googletagmanager',
          'google',
          'fontawesome',
          'facebook',
          'analytics',
          'optimizely',
          'clicktale',
          'mixpanel',
          'zedo',
          'clicksor',
          'tiqcdn',
        ];

        // Set Request Interception to avoid receiving images, fonts and stylesheets for fast speed
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const requestUrl = req._url.split('?')[0].split('#')[0];
          if (
            blockedResources.includes(req.resourceType()) ||
            skippedResources.some(resource => requestUrl.includes(resource))
          ) {
            req.abort();
          } else {
            req.continue();
          }
        });
      }

      // Set Extra Header for request
      await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.8',
      });

      // Set Session Cookie
      // await page.setCookie({
      //   'name': 'li_at',
      //   'value': process.env.LINKEDIN_SESSION_COOKIE_VALUE,
      //   'domain': '.www.linkedin.com'
      // })
      
      
      // Authenticate Proxy Server
      // await page.authenticate({username: proxyUser, password: proxyPassword});

      resolve(page);
    } catch (error) {
      console.log('Launch Page Error: ', error);
      reject(error);
    }
  });
}

module.exports.getHTML = (selector, page) => new Promise(async (resolve, reject) => {
  try {
    let html = '';
    const isNode = await page.$(selector);
    if (isNode) {
      html = await page.$eval(
          selector, (elm) => elm.innerHTML.trim()
      )
    };
    
    resolve(html);
  } catch (error) {
    console.log(`getHTML Error: ${error}`);
    reject(error);
  }
});

module.exports.getTxt = (selector, page) => new Promise(async (resolve, reject) => {
  try {
    let txt = '';
    const isNode = await page.$(selector);
    if (isNode) {
      txt = await page.$eval(
          selector, (elm) => elm.innerText.trim()
      )
    };

    resolve(txt);
  } catch (error) {
    console.log(`getTxt Error: ${error}`);
    reject(error);
  }
});

module.exports.getTxtMultiple = (selector, page) => new Promise(async (resolve, reject) => {
  try {
    let txt = [];
    const isNode = await page.$(selector);
    if (isNode) {
      txt = await page.$$eval(
          selector, elms => elms.map(elm => elm.innerText.trim())
      )
    };

    resolve(txt);
  } catch (error) {
    console.log(`getTxtMultiple Error: ${error}`);
    reject(error);
  }
});

module.exports.getAttr = (selector, attribute, page) => new Promise(async (resolve, reject) => {
  try {
    let attr = '';
    const isNode = await page.$(selector);
    if (isNode) {
      attr = await page.$eval(
        selector,
        (elm, attribute) => elm.getAttribute(attribute).trim(),
        attribute
      );
    } else {
      console.log(`Node not found`);
    };

    resolve(attr);
  } catch (error) {
    console.log(`getAttr Error: ${error}`);
    reject(error);
  }
});

module.exports.getAttrMultiple = (selector, attribute, page) => new Promise(async (resolve, reject) => {
  try {
    let attr = [];
    const isNode = await page.$(selector);
    if (isNode) {
      attr = await page.$$eval(
        selector,
        (elms, attribute) => elms.map(elm => elm.getAttribute(attribute).trim()),
        attribute
      );
    };

    resolve(attr)
  } catch (error) {
    console.log(`getAttrMultiple Error: ${error}`);
    reject(error);
  }
});