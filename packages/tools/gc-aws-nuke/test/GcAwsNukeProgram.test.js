const { describe, it } = require("node:test");
const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const { callProp, isDeepEqual } = require("rubico/x");

const { createProgram } = require("../GcAwsNukeProgram");

describe("GcAwsNukeProgram", () => {
  it("region simple", () =>
    pipe([
      () => ["", "", "--regions", "us-east-1", "us-west-2"],
      (argv) =>
        pipe([
          () => ({
            argv,
          }),
          createProgram,
          callProp("parse", argv),
          callProp("opts"),
          ({ regions }) =>
            assert(isDeepEqual(regions, ["us-east-1", "us-west-2"])),
        ]),
    ])());
});
