import axios from "axios";
import { render_site } from "./src/render.js";

// Settings
process.loadEnvFile('./.env');
const WEB_APP_URL = process.env.WEB_APP_URL; // I NEED TO REPLACE BY NETLIFY ENV VAR!
const TIMEOUT = 10000;  // Download data in 10 seconds, otherwise throw error
let data = [];

console.log(`Getting data from Google Sheets [${WEB_APP_URL}[]...`);

// Start fetching data
await axios.get(WEB_APP_URL, {timeout: TIMEOUT})
  .then((response) => {
    data = response.data;
    console.log("Success!");
})
.catch((error) => {
    console.error("Error fetching data from Google Sheets:\n", error);
});

// If data was fetched successfully
if (data) {
    await render_site(data);
} else {
    console.error("It is not possible to render the site without the Google Sheets data.");
}