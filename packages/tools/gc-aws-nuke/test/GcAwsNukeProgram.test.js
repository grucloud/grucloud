const { describe, it } = require("node:test");
const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const { callProp, isDeepEqual } = require("rubico/x");

const { createProgram } = require("../GcAwsNukeProgram");

describe("GcAwsNukeProgram", () => {
  it("region simple", () =>
    pipe([
      () => ({
        argv: ["", "", "--regions", "us-east-1", "us-west-2"],
      }),
      createProgram,
      callProp("opts"),
      ({ regions }) => assert(isDeepEqual(regions, ["us-east-1", "us-west-2"])),
    ])());
  it("help", () =>
    pipe([
      () => ({
        argv: ["", "", "help"],
      }),
      createProgram,
      tap((params) => {
        assert(true);
      }),
      callProp("opts"),
      tap((params) => {
        assert(true);
      }),
    ])());
});
