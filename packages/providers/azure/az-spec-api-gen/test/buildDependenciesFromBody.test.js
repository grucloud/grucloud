const assert = require("assert");
const path = require("path");

const { pipe, tap, get, eq, tryCatch } = require("rubico");

const {
  buildDependenciesFromBodyObject,
} = require("../buildDependenciesFromBody");
const { NatGatewaySchema } = require("./natGatewaySchema");

describe("buildDependenciesFromBody", function () {
  before(async function () {});

  it("buildDependenciesFromBody ", async function () {
    pipe([
      () => NatGatewaySchema,
      buildDependenciesFromBodyObject({ swagger: {} }),
      tap((params) => {
        assert(true);
      }),
    ])();
  });
});
