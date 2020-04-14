const assert = require("assert");
const _ = require("lodash");
const { checkEnvironment, compare } = require("./Utils");

describe("checkEnvironment", function () {
  it("checkEnvironment empty", async function () {
    checkEnvironment([]);
  });
});

describe.only("compare", function () {
  it("compare", async function () {
    const target = {
      size: 200,
      location: "br",
      type: "block",
    };
    const live = {
      size: 200,
      location: "co",
      tags: [],
    };

    assert.equal(compare(target, live).length, 2);
  });
});
