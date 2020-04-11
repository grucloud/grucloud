const CoreClient = require("../CoreClient");
const urljoin = require("url-join");

const BASE_URL = "https://api.scaleway.com/instance/v1/";

module.exports = ScalewayClient = ({
  name,
  url,
  config: { zone },
  onResponse,
}) =>
  CoreClient({
    name,
    type: "scaleway",
    onResponse,
    onHeaders: () => ({ "X-Auth-Token": process.env.SCALEWAY_SECRET_KEY }),
    baseURL: urljoin(BASE_URL, "zones", zone, url),
  });
