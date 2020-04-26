const assert = require("assert");
const _ = require("lodash");
const { createProgram } = require("../program");

const { planQuery, planDeploy, planDestroy } = require("../cli");

const filename = "src/providers/mock/test/MockStack.js";

const runProgram = async ({ asyncCmd = true, filename, cmds = [] }) => {
  const argv = ["node", "cliEntry.js", "--infra", filename, ...cmds];
  const program = createProgram({
    version: "1.2",
    commands: { planQuery, planDeploy, planDestroy },
  });
  asyncCmd ? await program.parseAsync(argv) : program.parse(argv);
};

describe("cli", function () {
  it.skip("version", async function () {
    await runProgram({ filename, cmds: ["--version"] });
    console.log("DONE");
  });

  it.skip("query plan is the default command", async function () {
    await runProgram({ filename, cmds: [""] });
  });
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
});
