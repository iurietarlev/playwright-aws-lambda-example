const { webkit, chromium } = require("playwright");

getCustomExecutablePath = (expectedPath) => {
  return expectedPath;
  //   const suffix = expectedPath.split("/.cache/ms-playwright/")[1];
  //   return `/home/pwuser/.cache/ms-playwright/${suffix}`;
};

exports.handler = async (event, context) => {
  let browserName = event.browser || "chromium";
  const extraLaunchArgs = event.browserArgs || [];
  const browserTypes = {
    webkit: webkit,
    chromium: chromium
    //'firefox': firefox,
  };
  const browserLaunchArgs = {
    webkit: [],
    chromium: ["--single-process", "--no-zygote"]
    //'firefox': [],
  };
  let browser = null;
  if (Object.keys(browserTypes).indexOf(browserName) < 0) {
    console.log(`Browser '${browserName}' not supported, using chromium`);
    browserName = "chromium";
  }
  try {
    console.log(`Starting browser: ${browserName}`);
    console.log(
      `executable path: ${browserTypes[browserName].executablePath()}`
    );
    browser = await browserTypes[browserName].launch({
      executablePath: getCustomExecutablePath(
        browserTypes[browserName].executablePath()
      ),
      args: browserLaunchArgs[browserName].concat(extraLaunchArgs)
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
