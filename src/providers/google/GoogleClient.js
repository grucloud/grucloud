const CoreClient = require("../CoreClient");
const urljoin = require("url-join");
const BASE_URL = "https://compute.googleπ.com/compute/v1/";

module.exports = GoogleClient = ({ spec, config }) =>
  CoreClient({
    type: "google",
    spec,
    ...spec,
    onHeaders: () => ({
      Authorization: `Bearer ${process.env.GOOGLE_SERVICE_ACCOUNT_KEY}`,
    }),
    baseURL: urljoin(BASE_URL, spec.url),
  });
