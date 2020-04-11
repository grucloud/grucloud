const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");

const GruCloud = require("../../GruCloudApp");

const config = {
  project: "starhackit",
  region: "europe-west4",
  zone: "europe-west4-a",
};

const webResourceConfig = {
  os: "ubuntu",
  machineType: "f1-micro",
};

describe("GoogleProvider", function () {
  const provider = GoogleProvider({ name: "google" }, config);
  const computeResource = provider.engineByType("compute");
  const webResource = provider.makeCompute("web-server", config);

  const infra = {
    providers: [provider],
    resources: [webResource],
  };

  it("engineByType", async function () {
    //const computeResource = provider.engineByType("compute");
    //assert(computeResource);
  });
  it("plan", async function () {
    const gc = GruCloud(infra);
    const plan = await gc.plan();
    console.log(JSON.stringify(plan, null, 4));
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });

  it("list, ", async function () {
    const response = await computeResource.client.list({});
    assert(response);
  });

  it("list, create, list, delete, list", async function () {
    const listB4 = await computeResource.client.list();

    const name = `vm-test-${new Date().getTime()}`;

    await computeResource.create(name, webResourceConfig);

    const vm = await computeResource.client.get(name);

    //console.log("listAfterCreation", vm);
    const { metadata } = vm;
    assert(metadata.machineType.endsWith(webResourceConfig.machineType));
    assert.equal(metadata.status, "RUNNING");

    await computeResource.client.destroy(name);
    const listAfterDestroy = await computeResource.client.list();
    //console.log("listAfterDestroy", listAfterDestroy);
    assert.equal(listB4.length, listAfterDestroy.length);
  });
  it.skip("create", async function () {
    const name = `vm-test-${new Date().getTime()}`;
    await computeResource.create(name, webResourceConfig);
  });
});
