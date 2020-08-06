const assert = require("assert");
const { defaultsDeep } = require("lodash/fp");

const MockClient = require("../MockClient");
const { SpecDefault } = require("../../SpecDefault");
const { createAxiosMock } = require("../MockAxios");
const MockCloud = require("../MockCloud");

describe("MockClient", function () {
  const BASE_URL = "http://localhost:8089";
  const url = `/server`;
  let mockClient;
  const config = { mockCloud: MockCloud(), createAxios: createAxiosMock };

  const spec = defaultsDeep(SpecDefault({}))({
    type: "Server",
  });

  it("regex", async function () {
    const r = new RegExp(/^\/.+/);
    assert(!r.test("http://ggg/"));
    assert(r.test("/123"));
  });
  before(async function () {
    mockClient = MockClient({
      spec,
      url,
      config,
    });
  });
  it("list", async function () {
    const { total } = await mockClient.getList();
    assert.equal(total, 0);
  });
  it("get by id", async function () {
    try {
      await mockClient.getById({ id: "asdfg" });
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });
  it("create", async function () {
    const { id } = await mockClient.create({
      name: "ciccio",
      payload: { name: "ciccio" },
    });

    {
      const { total, items } = await mockClient.getList();
      assert.equal(total, 1);
      assert.equal(items.length, 1);
    }
    {
      const data = await mockClient.getById({ id });
      assert(data.id);
      assert.equal(data.id, id);
    }
    {
      await mockClient.destroy({ id });
    }
  });
});
