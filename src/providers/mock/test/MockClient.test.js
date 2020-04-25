const assert = require("assert");
const _ = require("lodash");

const MockClient = require("../MockClient");
const MockCloud = require("./MockCloud");
const { SpecDefault } = require("../../SpecDefault");

const initStates = [
  ["Ip", []],
  ["Image", []],
  ["Volume", []],
  ["Server", []],
];

describe("MockClient", function () {
  const config = MockCloud(initStates);

  const spec = _.defaults(
    {
      type: "Server",
      url: `/server`,
    },
    SpecDefault({})
  );
  it("regex", async function () {
    const r = new RegExp(/^\/.+/);
    assert(!r.test("http://ggg/"));
    assert(r.test("/123"));
  });
  it("list", async function () {
    const mockClient = MockClient({ spec, config });

    const { data } = await mockClient.list();
    assert.equal(data.total, 0);
  });
  it("get by id", async function () {
    const mockClient = MockClient({ spec, config });
    try {
      await mockClient.getById({ id: "asdfg" });
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });
  it("create", async function () {
    const mockClient = MockClient({ spec, config });

    const {
      data: { id },
    } = await mockClient.create({
      name: "ciccio",
      payload: { name: "ciccio" },
    });

    {
      const { data } = await mockClient.list();
      assert.equal(data.total, 1);
      assert.equal(data.items.length, 1);
    }
    {
      const { data } = await mockClient.getById({ id });
      assert(data);
      assert.equal(data.id, id);
    }
    {
      await mockClient.destroy({ id });
    }
  });
});
