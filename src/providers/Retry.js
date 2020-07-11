const Promise = require("bluebird");
const assert = require("assert");
const { of, iif, throwError } = require("rxjs");
const {
  retryWhen,
  mergeMap,
  concatMap,
  tap,
  delay,
} = require("rxjs/operators");
const logger = require("../logger")({ prefix: "Retry" });
const { tos } = require("../tos");
const { logError } = require("./Common");
const retryCall = async ({
  name = "",
  fn,
  retryCount = 30,
  retryDelay = 2e3,
  shouldRetry = () => false,
}) => {
  logger.debug(
    `retryCall ${name}, retryCount: ${retryCount}, retryDelay: ${retryDelay} `
  );
  return of({})
    .pipe(
      mergeMap(async () => await fn()),
      retryWhen((errors) =>
        errors.pipe(
          concatMap((error, i) => {
            logError(`retryCall error ${name}, attempt ${i} `, error);
            return iif(
              () => i > retryCount || !shouldRetry(error),
              throwError(error),
              of(error).pipe(delay(retryDelay))
            );
          })
        )
      )
    )
    .toPromise();
};
exports.retryCall = retryCall;

exports.retryCallOnTimeout = ({ name, fn, config }) =>
  retryCall({
    name,
    fn,
    shouldRetry: (error) => error.code === "ECONNABORTED",
    retryCount: config.retryCount,
    retryDelay: config.retryDelay,
  });

const retryExpectOk = async ({
  name,
  fn,
  retryDelay = 10e3,
  retryCount = 30,
}) => {
  logger.debug(`retryExpectOk ${name}`);
  return retryCall({
    name,
    fn: async () => {
      const result = await fn();
      if (!result) {
        throw Error("Retry");
      }
    },
    retryCount,
    retryDelay,
    shouldRetry: () => true,
  });
};

exports.retryExpectOk = retryExpectOk;
