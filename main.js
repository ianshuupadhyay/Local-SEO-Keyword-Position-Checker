const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 680, // Increased height to accommodate the new field
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

// Country-specific Google Local Services URLs
const countryUrls = {
  ca: 'https://www.google.com/localservices/prolist?g2lbs=AAEPWCsl0CtiBXqXAuy9z_kcdXJyRwe4C-ZBscQY_L3_0S5CXSiwLogU92d0LwTMouTGinzRPH1uDeXJU2OBT888WJpJhIEL9Q%3D%3D&hl=en&gl=ca&ssta=1&oq=Interior%20Design%20Heathwood&src=2&sa=X&q%20Heathwood&ved=2ahUKEwjWzc7jqsuMAxUb2oQAHcIXMVgQjdcJegQIABAF&scp=ChFnY2lkOmhvbWVfYnVpbGRlchIAGgAqDEhvbWUgYnVpbGRlcg%3D%3D',
  us: 'https://www.google.com/localservices/prolist?g2lbs=AOHF13kNoHnPY-1JNcvzodwU40wSQXCedhuNIZi4N_Z8F1UDPdWFVY-pNh4hdNa1PSCbx74NY1MmTRTf4ujpkTR2ovVDu7itewfXTzApapum8BYfD_QBNVk%3D&hl=en-US&gl=us&ssta=1&q&oq&slp=MgBSAggCYACSAaICCgsvZy8xdGhxNjJucQoNL2cvMTFnNnA2a2JqagoNL2cvMTFnMW5tOHF0MAoML2cvMXB0eGJtczkzCg0vZy8xMWZsZ2ZwNnN6Cg0vZy8xMWo1OGNxbXQ2CgwvZy8xcTY3cW54Y2QKCy9nLzF0Zmg1Z3pwCg0vZy8xMWZqcWxua3RyCg0vZy8xMXB0bWpfdnZmCg0vZy8xMWJ4amQ1ZHE1Cg0vZy8xMWNuMHBkZnprCg0vZy8xMWI3ZF9oMDM2Cg0vZy8xMXE4OGIxejg1Cg0vZy8xMWZ5bHNrcjFjCg0vZy8xMWYweGxwaHMwCgsvZy8xdGg4MnNmcAoNL2cvMTF0cmgwcTFocgoLL2cvMXRoazlqZnkKDS9nLzExZzY5ZzU3cGqaAQYKAhcZEAA%3D&src=2&serdesk=1&sa=X&ved=',
  uk: 'https://www.google.com/localservices/prolist?g2lbs=AOHF13mQCn9M23U86-0EAipi3P2TIsH5GeL2GtMYi3LzPn9KqbdaJxiGSNV1tyGg_OkJUDUH7S47LNUzWHag2Az97z_Tjg2PWttsi7Py4Y-XIHvQJsHPQW8%3D&hl=en-GB&gl=uk&ssta=1&oq&src=2&sa=X&q&ved=0CAcQjdcJahcKEwjw5tTC6tOHAxUAAAAAHQAAAAAQDA&slp=MgBAAVIECAIgAIgBAJoBBgoCFxkQAA%3D%3D&scp=CgpnY2lkOnN0b3JlEgAaACoEU2hvcA%3D%3D',
  au: 'https://www.google.com/localservices/prolist?g2lbs=AAEPWCsQ6bKhawFPgZqtTFc0vk_lxmwLfK2e6j0zaIIvF9K82n6eSL3YNFB9w9qJnCxeBtlgYwjaCYJ1YQKyW_EAkh30AWGVNQ%3D%3D&hl=en_GB&gl=au&ssta=1&q=%20&oq=haircut%20Stratton%20St&src=2&serdesk=1&lrlstt&slp=MgBAAVIECAIgAGAAaAE%3D&scp=EiAiCG1hcCBhcmVhKhQNr_Vn6hVpU1tEHWEg2PYlfA4GWg%3D%3D',
  sg: 'https://www.google.com/localservices/prolist?g2lbs=AOHF13nn4ObTvHsig14EW6dpANEB888bjinjUu7DsSbe33Qhez6qBCPD9e8YNnj5Fi4r5OemL2I9I4uQYXmOxSlJjbvjaoM0aESnX8GgvxlAgyqM4rFiuqc%3D&hl=en-SG&gl=sg&ssta=1&oq=&src=2&sa=X&scp=CgASABoAKgA%3D&q=&ved=0CAUQjdcJahgKEwjIiaXjmNSHAxUAAAAAHQAAAAAQhwE&slp=MgBAAVIECAIgAIgBAJoBBgoCFxkQAA%3D%3D',
  nz: 'https://www.google.com/localservices/prolist?g2lbs=AOHF13mkH56KEQEc5LOSVp7Ny4fJIb8hiWPH2r1culf-2nz_ACxrgRJ77-FoxGUS0apCx_MFTh_81BdPRSKA8JU2AcXY5Q5F_MZLwku-lUJ4yB2eR8t6o60%3D&hl=en-NZ&gl=nz&ssta=1&oq=estate%20agent%20watford&src=2&sa=X&ved=2ahUKEwijhejmxouGAxUDdmwGHSYpCiwQjGp6BAgiEAE&scp=CgASABoAKgA%3D&q=&slp=MgBAAVIECAIgAIgBAJoBBgoCFxkQAA%3D%3D'
};

ipcMain.handle('run-script', async (event, formData) => {
  const { businessName, keywords, countryCode } = formData;
  const keywordsPos = {};

  // Get the appropriate URL for the selected country, fallback to Canada if not found
  const baseUrl = countryUrls[countryCode] || countryUrls.ca;

  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set a default timeout of 30 seconds for all operations
    page.setDefaultTimeout(30000);

    for (const keyword of keywords) {
      try {
        // Navigate to the country-specific Google Local Services page
        await page.goto(baseUrl);
        
        // Wait for the search input field to be available and click on it
        await page.waitForSelector('#qjZKOb');
        await page.click('#qjZKOb');
        
        // Type the keyword and press Enter
        await page.type('#qjZKOb', keyword, { delay: 100 });
        await page.keyboard.press('Enter');

        // Wait for the network to be idle (all content loaded)
        await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {
          console.log('Network idle timeout, continuing anyway...');
        });

        // Wait a bit to ensure results are loaded
        await page.waitForTimeout(2000);

        // Extract the business names from the results
        const textArray = await page.evaluate(() => {
          const textContainer = document.getElementsByClassName('rgnuSb xYjf2e');
          const textArray = [];
          for (let i = 0; i < textContainer.length; i++) {
            const text = textContainer[i].textContent.trim();
            textArray.push(text);
          }
          return textArray;
        });

        console.log(`Found ${textArray.length} results for keyword: ${keyword}`);
        
        // Find the position of the business
        const position = textArray.findIndex((text) => text.includes(businessName));
        keywordsPos[`${keyword}`] = position !== -1 ? position + 1 : '-';
        
        console.log(`Position for "${keyword}": ${keywordsPos[keyword]}`);
      } catch (error) {
        console.error(`Error searching for keyword "${keyword}":`, error);
        keywordsPos[`${keyword}`] = 'Error';
      }
    }
  } catch (error) {
    console.error('Error in Puppeteer session:', error);
  } finally {
    // Make sure to close the browser to prevent memory leaks
    await browser.close();
  }
  
  return keywordsPos;
});
