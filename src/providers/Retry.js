const Promise = require("bluebird");
const assert = require("assert");
const { of, throwError } = require("rxjs");
const {
  retryWhen,
  take,
  mergeMap,
  flatMap,
  concat,
  tap,
  delay,
} = require("rxjs/operators");
const logger = require("../logger")({ prefix: "CoreClient" });
const { tos } = require("../tos");

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
      retryWhen((errors) => {
        return errors.pipe(
          flatMap((error) => {
            logger.debug(error);
            if (shouldRetry(error)) {
              logger.debug(`retry ${name}`);
              return of({}).pipe(delay(retryDelay));
            }
            throw error;
          }),
          take(retryCount),
          concat(throwError(`Request failed after ${retryCount} retries.`))
        );
      })
    )
    .toPromise();
};
exports.retryCall = retryCall;

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
