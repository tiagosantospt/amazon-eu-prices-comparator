const puppeteer = require('puppeteer');
const $ = require('cheerio');

const dps = ['co.uk', 'it', 'fr', 'es', 'de', 'nl']; //european union countries
const productID = 'B07MSYTQNM';

async function configureBrowser(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkPrice(page) {
    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);
    let plainPrice = undefined;
    $('#price_inside_buybox', html).each(function() {
        plainPrice = $(this).text().replace(/[^0-9.-€£,]+/g,"");
    });
    return plainPrice;
}

async function startCheking() {
    for (const dp of dps) {
        let page = await configureBrowser('https://www.amazon.' + dp + '/dp/' + productID);
        let price = await checkPrice(page);
        console.log(dp + ' :: ' + price);
    };
}

startCheking();