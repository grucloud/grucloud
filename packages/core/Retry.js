const assert = require("assert");
const { pipe, or, get } = require("rubico");
const { identity, isIn } = require("rubico/x");
const logger = require("./logger")({ prefix: "Retry" });
const { convertError } = require("./Common");

const sleep = (waitMs) => new Promise((resolve) => setTimeout(resolve, waitMs));

const retryCall = async ({
  name = "",
  fn,
  isExpectedResult = identity,
  isExpectedException = () => false,
  shouldRetryOnException = ({ error, name }) => {
    logger.info(
      `shouldRetryOnException ${name}, error: ${JSON.stringify(
        convertError({ error })
      )}`
    );
    error.stack && logger.error(error.stack);
    return !error.stack;
  },
  config: {
    repeatCount = 0,
    repeatDelay = 1e3,
    retryCount = 12 * 10,
    retryDelay = 5e3,
  } = {},
}) => {
  // logger.debug(
  //   `retryCall ${name}, retryCount: ${retryCount}, retryDelay: ${retryDelay}, repeatCount: ${repeatCount}, repeatDelay ${repeatDelay}`
  // );
  let _error;
  for (let index = 0; index < retryCount; index++) {
    //console.log("retryCall", name, index, "/", retryCount);
    try {
      const res = await fn();
      if (isExpectedResult(res)) {
        //console.log("retryCall isExpectedResult");
        return res;
      } else {
        //console.log("retryCall not Expected Result, retry");
      }
    } catch (error) {
      _error = error;
      if (isExpectedException(error)) {
        return;
      }
      if (!shouldRetryOnException({ error, name })) {
        //console.log("retryCall shouldRetryOnException ko");
        throw error;
      }
    }

    await sleep(retryDelay);
  }

  if (_error) {
    throw _error;
  } else {
    throw {
      code: 503,
      type: "retryCall",
      message: `${name}: not expected result`,
    };
  }
};

exports.retryCall = retryCall;

const shouldRetryOnExceptionDefault = pipe([
  get("error.code"),
  isIn([
    "ECONNABORTED",
    "ECONNRESET",
    "ENOTFOUND",
    "ENETDOWN",
    "EHOSTUNREACH",
    "ERR_BAD_RESPONSE", //"maxContentLength size of -1 exceeded "
    "ERR_SOCKET_CONNECTION_TIMEOUT",
  ]),
]);

exports.retryCallOnError = ({
  name,
  fn,
  config,
  isExpectedException = () => false,
  shouldRetryOnException = () => false,
  isExpectedResult = (result) => {
    assert(result.status, `no status in result`);
    logger.debug(`${name} status: ${result.status}`);
    return [200, 201, 202, 204].includes(result.status);
  },
}) =>
  retryCall({
    name,
    fn,
    shouldRetryOnException: or([
      shouldRetryOnException,
      shouldRetryOnExceptionDefault,
    ]),
    isExpectedResult,
    isExpectedException,
    config,
  });
