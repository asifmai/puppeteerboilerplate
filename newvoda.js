const puppeteer = require('puppeteer');
const request = require("request");
var randomstring = require("randomstring");
const qs = require('qs');
var cheerio = require('cheerio');
random = 0;
var ads_url = "http://ads.clixsad.com/redirect?op=voda&source=plugrush"
var header = {};
var getHeaderUrl = "http://charging.mobclixs.com/api/v1/chargingurl?bucket=1001";


function getHeaders() {
    return new Promise(function (resolve, reject) {
        request(getHeaderUrl, { method: "GET" }, function (err, res, body) {
            body = body || ""
            var queryParams = body.split('?').length > 1 ? body.split('?')[1] : "";
            var queryObj = qs.parse(queryParams, {});
            let xforw = queryObj["xforw"];
            var randomMSISDN = randomstring.generate({
                length: 4,
                charset: 'numeric'
            });
            var msisdn = '91962091' + randomMSISDN
            var msisdn = queryObj["mobile"];
            var imsi = queryObj["imsi"];
            var chargingid = queryObj["chargingid"]
            var useragent = queryObj["ua"] || "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19";
            header = { "user-agent": useragent, "x-msisdn": msisdn, "x-imsi": imsi,'x-forwarded-for':xforw};
            err === null && body !== "" ? resolve(undefined, header) : reject(err, undefined);
        })
    })
}

browser = {}
page = {}

function start() {   
    (async () => {
        try {
            await getHeaders();
            console.log(header)
            // Launch Browser
            browser = await puppeteer.launch({
                headless: false, // To run on headless: true
                args: ['--no-sandbox'],   // To run on linux server
                    // '--proxy-server=127.0.0.1:9876'   //To use a sock5 proxy
            });

            page = await browser.newPage(); // Launch New Page
            await page.setExtraHTTPHeaders(header); //Set Extra Header for request
            await page.setRequestInterception(true);     // Set Request Interception to avoid receiving images, fonts and stylesheets for fast speed

            page.on('request', (req) => {
                if (req.resourceType() === 'image' || req.resourceType() === 'font' || req.resourceType() === 'stylesheet') {
                    req.abort();
                } else {
                    var url = req.url();
                    console.log(req.resourceType(),"url========",url)
                    req.continue();
                }
            });

            // Open Advertising URL
            const response = await page.goto(ads_url, {
                timeout: 0,
                waitUntil: 'load'
            });

            if (response.status() === 403 || response.status() == 410) { // If IP is blocked
                console.log('Your ip Blocked by Website...');
                await page.close();   // Close the page
                await browser.close(); // Post closing page now Close the browser
                start(); // restart process again
            } else if (response.status() === 404) { // If Page Not found
                console.log('Page Not Found...');
                await page.close();   // Close the page
                await browser.close(); // Post closing page now Close the browser
                start(); // restart process again
            } else { // Everything is good and we can process for custom action
                await Promise.all([
                    //await page.waitForNavigation({ timeout: 5000, waitUntil: 'load' }),
                    // await page.waitForSelector('.clickToActionTab'),
                    // await page.evaluate(() => { document.getElementsByClassName('clickToActionTab')[0].click(); })
                    console.log("page opened successfully")
                ]);
                // await page.screenshot({ path: 'screenshot' + random + '.png' })
                console.log('Charging successfully done : ' + random)
                random++

                console.log(page.url())

                await page.waitForNavigation({ timeout: 0, waitUntil: 'load' })
                console.log(page.url())
                await page.waitForNavigation({ timeout: 0, waitUntil: 'load' })
                console.log(page.url()) 
                page.close();   // Close the page
                await browser.close(); // Post closing page now Close the browser
                start(); // restart process again
            }            
        } catch (error) {
            //console.log(error);
            page.close();   // Close the page
            browser.close();
            start(); // restart process again
        }
    })();
}

start();