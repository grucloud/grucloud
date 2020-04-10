const CoreClient = require("../CoreClient");

const BASE_URL = "https://api.scaleway.com/instance/v1/";

module.exports = ScalewayClient = ({ url, config: { zone }, onResponse }) =>
  CoreClient({
    type: "scaleway",
    onResponse,
    onHeaders: () => ({ "X-Auth-Token": process.env.SCALEWAY_SECRET_KEY }),
    baseURL: `${BASE_URL}zones/${zone}/${url}`,
  });
