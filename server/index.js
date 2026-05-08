import axios from "axios";
import render_site from "./render.js";

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw8OR3e50GVCQ_tgu843cFUoSsDHUH8tedLFkNydR64PcQDec0pJZH_HK5kYpN0WULG/exec";
const TIMEOUT = 10000; // 10 seconds
let data = [];

await axios.get(WEB_APP_URL, {timeout: TIMEOUT})
  .then((response) => {
    data = response.data;
})
.catch((error) => {
    console.error("Error fetching data from Google Sheets:\n", error);
});

if (data) {
    render_site(data);
}