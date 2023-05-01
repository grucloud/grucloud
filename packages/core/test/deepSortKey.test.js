const assert = require("assert");

const { deepSortKey } = require("../deepSortKey");

describe.only("deepSortKey", function () {
  it("deepSortKey simple", async function () {
    const obj = {
      c: 3,
      b: [{ z: 1, y: 2 }],
      a: { z: 1, y: 2 },
    };
    const result = deepSortKey()(obj);
    assert.equal(
      JSON.stringify(result),
      JSON.stringify({
        a: { y: 2, z: 1 },
        b: [{ y: 2, z: 1 }],
        c: 3,
      })
    );
  });
  it("deepSortKey exlude", async function () {
    const obj = {
      c: 3,
      b: [{ z: 1, y: 2 }],
      a: { z: 1, y: 2 },
    };
    const result = deepSortKey({ keysExclude: ["a"] })(obj);
    assert.equal(
      JSON.stringify(result),
      JSON.stringify({
        a: { z: 1, y: 2 },
        b: [{ y: 2, z: 1 }],
        c: 3,
      })
    );
  });
  it("deepSortKey policy", async function () {
    const obj = {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "appsync.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    };

    const result = deepSortKey({ keysExclude: ["AssumeRolePolicyDocument"] })(
      obj
    );
    assert.equal(JSON.stringify(result), JSON.stringify(obj));
  });
});
