// Make Sure the Browser restarts itself on error
browser.on('disconnected', async () => {
  browser = false;
  browser = await pupHelper.launchBrowser();
});

// Promise Snippet
const functionName = () => new Promise(async (resolve, reject) => {
  let page;
  try {
    page = await pupHelper.launchPage(browser);
    
    await page.close();
    resolve(true);
  } catch (error) {
    if (page) await page.close();
    console.log(`functionName Error: ${error}`);
    reject(error);
  }
})

// Get Text from inside of an Element
await page.$eval('selector', (elm) => elm.innerText.trim());

// Get Attribute of an Element
await page.$eval('selector', (elm) => elm.getAttribute('href').trim());

// Get Text from inside of multiple Elements
await page.$eval('selector', (elms) => elms.map(elm => elm.innerText.trim()));

// Get Attributes of multiple Elements
await page.$eval('selector', (elms) => elms.map(elm => elm.getAttribute('href').trim()));

// Get Value from an input
const inputVal = await page.$eval('selector', elm => elm.value.trim());

// Make chromium download file to your desired path
const pdfPath = path.resolve(__dirname, `pdfs`);
await page._client.send('Page.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: pdfPath,
});

// Download an Image
await imagePage._client.send('Network.enable', {
  maxResourceBufferSize: 1024 * 1204 * 100,
  maxTotalBufferSize: 1024 * 1204 * 200,
})
const viewSource = await imagePage.goto(imageUrl, {timeout: 0, waitUntil: 'load'});
const imgPath = path.resolve(__dirname, `images/${screenId}.PNG`);
fs.writeFileSync(imgPath, await viewSource.buffer());

// Take a Screenshot
await page.screenshot({path: 'screenshot.png'})

// Create PDF
await popup.pdf({
  path: pdfPath,
  format: 'A4'
});

// Handle Popup Window
const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));   // Create Promise for popup window
await page.click('img#imgPrint');         // Do the action to open popup window
const popup = await newPagePromise;       // Returns the popup page
await popup.close();

// Set Page Content
await page.setContent(pdfContent);

// Type in input
await page.focus('input');
await page.keyboard.type('values put into input');

// Type in Input
await page.type('input', 'values put into input', {delay: 100});

// Type in Input
await page.evaluate(val => document.querySelector('input').value=val, val);

// Set Session Cookie
await page.setCookie({
  'name': 'li_at',
  'value': process.env.LINKEDIN_SESSION_COOKIE_VALUE,
  'domain': '.www.linkedin.com'
});

// Select option from Select element
await page.select('select[name="country"]', 'AU');

// Check or Uncheck a checkbox
await page.evaluate(() => {
  document.querySelector("input#profileAgreeTC").checked = true;
});

// Get Session Cookies and Then use cookies with page
const cookies = await page.cookies();
fs.writeFileSync('cookies.json', JSON.stringify(cookies));
const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
for (let i = 0; i < cookies.length; i++) {
  await page.setCookie(cookies[i]);
};

// Scroll Page to Bottom
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// Save Image from Response as base64Image
page.on('response', async (response) => {
  if (response.url().toLowerCase().includes('getcapchaimage.do')) {
    const buffer = await response.buffer();
    base64Img = buffer.toString('base64');
  }
})


// Change Styling of Elements
await page.evaluate(() => {
  document.querySelector('textarea#g-recaptcha-response').style.display = 'block';
})

// Fill textarea
await page.evaluate((captchaSolution) => {
  document.querySelector('textarea#g-recaptcha-response').innerText = captchaSolution;
}, capchaSolution)