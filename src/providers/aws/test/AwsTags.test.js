const assert = require("assert");
const { isOurMinionEc2, isOurMinion } = require("../AwsTags");

const tag = "-gru";

describe("isOurMinionEc2", function () {
  const resource = {
    Groups: [],
    Instances: [
      {
        Tags: [
          {
            Key: "name",
            Value: "web-server",
          },
          {
            Key: "-gru",
            Value: "true",
          },
        ],
      },
    ],
  };
  it("is our", function () {
    assert(isOurMinionEc2({ resource, tag }));
  });
  it("not our", function () {
    assert(!isOurMinionEc2({ resource, tag: "NotMyTag" }));
  });
});

describe("isOurMinion", function () {
  const resource = {
    Tags: [
      {
        Key: "name",
        Value: "web-server",
      },
      {
        Key: "-gru",
        Value: "true",
      },
    ],
  };
  it("is our", function () {
    assert(isOurMinion({ resource, tag }));
  });
  it("not our", function () {
    assert(!isOurMinion({ resource, tag: "NotMyTag" }));
  });
});
