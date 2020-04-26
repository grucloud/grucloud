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

describe.only("cli", function () {
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
