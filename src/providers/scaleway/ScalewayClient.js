const CoreClient = require("../CoreClient");
const urljoin = require("url-join");

const BASE_URL = "https://api.scaleway.com/instance/v1/";

module.exports = ScalewayClient = ({ spec, config }) =>
  CoreClient({
    type: "scaleway",
    spec,
    ...spec,
    onHeaders: () => ({ "X-Auth-Token": process.env.SCALEWAY_SECRET_KEY }),
    baseURL: urljoin(BASE_URL, "zones", config.zone, spec.url),
  });
