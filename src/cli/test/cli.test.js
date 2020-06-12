const assert = require("assert");
const _ = require("lodash");

const { main } = require("../cliMain");

const filename = "src/providers/mock/test/MockStack.js";
const configFile = "src/providers/mock/test/config.js";

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
  it("deploy plan", async function () {
    await runProgram({ cmds: ["deploy", "--force"] });
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
});
describe("save to json", function () {
  it("query plan", async function () {
    await runProgram({ cmds: ["plan", "--json", "gc.result.json"] });
  });
});
