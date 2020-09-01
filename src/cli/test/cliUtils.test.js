const assert = require("assert");
const { runAsyncCommand } = require("../cliUtils");

describe("cliUtils", function () {
  it("runAsyncCommand", async function () {
    try {
      await runAsyncCommand({
        text: "throwing",
        command: () => {
          throw Error("Boom");
        },
      });
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.message, "Boom");
    }
  });
  it("StateChange", async function () {
    if (process.env.CONTINUOUS_INTEGRATION) {
      return;
    }
    try {
      await runAsyncCommand({
        text: "throwing",
        command: ({ onStateChange }) => {
          const context = { uri: "uri1" };
          onStateChange({ context, nextState: "BADNEXTSTATE" });
        },
      });
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.message, "unknown state BADNEXTSTATE");
    }
  });
});
