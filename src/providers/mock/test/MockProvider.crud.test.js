const assert = require("assert");
const createStack = require("./MockStack");
const MockCloud = require("../MockCloud");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

const createName = (name) => `${name}-${new Date().getTime()}`;

const mockServerInitStates = [
  ["Ip", []],
  ["Image", [["1", { name: "Ubuntu", arch: "x86_64" }]]],
  ["Volume", []],
  ["Server", []],
];

const testCrud = async ({ provider, resource, createOptions }) => {
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
    //TODO
    //await provider.destroyByName({ resource: items[0] });
  }
  {
    const {
      data: { items },
    } = await client.list();
    //assert.equal(items.length, 1);
  }
  {
    //TODO destroyAll ?
    await resource.destroyAll();
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 0);
  }
};

describe("MockProvider", function () {
  const { provider, ip, volume, server, image } = createStack({
    config: MockCloud(mockServerInitStates),
  });

  it("testCrud", async function () {
    await testCrud({ provider, resource: image });
  });
});
