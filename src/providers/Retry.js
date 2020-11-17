const assert = require("assert");
const { of, iif, throwError } = require("rxjs");
const { pipe, tryCatch, switchCase } = require("rubico");

const {
  retryWhen,
  repeatWhen,
  mergeMap,
  concatMap,
  tap,
  take,
  delay,
  catchError,
} = require("rxjs/operators");
const logger = require("../logger")({ prefix: "Retry" });
const { tos } = require("../tos");
const { logError } = require("./Common");

const retryCall = async ({
  name = "",
  fn,
  isExpectedResult = () => true,
  isExpectedException = () => false,
  shouldRetryOnException = () => false,
  repeatCount = 0,
  repeatDelay = 1e3,
  retryCount = 30,
  retryDelay = 5e3,
}) => {
  logger.debug(
    `retryCall ${name}, retryCount: ${retryCount}, retryDelay: ${retryDelay}, repeatCount: ${repeatCount} `
  );
  return of({})
    .pipe(
      mergeMap(
        tryCatch(
          pipe([
            () => fn(),
            switchCase([
              (result) => isExpectedResult(result),
              (result) => {
                logger.debug(`retryCall ${name}, success`);
                return result;
              },
              (result) => {
                throw {
                  code: 503,
                  type: "retryCall",
                  message: "not expected result",
                  result,
                };
              },
            ]),
          ]),
          (error) => {
            if (!isExpectedException(error)) {
              throw error;
            }
            return error;
          }
        )
      ),

      repeatWhen((result) =>
        result.pipe(delay(repeatDelay), take(repeatCount))
      ),
      retryWhen((errors) =>
        errors.pipe(
          concatMap((error, i) => {
            logger.info(`retryCall error ${name}, attempt ${i}/${retryCount}`);

            return iif(
              () =>
                i >= retryCount ||
                (!shouldRetryOnException(error) && error.code != 503),
              throwError(error),
              of(error).pipe(delay(retryDelay))
            );
          })
        )
      ),
      catchError((error) => {
        if (error.code == 503) {
          return of(error.result);
        } else {
          return throwError(error);
        }
      })
    )
    .toPromise();
};
exports.retryCall = retryCall;

exports.retryCallOnError = ({
  name,
  fn,
  config,
  isExpectedException = () => false,
  shouldRetryOnException = (error) =>
    ["ECONNABORTED", "ECONNRESET"].includes(error.code),
  isExpectedResult = (result) => {
    assert(result.status, `no status in result`);
    return [200, 201, 202, 204].includes(result.status);
  },
}) =>
  retryCall({
    name,
    fn,
    shouldRetryOnException,
    isExpectedResult,
    isExpectedException,
    retryCount: config.retryCount,
    retryDelay: config.retryDelay,
  });

const retryExpectOk = async ({ name, fn, config }) => {
  logger.debug(`retryExpectOk ${name}`);
  return retryCall({
    name,
    fn,
    isExpectedResult: (result) => result,
    shouldRetryOnException: () => true,
    retryCount: config.retryCount || 30,
    retryDelay: config.retryDelay || 10e3,
    repeatCount: config.repeatCount,
  });
};

exports.retryExpectOk = retryExpectOk;
