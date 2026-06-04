import fetch_data from './src/fetch/fetch_data.js';
import build_website from './src/build.js';

let data = await fetch_data();

// If data was fetched successfully
if (data != null) {
    await build_website(data);
}