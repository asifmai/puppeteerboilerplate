const fs = require('fs');
const pupHelper = require('./puppeteerhelper');
const { categories } = require('./keys');
let productsLinks = [];
let products = [];

const run = async () => {
  try {
    await pupHelper.launchBrowser();

    await fetchAllProductsLinks();

    await pupHelper.closeBrowser();
  } catch (error) {
    await pupHelper.closeBrowser();
    return error;
  }
};

const fetchAllProductsLinks = () =>
  new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < categories.length; i++) {
        console.log(`${i + 1}/${categories.length} - Fetching links from category`);
        await fetchProductsLinks(categories[i]);
      }

      fs.writeFileSync('productsLinks.json', JSON.stringify(productsLinks));
      resolve(true);
    } catch (error) {
      console.log(`fetchAllProductsLinks Error: ${error}`);
      reject(error);
    }
  });

const fetchProductsLinks = (url) =>
  new Promise(async (resolve, reject) => {
    let page;
    try {
      page = await pupHelper.launchPage(pupHelper.browser);
      await page.goto(url, { timeout: 0, waitUntil: 'load' });

      await page.waitForSelector('.search-results-header__heading + .d-flex > .mr-2');
      const listingsText = await pupHelper.getTxt('.search-results-header__heading + .d-flex > .mr-2', page);
      const numberOfPages = Math.ceil(
        Number(
          listingsText
            .match(/^.*(?=listings)/gi)[0]
            .replace(/\s/gi, '')
            .trim()
        ) / 48
      );

      let pageNumber = 1;
      let nextButton = true;
      let categoryLinks = [];

      do {
        await acceptPrivacy(page);
        console.log(`Fetching links from page ${pageNumber}/${numberOfPages}`);
        await pupHelper.autoScroll(page);
        await page.waitForSelector('.search-results > .row > .item-card-container a.item-card-image');
        const pageLinks = await page.$$eval('.search-results > .row > .item-card-container a.item-card-image', (elms) => elms.map((elm) => elm.href));
        categoryLinks.push(...pageLinks);

        nextButton = await page.$('ul.pagination > .page-item:last-child > a:not(.disabled)');
        if (nextButton) {
          pageNumber++;
          await Promise.all([
            page.waitForNavigation({ timeout: 0, waitUntil: 'load' }),
            page.click('ul.pagination > .page-item:last-child > a:not(.disabled)'),
          ]);
        }
      } while (nextButton);

      productsLinks.push(...new Set(categoryLinks));
      console.log(`Number of Products found in Category [${url}]: ${productsLinks.length}`);

      await page.close();
      resolve();
    } catch (error) {
      if (page) await page.close();
      console.log('fetchProductsLinks Error: ', error);
      reject(error);
    }
  });

const acceptPrivacy = (page) =>
  new Promise(async (resolve, reject) => {
    try {
      const gotPrivacy = await page.$('#qc-cmp2-ui');
      if (gotPrivacy) {
        await page.click('#qc-cmp2-ui .qc-cmp2-summary-buttons > button:last-child');
      }

      resolve(true);
    } catch (error) {
      console.log('acceptPrivacy Error: ', error);
      reject(error);
    }
  });

const fetchProducts = () =>
  new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < productsLinks.length; i++) {
        // await fetchProduct(productsLinks[i]);
      }

      resolve(true);
    } catch (error) {
      console.log('fetchProducts Error: ', error);
      reject(error);
    }
  });

run();
