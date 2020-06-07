const assert = require("assert");
const _ = require("lodash");
const { createProgram } = require("../program");

const commands = require("../cliCommands");

const filename = "src/providers/mock/test/MockStack.js";
const configFile = "src/providers/mock/test/config.js";

const runProgram = async ({ filename, cmds = [] }) => {
  const argv = [
    "node",
    "cliEntry.js",
    "--infra",
    filename,
    "--config",
    configFile,
    ...cmds,
  ];
  const program = createProgram({
    version: "1.2",
    commands,
  });
  return program.parseAsync(argv);
};

describe("cli", function () {
  it("query plan", async function () {
    await runProgram({ filename, cmds: ["plan"] });
  });
  it("deploy plan", async function () {
    await runProgram({ filename, cmds: ["deploy"] });
  });
  it("destroy plan", async function () {
    await runProgram({ filename, cmds: ["destroy"] });
  });
  it("list all", async function () {
    await runProgram({ filename, cmds: ["list", "--all"] });
  });
  it("list our", async function () {
    await runProgram({ filename, cmds: ["list", "--our"] });
  });
  it("list by type", async function () {
    await runProgram({ filename, cmds: ["list", "--type", "Server", "Ip"] });
  });
  it("--config notexisting.js", async function () {
    runProgram({
      filename,
      cmds: ["--config", "notexisting.js", "list"],
    }).catch((error) => {
      assert.equal(error.code, 422);
    });
  });
});
