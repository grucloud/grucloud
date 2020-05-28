const assert = require("assert");
const _ = require("lodash");
const { createProgram } = require("../program");

const commands = require("../cliCommands");

const filename = "src/providers/mock/test/MockStack.js";

const runProgram = async ({ filename, cmds = [] }) => {
  const argv = ["node", "cliEntry.js", "--infra", filename, ...cmds];
  const program = createProgram({
    version: "1.2",
    commands,
  });
  program.parseAsync(argv);
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
  it("display Status", async function () {
    await runProgram({ filename, cmds: ["status"] });
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
});
