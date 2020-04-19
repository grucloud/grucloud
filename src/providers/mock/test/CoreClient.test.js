const assert = require("assert");
const CoreClient = require("../../CoreClient");
const MockServer = require("./MockServer");

const port = 5645;
const baseURL = `http://localhost:${port}/compute`;

describe("CoreClient", function () {
  const routes = ["/compute/", "/address/"];
  const mockServer = MockServer({ port, routes });

  before(async function () {
    await mockServer.stop();
    await mockServer.start();
  });
  after(async function () {
    await mockServer.stop();
  });
  it("list", async function () {
    const coreClient = CoreClient({ baseURL });
    {
      const { data } = await coreClient.list();
      assert.equal(data.total, 0);
    }
  });
  it("create", async function () {
    const coreClient = CoreClient({ baseURL });

    const {
      data: { id },
    } = await coreClient.create({ name: "ciccio" });

    {
      const { data } = await coreClient.list();
      assert.equal(data.total, 1);
      assert.equal(data.items.length, 1);
    }
    {
      const { data } = await coreClient.get(id);
      assert(data);
      assert.equal(data.id, id);
    }
    {
      const { data } = await coreClient.destroy(id);
      assert(data);
      assert.equal(data.id, id);
    }
  });
});
