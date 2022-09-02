const assert = require("assert");

const { pipe, tryCatch, tap, get } = require("rubico");

const { buildDependenciesObject } = require("../GcpBuildDependencies");
const { SubnetworkSchema } = require("./fixture/fixture");

describe("GcpBuildDependencies", async function () {
  it(
    "subnetwork",
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => SubnetworkSchema,
        buildDependenciesObject({}),
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
