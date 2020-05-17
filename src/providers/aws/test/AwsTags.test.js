const assert = require("assert");
const { isOurMinion } = require("../AwsTags");

const tag = "-gru";
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

describe("AwsIsOurMinion", function () {
  it("is our", function () {
    assert(isOurMinion({ resource, tag }));
  });
  it("not our", function () {
    assert(!isOurMinion({ resource, tag: "NotMyTag" }));
  });
});
