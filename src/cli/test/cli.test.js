const assert = require("assert");
const _ = require("lodash");
const path = require("path");
const shell = require("shelljs");
const { main } = require("../cliMain");

const filename = "src/providers/mock/test/MockStack.js";
const configFile = "src/providers/mock/test/config/default.json";

const runProgram = async ({ cmds = [] }) => {
  const argv = [
    "node",
    "gc",
    "--infra",
    filename,
    "--config",
    configFile,
    ...cmds,
  ];
  await main({ argv });
};

describe("cli", function () {
  it("query plan", async function () {
    await runProgram({ cmds: ["plan"] });
  });
  it("apply plan", async function () {
    await runProgram({ cmds: ["apply", "--force"] });
  });
  it("destroy plan", async function () {
    await runProgram({ cmds: ["destroy", "--force"] });
  });
  it("list all", async function () {
    await runProgram({ cmds: ["list", "--all"] });
  });
  it("list our", async function () {
    await runProgram({ cmds: ["list", "--our"] });
  });
  it("list by type", async function () {
    await runProgram({ cmds: ["list", "--types", "Server", "Ip"] });
  });
  it.skip("--config notexisting.js", async function () {
    main({
      argv: ["xx", "xx", "--config", "notexisting.js", "list"],
    }).catch((error) => {
      assert.equal(error.code, 422);
    });
  });
  it("version", function () {
    const program = path.join(__dirname, "../cliEntry.js");
    const command = `${program} --version`;
    shell.cd("test"); // Avoid deleting the main log file
    const { stdout, code } = shell.exec(command);
    shell.cd("..");
    const version = stdout.replace(/(\r\n|\n|\r)/gm, "");
    const re = /^\d+\.\d+\.\d+$/;
    assert.equal(code, 0);
    assert(re.test(version));
  });
});
describe("save to json", function () {
  it("query plan", async function () {
    await runProgram({ cmds: ["plan", "--json", "gc.result.json"] });
  });
});
