const assert = require("assert");

const { runShellCommands } = require("../runShellCommands");

describe("runShellCommands", function () {
  it("ok", async function () {
    try {
      await runShellCommands({
        text: "register",
        commands: ["sleep 2", "sleep 1"],
      });
    } catch (error) {
      assert(false);
    }
  });
  it.only("throw", async function () {
    try {
      await runShellCommands({
        text: "register",
        commands: ["exit -1", "sleep 1"],
      });
    } catch (error) {
      assert(false);
    }
  });
});
