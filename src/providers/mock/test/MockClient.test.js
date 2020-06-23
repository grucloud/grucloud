const assert = require("assert");
const _ = require("lodash");
const urljoin = require("url-join");
const MockClient = require("../MockClient");
const { SpecDefault } = require("../../SpecDefault");
const { createAxiosMock } = require("./MockAxios");
const MockCloud = require("../MockCloud");

describe("MockClient", function () {
  const BASE_URL = "http://localhost:8089";
  const url = `/server`;

  const config = { mockCloud: MockCloud(), createAxios: createAxiosMock };

  const spec = _.defaults(
    {
      type: "Server",
    },
    SpecDefault({})
  );
  it("regex", async function () {
    const r = new RegExp(/^\/.+/);
    assert(!r.test("http://ggg/"));
    assert(r.test("/123"));
  });
  //TODO create mockClient in before()
  it("list", async function () {
    const mockClient = MockClient({
      spec,
      url,
      config,
    });

    const { total } = await mockClient.list();
    assert.equal(total, 0);
  });
  it("get by id", async function () {
    const mockClient = MockClient({
      spec,
      url,
      config,
    });
    try {
      await mockClient.getById({ id: "asdfg" });
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });
  it("create", async function () {
    const mockClient = MockClient({
      spec,
      url,
      config,
    });

    const { id } = await mockClient.create({
      name: "ciccio",
      payload: { name: "ciccio" },
    });

    {
      const { total, items } = await mockClient.list();
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
