const CoreClient = require("../CoreClient");
const urljoin = require("url-join");
const AxiosMaker = require("../AxiosMaker");

const BASE_URL = "https://api.scaleway.com/instance/v1/";

module.exports = ScalewayClient = ({ spec, config }) =>
  CoreClient({
    type: "scaleway",
    spec,
    ...spec,
    axios: AxiosMaker({
      baseURL: urljoin(BASE_URL, "zones", config.zone, spec.url),
      onHeaders: () => ({ "X-Auth-Token": process.env.SCALEWAY_SECRET_KEY }),
    }),
  });
