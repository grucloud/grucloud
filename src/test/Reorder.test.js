const assert = require("assert");
const _ = require("lodash");
const { PlanReorder } = require("../providers/PlanReorder");

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
  it("aws", function () {
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
      { type: "Server", dependsOn: ["SecurityGroup"] },
      { type: "SecurityGroup", dependsOn: ["Vpc"] },
      { type: "Vpc" },
      { type: "Image" },
    ];
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
  it("azure", function () {
    const plans = [
      {
        resource: {
          name: "rg",
          type: "ResourceGroup",
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
          name: "vnet",
          type: "VirtualNetwork",
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
          name: "ip",
          type: "PublicIpAddress",
        },
      },
      {
        resource: {
          name: "netint",
          type: "NetworkInterface",
        },
      },
    ];

    const specs = [
      { type: "ResourceGroup" },
      { type: "SecurityGroup", dependsOn: ["ResourceGroup"] },
      { type: "VirtualNetwork", dependsOn: ["ResourceGroup"] },
      {
        type: "NetworkInterface",
        dependsOn: [
          "ResourceGroup",
          "VirtualNetwork",
          "SecurityGroup",
          "PublicIpAddress",
        ],
      },
      { type: "PublicIpAddress", dependsOn: ["ResourceGroup"] },
    ];
    const ordered = _.flatten(PlanReorder({ plans, specs }));
    console.log(
      "ORDERED",
      ordered.map((item) => item.resource.type)
    );
    const expected = [
      "ResourceGroup",
      "VirtualNetwork",
      "SecurityGroup",
      "PublicIpAddress",
      "NetworkInterface",
    ];
    /*
    assert(
      _.isEqual(
        expected,
        ordered.map((item) => item.resource.type)
      )
    );*/
  });
});
