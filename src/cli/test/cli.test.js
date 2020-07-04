const assert = require("assert");
const Axios = require("axios");
const _ = require("lodash");
const path = require("path");
const shell = require("shelljs");
const { map, any } = require("rubico");
const { main } = require("../cliMain");
const { MockServer } = require("../../mockServer/MockServer");

const filename = "src/providers/mock/test/MockStack.js";
const configFileDefault = "src/providers/mock/test/config/default.js";
const configFile404 = path.join(__dirname, "./config/config.404.js");
const configFile500 = path.join(__dirname, "./config/config.500.js");

const configFileNetworkError = path.join(
  __dirname,
  "./config/config.networkError.js"
);

const commands = ["plan", "apply -f", "destroy -f -a", "list"];

const onExitOk = () => assert(false);
const runProgram = async ({
  cmds = [],
  configFile = configFileDefault,
  onExit = onExitOk,
}) => {
  const argv = [
    "node",
    "gc",
    "--infra",
    filename,
    "--config",
    configFile,
    ...cmds,
  ];

  return await main({ argv, onExit });
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
  it("--config notexisting.js", async function () {
    await main({
      argv: ["xx", "xx", "--config", "notexisting.js", "list"],
      onExit: ({ code }) => assert.equal(code, 422),
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
  it("save to json", async function () {
    await runProgram({ cmds: ["plan", "--json", "gc.result.json"] });
  });
});

describe("cli error", function () {
  const routes = ["/ip", "/server", "/volume", "/security_group", "/image"];
  const port = 8089;
  const delay = { min: 1, max: 1 };
  const mockServer = MockServer({ port, routes, delay });

  before(async function () {
    await mockServer.start();
    const axios = Axios.create({ baseURL: `http://localhost:${port}` });
    await axios.post("/ip", {});
    const list = await axios.get("/ip");
    console.log(list);
  });

  after(async function () {
    await mockServer.stop();
  });

  it("cli 404", async function () {
    const results = await map.series((command) =>
      runProgram({
        cmds: command.split(" "),
        configFile: configFile404,
        onExit: ({ code, error: { error } }) => {
          assert.equal(code, 422);
          assert.equal(error.response.status, 404);
        },
      })
    )(commands);
    assert.deepEqual(results, [-1, -1, -1, -1]);
  });
  it("cli 500", async function () {
    const results = await map.series(
      async (command) =>
        await runProgram({
          cmds: command.split(" "),
          configFile: configFile500,
          onExit: ({ code, error: { error } }) => {
            assert.equal(code, 422);
            error.forEach((error) =>
              assert.equal(error.error.response.status, 500)
            );
          },
        })
    )(commands);
    assert.deepEqual(results, [0, -1, -1, 0]);
  });
  it("cli network error", async function () {
    const results = await map.series((command) =>
      runProgram({
        cmds: command.split(" "),
        configFile: configFileNetworkError,
        onExit: ({ code, error: { error } }) => {
          assert.equal(code, 422);
          assert.equal(error.message, "Network Error");
        },
      })
    )(commands);
    assert.deepEqual(results, [-1, -1, -1, -1]);
  });
});
