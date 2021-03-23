const assert = require("assert");
const { replacerCredentials, hiddenCredentials } = require("../tos");
const YAML = require("../cli/json2yaml");

const properties = {
  storageProfile: {
    imageReference: {
      offer: "UbuntuServer",
      publisher: "Canonical",
    },
  },
};

const propertiesToYaml = `storageProfile:
  imageReference:
    offer: UbuntuServer
    publisher: Canonical
`;

describe("replacerCredentials", function () {
  it("replacerCredentials ok", async function () {
    assert.equal(
      replacerCredentials("adminPassword", "password"),
      hiddenCredentials
    );
  });
  it("YAML.stringify password", async function () {
    YAML.stringify({ properties: { adminPassword: "aaaaaaaa" } });
  });
  it("replacerCredentials accessToken", async function () {
    assert.equal(replacerCredentials("accessToken", "aaaa"), hiddenCredentials);
  });
  it("replacerCredentials disablePasswordAuthentication", async function () {
    assert.equal(
      replacerCredentials("disablePasswordAuthentication", true),
      true
    );
  });
  it("YAML.stringify object", async function () {
    assert.equal(YAML.stringify(properties), propertiesToYaml);
  });

  it("YAML.stringify corner case", async function () {
    const result = YAML.stringify({
      key1: undefined,
      key1: null,
      arr: [],
      fn: () => {},
    });
    console.log(result);
  });
  it("YAML.stringify undefined", async function () {
    const result = YAML.stringify(undefined);
    console.log(result);
  });

  it("YAML.stringify undefined in array", async function () {
    const result = YAML.stringify([undefined]);
    console.log(result);
  });
});
