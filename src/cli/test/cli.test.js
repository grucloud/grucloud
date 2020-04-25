const assert = require("assert");
const _ = require("lodash");
const { createProgram } = require("../program");
const { main } = require("../cli");
const path = require("path");
describe("cli", function () {
  it("version", function () {
    const program = createProgram({ version: "1.2", argv: [] });
    assert.equal(program._version, "1.2");
  });
  it("query plan", async function () {
    const filename = "examples/scaleway/iac.js";
    const program = createProgram({
      version: "1.2",
      argv: ["node", "cliEntry.js", filename],
    });
    await main({ program });
  });
});
