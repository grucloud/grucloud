const assert = require("assert");
const urljoin = require("url-join");
const defaultsDeep = require("rubico/x/defaultsDeep");

const { isEqual } = require("lodash/fp");
const { get, switchCase } = require("rubico");

const list = {
  data: {
    items: [
      {
        id: "11",
      },
    ],
  },
};

describe("Playground", function () {
  it.skip("urljoin", async function () {
    const result = urljoin("", "/test");
    assert.equal(result, "/test");
  });
  it("defaultsDeep", async function () {
    const result = defaultsDeep({ size: 10 })({ size: 20 });
    assert(isEqual(result, { size: 20 }));
  });
  it("get", async function () {
    const obj = { a: "aaa" };
    assert.equal(get("a")(obj), "aaa");
  });
  it.skip("switchCase", async function () {
    await switchCase([
      () => true,
      async () => {
        console.log("throw 422");
        throw { code: 422 };
      },
      () => {},
    ])();
    console.log("after switchCase");
  });
});
