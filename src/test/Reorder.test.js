const assert = require("assert");
const _ = require("lodash");
const { PlanReorder } = require("../providers/PlanReorder");

const plans = [
  {
    resource: {
      name: "vpc",
      type: "Vpc",
    },
  },
  {
    resource: {
      name: "sg",
      type: "SecurityGroup",
    },
  },
  {
    resource: {
      name: "server",
      type: "Server",
    },
  },
  {
    resource: {
      name: "image",
      type: "Image",
    },
  },
];

const specs = [
  { type: "Vpc" },
  { type: "SecurityGroup", dependsOn: "Vpc" },
  { type: "Server", dependsOn: "SecurityGroup" },
  { type: "Image" },
];

describe("Reoder", function () {
  it("specUsedBy", function () {
    assert(
      _.isEqual(specUsedBy(specs), [
        { type: "Vpc", usedBy: ["SecurityGroup"] },
        { type: "SecurityGroup", dependsOn: "Vpc", usedBy: ["Server"] },
        { type: "Server", dependsOn: "SecurityGroup", usedBy: [] },
      ])
    );
  });
  it("ok", function () {
    const ordered = PlanReorder({ plans, specs });
    console.log(JSON.stringify(_.flatten(ordered), null, 4));
  });
});
