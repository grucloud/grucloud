const assert = require("assert");
const MockProvider = require("./MockProvider");

const config = {
  compute: { machines: [] },
};

const createOptions = {};

describe("MockProvider", function () {
  const provider = MockProvider({ name: "mock" }, config);
  const computeResource = provider.engineByType("mock");
  assert(computeResource);

  it("list, ", async function () {
    const response = await computeResource.list({});
  });

  it("list, create, list, delete, list", async function () {
    const listB4 = await computeResource.list();
    const name = `vm-test-${new Date().getTime()}`;
    await computeResource.create(name, createOptions);
    const vm = await computeResource.get(name);
    await computeResource.destroy(name);
  });
  it("create", async function () {
    const name = `vm-test-${new Date().getTime()}`;
    await computeResource.create(name, createOptions);
  });
});
