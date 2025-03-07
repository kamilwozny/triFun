const puppeteer = require('puppeteer');

const scrapeData = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  let hasNextPage = true; // Flag to track pagination
  const allData = []; // Array to store data from all pages

  while (hasNextPage) {
    // Wait for the race-card elements to load
    await page.waitForSelector('div.race-card');

    // Scrape data from the current page
    const data = await page.evaluate(() => {
      const raceCards = document.querySelectorAll('div.race-card');
      return Array.from(raceCards).map((card) => {
        const detailsLeft = card.querySelector('div.details-left');
        const raceDate = card.querySelector('div.race-date');
        const raceImage = card.querySelector('div.race-image img');
        const detailsRight = card.querySelector('div.details-right');

        const h3 = detailsLeft ? detailsLeft.querySelector('h3') : null;
        const raceLocation = detailsLeft
          ? detailsLeft.querySelector('p')
          : null;
        const raceMonth = raceDate
          ? raceDate.querySelector('p.race-month')
          : null;
        const raceDay = raceDate ? raceDate.querySelector('p.race-day') : null;
        const raceYear = raceDate
          ? raceDate.querySelector('p.race-year')
          : null;
        const imageUrl = raceImage ? raceImage.src : null;
        const detailsLink = detailsRight
          ? detailsRight.querySelector('a')
          : null;

        return {
          title: h3 ? h3.innerText.trim() : null,
          location: raceLocation ? raceLocation.innerText.trim() : null,
          date:
            raceMonth && raceDay && raceYear
              ? `${raceMonth.innerText.trim()} ${raceDay.innerText.trim()}, ${raceYear.innerText.trim()}`
              : null,
          image: imageUrl,
          detailsLink: detailsLink ? detailsLink.href : null,
        };
      });
    });

    // Add the current page's data to the overall array
    allData.push(...data);

    // Check if there's a "Next" button and navigate to the next page
    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector('button.nextPageButton'); // Adjust selector for the "Next" button
      if (nextButton && !nextButton.classList.contains('hidden')) {
        nextButton.click();
        return true;
      }
      return false;
    });

    // Wait for the next page to load if there is one
    if (hasNextPage) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Output all scraped data
  // console.log(allData);

  // Close the browser
  await browser.close();
};

scrapeData('https://www.ironman.com/races');
