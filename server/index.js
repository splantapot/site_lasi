import axios from "axios";
import render_site from "./render.js";

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzGfTkQ6xI-aSQUAGB-FHIMmX1eeppPT9UaMBmHTFbTskgsN_xDotDm30HRR0rxp54/exec";
const TIMEOUT = 10000; // 10 seconds
let data = [];

const x = 1000;

await axios.get(WEB_APP_URL, {timeout: TIMEOUT})
  .then((response) => {
    data = response.data;
})
.catch((error) => {
    console.error("Error fetching data from Google Sheets:\n", error);
});

if (data) {
    await render_site(data);
}