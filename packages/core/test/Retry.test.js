const assert = require("assert");

const { retryCall } = require("../Retry");

const retryDelay = 50;

const createMock = ({ seq }) => {
  let callCount = 0;
  return (fn = async () => {
    return new Promise((resolve, reject) => {
      const step = seq[callCount];
      assert(step);
      callCount++;
      if (step.throwError) {
        //console.log(`throw error callCount:  ${callCount}`);
        return reject(step.throwError);
      }
      //console.log(`callCount ${callCount}, return: ${step.return}`);
      return resolve(step.return);
    });
  });
};

describe("Retry", function () {
  it("retryCall expect true success", async function () {
    const seq = [
      { return: true },
      { return: false },
      { return: true },
      { return: true },
    ];

    const fn = createMock({ seq });
    const result = await retryCall({
      name: "retryCall expect true success",
      fn: async () => fn({}),
      config: { retryCount: 2, retryDelay },
    });
    assert(result);
  });
  it("retryCall expect true fails", async function () {
    const seq = [{ return: false }, { return: false }];
    const fn = createMock({ seq });

    try {
      await retryCall({
        name: "retryCall expect true fails",
        fn: async () => fn({}),
        config: { retryCount: 1, retryDelay },
      });
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.code, 503);
    }
  });
  it("retryCall expect 42 success", async function () {
    const seq = [{ return: 42 }, { return: 1 }, { return: 42 }, { return: 42 }];

    const fn = createMock({ seq });
    const result = await retryCall({
      name: "retryCall expect 42 success",
      fn: async () => fn({}),
      isExpectedResult: (result) => result === 42,
      config: { retryCount: 2, retryDelay },
    });
    assert.equal(result, 42);
  });

  it("retryCall throw error", async function () {
    const seq = [{ throwError: { code: 1 } }];
    const fn = createMock({ seq });

    try {
      await retryCall({
        name: "retryCall expect 42 success",
        fn: async () => fn({}),
        shouldRetryOnException: () => false,
        isExpectedResult: (result) => result === 42,
        config: { retryCount: 1, retryDelay },
      });
      assert(false);
    } catch (error) {
      assert.equal(error.code, 1);
    }
  });
  it("retryCall timeout", async function () {
    const seq = [{ return: 1 }, { return: 1 }, { return: 1 }];

    const fn = createMock({ seq });

    try {
      await retryCall({
        name: "retryCall timeout",
        fn: async () => fn({}),
        shouldRetryOnException: () => false,
        isExpectedResult: (result) => result === 42,
        config: { retryCount: 1, retryDelay },
      });
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.code, 503);
    }
  });
});
