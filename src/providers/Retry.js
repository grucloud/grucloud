const Promise = require("bluebird");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CoreClient" });
const toString = (x) => JSON.stringify(x, null, 4);

//TODO revist, throw on error ? add isExceptionOk ?
const retryExpectOk = async ({ name, fn, isOk, delay = 4e3 }, count = 60) => {
  logger.debug(`retryExpectOk ${name},  count: ${count}, delay: ${delay}`);
  assert(fn);
  if (count === 0) {
    throw Error(`retryExpectOk timeout for ${name}`);
  }
  try {
    const result = await fn();
    logger.debug(`retryExpectOk ${name} result: ${toString(result)}`);

    if (isOk(result)) {
      logger.debug(`retryExpectOk ${name} isOk`);
      return result;
    }
    logger.debug(`retryExpectOk: ${name} not ok`);
  } catch (error) {
    if (error.stack) {
      logger.error(error.stack);
      //TODO give up
      throw error;
    }
    logger.debug(
      `retryExpectOk ${name},  error: ${toString(
        error.response ? error.response : error
      )}`
    );
  }
  await Promise.delay(delay);
  return retryExpectOk({ name, fn, isOk, delay }, --count);
};

exports.retryExpectOk = retryExpectOk;

//TODO add name
/*
const retryExpectException = async (
  { fn, isExpectedError, delay = 4e3 },
  count = 90
) => {
  assert(fn);
  logger.debug(`retryExpectException count: ${count}, delay: ${delay}`);
  if (count === 0) {
    throw Error("timeout");
  }
  try {
    await fn();
    throw Error("No exception, Have to retry");
  } catch (error) {
    if (isExpectedError(error)) {
      logger.debug(`retryExpectException isExpectedError`);
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
*/
