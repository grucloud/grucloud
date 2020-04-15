const assert = require("assert");
const createStack = require("./MockStack");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

const createName = (name) => `${name}-${new Date().getTime()}`;

const testCrud = async ({ resource, createOptions }) => {
  //TODO do not use client
  const { client } = resource;
  {
    await resource.destroyAll();
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 0);
  }

  {
    await resource.create({ name: createName("1"), options: createOptions });
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 1);
  }
  {
    await resource.create({ name: createName("2"), options: createOptions });
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 2);
    assert(items[0].name);
    await resource.destroy(items[0].name);
  }
  {
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 1);
  }
  {
    await resource.destroyAll();
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 0);
  }
};

describe("MockProvider", function () {
  const { provider, ip, volume, server, image } = createStack();

  it("testCrud", async function () {
    await testCrud({ resource: image });
  });
});
