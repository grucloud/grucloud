const assert = require("assert");

const { pipe, tryCatch, tap, get } = require("rubico");

const { buildOmitPropertiesObject } = require("../GcpBuildOmitProperties");
const { SubnetworkSchema } = require("./fixture/fixture");

describe("GcpBuildOmitProperties", async function () {
  it(
    "omit for subnetwork",
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => SubnetworkSchema,
        buildOmitPropertiesObject({}),
        tap((params) => {
          assert(true);
        }),
      ]),
      (error) => {
        throw error;
      }
    )
  );
});
