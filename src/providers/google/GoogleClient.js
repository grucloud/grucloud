const CoreClient = require("../CoreClient");
const urljoin = require("url-join");
const BASE_URL = "https://compute.googleπ.com/compute/v1/";

module.exports = GoogleClient = ({ options }) =>
  CoreClient({
    type: "google",
    options,
    onHeaders: () => ({
      Authorization: `Bearer ${process.env.GOOGLE_SERVICE_ACCOUNT_KEY}`,
    }),
    baseURL: urljoin(BASE_URL, options.url),
    onResponse: options.onResponse,
  });
