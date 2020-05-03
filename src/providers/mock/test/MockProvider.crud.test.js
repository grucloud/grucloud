const assert = require("assert");
const createStack = require("./MockStack");
const config = require("./config");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

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

describe("MockProviderCrud", async function () {
  const { providers, ip, volume, server, image } = await createStack({
    config,
  });
  const provider = providers[0];

  it.skip("testCrud", async function () {
    //TODO add createOptions
    await testCrud({ provider, resource: ip });
  });
});
