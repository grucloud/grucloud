const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");

const config = {
  project: "starhackit",
  region: "europe-west4",
  zone: "europe-west4-a",
};

describe.skip("GoogleProvider", function () {
  const provider = GoogleProvider({ name: "google" }, config);

  const volume = provider.makeVolume({ name: "volume1" }, () => ({
    size: 20000000000,
  }));

  const server = provider.makeServer(
    {
      name: "web-server",
      dependencies: { volume },
    },
    async ({ dependencies: { volume } }) => ({
      name: "web-server",
      commercial_type: "DEV1-S",
      //image: await image.config(),
      volumes: {
        "0": await volume.config(),
      },
    })
  );
});
