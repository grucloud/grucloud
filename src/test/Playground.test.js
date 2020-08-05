const assert = require("assert");
const urljoin = require("url-join");
const {defaultsDeep, isDeepEqual} = require("rubico/x");
const { get, switchCase, all } = require("rubico");

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
    assert(isDeepEqual(result, { size: 20 }));
  });
  it("get", async function () {
    const obj = { a: "aaa" };
    assert.equal(get("a")(obj), "aaa");
  });
  it("all", async function () {
    const resultsWithError = [{ data: "a" }, { error: true }];
    assert.equal(all((result) => !result.error)(resultsWithError), false);
    const resultsOk = [{ data: "a" }, { data: "b" }];
    assert.equal(all((result) => !result.error)(resultsOk), true);
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
