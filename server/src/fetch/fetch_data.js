import axios from 'axios';
import { WEB_APP_URL, WEB_APP_TIMEOUT } from '../../config.js'

/**
 * Fetch data from API.
 * 
 * @returns {Array} The data array or null, in errors.
 */
async function fetch_data() {
    console.log(`>> Started to Fetch Data`);
    console.log(`"${WEB_APP_URL}"`);

    // Start fetching data
    let data = null;
    await axios.get(WEB_APP_URL, {timeout: WEB_APP_TIMEOUT})
    .then((response) => {
        console.log("Success!");
        data = response.data;
    })
    .catch((error) => {
        console.error("# Error fetching data from Google Sheets:\n");
        console.error(error);
    });
    return data;
}

export default fetch_data;