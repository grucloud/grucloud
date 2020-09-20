const assert = require("assert");
const { isOurMinion } = require("../AwsEC2Tags");

const config = {
  managedByKey: "ManagedBy",
  managedByValue: "GruCloud",
  managedByDescription: "Managed By GruCloud",
};

describe("isOurMinion", function () {
  const resource = {
    Tags: [
      {
        Key: "ìName",
        Value: "web-server",
      },
      {
        Key: "ManagedBy",
        Value: "GruCloud",
      },
    ],
  };
  it("is our", function () {
    assert(isOurMinion({ resource, config }));
  });
  it("not our", function () {
    assert(
      !isOurMinion({ resource, config: { ...config, managedByValue: "other" } })
    );
  });
});
