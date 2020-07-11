const assert = require("assert");
const Promise = require("bluebird");

const { retryCall } = require("../providers/Retry");

const retryDelay = 50;

const createMock = ({ seq }) => {
  let callCount = 0;
  return (fn = async () => {
    return new Promise((resolve, reject) => {
      const step = seq[callCount];
      callCount++;
      if (!step) {
        console.log("error callCount: ", callCount);
        return reject({ name: "error" });
      }
      console.log("ok    callCount: ", callCount);
      return resolve(callCount);
    });
  });
};

describe("Retry", function () {
  it("retryCall", async function () {
    //const seq = [false, false, false];
    const seq = [true, false, true, true];

    const fn = createMock({ seq });
    const result = await retryCall({
      name: "fn ok",
      fn: async () => fn({}),
      retryCount: 2,
      retryDelay,
    });
    console.log("DONE", result);
  });
});
