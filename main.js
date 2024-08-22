const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

ipcMain.handle('run-script', async (event, formData) => {
  const { businessName, keywords } = formData;
  const keywordsPos = {};

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (const keyword of keywords) {
    await page.goto('https://www.google.com/localservices/prolist?g2lbs=AOHF13nn4ObTvHsig14EW6dpANEB888bjinjUu7DsSbe33Qhez6qBCPD9e8YNnj5Fi4r5OemL2I9I4uQYXmOxSlJjbvjaoM0aESnX8GgvxlAgyqM4rFiuqc%3D&hl=en-SG&gl=sg&ssta=1&oq=&src=2&sa=X&scp=CgASABoAKgA%3D&q=&ved=0CAUQjdcJahgKEwjIiaXjmNSHAxUAAAAAHQAAAAAQhwE&slp=MgBAAVIECAIgAIgBAJoBBgoCFxkQAA%3D%3D');
    await page.click('#qjZKOb');
    await page.type('#qjZKOb', keyword, { delay: 100 });
    await page.keyboard.press('Enter');

    await page.waitForNetworkIdle();

    const textArray = await page.evaluate(() => {
      const textContainer = document.getElementsByClassName('rgnuSb xYjf2e');
      const textArray = [];
      for (let i = 0; i < textContainer.length; i++) {
        const text = textContainer[i].textContent.trim();
        textArray.push(text);
      }
      return textArray;
    });

    const position = textArray.findIndex((text) => text.includes(businessName));
    keywordsPos[`${keyword}`] = position !== -1 ? position + 1 : '-';
  }

  await browser.close();
  return keywordsPos;
});
