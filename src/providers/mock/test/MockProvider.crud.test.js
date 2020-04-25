const assert = require("assert");
const createStack = require("./MockStack");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

const mockCloudInitStates = [
  ["Ip", []],
  ["Image", [["1", { name: "Ubuntu", arch: "x86_64" }]]],
  ["Volume", []],
  ["Server", []],
];

const testCrud = async ({ provider, resource, createOptions }) => {
  //TODO do not use client
  const { client } = resource;
  {
    await provider.destroyAll();
    const {
      data: { items },
    } = await client.list();
    //Cannot destroy images
    assert.equal(items.length, 0);
  }

  {
    await resource.create({ payload: createOptions });
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 1);
  }
  //TODO check double create
  {
    const {
      data: { items },
    } = await client.list();
    //assert.equal(items.length, 1);
  }
  {
    await provider.destroyAll();
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 0);
  }
};

describe("MockProvider", function () {
  const { providers, ip, volume, server, image } = createStack({
    config: { mockCloudInitStates },
  });
  const provider = providers[0];

  it.skip("testCrud", async function () {
    //TODO add createOptions
    await testCrud({ provider, resource: ip });
  });
});
