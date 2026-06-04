import fs from 'fs';
import axios from 'axios';

/**
 * Downloads an image from a URL and saves it to a local path.
 * @param {string} output_path - The path where the downloaded image will be saved.
 * @param {string} url - The URL of the image to download.
 */
async function fetch_image(output_path=null, url=null, show_log = false) {
    if (show_log) {
        console.log(">> Starting Fetch Image...");
        console.log(`..Path: ${output_path}\n..URL: ${url}`);
    }
    try {
        const response = await axios.get(url, {responseType: 'arraybuffer'});
        fs.writeFileSync(output_path, Buffer.from(response.data));
    } catch(error) {
        console.error(`# Error downloading image from ${url}:\n`);
        console.error(error);
    } finally {
        if (show_log) console.log('Done!');
    }
}

export default fetch_image;
export { fetch_image };