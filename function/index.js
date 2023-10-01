const { chromium } = require("playwright-chromium");

exports.handler = async (event, context) => {
  const browserName = "chromium";
  let browser = null;

  try {
    console.log(`Starting browser: ${browserName}`);
    browser = await chromium.launch({
      executablePath: chromium.executablePath(),
      args: ["--single-process", "--no-zygote"],
      headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("http://google.com/");
    const title = await page.title();
    console.log(`Page title: ${title}`);
    return { title };
  } catch (error) {
    console.log(`error${error}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
