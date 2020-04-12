const CoreClient = require("../CoreClient");
const urljoin = require("url-join");

const BASE_URL = "https://api.scaleway.com/instance/v1/";

module.exports = ScalewayClient = (options, providerConfig) =>
  CoreClient({
    type: "scaleway",
    options,
    onHeaders: () => ({ "X-Auth-Token": process.env.SCALEWAY_SECRET_KEY }),
    baseURL: urljoin(BASE_URL, "zones", providerConfig.zone, options.url),
    onResponse: options.onResponse,
  });
