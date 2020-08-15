const assert = require("assert");
const urljoin = require("url-join");
const { defaultsDeep, isDeepEqual, unionWith } = require("rubico/x");
const { get, switchCase, all } = require("rubico");
const { copyDeep } = require("rubico/monad/Struct");

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
  it("unionWith", async function () {
    const managementTags = [
      {
        Key: "managedBy",
        Value: "gru",
      },
      {
        Key: "phase",
        Value: "prod",
      },
    ];
    const otherTags = [
      {
        Key: "phase",
        Value: "prod",
      },
      {
        Key: "key1",
        Value: "value1",
      },
    ];
    const result = unionWith(isDeepEqual)([managementTags, otherTags]);
    assert.deepEqual(result, [
      {
        Key: "managedBy",
        Value: "gru",
      },
      {
        Key: "phase",
        Value: "prod",
      },
      {
        Key: "key1",
        Value: "value1",
      },
    ]);
  });
  it.skip("unionWith undefined", async function () {
    const managementTags = [
      {
        Key: "managedBy",
        Value: "gru",
      },
      {
        Key: "phase",
        Value: "prod",
      },
    ];

    const result = unionWith(isDeepEqual)([undefined, managementTags]);
    assert.deepEqual(result, managementTags);
  });
  it("defaultsDeep no mutation", async function () {
    const defaultHook = {
      onDeployed: {
        init: () => {},
        actions: [],
      },
    };
    const hook = {
      onDeployed: {
        actions: [
          { name: "Ping", command: async ({ host }) => {} },
          { name: "SSH", command: async ({ host }) => {} },
        ],
      },
    };
    const hookCloned = copyDeep(hook);
    defaultsDeep(defaultHook)(hookCloned);
    assert(isDeepEqual(hookCloned, hook));
  });
  it("defaultsDeep Cannot read property 'Rules' of undefined", async function () {
    const result = defaultsDeep({ Bucket: "ciccio" })({
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
    });
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
