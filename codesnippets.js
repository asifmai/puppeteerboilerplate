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
await page.type('input', 'values put into input');