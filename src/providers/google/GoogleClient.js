const assert = require("assert");
const urljoin = require("url-join");
const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");

const BASE_URL = "https://compute.googleapis.com/compute/v1/";

module.exports = GoogleClient = ({ spec, config }) => {
  assert(spec.url);
  assert(config.accessToken);

  return CoreClient({
    type: "google",
    spec,
    ...spec,
    axios: AxiosMaker({
      baseURL: urljoin(BASE_URL, spec.url),
      onHeaders: () => ({
        Authorization: `Bearer ${config.accessToken}`,
      }),
    }),
  });
};
