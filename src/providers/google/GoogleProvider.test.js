const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");

const config = {
  project: "starhackit",
  region: "us-central1",
  zone: "us-central1-f",
};

const createOptions = {
  os: "ubuntu",
  machineType: "f1-micro",
};

describe("GoogleProvider", function () {
  const provider = GoogleProvider(config);
  const computeResource = provider.resource("compute");
  assert(computeResource);

  it("list, ", async function () {
    const response = await computeResource.list({});
    console.log(response);
  });

  it.only("list, create, list, delete, list", async function () {
    const listB4 = await computeResource.list();
    console.log("listB4", listB4);

    const name = `vm-test-${new Date().getTime()}`;

    await computeResource.create(name, createOptions);

    const vm = await computeResource.get(name);

    console.log("listAfterCreation", vm);
    const { metadata } = vm;
    assert(metadata.machineType.endsWith(createOptions.machineType));
    assert.equal(metadata.status, "RUNNING");

    await computeResource.destroy(name);
    const listAfterDestroy = await computeResource.list();
    console.log("listAfterDestroy", listAfterDestroy);
    assert.equal(listB4.length, listAfterDestroy.length);
  });
});
