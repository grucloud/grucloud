const Promise = require("bluebird");
const logger = require("../logger")({ prefix: "CoreClient" });

const retryExpectException = async (
  { fn, isExpectedError, delay = 1e3 },
  count = 10
) => {
  logger.debug(`retryExpectException count: ${count}, delay: ${delay}`);
  if (count === 0) {
    throw Error("timeout");
  }
  try {
    await fn();
    throw Error("No exception, Have to retry");
  } catch (error) {
    if (isExpectedError(error)) {
      return true;
    }
    logger.debug(
      `retryExpectException count: ${count}, waiting delay: ${delay}`
    );

    await Promise.delay(delay);
    return retryExpectException({ fn, isExpectedError, delay }, --count);
  }
};
exports.retryExpectException = retryExpectException;

const retryExpectOk = async ({ fn, isOk, delay = 1e3 }, count = 10) => {
  logger.debug(`retryExpectOk count: ${count}, delay: ${delay}`);
  if (count === 0) {
    throw Error("timeout");
  }
  try {
    const result = await fn();
    logger.debug(`retryExpectOk: result: ${toString(result)}`);

    if (isOk(result)) {
      return true;
    }
    logger.debug(`retryExpectOk: not ok`);
  } catch (error) {
    logger.debug(`retryExpectOk: ${toString(error.response)}`);
  }
  await Promise.delay(delay);
  return retryExpectOk({ fn, isOk, delay }, --count);
};

exports.retryExpectOk = retryExpectOk;
