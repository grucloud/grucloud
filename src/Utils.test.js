const assert = require("assert");
const _ = require("lodash");
const { checkEnvironment, compare } = require("./Utils");

describe("checkEnvironment", function () {
  it("checkEnvironment empty", async function () {
    checkEnvironment([]);
  });
  it("checkEnvironment throw", async function () {
    assert.throws(
      () => checkEnvironment(["ENV_IDONOTEXSIT"]),
      Error("Please set the environment variable ENV_IDONOTEXSIT")
    );
  });
});

describe("compare", function () {
  it("compare ok", async function () {
    const target = {
      public_ip: {
        tags: ["myip-gru"],
        organization: "7734a2c2-df95-409c-bfa0-c094bd12f4ba",
      },
      name: "web-server",
      dynamic_ip_required: false,
      commercial_type: "DEV1-S",
      enable_ipv6: true,
      boot_type: "local",
      organization: "7734a2c2-df95-409c-bfa0-c094bd12f4ba",
      tags: ["web-server-gru"],
      volumes: {
        "0": {
          size: 20000000000,
        },
      },
    };
    const live = {
      id: "3c54230e-e944-4599-896b-2a5fc1136c17",
      name: "web-server",
      arch: "x86_64",
      commercial_type: "DEV1-S",
      boot_type: "local",
      volumes: {
        "0": {
          id: "9b0d0b50-0325-4b12-a26a-ea9ebaa60fad",
          name:
            "snapshot-55b0b5c2-0bd2-4475-b2e1-1edd66661e0d-2020-01-17_14:17",
        },
      },
      tags: ["web-server-gru"],
    };

    assert.equal(
      compare({
        target,
        targetKeys: ["volumes.0.size", "commercial_type"],
        live,
      }).length,
      0
    );
    assert.equal(
      compare({
        target,
        targetKeys: ["volumes.0.id"],
        live,
      }).length,
      1
    );
  });
});
