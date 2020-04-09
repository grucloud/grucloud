const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");
const ComputeResource = require("./resources/Compute");

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

describe.skip("GoogleProvider", function () {
  const provider = GoogleProvider({ name: "google" }, config);

  const webResource = ComputeResource(
    { name: "web-server", provider },
    webResourceConfig
  );

  const infra = {
    providers: [provider],
    resources: [webResource],
  };

  it("engineByType", async function () {
    const computeResource = provider.engineByType("compute");
    assert(computeResource);
  });
  it("plan", async function () {
    // The infrastructure

    const gc = GruCloud(infra);
    const plan = await gc.plan();
    console.log(JSON.stringify(plan, null, 4));
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });

  it("list, ", async function () {
    const response = await computeResource.list({});
    assert(response);
  });

  it("list, create, list, delete, list", async function () {
    const listB4 = await computeResource.list();

    const name = `vm-test-${new Date().getTime()}`;

    await computeResource.create(name, createOptions);

    const vm = await computeResource.get(name);

    //console.log("listAfterCreation", vm);
    const { metadata } = vm;
    assert(metadata.machineType.endsWith(createOptions.machineType));
    assert.equal(metadata.status, "RUNNING");

    await computeResource.destroy(name);
    const listAfterDestroy = await computeResource.list();
    //console.log("listAfterDestroy", listAfterDestroy);
    assert.equal(listB4.length, listAfterDestroy.length);
  });
  it.skip("create", async function () {
    const name = `vm-test-${new Date().getTime()}`;
    await computeResource.create(name, createOptions);
  });
});
