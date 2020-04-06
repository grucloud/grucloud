const assert = require("assert");
const GruCloud = require("./GruCloudApp");
const MockProvider = require("./providers/mock");

const config = {};

const infra = (config) => ({
  providers: [
    {
      name: "mock",
      engine: MockProvider,
      config: {
        compute: {
          machines: [{ name: "mock-server", machineType: "f1-micro" }],
        },
      },
    },
  ],
  resources: [
    {
      name: "web",
      type: "compute",
      provider: "mock",
      config: {
        machineType: "f1-micro",
      },
    },
  ],
});
const infraNoResource = (config) => ({
  providers: [
    {
      name: "mock",
      engine: mock,
      config: {},
    },
  ],
  resources: [],
});
describe("GruCloud", function () {
  describe("plan", function () {
    const gc = GruCloud(infra(config));
    it.only("plan", async function () {
      const gc = GruCloud(infra(config));
      const plan = await gc.plan();
      //console.log(plan);
    });

    it("NoResource", async function () {
      const gcNoResource = GruCloud(infraNoResource(config));
      const planNoResource = await gcNoResource.plan();
      //console.log(planNoResource);
    });
    it("list", async function () {
      const result = await gc.list();
      //console.log(result);
    });
  });
});
