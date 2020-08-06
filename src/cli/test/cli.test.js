const assert = require("assert");
const Axios = require("axios");
const path = require("path");
const shell = require("shelljs");
const { map } = require("rubico");
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

const configFile400Retry = path.join(__dirname, "./config/config.400.retry.js");
const configFile400RetryOnce = path.join(
  __dirname,
  "./config/config.400.retry.once.js"
);

const configFileTimeout = path.join(__dirname, "./config/config.timeout.js");

const configFileTimeoutOnce = path.join(
  __dirname,
  "./config/config.timeout.once.js"
);

const commands = ["destroy -f -a", "list"];
const commandsHooks = ["run --onDeployed", "run --onDestroyed"];
const commandsAll = ["plan", "apply -f", ...commands, ...commandsHooks];

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
  it("cli apply plan", async function () {
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
  it("list by provider", async function () {
    await runProgram({ cmds: ["list", "--provider", "Moc"] });
  });
  // TODO
  it("--config notexisting.js", async function () {
    await main({
      argv: ["xx", "xx", "--config", "notexisting.js", "list"],
      onExit: ({ code }) => assert.equal(code, 422),
    });
  });
  it.skip("version", function () {
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
  });

  after(async function () {
    await mockServer.stop();
  });
  it("cli invalid provider", async function () {
    const results = await map.series((command) =>
      runProgram({
        cmds: `${command} --provider idonotexist`.split(" "),
        onExit: ({ code, error: { error } }) => {
          assert.equal(code, 422);
          assert(error.message);
        },
      })
    )(commandsAll);
    assert.deepEqual(results, [-1, -1, -1, -1, -1, -1]);
  });
  it("cli Query 404", async function () {
    const result = await runProgram({
      cmds: "plan",
      configFile: configFile404,
      onExit: ({ code, error: { error } }) => {
        assert.equal(code, 422);
        assert(error.results[0].resultQuery.error);
      },
    });
    assert.deepEqual(result, -1);
  });
  it("cli Query Network error", async function () {
    const result = await runProgram({
      cmds: "plan",
      configFile: configFileNetworkError,
      onExit: ({ code, error: { error } }) => {
        assert.equal(code, 422);
        const { resultQuery } = error.results[0];
        assert(resultQuery.error);
        assert.equal(
          resultQuery.resultCreate.plans[0].message,
          "Network Error"
        );
      },
    });
    assert.deepEqual(result, -1);
  });
  it("cli Query timeout", async function () {
    const result = await runProgram({
      cmds: "plan",
      configFile: configFileTimeout,
      onExit: ({ code, error: { error } }) => {
        assert.equal(code, 422);
        const { resultQuery } = error.results[0];
        assert(resultQuery.error);
        assert.equal(resultQuery.resultCreate.plans[0].code, "ECONNABORTED");
      },
    });
    assert.deepEqual(result, -1);
  });

  it("cli Apply 404", async function () {
    const result = await runProgram({
      cmds: ["apply", "-f"],
      configFile: configFile404,
      onExit: ({ code, error: { error } }) => {
        assert.equal(code, 422);
        assert(error.results[0].resultQuery.error);
      },
    });
    assert.deepEqual(result, -1);
  });
  it("cli Apply Network error", async function () {
    const result = await runProgram({
      cmds: ["apply", "-f"],
      configFile: configFileNetworkError,
      onExit: ({ code, error: { error } }) => {
        assert.equal(code, 422);
        const { resultQuery } = error.results[0];
        assert(resultQuery.error);
        assert.equal(
          resultQuery.resultCreate.plans[0].message,
          "Network Error"
        );
      },
    });
    assert.deepEqual(result, -1);
  });
  it("cli Apply timeout", async function () {
    const result = await runProgram({
      cmds: ["apply", "-f"],
      configFile: configFileTimeout,
      onExit: ({ code, error: { error } }) => {
        assert.equal(code, 422);
        const { resultQuery } = error.results[0];
        assert(resultQuery.error);
        assert.equal(resultQuery.resultCreate.plans[0].code, "ECONNABORTED");
      },
    });
    assert.deepEqual(result, -1);
  });
  it("cli Apply 500", async function () {
    const result = await runProgram({
      cmds: ["apply", "-f"],
      configFile: configFile500,
      onExit: ({ code, error: { error } }) => {
        assert.equal(code, 422);
        const { result } = error.results[0];
        assert(result.error);
        assert.equal(result.resultCreate.results[0].error.Status, 500);
      },
    });
    assert.deepEqual(result, -1);
  });
  it("cli 404", async function () {
    const results = await map.series((command) =>
      runProgram({
        cmds: command.split(" "),
        configFile: configFile404,
        onExit: ({ code, error: { error } }) => {
          assert.equal(code, 422);
          assert(error.results[0].result.error);
        },
      })
    )(commands);
    assert.deepEqual(results, [-1, -1]);
  });
  it("cli 500", async function () {
    const results = await map.series(
      async (command) =>
        await runProgram({
          cmds: command.split(" "),
          configFile: configFile500,
          onExit: ({ code, error }) => {
            assert.equal(code, 422);
            error.error.results.forEach(({ result }) => assert(result.error));
          },
        })
    )(commands);
    assert.deepEqual(results, [-1, 0]);
  });
  it("cli network error", async function () {
    const results = await map.series((command) =>
      runProgram({
        cmds: command.split(" "),
        configFile: configFileNetworkError,
        onExit: ({ code, error: { error } }) => {
          assert.equal(code, 422);
          assert(error.results[0].result.error);
        },
      })
    )(commands);
    assert.deepEqual(results, [-1, -1]);
  });

  it("cli 400 retry", async function () {
    const result = await runProgram({
      cmds: ["apply", "-f"],
      configFile: configFile400Retry,
      onExit: ({ code }) => {
        assert.equal(code, 422);
      },
    });
    assert.equal(result, -1);
  });
  it("cli 400 retry once", async function () {
    const result = await runProgram({
      cmds: ["apply", "-f"],
      configFile: configFile400RetryOnce,
      onExit: ({ code }) => {
        assert.equal(code, 0);
      },
    });
    assert.equal(result, 0);
  });

  it("cli timeout once", async function () {
    const results = await map.series((command) =>
      runProgram({
        cmds: command.split(" "),
        configFile: configFileTimeoutOnce,
        onExit: ({ code, error: { error } }) => {
          assert.equal(code, 0);
        },
      })
    )(commands);
    assert.deepEqual(results, [0, 0]);
  });
  it("cli timeout ", async function () {
    const results = await map.series((command) =>
      runProgram({
        cmds: command.split(" "),
        configFile: configFileTimeout,
        onExit: ({ code, error: { error } }) => {
          assert.equal(code, 422);
          assert(error.results[0].result.error);

          /*assert.equal(
            error.results[0].result.results[0].error.Code,
            "ECONNABORTED"
          );*/
        },
      })
    )(commands);
    assert.deepEqual(results, [-1, -1]);
  });

  it("cli run invalid command", async function () {
    const result = await runProgram({
      cmds: ["run", ""],
      onExit: ({ code }) => {
        assert.equal(code, 422);
      },
    });
    assert.equal(result, -1);
  });
});
