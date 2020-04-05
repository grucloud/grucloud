const assert = require("assert");
const GruCloud = require("./GruCloudApp");
const GoogleProvider = require("./providers/google");

const config = {
  project: "starhackit",
  region: "europe-west4",
  zone: "europe-west4-a",
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
      name: "web",
      type: "compute",
      provider: "google",
      config: {
        machineType: "f1-micro",
        zone: config.zone,
        tags: ["www-node"],
      },
    },
  ],
});
const infraNoResource = (config) => ({
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
  resources: [],
});
describe("GruCloud", function () {
  describe("plan", function () {
    const gc = GruCloud(infra(config));
    it("plan", async function () {
      const gc = GruCloud(infra(config));
      const plan = await gc.plan();
      console.log(plan);
    });
    it.only("NoResource", async function () {
      const gcNoResource = GruCloud(infraNoResource(config));
      const planNoResource = await gcNoResource.plan();
      console.log(planNoResource);
    });
    it("list", async function () {
      const result = await gc.list();
      console.log(result);
    });
  });
});
