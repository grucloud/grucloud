const CoreClient = require("../CoreClient");
const urljoin = require("url-join");
const BASE_URL = "https://compute.googleapis.com/compute/v1/";

module.exports = GoogleClient = (options, config) =>
  CoreClient({
    type: "google",
    options,
    onHeaders: () => ({
      Authorization: `Bearer ${process.env.GOOGLE_SERVICE_ACCOUNT_KEY}`,
    }),
    baseURL: urljoin(BASE_URL, options.url),
    onResponse: options.onResponse,
  });
