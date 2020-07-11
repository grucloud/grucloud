const Promise = require("bluebird");
const assert = require("assert");
const { of, iif, throwError } = require("rxjs");
const {
  retryWhen,
  repeatWhen,
  mergeMap,
  concatMap,
  tap,
  take,
  delay,
} = require("rxjs/operators");
const logger = require("../logger")({ prefix: "Retry" });
const { tos } = require("../tos");
const { logError } = require("./Common");
const retryCall = async ({
  name = "",
  fn,
  repeatCount = 0,
  repeatDelay = 500,
  retryCount = 30,
  retryDelay = 5e3,
  shouldRetry = () => false,
}) => {
  logger.debug(
    `retryCall ${name}, retryCount: ${retryCount}, retryDelay: ${retryDelay}, repeatCount: ${repeatCount} `
  );
  return of({})
    .pipe(
      mergeMap(async () => await fn()),
      repeatWhen((result) => {
        return result.pipe(delay(repeatDelay), take(repeatCount));
      }),
      retryWhen((errors) =>
        errors.pipe(
          concatMap((error, i) => {
            logError(
              `retryCall error ${name}, attempt ${i}/${retryCount}, retryDelay: ${retryDelay},`,
              error
            );
            return iif(
              () => i >= retryCount || !shouldRetry(error),
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

const retryExpectOk = async ({ name, fn, config }) => {
  logger.debug(`retryExpectOk ${name}`);
  return retryCall({
    name,
    fn: async () => {
      const result = await fn();
      if (!result) {
        throw Error(`Retry ${name}`);
      }
    },
    retryCount: config.retryCount || 30,
    retryDelay: config.retryDelay || 10e3,
    repeatCount: config.repeatCount,
    shouldRetry: () => true,
  });
};

exports.retryExpectOk = retryExpectOk;
