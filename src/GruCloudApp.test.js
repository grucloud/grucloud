const assert = require("assert");
const GruCloud = require("./GruCloudApp");
const GoogleProvider = require("./providers/google");

const config = {
  project: "starhackit",
  region: "us-central1",
  zone: "us-central1-f",
};

const infra = (config) => ({
  providers: [
    {
      name: "google",
      engine: GoogleProvider,
      config: {
        region: config.region,
        project: config.project,
        zone: config.zone,
      },
    },
  ],
  resources: [
    {
      name: "compute",
      provider: "google",
      config: {
        machine_type: "f1-micro",
        zone: config.zone,
        tags: ["www-node"],
      },
    },
  ],
});

describe("GruCloud", function () {
  describe("plan", function () {
    const gc = GruCloud(infra(config));

    it("list", async function () {
      await gc.list();
    });
  });
});
