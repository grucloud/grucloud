const assert = require("assert");
const { isDeepEqual } = require("rubico/x");

const { deepDefaultByPath, deepDefaults } = require("../deepDefault");

describe("deepDefault", function () {
  it("deepDefault key already set", async function () {
    const obj = { a: 1 };
    const result = deepDefaultByPath([["a"], 2])(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepDefault simple", async function () {
    const obj = { a: 1 };
    const result = deepDefaultByPath([["b"], 2])(obj);
    assert(isDeepEqual(result, { a: 1, b: 2 }));
  });
  it("deepDefault undefined", async function () {
    const obj = undefined;
    const result = deepDefaultByPath([["b"], 2])(obj);
    assert(isDeepEqual(result, { b: 2 }));
  });
  it("deepDefault undefined array", async function () {
    const obj = {};
    const result = deepDefaultByPath([["a[]", "b"], 2])(obj);
    assert(isDeepEqual(result, {}));
  });
  it("deepDefault deep ", async function () {
    const obj = {};
    const result = deepDefaultByPath([["a", "b"], 2])(obj);
    assert(isDeepEqual(result, { a: { b: 2 } }));
  });
  it("deepDefault deep simple", async function () {
    const obj = { a: { b: 2 } };
    const result = deepDefaultByPath([["a", "c"], 3])(obj);
    assert(isDeepEqual(result, { a: { b: 2, c: 3 } }));
  });
  it("deepDefault with array", async function () {
    const obj = { a: [{ b: 1 }] };
    const result = deepDefaultByPath([["a[]", "c"], 2])(obj);
    assert(isDeepEqual(result, { a: [{ b: 1, c: 2 }] }));
  });
  it("deepDefault empty with array", async function () {
    const obj = {};
    const result = deepDefaultByPath([["a", "b[]", "c"], 2])(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepDefaults key already set", async function () {
    const obj = { a: 1 };
    const result = deepDefaults([["a", 2]])(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepDefaults defaults undefined", async function () {
    const obj = { a: 1 };
    const result = deepDefaults()(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepDefaults network-interface", async function () {
    const obj = {
      name: "network-interface",
      properties: {
        ipConfigurations: [
          {
            name: "ipconfig",
            properties: {
              privateIPAllocationMethod: "Dynamic",
            },
          },
        ],
      },
    };
    const result = deepDefaults([
      [
        "properties.ipConfigurations[].properties.subnet.properties.privateEndpointNetworkPolicies",
        "Enabled",
      ],
      [
        "properties.privateLinkService.properties.loadBalancerFrontendIpConfigurations[].properties.subnet.properties.privateEndpointNetworkPolicies",
        "Enabled",
      ],
    ])(obj);
    assert(
      isDeepEqual(result, {
        name: "network-interface",
        properties: {
          ipConfigurations: [
            {
              name: "ipconfig",
              properties: {
                privateIPAllocationMethod: "Dynamic",
                subnet: {
                  properties: {
                    privateEndpointNetworkPolicies: "Enabled",
                  },
                },
              },
            },
          ],
        },
      })
    );
  });
});
