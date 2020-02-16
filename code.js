// Make chromium download file to your desired path
const pdfPath = path.resolve(__dirname, `pdfs`);
await page._client.send('Page.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: pdfPath,
});