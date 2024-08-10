import puppeteer from "puppeteer";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const prompt = require("prompt-sync")({ sigint: true });
const articleUrl = prompt("Enter URL: ");

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(`${articleUrl}`, {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const quotes = await page.evaluate(() => {

    // Fetch the first element with class "quote"
    // Get the displayed text and returns it
    const quoteList = document.querySelectorAll(".content");

    // Convert the quoteList to an iterable array
    // For each quote fetch the text
    return Array.from(quoteList).map((quote) => {
      // Get the displayed text and return it (`.innerText`)
      const text = quote.innerText;
      return { text };
    });
  });

  // Display the quotes
  //console.log(source);
  console.log(quotes);
  //console.log(source.innerHTML);

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();