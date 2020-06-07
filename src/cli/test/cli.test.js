const assert = require("assert");
const _ = require("lodash");

const { main } = require("../cliMain");

const filename = "src/providers/mock/test/MockStack.js";
const configFile = "src/providers/mock/test/config.js";

const runProgram = async ({ cmds = [] }) => {
  const argv = [
    "xx",
    "xx",
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
    await runProgram({ cmds: ["deploy"] });
  });
  it("destroy plan", async function () {
    await runProgram({ cmds: ["destroy"] });
  });
  it("list all", async function () {
    await runProgram({ cmds: ["list", "--all"] });
  });
  it("list our", async function () {
    await runProgram({ cmds: ["list", "--our"] });
  });
  it("list by type", async function () {
    await runProgram({ cmds: ["list", "--type", "Server", "Ip"] });
  });
  it.skip("--config notexisting.js", async function () {
    main({
      argv: ["xx", "xx", "--config", "notexisting.js", "list"],
    }).catch((error) => {
      assert.equal(error.code, 422);
    });
  });
});
