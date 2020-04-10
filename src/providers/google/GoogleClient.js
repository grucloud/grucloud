const CoreClient = require("../CoreClient");
const urljoin = require("url-join");
const BASE_URL = "https://compute.googleapis.com/compute/v1/";

//TODO join url

module.exports = GoogleClient = ({ url, config, onResponse }) =>
  CoreClient({
    type: "google",
    onResponse,
    onHeaders: () => ({
      Authorization: `Bearer ${process.env.GOOGLE_SERVICE_ACCOUNT_KEY}`,
    }),
    baseURL: urljoin(BASE_URL, url),
  });
