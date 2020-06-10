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
  { type: "Server", dependsOn: "SecurityGroup" },
  { type: "SecurityGroup", dependsOn: "Vpc" },
  { type: "Vpc" },
  { type: "Image" },
];

describe("Reoder", function () {
  /*it("specUsedBy", function () {
    assert(
      _.isEqual(specUsedBy(specs), [
        { type: "Vpc", usedBy: ["SecurityGroup"] },
        { type: "SecurityGroup", dependsOn: "Vpc", usedBy: ["Server"] },
        { type: "Server", dependsOn: "SecurityGroup", usedBy: [] },
      ])
    );
  });*/
  it("ok", function () {
    const ordered = _.flatten(PlanReorder({ plans, specs }));
    //console.log(JSON.stringify(ordered, null, 4));
    const expected = ["Vpc", "SecurityGroup", "Server", "Image"];
    assert(
      _.isEqual(
        expected,
        ordered.map((item) => item.resource.type)
      )
    );
  });
});
