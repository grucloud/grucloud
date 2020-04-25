const urljoin = require("url-join");

const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");

const BASE_URL = "https://compute.googleapis.com/compute/v1/";

//TODO dot not use process.env.GOOGLE_SERVICE_ACCOUNT_KEY here, pass it down

module.exports = GoogleClient = ({ spec, config }) =>
  CoreClient({
    type: "google",
    spec,
    ...spec,
    axios: AxiosMaker({
      baseURL: urljoin(BASE_URL, "zones", config.zone, spec.url),
      onHeaders: () => ({
        Authorization: `Bearer ${process.env.GOOGLE_SERVICE_ACCOUNT_KEY}`,
      }),
    }),
  });
