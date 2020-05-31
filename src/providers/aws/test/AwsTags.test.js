const assert = require("assert");
const { isOurMinionEc2, isOurMinion } = require("../AwsTags");

const config = {
  managedByKey: "ManagedBy",
  managedByValue: "GruCloud",
  managedByDescription: "Managed By GruCloud",
};

describe("isOurMinionEc2", function () {
  const resource = {
    Groups: [],
    Instances: [
      {
        Tags: [
          {
            Key: "Name",
            Value: "web-server",
          },
          {
            Key: "ManagedBy",
            Value: "GruCloud",
          },
        ],
      },
    ],
  };
  it("is our", function () {
    assert(isOurMinionEc2({ resource, config }));
  });
  it("not our", function () {
    assert(
      !isOurMinionEc2({
        resource,
        config: { managedByKey: "ddd", managedByValue: "other" },
      })
    );
  });
});

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
